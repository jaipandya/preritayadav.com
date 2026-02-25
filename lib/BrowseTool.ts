import { StateNode, type TLPointerEventInfo } from "tldraw";

export class BrowseTool extends StateNode {
  static override id = "browse";

  private isDragging = false;
  private lastScreenPoint: { x: number; y: number } | null = null;

  override onPointerDown(info: TLPointerEventInfo) {
    this.isDragging = false;
    this.lastScreenPoint = { x: info.point.x, y: info.point.y };
  }

  override onPointerMove(info: TLPointerEventInfo) {
    if (!this.lastScreenPoint) return;
    if (!(info as unknown as { isPen?: boolean; shiftKey?: boolean }).isPen && info.point) {
      const dx = info.point.x - this.lastScreenPoint.x;
      const dy = info.point.y - this.lastScreenPoint.y;

      if (!this.isDragging && Math.sqrt(dx * dx + dy * dy) > 3) {
        this.isDragging = true;
      }

      if (this.isDragging) {
        const camera = this.editor.getCamera();
        this.editor.setCamera({
          x: camera.x + dx,
          y: camera.y + dy,
          z: camera.z,
        });
        this.lastScreenPoint = { x: info.point.x, y: info.point.y };
      }
    }
  }

  override onPointerUp() {
    this.isDragging = false;
    this.lastScreenPoint = null;
  }

  override onCancel() {
    this.isDragging = false;
    this.lastScreenPoint = null;
  }
}
