import type { Express } from "express";
import { initializePostsAPI } from "./api";
import { iniializeAuthAPI } from "./auth";
import authMiddleware from "./auth-middlewares";
import cors from "cors";
import { limiter } from "./rate-limiter";

export const initializeAPI = (app: Express) => {
  app.use("/api", authMiddleware);
  app.use(limiter);
  app.use(cors());
  initializePostsAPI(app);
  iniializeAuthAPI(app);
};
