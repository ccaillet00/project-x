import { Job, Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { twitterTable } from "../db/schema";
import { db } from "../db/database";
import { eq, and } from "drizzle-orm";
import { textAnalysis } from "../service/ai";
import { invalidatePostsCache } from "../service/cache";

const SERVER_ROLE = process.env.SERVER_ROLE;

let sentimentQueue: Queue;

export const initializeMessageBroker = () => {
  const connection = new IORedis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    maxRetriesPerRequest: null,
  });
  sentimentQueue = new Queue("sentiment", { connection });
  console.log("Sentiment queue initialized");
  if (SERVER_ROLE === "all" || SERVER_ROLE === "worker") {
    new Worker("sentiment", analyzeSentiment, { connection });
  }
};

const analyzeSentiment = async (job: Job) => {
  console.log(job.data);
  const postId = job.data.id;
  const getPost = await db
    .select({ tweet: twitterTable.tweet })
    .from(twitterTable)
    .where(and(eq(twitterTable.id, postId)));
  const texts = getPost;
  for (const text of texts) {
    const sentiment = await textAnalysis(text.tweet);

    const updateDBPost = await db
      .update(twitterTable)
      .set({ sentiment: sentiment.sentiment, correction: sentiment.correction })
      .where(and(eq(twitterTable.id, postId)));

    console.log(text);
    console.log(sentiment);
    console.log(updateDBPost);
  }
 await invalidatePostsCache()
  // 1. Generate job when new post is created with post id (in api/api.ts POST/PUT endpoint)
  // 2. Fetch the post from the database
  // 3. Analyze the sentiment of the post (services/ai.ts -> textAnalysis)
  // 4. Update the post with the sentiment
};

export { sentimentQueue };
