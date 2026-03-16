import { type Request, type Response, type Express } from "express"
import bcrypt from "bcrypt"
import { userTable } from "../db/schema"
import { db } from "../db/database"
import { eq } from "drizzle-orm"
import jwt from "jsonwebtoken"

export const iniializeAuthAPI = (app: Express) => {

const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

    app.post("/api/auth/register", async (req: Request, res: Response) => {
        const { username, email, password } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        try {
        const newUser = await db.insert(userTable).values({username: username, email: email, password: hashedPassword}).returning()
        const token = jwt.sign({ id: newUser[0]?.id, username: newUser[0]?.username }, jwtSecret, {expiresIn: "1h"} )
        res.send({ message: "User registered successfully", user: newUser, jwt: token });
        } catch (error: any) {
            console.error("Fehler beim erstellen des Users", error)
            res.status(500).json({ message: error.cause}) // less details? 
        }
    })

    app.post("/api/auth/login", async (req: Request, res: Response) => {
        const { username, password, remember } = req.body;
        const user = await db.select().from(userTable).where(eq(userTable.username, username)).limit(1);
        const checkPassword = user[0]?.id ? bcrypt.compareSync(password, user[0].password) : false;
    
        if (!checkPassword) {
            return res.status(401).send({ message: "Invalid credentials" });
        }
        const remeberFlag = Number(remember) === 1;
        const expiresIn = remeberFlag ? "30d" : "1h";
        const token = jwt.sign({ id: user[0]?.id, username: user[0]?.username }, jwtSecret, { expiresIn })
        return res.send({
            message: "Login successful", jwt: token

            }); 
    }); console.log("Auth API initialized");
}