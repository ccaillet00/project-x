import { type Request, type Response, type Express } from "express"
import { twitterTable } from "../db/schema"
import { db } from "../db/database"
import { eq } from "drizzle-orm"
import { and } from "drizzle-orm"

export const initializePostsAPI = (app: Express) => {

    app.get("/api/posts", async (req: Request, res: Response) => {
        const dbPosts = await db.select().from(twitterTable)
        res.send(dbPosts)
    })

    app.post("/api/posts", async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        const { tweet } = req.body;
        const createDBPost = await db.insert(twitterTable).values({ tweet, userId }).returning()
        res.send(createDBPost[0])
    })

    app.put("/api/posts/:id", async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        const uid = Number(userId)
        const postId = Number(req.params.id ?? 0)
        const updateDBPost = await db.update(twitterTable)
        .set({tweet: req.body.tweet})
        .where(
            and(
            eq(twitterTable.id, postId), 
            eq(twitterTable.userId, uid)
            )
        )
            .returning();
        if (!updateDBPost.length) {
            res.status(404).send({ message: "Not found or not authorized" });
            return;
        }
        res.send(updateDBPost)
    })

    app.delete("/api/posts/:id", async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        const uid = Number(userId)
        const postId = Number(req.params.id ?? 0)
        const deleteDBPost = await db.delete(twitterTable)
        .where(
            and(
            eq(twitterTable.id, postId),
            eq(twitterTable.userId, uid)))
            .returning();
        if (!deleteDBPost.length) {
            res.status(404).send({ message: "Not found or not authorized" });
            return;
        }
        res.send({ message: "Tweet gelöscht", deleted: deleteDBPost })
    })
}
