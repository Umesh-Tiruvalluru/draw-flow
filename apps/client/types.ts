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
    }
  | {
      type: "LINE";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    }
  | {
      type: "PENCIL";
      points: ElementPointsType[];
    };

type ElementPointsType = {
  x: number;
  y: number;
};

export type Tool = "RECT" | "CIRCLE" | "LINE" | "PENCIL" | "PAN";

export type room = {
  id: number;
};
