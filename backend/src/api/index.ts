import type { Express } from "express";
import { initializePostsAPI } from "./api";
import { iniializeAuthAPI } from "./auth";
import authMiddleware from "./auth-middlewares";
import cors from "cors";
import { httpLogger } from "../service/logger";

export const initializeAPI = (app: Express) => {
  app.use("/api", authMiddleware);
  app.use(cors());
  app.use(httpLogger);
  initializePostsAPI(app);
  iniializeAuthAPI(app);
};
