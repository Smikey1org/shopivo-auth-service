import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

interface AuthPayload {
  sub: string;
  email: string;
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Missing bearer token",
      });
      return;
    }

    const token = header.substring(7);

    const decoded = jwt.verify(token, env.jwtSecret);

    if (
      typeof decoded === "string" ||
      typeof decoded.sub !== "string" ||
      typeof decoded.email !== "string"
    ) {
      res.status(401).json({
        message: "Invalid token payload",
      });
      return;
    }

    const payload: AuthPayload = {
      sub: decoded.sub,
      email: decoded.email,
    };

    req.user = {
      userId: payload.sub,
      email: payload.email,
    };

    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
