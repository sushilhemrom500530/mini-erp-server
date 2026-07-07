import app from "../src/app";
import { connectDB } from "../src/config/db";

import mongoose from "mongoose";

let isConnected = false;
let connectionPromise: Promise<void> | null = null;

export default async function handler(req: any, res: any) {
  // Ensure DB is connected before processing the request
  if (!isConnected && mongoose.connection.readyState !== 1) {
    if (!connectionPromise) {
      connectionPromise = connectDB().then(() => {
        isConnected = true;
      });
    }
    await connectionPromise;
  }

  // Delegate to Express app
  return app(req, res);
}
