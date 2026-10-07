import type { ShapeUtilConstructor } from "@/lib/canvas";
import { ProjectCardShapeUtil } from "@/components/shapes/ProjectCardShapeUtil";
import { HandDrawnButtonShapeUtil } from "@/components/shapes/HandDrawnButtonShapeUtil";
import { AnnotationShapeUtil } from "@/components/shapes/AnnotationShapeUtil";
import { TeamAvatarsShapeUtil } from "@/components/shapes/TeamAvatarsShapeUtil";
import { SkillIconShapeUtil } from "@/components/shapes/SkillIconShapeUtil";
import { ImagePlaceholderShapeUtil } from "@/components/shapes/ImagePlaceholderShapeUtil";
import { BrowserFrameShapeUtil } from "@/components/shapes/BrowserFrameShapeUtil";
import { HandDrawnIllustrationShapeUtil } from "@/components/shapes/HandDrawnIllustrationShapeUtil";
import { OutsideWorkCardShapeUtil } from "@/components/shapes/OutsideWorkCardShapeUtil";
import { CompanyLogosShapeUtil } from "@/components/shapes/CompanyLogosShapeUtil";
import { ContactMeShapeUtil } from "@/components/shapes/ContactMeShapeUtil";
import { CanvasImageShapeUtil } from "@/components/shapes/CanvasImageShapeUtil";

/** The site's custom shapes. Quickdraw's own (pen strokes, text) need no util. */
export const customShapeUtils: readonly ShapeUtilConstructor[] = [
  ProjectCardShapeUtil,
  HandDrawnButtonShapeUtil,
  AnnotationShapeUtil,
  TeamAvatarsShapeUtil,
  SkillIconShapeUtil,
  ImagePlaceholderShapeUtil,
  BrowserFrameShapeUtil,
  HandDrawnIllustrationShapeUtil,
  OutsideWorkCardShapeUtil,
  CompanyLogosShapeUtil,
  ContactMeShapeUtil,
  CanvasImageShapeUtil,
];
