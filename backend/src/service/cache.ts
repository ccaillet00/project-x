import { eq } from "drizzle-orm";
import { db } from "../db/database";
import { twitterTable, userTable } from "../db/schema";
import IORedis from "ioredis";
import { logger } from "./logger";

const CACHE_ACTIVE = (process.env.CACHE_ACTIVE || "true") === "true";

let redis: IORedis;

export const initializeCache = async () => {
  if (redis || !CACHE_ACTIVE) return;
  console.log("Initializing Redis Cache...");
  redis = new IORedis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    maxRetriesPerRequest: null,
  });
  logger.info("Redis Cache initialized");
};

type Posts = Awaited<ReturnType<typeof getPostsFromDB>>;

export const getPosts = async (userId?: number) => {
  if (!CACHE_ACTIVE) return getPostsFromDB(userId);

  const cacheKey = userId ? `posts:user:${userId}` : "posts:all";

  try {
    const cachedPosts = await getPostsFromCache(cacheKey);
    if (cachedPosts) {
      logger.info(`Cache hit for ${cacheKey}`);
      return cachedPosts;
    }
  } catch (error) {
    logger.error(`Cache retrieval error: ${error}`);
  }

  const posts = await getPostsFromDB(userId);
  await setPostsInCache(posts, cacheKey);
  return posts;
};

const getPostsFromCache = async (cachedKey: string) => {
  if (!redis) return null;

  const cached = await redis.get(cachedKey);
  if (!cached) return null;

  try {
    return JSON.parse(cached);
  } catch (error) {
    console.log("Cache parse error:", error);
    await redis.del(cachedKey);
    return null;
  }
};

const getPostsFromDB = async (userId?: number) => {
  let query = db
    .select({
      id: twitterTable.id,
      tweet: twitterTable.tweet,
      userId: twitterTable.userId,
      created: twitterTable.created,
      sentiment: twitterTable.sentiment,
      correction: twitterTable.correction,
      username: userTable.username,
    })
    .from(twitterTable)
    .leftJoin(userTable, eq(twitterTable.userId, userTable.id));
  if (userId) {
    return await query.where(eq(twitterTable.userId, userId));
  }
  logger.info("Get post from DB");
  return await query;
};

const setPostsInCache = async (posts: Posts, cacheKey: string) => {
  if (!redis || !CACHE_ACTIVE) return;

  try {
    await redis.set(cacheKey, JSON.stringify(posts));
    logger.info(`Cache set for ${cacheKey}`);
  } catch (error) {
    logger.error(`Cache set error ${error}`);
  }
};

export const invalidatePostsCache = async () => {
  if (!redis || !CACHE_ACTIVE) return;

  try {
    await redis.del("posts:all");
    const keys = await redis.keys("posts:user:*");
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    logger.info("Posts cache invalidated");
  } catch (error) {
    logger.error(`Cache invalidation error: ${error}`);
  }
};
