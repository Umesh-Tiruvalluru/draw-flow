import express from "express";
import { auth } from "./middleware";
import { prismaClient } from "@repo/db/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { RoomSchema, SigninSchema, UserSchema } from "@repo/common/types";
import cors from "cors";
import { JWT_SECRET } from "@repo/backend-common/config";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  const parsedData = UserSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({ error: parsedData.error });
    return;
  }

  const hashedPassword = await bcrypt.hash(parsedData.data?.password, 5);

  try {
    const user = await prismaClient.user.create({
      data: {
        fullName: parsedData.data?.fullName,
        email: parsedData.data?.email,
        password: hashedPassword,
      },
    });

    res.json({ message: "successful" });
  } catch (e) {
    res.json({ message: e });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const parsedData = SigninSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({ error: parsedData.error });
    return;
  }

  try {
    const user = await prismaClient.user.findFirst({
      where: { email: parsedData.data?.email },
    });

    const passwordMatch = bcrypt.compare(
      parsedData.data?.password || "",
      user?.password || "",
    );

    if (!passwordMatch) {
      res.json({ message: "Invalid Credentials" });
      return;
    }

    const token = jwt.sign({ id: user?.id }, JWT_SECRET);

    if (!token) {
      res.json({ message: "Invalid Credentials" });
    }

    res.json({ token });
  } catch (e) {
    res.json({ message: e });
  }
});

app.post("/room", auth, async (req, res) => {
  const slug = req.body.slug;

  //@ts-ignore
  const userId = req.userId;
  console.log(userId);
  try {
    const room = await prismaClient.room.create({
      data: {
        slug: slug,
        adminId: userId,
        imageId: Math.floor(Math.random() * 10),
      },
    });

    res.json({ room });
  } catch (e) {
    res.status(411).json({ message: "Room already exists with the name" });
  }
});

app.get("/rooms", auth, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;

  try {
    const rooms = await prismaClient.room.findMany({
      where: { adminId: userId },
    });

    res.send({ rooms });
  } catch (e) {
    res.status(411).json({ message: e });
  }
});

app.get("/shapes/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);
  try {
    const elements = await prismaClient.elements.findMany({
      where: { roomId },
    });

    res.json({ elements });
  } catch (e) {
    console.error(e);
    res.json({ error: e });
  }
});

app.delete("/room/:id", auth, async (req, res) => {
  const roomId = Number(req.params.id);

  try {
    await prismaClient.room.delete({ where: { id: roomId } });

    res.json({ message: "successfully deleted" });
  } catch (e) {
    res.json({ error: e });
  }
});

app.listen(8081);
