import Redis from "ioredis";
import { REDIS_URL, NODE_ENV } from "./index";
import { logger } from "../logger/logger";

/**
 * Professional Redis Configuration
 * Features:
 * - Silent connection management for development
 * - Graceful fallback to in-memory systems
 * - Serverless-safe: skips connection on Vercel
 */

const isVercel = !!process.env.VERCEL;

const redisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  showFriendlyErrorStack: false,
  lazyConnect: true,
  family: 4,
  retryStrategy: (times: number) => {
    // On Vercel serverless, don't retry at all
    if (isVercel) {
      return null;
    }
    // In development, we retry much less frequently to avoid noise
    if (NODE_ENV === "development" && times > 5) {
      return null; // Give up after 5 attempts to be "professional" and quiet
    }
    return Math.min(times * 2000, 30000);
  },
};

const redis = new Redis(REDIS_URL, redisOptions);

export let isRedisConnected = false;

redis.on("connect", () => {
  isRedisConnected = true;
  logger.info("✅ Connected to Redis");
});

redis.on("ready", () => {
  isRedisConnected = true;
});

redis.on("error", (err: any) => {
  isRedisConnected = false;

  // In professional development environments or serverless, we don't spam connection errors
  if (NODE_ENV === "development" || isVercel) {
    return; // Stay silent
  }

  logger.error(err, "❌ Redis error:");
});

redis.on("end", () => {
  isRedisConnected = false;
});

// Attempt to connect in the background — but NOT on Vercel serverless
if (REDIS_URL && !isVercel) {
  redis.connect().catch(() => {
    if (NODE_ENV === "development") {
      // In development, we don't log this as an error because we have an automatic fallback.
      // This keeps the terminal clean.
    }
  });
}

export default redis;
