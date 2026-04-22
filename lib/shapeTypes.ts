import "tldraw";

declare module "tldraw" {
  export interface TLGlobalShapePropsMap {
    "project-card": {
      w: number;
      h: number;
      number: string;
      title: string;
      description: string;
      mediaType: string;
    };
    "hand-drawn-button": {
      w: number;
      h: number;
      label: string;
    };
    annotation: {
      w: number;
      h: number;
      text: string;
      fontSize: number;
      showArrow: boolean;
      arrowDirection: string;
    };
    "team-avatars": {
      w: number;
      h: number;
      title: string;
      subtitle: string;
      count: number;
    };
    "skill-icon": {
      w: number;
      h: number;
      icon: string;
      label: string;
    };
    "image-placeholder": {
      w: number;
      h: number;
    };
    "browser-frame": {
      w: number;
      h: number;
      url: string;
      contentType: string;
      src: string;
    };
    "hand-drawn-illustration": {
      w: number;
      h: number;
      scene: string;
    };
    "company-logos": {
      w: number;
      h: number;
      companies: string;
    };
    "outside-work-card": {
      w: number;
      h: number;
      number: string;
      title: string;
      subtitle: string;
      description: string;
      illustration: string;
    };
    "contact-me": {
      w: number;
      h: number;
    };
  }
}
