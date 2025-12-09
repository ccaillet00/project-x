import type { Express } from "express"
import { initializePostsAPI } from "./api"
import { iniializeAuthAPI } from "./auth"
import authMiddleware from "./auth-middlewares"

export const initializeAPI = (app: Express) => {
    app.use("/api", authMiddleware)
    initializePostsAPI(app)
    iniializeAuthAPI(app)
}
/*
export const initializeAuthAPIWrapper = (app: Express) => {
    iniializeAuthAPI(app)
}*/