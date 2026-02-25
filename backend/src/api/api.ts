import { type Request, type Response, type Express } from "express";
import { twitterTable } from "../db/schema";
import { db } from "../db/database";
import { eq, and } from "drizzle-orm";
import { sentimentQueue } from "../message-broker";
import { getPosts, invalidatePostsCache } from "../service/cache";

export const initializePostsAPI = (app: Express) => {
  app.get("/api/posts", async (req: Request, res: Response) => {
    const userId = req.user?.id;
    res.send(await getPosts(userId));
  });

  app.post("/api/posts", async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }
    const { tweet } = req.body;
    const createDBPost = await db
      .insert(twitterTable)
      .values({ tweet, userId })
      .returning();
    if (!tweet.length) {
      res.status(404).send({ message: "type a text" });
      return;
    }

    if (!createDBPost[0]) {
      res.status(500).send({ message: "Failed to create post" });
      return;
    }
    sentimentQueue.add("analyze", { id: createDBPost[0].id });
    res.send(createDBPost[0]);
  });

  app.put("/api/posts/:id", async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
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
      res.status(404).send({ message: "Not found or not authorized" });
      return;
    }
    if (!updateDBPost[0]) {
      res.status(500).send({ message: "Failed to create post" });
      return;
    }
    sentimentQueue.add("analyze", { id: updateDBPost[0].id });
    res.send(updateDBPost);
  });

  app.delete("/api/posts/:id", async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
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
      res.status(404).send({ message: "Not found or not authorized" });
      return;
    }
    await invalidatePostsCache();
    res.send({ message: "Tweet gelöscht", deleted: deleteDBPost });
  });
};
