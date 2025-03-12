"use client";

import { useEffect, useState } from "react";
import Canvas from "./Canvas";
import { WS_BACKEND } from "@/config";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="))
      ?.split("=")[1];

    const ws = new WebSocket(`ws://localhost:8080?token=${token}`);

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          roomAction: "join_room",
          roomId: roomId,
        }),
      );
    };
  }, [roomId]);

  if (!socket) {
    return <div>Conecting to the server .....</div>;
  }

  return <Canvas roomId={roomId} socket={socket} />;
}
