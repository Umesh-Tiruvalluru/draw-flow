import { useEffect, useRef, useState } from "react";

import Topbar from "./ui/Topbar";
import { Draw } from "@/draw/Draw";
import { Tool } from "@/types";

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draw, setDraw] = useState<Draw>();

  const [selectedTool, setSelectedTool] = useState<Tool>("RECT");

  useEffect(() => {
    if (canvasRef.current) {
      const initDraw = new Draw(canvasRef.current, socket, roomId);
      setDraw(initDraw);
    }
  }, [canvasRef, socket, roomId, selectedTool]);

  useEffect(() => {
    draw?.setTool(selectedTool);
  }, [selectedTool, draw]);

  return (
    <div className="relative">
      <canvas
        className="overflow-hidden"
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
      <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  );
}
