import { rateLimit } from "express-rate-limit"

export const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 Minuten
<<<<<<< HEAD
    limit: 1000, // Limit each IP to 1000 requests
    legacyHeaders: false
=======
    limit: 1000, // limit each IP to 1000 request
    legacyHeaders: false,
>>>>>>> #39
})