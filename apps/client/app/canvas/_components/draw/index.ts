import { getExistingShapes } from "@/service";
import { ElementType, Tool } from "@/types";

export class Draw {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingElements: ElementType[];
  private socket: WebSocket;
  private roomId: string;

  private clicked: boolean;
  private startX: number = 0;
  private startY: number = 0;

  private viewPortTransform = {
    x: 0,
    y: 0,
    scale: 1,
  };

  private selectedTool: Tool = "RECT";

  constructor(canvas: HTMLCanvasElement, socket: WebSocket, roomId: string) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingElements = [];
    this.socket = socket;
    this.roomId = roomId;
    this.clicked = false;

    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  async init() {
    this.existingElements = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
    console.log(this.selectedTool);
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      try {
        const elementData = JSON.parse(event.data);

        if (elementData.roomAction === "draw") {
          this.existingElements.push(elementData);
          this.clearCanvas();
        }
      } catch (e) {
        console.error(e);
      }
    };
  }

  clearCanvas() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.setTransform(
      this.viewPortTransform.scale,
      0,
      0,
      this.viewPortTransform.scale,
      this.viewPortTransform.x,
      this.viewPortTransform.y,
    );

    this.ctx.fillStyle = "rgba(0, 0, 0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    for (const element of this.existingElements) {
      if (element.type === "RECT") {
        this.ctx.strokeStyle = "rgba(255, 255, 255)"; //blah
        this.drawRect(element);
      } else if (element.type === "CIRCLE") {
        this.drawCircle(element);
      } else if (element.type === "LINE") {
        this.drawLine(element);
      }
    }
  }

  drawRect(element: Extract<ElementType, { type: "RECT" }>) {
    this.ctx.strokeRect(element.x, element.y, element.width, element.height);
  }

  drawCircle(element: Extract<ElementType, { type: "CIRCLE" }>) {
    this.ctx.beginPath();
    this.ctx.arc(
      element.centerX,
      element.centerY,
      Math.abs(element.radius),
      0,
      2 * Math.PI,
    );
    this.ctx.stroke();
    this.ctx.closePath();
  }
  drawLine(element: Extract<ElementType, { type: "LINE" }>) {
    this.ctx.beginPath();
    this.ctx.moveTo(element.startX, element.startY); // Start point
    this.ctx.lineTo(element.endX, element.endY); // End point
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawWithPencil(element: Extract<ElementType, { type: "PENCIL" }>) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "rgba(255, 255, 255)";
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    if (element.points.length > 0) {
      this.ctx.moveTo(element.points[0].x, element.points[0].y);
    }

    for (let i = 1; i < element.points.length; i++) {
      this.ctx.moveTo(element.points[i].x, element.points[i].y);
    }

    this.ctx.stroke();
    this.ctx.closePath();
  }

  mouseDownHandler = (event: MouseEvent) => {
    //Mouse down event
    this.clicked = true;
    this.startX = event.offsetX;
    this.startY = event.offsetY;
  };

  mouseUpHandler = (event: MouseEvent) => {
    this.clicked = false;

    const endX = event.offsetX;
    const endY = event.offsetY;

    const width = endX - this.startX;
    const height = endY - this.startY;

    let element: ElementType | null = null;

    if (this.selectedTool === "RECT") {
      element = {
        type: "RECT",
        x: this.startX,
        y: this.startY,
        width: width,
        height: height,
      };
    } else if (this.selectedTool === "CIRCLE") {
      const radius = Math.sqrt(width * width + height * height) / 2;
      const centerX = this.startX + width / 2;
      const centerY = this.startY + height / 2;

      element = {
        type: "CIRCLE",
        radius,
        centerX,
        centerY,
      };
    } else if (this.selectedTool === "LINE") {
      element = {
        type: "LINE",
        startX: this.startX,
        startY: this.startY,
        endX: endX,
        endY: endY,
      };
    }

    console.log(element);

    if (!element) return;

    this.existingElements.push(element);

    this.socket.send(
      JSON.stringify({
        roomAction: "draw",
        elementData: JSON.stringify(element),
        roomId: this.roomId,
      }),
    );

    this.clearCanvas();
  };

  mouseMoveHandler = (event: MouseEvent) => {
    //Mouse move event
    if (this.clicked) {
      const endX = event.offsetX;
      const endY = event.offsetY;

      const width = endX - this.startX;
      const height = endY - this.startY;
      this.clearCanvas();
      this.ctx.strokeStyle = "rgba(255, 255, 255)";

      if (this.selectedTool === "RECT") {
        this.drawRect({
          type: "RECT",
          x: this.startX,
          y: this.startY,
          width: width,
          height: height,
        });
      } else if (this.selectedTool === "CIRCLE") {
        const radius = Math.sqrt(width * width + height * height) / 2;
        const centerX = this.startX + width / 2;
        const centerY = this.startY + height / 2;

        this.drawCircle({ type: "CIRCLE", centerX, centerY, radius });
      } else if (this.selectedTool === "LINE") {
        this.drawLine({
          type: "LINE",
          startX: this.startX,
          startY: this.startY,
          endX,
          endY,
        });
      }
    }
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
}
