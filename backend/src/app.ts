import express from "express";
import { initializeAPI } from "./api/index";
import { initializeMessageBroker } from "./message-broker";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

initializeMessageBroker();
initializeAPI(app);

app.listen(port, () => {
  console.log("Webserver is running on", port);
});

const SERVER_ROLE = process.env.SERVER_ROLE || "all";
const allowedServerRoles = ["all", "api", "worker"];
if (!allowedServerRoles.includes(SERVER_ROLE)) {
  console.error("Invalid SERVER_ROLE: ${SERVER_ROLE}");
  process.exit(1);
}

if (SERVER_ROLE === "all" || SERVER_ROLE === "api") {
  const port = 3000;
  const app = express();
  app.use(express.json());
  app.use(cors());
  initializeAPI(app);
  app.listen(port, () => {
    console.log("Webserver is running on", port);
  });
}
