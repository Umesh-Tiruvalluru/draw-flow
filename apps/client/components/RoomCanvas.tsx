"use client";

import { useEffect, useState } from "react";
import Canvas from "./Canvas";
import { WS_BACKEND } from "@/config";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      "ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMyOTYwZTY3LTM4YWUtNGFiYS04YWYwLTBhOWQ3YWY4YzVlNCIsImlhdCI6MTczOTc3MTQ5NX0.69X1dN4VVzV868OUf8Xtdr8rIfGqyMEyO9ge3vJ3VJ4",
    );

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
