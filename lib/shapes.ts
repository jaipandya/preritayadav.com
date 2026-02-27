import "@/lib/shapeTypes";
import { defaultShapeUtils, defaultBindingUtils } from "tldraw";
import { ProjectCardShapeUtil } from "@/components/shapes/ProjectCardShapeUtil";
import { HandDrawnButtonShapeUtil } from "@/components/shapes/HandDrawnButtonShapeUtil";
import { AnnotationShapeUtil } from "@/components/shapes/AnnotationShapeUtil";
import { TeamAvatarsShapeUtil } from "@/components/shapes/TeamAvatarsShapeUtil";
import { SkillIconShapeUtil } from "@/components/shapes/SkillIconShapeUtil";
import { ImagePlaceholderShapeUtil } from "@/components/shapes/ImagePlaceholderShapeUtil";
import { BrowserFrameShapeUtil } from "@/components/shapes/BrowserFrameShapeUtil";
import { HandDrawnIllustrationShapeUtil } from "@/components/shapes/HandDrawnIllustrationShapeUtil";

export const customShapeUtils = [
  ...defaultShapeUtils,
  ProjectCardShapeUtil,
  HandDrawnButtonShapeUtil,
  AnnotationShapeUtil,
  TeamAvatarsShapeUtil,
  SkillIconShapeUtil,
  ImagePlaceholderShapeUtil,
  BrowserFrameShapeUtil,
  HandDrawnIllustrationShapeUtil,
];

export const customBindingUtils = [...defaultBindingUtils];
