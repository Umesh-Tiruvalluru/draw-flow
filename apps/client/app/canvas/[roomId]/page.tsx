import React from "react";
import RoomCanvas from "../_components/RoomCanvas";

export default async function CanvasPage({ params }: { params: string }) {
  const roomId = (await params).roomId;

  if (typeof roomId !== "string") return;

  return <RoomCanvas roomId={roomId} />;
}
