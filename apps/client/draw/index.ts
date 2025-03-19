import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type Shape =
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

const viewPortTransform = {
  x: 0,
  y: 0,
  scale: 1,
};

let previousX = 0,
  previousY = 0;

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  selectedTool: "RECT" | "CIRCLE" | "LINE" | "PENCIL",
) {
  const ctx = canvas.getContext("2d");

  const existingShapes: Shape[] = await getExistingShapes(roomId);

  if (!ctx) return;

  socket.onmessage = (event) => {
    const elementData = JSON.parse(event.data);

    if (elementData.roomAction === "draw") {
      existingShapes.push(elementData);
      clearCanvas(canvas, ctx, existingShapes);
    }
  };

  clearCanvas(canvas, ctx, existingShapes);

  let clicked: boolean = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("mousedown", (event) => {
    clicked = true;
    startX = event.clientX;
    startY = event.clientY;
  });

  canvas.addEventListener("mouseup", (event) => {
    clicked = false;
    const width = event.clientX - startX;
    const height = event.clientY - startY;
    // const shape: Shape =

    let shape: Shape | null = null;

    if (selectedTool === "RECT") {
      shape = { type: "RECT", x: startX, y: startY, width, height };
    } else if (selectedTool === "CIRCLE") {
      const radius = Math.max(width, height) / 2;
      shape = {
        type: "CIRCLE",
        radius: radius,
        centerX: startX + radius,
        centerY: startY + radius,
      };
    }

    if (!shape) return;

    existingShapes.push(shape);

    socket.send(
      JSON.stringify({
        roomAction: "draw",
        shapeData: JSON.stringify(shape),
        roomId,
      }),
    );
  });
  console.log(selectedTool);

  canvas.addEventListener("mousemove", (event) => {
    if (clicked) {
      const width = event.clientX - startX;
      const height = event.clientY - startY;

      if (selectedTool === "RECT") {
        clearCanvas(canvas, ctx, existingShapes);
        ctx.strokeStyle = "rgba(255, 255, 255)";
        ctx.strokeRect(startX, startY, width, height);
      } else if (selectedTool === "CIRCLE") {
        const radius = Math.max(width, height) / 2;
        const centerX = startX + radius;
        const centerY = startY + radius;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
      }
    }
  });
}

function drawRect(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  width: number,
  height: number,
) {
  ctx.strokeStyle = "rgba(255, 255, 255)";
  ctx.strokeRect(startX, startY, width, height);
}

function drawCircle(
  ctx: CanvasRenderingContext2D,
  radius: number,
  x: number,
  y: number,
) {
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255, 255,255)";
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
}

function updatePanning(event: MouseEvent) {
  const localX = event.clientX;
  const localY = event.clientY;

  viewPortTransform.x += localX - previousX;
  viewPortTransform.y += localY - previousY;

  previousX = localX;
  previousY = localY;
}

function clearCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  existingShapes: Shape[],
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.map((shape) => {
    if (shape.type === "RECT") {
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "CIRCLE") {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
  });
}

async function getExistingShapes(roomId: string) {
  const response = await axios.get(`${HTTP_BACKEND}/shapes/${roomId}`);
  const elements = response.data.elements;

  const elementData = elements.map((element) => {
    return { ...element.data, type: element.type, roomId, roomAction: "draw" };
  });

  return elementData;
}
