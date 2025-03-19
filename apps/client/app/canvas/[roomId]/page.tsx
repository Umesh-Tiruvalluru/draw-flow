import RoomCanvas from "@/components/RoomCanvas";
import React from "react";

export default async function CanvasPage({ params }: { params: string }) {
  const roomId = (await params).roomId;

  if (typeof roomId !== "string") return;

  return <RoomCanvas roomId={roomId} />;
}
