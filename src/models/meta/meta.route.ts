import express from "express";
import { auth } from "../../middlewares/auth";
import { cacheMiddleware } from "../../middlewares/cacheMiddleware";
import { DashboardController } from "./meta.controller";
const router = express.Router();

router.get(
  "/stats",
  auth("admin", "common"),
  cacheMiddleware("dashboard", 30),
  DashboardController.getDashboardStats,
);

export const DashboardRoutes = router;
