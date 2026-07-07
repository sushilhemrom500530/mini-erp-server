import http from "http";
import cluster from "node:cluster";
import os from "node:os";
import app from "./app";
import { connectDB } from "./config/db";
import { PORT, NODE_ENV } from "./config";
import { logger } from "./logger/logger";
import { initIO } from "./utils/io";
import "dotenv/config";

const isVercel = !!process.env.VERCEL;

// ─── Serverless Mode (Vercel) ───────────────────────────────────
// On Vercel, we don't call server.listen(), use cluster, or init Socket.io.
// We just need to connect to MongoDB and export the Express app.
// Redis is handled lazily in config/redis.ts.

if (isVercel) {
  // Import redis config (it will skip connection on Vercel)
  import("./config/redis").catch(() => {});

  // Ensure MongoDB is connected before handling requests
  let dbConnected = false;
  let dbConnecting: Promise<void> | null = null;

  app.use(async (_req, _res, next) => {
    if (!dbConnected) {
      if (!dbConnecting) {
        dbConnecting = connectDB()
          .then(() => {
            dbConnected = true;
          })
          .catch((err) => {
            dbConnecting = null;
            throw err;
          });
      }
      await dbConnecting;
    }
    next();
  });
}

// ─── Traditional Server Mode (Local Dev / VPS) ──────────────────
// import redis from "./config/redis";
const numCPUs = os.cpus().length;

async function main() {
  // Eagerly import Redis in non-serverless mode
  await import("./config/redis");

  const server = http.createServer(app);
  try {
    // Parallelize service initializations for fast startup
    logger.info("Starting services...");
    await Promise.all([connectDB()]);
    logger.info("Services started.");

    // Initialize Socket.io
    logger.info("Initializing Socket.io...");
    initIO(server);
    logger.info("Socket.io initialized.");

    server.listen(Number(PORT), () => {
      logger.info(`🚀 Server is running on Port : ${PORT} [${NODE_ENV}]`);
    });

    // Handle exceptions per worker
    process.on("unhandledRejection", (err: any) => {
      if (
        err?.code === "ECONNREFUSED" &&
        err?.port === 6379 &&
        NODE_ENV === "development"
      ) {
        return; // Ignore redis connection issues in dev
      }
      logger.error(`Server Unhandled rejection: ${err}`);
    });

    process.on("uncaughtException", (error: any) => {
      if (
        error?.code === "ECONNREFUSED" &&
        error?.port === 6379 &&
        NODE_ENV === "development"
      ) {
        return; // Ignore redis connection issues in dev
      }
      logger.error(`Server Uncaught exception: ${error}`);
    });

    process.on("SIGINT", () => {
      logger.info("SIGINT signal received, shutting down...");
      server.close(() => {
        logger.info("HTTP server closed.");
        process.exit(0);
      });
    });

    process.on("SIGTERM", () => {
      logger.info("SIGTERM signal received, shutting down...");
      server.close(() => {
        logger.info("HTTP server closed.");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error(`❌ Server failed to start: ${error}`);
    process.exit(1);
  }
}

if (!isVercel) {
  if (cluster.isPrimary && NODE_ENV === "production") {
    logger.info(
      `Primary ${process.pid} is running. Forking ${numCPUs} workers...`,
    );
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker) => {
      logger.warn(`Worker ${worker.process.pid} died. Forking a new one...`);
      cluster.fork();
    });
  } else {
    main().catch((err) => {
      logger.error(`Server startup error: ${err}`);
    });
  }
}

// Export the Express app for Vercel serverless functions
export default app;
