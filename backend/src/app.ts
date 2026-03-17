import express from "express";
import { initializeAPI } from "./api/index";
import cors from "cors";
import { initializeMessageBroker } from "./message-broker";
import { initializeCache } from "./service/cache";
import { logger } from "./service/logger";

const SERVER_ROLE = process.env.SERVER_ROLE || "all";
const allowedServerRoles = ["all", "api", "worker"];
if (!allowedServerRoles.includes(SERVER_ROLE)) {
  console.error("Invalid SERVER_ROLE: ${SERVER_ROLE}");
  process.exit(1);
}

initializeCache();
initializeMessageBroker();

if (SERVER_ROLE === "all" || SERVER_ROLE === "api") {
  const port = 3000;
  const app = express();
  app.use(express.json());
  app.use(cors());
  initializeAPI(app);
  app.listen(port, () => {
    logger.info(`Webserver is running on  ${port}`);
  });
}
