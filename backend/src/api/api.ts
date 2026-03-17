import { type Request, type Response, type Express } from "express";
import { twitterTable } from "../db/schema";
import { db } from "../db/database";
import { eq, and } from "drizzle-orm";
import { sentimentQueue } from "../message-broker";
import { getPosts, invalidatePostsCache } from "../service/cache";
import { logger } from "../service/logger";

export const initializePostsAPI = (app: Express) => {
  app.get("/api/posts", async (req: Request, res: Response) => {
    const userId = req.user?.id;
    res.send(await getPosts(userId));
  });

  app.post("/api/posts", async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      logger.warn({ userId }, "Authentifizierung: Fehlgeschlagen.");
      res.status(401).send({ message: "Unauthorized" });
      return;
    }
    const { tweet } = req.body;
    const createDBPost = await db
      .insert(twitterTable)
      .values({ tweet, userId })
      .returning();
    if (!tweet.length) {
      logger.error({ tweet }, "Post: Fehlender Text");
      res.status(404).send({ message: "type a text" });
      return;
    }

    if (!createDBPost[0]) {
      logger.error({ createDBPost }, "Post: Konnte kein Post erstellen");
      res.status(500).send({ message: "Failed to create post" });
      return;
    }
    sentimentQueue.add("analyze", { id: createDBPost[0].id });
    logger.info({ sentimentQueue }, "Post übergeben an SentimentQueue");
    res.send(createDBPost[0]);
    logger.info({ createDBPost }, "Post: Wurde erfolgreich erstellt");
  });

  app.put("/api/posts/:id", async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      logger.warn({ userId }, "Authentifizierung: Fehlgeschlagen.");
      res.status(401).send({ message: "Unauthorized" });
      return;
    }
    const uid = Number(userId);
    const postId = Number(req.params.id ?? 0);
    const updateDBPost = await db
      .update(twitterTable)
      .set({ tweet: req.body.tweet })
      .where(and(eq(twitterTable.id, postId), eq(twitterTable.userId, uid)))
      .returning();
    if (!updateDBPost.length) {
      logger.error(
        { updateDBPost },
        "Post: Nicht gefunden oder nicht autorisiert",
      );
      res.status(404).send({ message: "Not found or not authorized" });
      return;
    }
    if (!updateDBPost[0]) {
      logger.error({ updateDBPost }, "Post: Konnte kein Post erstellen");
      res.status(500).send({ message: "Failed to create post" });
      return;
    }
    sentimentQueue.add("analyze", { id: updateDBPost[0].id });
    res.send(updateDBPost);
    logger.info({ updateDBPost }, "Post: Wurde erfolgreich bearbeitet");
  });

  app.delete("/api/posts/:id", async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      logger.warn({ userId }, "Authentifizierung: Fehlgeschlagen.");
      res.status(401).send({ message: "Unauthorized" });
      return;
    }
    const uid = Number(userId);
    const postId = Number(req.params.id ?? 0);
    const deleteDBPost = await db
      .delete(twitterTable)
      .where(and(eq(twitterTable.id, postId), eq(twitterTable.userId, uid)))
      .returning();
    if (!deleteDBPost.length) {
      logger.error(
        { deleteDBPost },
        "Post: Nicht gefunden oder nicht autorisiert",
      );
      res.status(404).send({ message: "Not found or not authorized" });
      return;
    }
    await invalidatePostsCache();
    res.send({ message: "Tweet gelöscht", deleted: deleteDBPost });
    logger.info({ deleteDBPost }, "Post: Wurde erfolgreich gelöscht");
  });
};
