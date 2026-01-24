import { type Request, type Response, type Express } from "express";
import bcrypt from "bcrypt";
import { userTable } from "../db/schema";
import { db } from "../db/database";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export const iniializeAuthAPI = (app: Express) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await db
      .insert(userTable)
      .values({ username: username, password: hashedPassword });
    res.send({ message: "User registered successfully", user: newUser });
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await db
      .select()
      .from(userTable)
      .where(eq(userTable.username, username))
      .limit(1);
    const checkPassword = user[0]?.id
      ? bcrypt.compareSync(password, user[0].password)
      : false;

    if (!checkPassword) {
      return res.status(401).send({ message: "Invalid credentials" });
    } else {
      return res.send({
        message: "Login successful",
        jwt: jwt.sign({ id: user[0]?.id }, jwtSecret, { expiresIn: "1h" }),
      });
    }
  });
  console.log("Auth API initialized");
};
