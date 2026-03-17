import { type Request, type Response, type Express } from "express";
import bcrypt from "bcrypt";
import { userTable } from "../db/schema";
import { db } from "../db/database";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { logger } from "../service/logger";

export const iniializeAuthAPI = (app: Express) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    logger.error("JWT_SECRET is not defined in environment variables");
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      logger.warn(
        { username, email },
        "Register: Fehlende erforderliche Felder",
      );
      return res.status(400).json({ message: "Fehlende erforderliche Felder" });
    }

    logger.info({ username, email }, "Register: Neuer Registrierungsversuch");

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    try {
      const newUser = await db
        .insert(userTable)
        .values({ username: username, email: email, password: hashedPassword })
        .returning();

      logger.info(
        { userId: newUser[0]?.id, username },
        "Register: User erfolgreich erstellt",
      );
      const token = jwt.sign(
        { id: newUser[0]?.id, username: newUser[0]?.username },
        jwtSecret,
        { expiresIn: "1h" },
      );

      logger.debug({ userId: newUser[0]?.id }, "REgister: JWT Token generiert");

      res.send({
        message: "User registered successfully",
        user: newUser,
        jwt: token,
      });
    } catch (error: unknown) {
      logger.error(
        {
          error: error instanceof Error ? error.message : String(error),
          username,
          email,
        },
        "Register: Fehler beim Erstellen des Users",
      );
      res.status(500).json({ message: "Fehler beim Registrieren" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { username, password, remember } = req.body;

    // Validierungen loggen
    if (!username || !password) {
      logger.warn({ username }, "Login: Fehlende Anmeldedaten");
      return res.status(400).json({ message: "Fehlende Anmeldedaten" });
    }

    logger.info({ username }, "Login: Anmeldeversuch");

    try {
      const user = await db
        .select()
        .from(userTable)
        .where(eq(userTable.username, username))
        .limit(1);

      if (!user[0]) {
        logger.warn({ username }, "Login: User nicht gefunden");
        return res.status(401).json({ message: "Ungültige Anmeldedaten" });
      }

      const checkPassword = bcrypt.compareSync(password, user[0].password);

      if (!checkPassword) {
        logger.warn(
          { userId: user[0].id, username },
          "Login: Ungültiges Passwort",
        );
        return res.status(401).json({ message: "Ungültige Anmeldedaten" });
      }

      logger.info(
        { userId: user[0].id, username },
        "Login: Passwort validiert",
      );

      const rememberFlag = Number(remember) === 1;
      const expiresIn = rememberFlag ? "30d" : "1h";

      const token = jwt.sign(
        { id: user[0].id, username: user[0].username },
        jwtSecret,
        { expiresIn },
      );

      logger.debug(
        { userId: user[0].id, expiresIn },
        "Login: JWT Token generiert",
      );

      logger.info(
        { userId: user[0].id, username },
        "Login: Erfolgreich angemeldet",
      );

      return res.send({
        message: "Login successful",
        jwt: token,
      });
    } catch (error: unknown) {
      logger.error(
        {
          error: error instanceof Error ? error.message : String(error),
          username,
        },
        "Login: Fehler beim Anmelden",
      );
      res.status(500).json({ message: "Fehler beim Anmelden" });
    }
  });

  logger.info("Auth API initialized");
};
