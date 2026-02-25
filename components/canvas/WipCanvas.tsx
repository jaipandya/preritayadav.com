"use client";

import { useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Tldraw,
  type Editor,
  type TLUiOverrides,
  type TLEditorComponents,
} from "tldraw";
import "tldraw/tldraw.css";
import { customShapeUtils } from "@/lib/shapes";
import { useCanvasPersistence } from "./useCanvasPersistence";
import { CanvasUI } from "./CanvasUI";
import { BrowserChrome } from "./BrowserChrome";
import { getHref } from "@/lib/canvasMeta";

const DRAG_THRESHOLD = 5;

const uiOverrides: TLUiOverrides = {
  tools(_editor, tools) {
    const allowed = new Set(["select", "draw", "text", "eraser", "hand"]);
    for (const key of Object.keys(tools)) {
      if (!allowed.has(key)) {
        delete tools[key];
      }
    }
    return tools;
  },
};

export function WipCanvas({
  pageKey,
  onCreateLayout,
}: {
  pageKey: string;
  onCreateLayout?: (editor: Editor) => void;
}) {
  const router = useRouter();
  const { store, loadingState, reset, needsInitialLayout } =
    useCanvasPersistence(pageKey);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);
  const layoutCreated = useRef(false);

  const components = useMemo<TLEditorComponents>(
    () => ({
      InFrontOfTheCanvas: () => <CanvasUI onReset={reset} />,
    }),
    [reset]
  );

  const handleMount = useCallback(
    (editor: Editor) => {
      if (needsInitialLayout && onCreateLayout && !layoutCreated.current) {
        layoutCreated.current = true;
        onCreateLayout(editor);
      }

      editor.on("event", (event) => {
        if (event.type === "pointer" && event.name === "pointer_down") {
          pointerDownPos.current = { x: event.point.x, y: event.point.y };
        }

        if (event.type === "pointer" && event.name === "pointer_up") {
          if (editor.getCurrentToolId() !== "select") return;
          if (!pointerDownPos.current) return;

          const dx = event.point.x - pointerDownPos.current.x;
          const dy = event.point.y - pointerDownPos.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          pointerDownPos.current = null;

          if (dist > DRAG_THRESHOLD) return;

          const shapesAtPoint = editor.getShapesAtPoint(event.point);
          for (const shape of shapesAtPoint) {
            const href = getHref(shape);
            if (href) {
              router.push(href);
              return;
            }
          }
        }
      });
    },
    [router, needsInitialLayout, onCreateLayout]
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
            fontFamily: "'Loranthus', cursive",
            fontSize: 18,
          }}
        >
          Loading...
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
            fontFamily: "'Loranthus', cursive",
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
        style={{ width: "100%", height: "100%", position: "relative" }}
        role="application"
        aria-label="Prerita Yadav's interactive portfolio canvas"
      >
        <Tldraw
          store={store}
          shapeUtils={customShapeUtils}
          hideUi
          onMount={handleMount}
          overrides={uiOverrides}
          components={components}
        />
      </div>
    </BrowserChrome>
  );
}
