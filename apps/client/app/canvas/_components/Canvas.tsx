import { useEffect, useRef, useState } from "react";

import Topbar from "./Topbar";

import { Tool } from "@/types";
import { Draw } from "./draw";

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
    draw?.setTool(selectedTool);
  }, [selectedTool, draw]);

  useEffect(() => {
    if (canvasRef.current) {
      const initDraw = new Draw(canvasRef.current, socket, roomId);
      setDraw(initDraw);

      return () => {
        initDraw.destroy();
      };
    }
  }, [canvasRef, socket, roomId, selectedTool]);

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
