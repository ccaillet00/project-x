import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: number;
  username: string;
}

declare module "express" {
  interface Request {
    user?: UserPayload;
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return next();

  const token = authHeader.split(" ")[1] || "";
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret)
      throw new Error("JWT_SECRET is not defined in environment variables");
    const payload = jwt.verify(token, jwtSecret) as unknown as UserPayload;
    req.user = payload;
  } catch {
    req.user = undefined;
  }
  next();
};

export default authMiddleware;
