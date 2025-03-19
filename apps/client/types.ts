export type ElementType =
  | {
      type: "RECT";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "CIRCLE";
      centerX: number;
      centerY: number;
      radius: number;
    };

export type Tool = "RECT" | "CIRCLE" | "LINE" | "PENCIL" | "PAN";

export type room = {
  id: number;
};
