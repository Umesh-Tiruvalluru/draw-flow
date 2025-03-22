import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

import WebSocket, { WebSocketServer } from "ws";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

enum ElementType {
  "RECT",
  "CIRCLE",
}

const users: User[] = [];

function checkUser(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    //@ts-ignore
    if (!decoded || !decoded.id) {
      return null;
    }
    //@ts-ignore
    return decoded.id;
  } catch (e) {
    console.error(e);
    return null;
  }
}

wss.on("connection", (ws, req) => {
  const url = req.url;

  if (!url) {
    ws.close();
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";

  const userId = checkUser(token);

  if (!userId) {
    ws.close();
  }

  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on("message", async (data) => {
    let parsedData;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data);
    }

    // {roomAction, roomId}
    if (parsedData.roomAction === "join_room") {
      const user = users.find((usr) => usr.ws === ws);
      user?.rooms.push(parsedData.roomId);
      ws.send(JSON.stringify({ message: "Joined Successfully" }));
    }

    // {roomAction, room}
    if (parsedData.roomAction === "leave_room") {
      const user = users.find((usr) => usr.ws === ws);
      if (!user) return;
      user.rooms = user?.rooms.filter((room) => room === parsedData.room);
    }

    if (parsedData.roomAction === "draw") {
      const elementData = JSON.parse(parsedData.elementData);
      let data;
      if (elementData.type === "RECT") {
        data = {
          x: Number(elementData.x),
          y: Number(elementData.y),
          width: Number(elementData.width),
          height: Number(elementData.height),
        };
      } else if (elementData.type === "CIRCLE") {
        data = {
          centerX: Number(elementData.centerX),
          centerY: Number(elementData.centerY),
          radius: Number(elementData.radius),
        };
      } else if (elementData.type === "LINE") {
        data = {
          startX: Number(elementData.startX),
          startY: Number(elementData.startY),
          endX: Number(elementData.endX),
          endY: Number(elementData.endY),
        };
      } else if (elementData.type === "TEXT") {
        data = {
          x: Number(elementData.x),
          y: Number(elementData.y),
          text: elementData.text,
          maxWidth: Number(elementData.maxWidth),
        };
      } else if (elementData.type === "PENCIL") {
        console.log(elementData.points);
      }

      if (!data) return;

      try {
        await prismaClient.elements.create({
          data: {
            type: elementData.type,
            data,
            roomId: Number(parsedData.roomId),
            userId,
          },
        });
      } catch (e) {
        console.error(e);
      }

      users.forEach((user) => {
        if (user.rooms.includes(parsedData.roomId)) {
          user.ws.send(
            JSON.stringify({
              roomAction: "draw",
              data,
              roomId: parsedData.roomId,
            }),
          );
        }
      });
    }
  });
});
