import { CONTENT_OVERRIDES_KEY } from "@/lib/contentOverrides";

// Server component on purpose: the style and script must be in the initial HTML, before React hydrates.

const GATE_CSS = `
.content-pending [data-content-gate]{visibility:hidden}
.content-pending::after{content:"";position:fixed;top:50%;left:50%;width:28px;height:28px;margin:-14px 0 0 -14px;
border:2px solid currentColor;border-right-color:transparent;border-radius:50%;opacity:0;
animation:content-gate-in .2s linear .2s forwards,content-gate-spin .8s linear infinite}
@keyframes content-gate-in{to{opacity:.5}}
@keyframes content-gate-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.content-pending::after{animation:content-gate-in .2s linear .2s forwards}}
`;

const GATE_SCRIPT = `try{if(localStorage.getItem(${JSON.stringify(CONTENT_OVERRIDES_KEY)}))document.documentElement.classList.add("content-pending")}catch(e){}`;

/** Render inside <head> of the rendered layout. See ContentGate. */
export function ContentGateHead() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GATE_CSS }} />
      <script dangerouslySetInnerHTML={{ __html: GATE_SCRIPT }} />
    </>
  );
}
