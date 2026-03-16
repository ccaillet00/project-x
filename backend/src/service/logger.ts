import type { Request } from 'express'
import pinoHttp from 'pino-http'
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
  },
})

const httpLogger = pinoHttp({
  logger: logger,
  customProps: (req: Request, res) => {
    return {
      userId: req.user?.id,
      username: req.user?.username,
    }
  },
})

export { logger, httpLogger }
