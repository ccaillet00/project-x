import type { Express } from "express";
import { initializePostsAPI } from "./api";
import { iniializeAuthAPI } from "./auth";
import authMiddleware from "./auth-middlewares";
import cors from "cors";
<<<<<<< HEAD
import { limiter } from "./rate-limiter";
=======
import { httpLogger } from "../service/logger";
import { limiter } from "./rate-limiter"
import promMid from "express-prometheus-middleware"

>>>>>>> #39

export const initializeAPI = (app: Express) => {
    app.use(
        promMid({
        metricsPath: "/metrics",
            collectDefaultMetrics: false,
            requestDurationBuckets: [0.1, 0.5, 1, 1.5],
            requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
            responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400]
        })
    )  
  app.use("/api", authMiddleware);
  app.use(limiter);
  app.use(cors());
  app.use(limiter)
  app.use(httpLogger);
  initializePostsAPI(app);
  iniializeAuthAPI(app);
};
