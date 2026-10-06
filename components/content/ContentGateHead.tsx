import { CONTENT_OVERRIDES_KEY } from "@/lib/contentOverrides";

// Server component on purpose: the style and script must be in the initial HTML, before React hydrates.

// The spinner is scoped to pages that have a gate (:has), so a stray `content-pending` class can never leave one stuck.
const GATE_CSS = `
.content-pending [data-content-gate]{visibility:hidden}
.content-pending:has([data-content-gate])::after{content:"";position:fixed;top:50%;left:50%;width:20px;height:20px;margin:-10px 0 0 -10px;
border:1.5px solid rgba(26,26,26,.2);border-top-color:#1a1a1a;border-radius:50%;opacity:0;
animation:content-gate-in .2s linear .2s forwards,content-gate-spin .7s linear infinite}
@keyframes content-gate-in{to{opacity:1}}
@keyframes content-gate-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.content-pending:has([data-content-gate])::after{animation:content-gate-in .2s linear .2s forwards}}
`;

// Only on rendered pages, and only for browsers that have overrides. A hard load of any other page is untouched.
const GATE_SCRIPT = `try{var p=location.pathname;if((p==="/rendered"||p.indexOf("/rendered/")===0)&&localStorage.getItem(${JSON.stringify(CONTENT_OVERRIDES_KEY)}))document.documentElement.classList.add("content-pending")}catch(e){}`;

/**
 * Render once in the <head> of the root layout. It must not live in the rendered layout: that layout is created on the client
 * when you navigate from the WIP site, and React does not run (and warns about) scripts rendered on the client. See ContentGate.
 */
export function ContentGateHead() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GATE_CSS }} />
      <script dangerouslySetInnerHTML={{ __html: GATE_SCRIPT }} />
    </>
  );
}
