"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CanvasPointerEvent, Editor } from "@/lib/canvas";
import { customShapeUtils } from "@/lib/shapes";
import { useCanvasPersistence } from "./useCanvasPersistence";
import { CanvasUI } from "./CanvasUI";
import { BrowserChrome } from "./BrowserChrome";
import { QuickdrawCanvas } from "./QuickdrawCanvas";
import { canvasImageUrl } from "@/components/shapes/CanvasImageShapeUtil";
import { getHref, isNavigable } from "@/lib/canvasMeta";
import { BOUND_KEYS_META, ITEM_KEYS_META, boundKeysOf, itemKeysOf } from "@/lib/contentOverrides";
import { CANVAS_W } from "@/lib/layoutHelpers";
import { sounds } from "@/lib/sounds";
import { attachCanvasSounds } from "@/lib/canvasSounds";

const DRAG_THRESHOLD = 5;

/**
 * Start downloading the canvas images once the page is idle. An image is only requested when its shape renders,
 * so without this a screenshot starts loading at the moment you reach it.
 * Uses the same URL the shape will ask for, so the browser cache serves it.
 */
function warmCanvasImages(editor: Editor) {
  const run = () => {
    const zoom = editor.getZoomLevel();
    for (const shape of editor.getCurrentPageShapes()) {
      if (shape.type !== "canvas-image") continue;
      const img = new Image();
      img.fetchPriority = "low";
      img.decoding = "async";
      img.src = canvasImageUrl(shape as Parameters<typeof canvasImageUrl>[0], zoom, window.devicePixelRatio || 1);
    }
  };
  if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 2000 });
  else setTimeout(run, 500);
}

/** Remember which text fields and removable items the layout created, so Build can tell when one is erased from the canvas. */
function recordBoundKeys(editor: Editor) {
  const shapes = editor.getCurrentPageShapes();
  editor.setPageMeta({ [BOUND_KEYS_META]: boundKeysOf(shapes), [ITEM_KEYS_META]: itemKeysOf(shapes) });
}

/** On mobile, zoom out so the canvas content fits better on the small screen. */
function applyMobileCamera(editor: Editor) {
  if (window.innerWidth >= 768) return;
  const vb = editor.getViewportScreenBounds();
  const z = 0.5;
  editor.setCamera({ x: vb.width / 2 - (CANVAS_W / 2) * z, y: 0, z });
}

export function WipCanvas({
  pageKey,
  onCreateLayout,
}: {
  pageKey: string;
  onCreateLayout?: (editor: Editor) => void;
}) {
  const router = useRouter();
  const { store, initial, loadingState, reset, needsInitialLayout, attach } =
    useCanvasPersistence(pageKey);
  const layoutCreated = useRef(false);
  const prefetched = useRef(new Set<string>());
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  const editorRef = useRef<Editor | null>(null);

  const handleReset = useCallback(() => {
    reset(() => {
      const editor = editorRef.current;
      if (!editor) return;
      editor.setEditingShape(null);
      editor.run(() => {
        editor.store.clear();
        onCreateLayout?.(editor);
        recordBoundKeys(editor);
      });
      editor.clearHistory();
      editor.setCurrentTool("browse");
      applyMobileCamera(editor);
    });
  }, [reset, onCreateLayout]);

  const handleMount = useCallback(
    (editor: Editor) => {
      editorRef.current = editor;
      const cleanups = [attach(editor)];
      if (needsInitialLayout && onCreateLayout && !layoutCreated.current) {
        layoutCreated.current = true;
        onCreateLayout(editor);
        recordBoundKeys(editor);
        // The default layout is not an edit: undo starts from here.
        editor.clearHistory();
      }

      // Browse is the default tool (the pen is already set to a thin stroke).
      editor.setCurrentTool("browse");

      applyMobileCamera(editor);

      // Cmd+0 / Ctrl+0 to reset zoom
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "0") {
          e.preventDefault();
          const camera = editor.getCamera();
          const vb = editor.getViewportScreenBounds();
          editor.setCamera({
            x: -(CANVAS_W / 2) + vb.width / 2,
            y: camera.y,
            z: 1,
          });
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      cleanups.push(() => document.removeEventListener("keydown", handleKeyDown));

      cleanups.push(attachCanvasSounds(editor));
      warmCanvasImages(editor);

      // Listen for pointer events to handle navigation in browse mode
      cleanups.push(editor.on("event", (event: CanvasPointerEvent) => {
        // Update cursor when hovering over navigable shapes
        if (event.name === "pointer_move") {
          const container = editor.getContainer();
          if (editor.getCurrentToolId() !== "browse") {
            // Clean up any inline cursor left by browse mode
            container?.style.removeProperty("cursor");
            return;
          }
          const pagePoint = editor.screenToPage(event.point);
          const shapesAtPoint = editor.getShapesAtPoint(pagePoint, {
            hitInside: true,
            margin: 0,
          });
          const overLink = shapesAtPoint.some((s) => isNavigable(s));
          // Start loading the next page while the pointer is on its link (production only).
          for (const s of shapesAtPoint) {
            const href = getHref(s);
            if (href && href.startsWith("/") && !prefetched.current.has(href)) {
              prefetched.current.add(href);
              router.prefetch(href);
            }
          }
          if (container) {
            if (overLink) {
              container.style.setProperty("cursor", "pointer", "important");
            } else {
              container.style.removeProperty("cursor");
            }
          }
        }

        if (event.name === "pointer_down") {
          pointerDownPos.current = { x: event.point.x, y: event.point.y };
        }

        if (event.name === "pointer_up") {
          const toolId = editor.getCurrentToolId();
          if (toolId === "select" && editor.getSelectedShapeIds().length > 0) {
            sounds.play("select");
          } else if (toolId === "text") {
            sounds.play("text-begin");
          }
          if (editor.getCurrentToolId() !== "browse") return;
          if (!pointerDownPos.current) return;

          const dx = event.point.x - pointerDownPos.current.x;
          const dy = event.point.y - pointerDownPos.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          pointerDownPos.current = null;

          if (dist > DRAG_THRESHOLD) return;

          const pagePoint = editor.screenToPage(event.point);
          const shapesAtPoint = editor.getShapesAtPoint(pagePoint, {
            hitInside: true,
            margin: 0,
          });
          for (const shape of shapesAtPoint) {
            const href = getHref(shape);
            if (href) {
              sounds.play("navigate");
              if (href.startsWith("mailto:") || href.startsWith("http")) {
                window.open(href, href.startsWith("mailto:") ? "_self" : "_blank");
              } else {
                router.push(href);
              }
              return;
            }
          }
        }
      }));

      setCanvasReady(true);
      return () => cleanups.forEach((cleanup) => cleanup());
    },
    [router, needsInitialLayout, onCreateLayout, attach]
  );

  if (loadingState.status === "loading" || !store) {
    return (
      <BrowserChrome>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="canvas-spinner" />
        </div>
      </BrowserChrome>
    );
  }

  if (loadingState.status === "error") {
    return (
      <BrowserChrome>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Loranthus', sans-serif",
            fontSize: 18,
          }}
        >
          Something went wrong. Try refreshing.
        </div>
      </BrowserChrome>
    );
  }

  return (
    <BrowserChrome>
      <div
        className={canvasReady ? "canvas-fade-in" : undefined}
        style={{ width: "100%", height: "100%", position: "relative", opacity: canvasReady ? undefined : 0 }}
        role="application"
        aria-label="Prerita Yadav's interactive portfolio canvas"
      >
        <QuickdrawCanvas store={store} shapeUtils={customShapeUtils} initial={initial} onMount={handleMount}>
          <CanvasUI onReset={handleReset} />
        </QuickdrawCanvas>
      </div>
    </BrowserChrome>
  );
}
