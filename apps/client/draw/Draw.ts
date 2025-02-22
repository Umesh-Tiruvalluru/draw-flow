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
    this.initPanningHandlers();
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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0, 0, 0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (const element of this.existingElements) {
      if (element.type === "RECT") {
        this.ctx.strokeStyle = "rgba(255, 255, 255)"; //blah
        this.drawRect(element);
      } else if (element.type === "CIRCLE") {
        this.drawCircle(element);
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

  mouseDownHandler = (event: MouseEvent) => {
    //Mouse down event
    this.clicked = true;
    this.startX = event.clientX;
    this.startY = event.clientY;

    // const selectedTool = this.selectedTool;

    // if (selectedTool === "PAN") {
    //   this.canvas.addEventListener("mousemove", (event) => {
    //     this.clearCanvas();
    //     console.log("Hey Dumb");
    //     this.updatePanning(event);
    //   });
    // }
  };

  updatePanning = (event: MouseEvent) => {
    const localX = event.clientX;
    const localY = event.clientY;

    this.viewPortTransform.x += localX - this.startX;
    this.viewPortTransform.y += localY - this.startY;

    this.startX = localX;
    this.startY = localY;
  };

  mouseUpHandler = (event: MouseEvent) => {
    this.clicked = false;

    const width = event.clientX - this.startX;
    const height = event.clientY - this.startY;

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
      const radius = Math.max(width, height) / 2;
      const centerX = this.startX + width / 2;
      const centerY = this.startY + height / 2;

      element = {
        type: "CIRCLE",
        radius,
        centerX,
        centerY,
      };
    }

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
      const width = event.clientX - this.startX;
      const height = event.clientY - this.startY;
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
        const radius = Math.max(width, height) / 2;
        const centerX = this.startX + radius;
        const centerY = this.startY + radius;

        this.drawCircle({ type: "CIRCLE", centerX, centerY, radius });
      }
    }
  };

  initPanningHandlers() {
    if (this.selectedTool === "PAN") {
      this.canvas.addEventListener("mousedown", (event) => {
        this.startX = event.clientX;
        this.startY = event.clientY;

        this.canvas.addEventListener("mousemove", (event) => {
          this.clearCanvas();

          this.updatePanning(event);
        });
      });

      this.canvas.addEventListener("mouseup", () => {
        this.canvas.removeEventListener("mousedown", () => {
          this.clearCanvas();
        });
      });
    }
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
}
