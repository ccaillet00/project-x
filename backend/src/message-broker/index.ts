import { Job, Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { twitterTable } from "../db/schema";
import { db } from "../db/database";
import { eq, and } from "drizzle-orm";
import { textAnalysis } from "../service/ai";
import { invalidatePostsCache } from "../service/cache";
import { logger } from "../service/logger";

const SERVER_ROLE = process.env.SERVER_ROLE;

let sentimentQueue: Queue;

export const initializeMessageBroker = () => {
  const connection = new IORedis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    maxRetriesPerRequest: null,
  });
  sentimentQueue = new Queue("sentiment", { connection });
  logger.info("Sentiment queue initialized");
  if (SERVER_ROLE === "all" || SERVER_ROLE === "worker") {
    new Worker("sentiment", analyzeSentiment, { connection });
  }
};

const analyzeSentiment = async (job: Job) => {
  logger.info(job.data);
  const postId = job.data.id;
  const getPost = await db
    .select({ tweet: twitterTable.tweet })
    .from(twitterTable)
    .where(and(eq(twitterTable.id, postId)));
  const texts = getPost;
  for (const text of texts) {
    const sentiment = await textAnalysis(text.tweet);
    if (sentiment.sentiment === "dangerous") {
      // Post löschen
      await db.delete(twitterTable).where(eq(twitterTable.id, postId));
      logger.info(
        {
          Post: postId.postId,
          sentiment: sentiment.sentiment,
          tweet: text.tweet,
        },
        "Post removed",
      );
    } else {
      await db
        .update(twitterTable)
        .set({
          sentiment: sentiment.sentiment,
          correction: sentiment.correction,
        })
        .where(and(eq(twitterTable.id, postId)));

      logger.info(
        {
          text: text.tweet,
          sentiment: sentiment.sentiment,
          correction: sentiment.correction,
        },
        "Sentiment updated in database",
      );
    }
    await invalidatePostsCache();
  }
};
export { sentimentQueue };
