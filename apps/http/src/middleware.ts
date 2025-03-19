import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers["authorization"] || "";

  try {
    const response = jwt.verify(header, JWT_SECRET);

    //@ts-ignore
    req.userId = (response as JwtPayload).id;
    next();
  } catch (e) {
    res.json({ message: e });
  }
}
