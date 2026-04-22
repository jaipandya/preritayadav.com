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
import { OutsideWorkCardShapeUtil } from "@/components/shapes/OutsideWorkCardShapeUtil";
import { CompanyLogosShapeUtil } from "@/components/shapes/CompanyLogosShapeUtil";

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
  OutsideWorkCardShapeUtil,
  CompanyLogosShapeUtil,
];

export const customBindingUtils = [...defaultBindingUtils];
