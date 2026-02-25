import { eq } from "drizzle-orm";
import { db } from "../db/database";
import { twitterTable } from "../db/schema";
import IORedis from "ioredis";

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
  console.log("Redis Cache initialized");
};

type Posts = Awaited<ReturnType<typeof getPostsFromDB>>;

export const getPosts = async (userId?: number) => {
  if (!CACHE_ACTIVE) return getPostsFromDB(userId);

  const cacheKey = userId ? `posts:user:${userId}` : "posts:all";

  try {
    const cachedPosts = await getPostsFromCache(cacheKey);
    if (cachedPosts) {
      console.log(`Cache hit for ${cacheKey}`);
      return cachedPosts;
    }
  } catch (error) {
    console.log("Cache retrieval error:", error);
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
  let query = await db.select().from(twitterTable);
  if (userId) {
    query = await db
      .select()
      .from(twitterTable)
      .where(eq(twitterTable.userId, userId));
  }
  console.log("Get post from DB");
  return query;
};

const setPostsInCache = async (posts: Posts, cacheKey: string) => {
  if (!redis || !CACHE_ACTIVE) return;

  try {
    await redis.set(cacheKey, JSON.stringify(posts));
    console.log(`Cache set for ${cacheKey}`);
  } catch (error) {
    console.log("Cache set error", error);
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
    console.log("Posts cache invalidated");
  } catch (error) {
    console.error("Cache invalidation error:", error);
  }
};
