import z from "zod";

export const UserSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(3).max(20),
  password: z.string().min(6),
});

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
});

export const RoomSchema = z.object({
  slug: z.string().min(3).max(20),
});

export type ToolType = "CIRCLE" | "RECT" | "LINE" | "PENCIL";
