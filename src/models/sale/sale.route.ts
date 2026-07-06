import express from "express";
import { SaleController } from "./sale.controller";
import { SaleValidations } from "./sale.validation";
import { auth } from "../../middlewares/auth";
import {
  cacheMiddleware,
  clearCacheMiddleware,
} from "../../middlewares/cacheMiddleware";
import validateRequest from "../../shared/validateRequest";

const router = express.Router();

router.get(
  "/get-all",
  auth("admin"),
  cacheMiddleware("products", 60),
  SaleController.getAll,
);

router.get(
  "/get-my",
  auth("common"),
  cacheMiddleware("products", 60),
  SaleController.getMy,
);

router.post(
  "/create",
  auth("common"),
  clearCacheMiddleware("products"),
  validateRequest(SaleValidations.createSaleValidationSchema),
  SaleController.createSale,
);

router.get(
  "/find/:id",
  auth("common"),
  cacheMiddleware("products", 60),
  SaleController.getSingleSale,
);

export const SaleRoutes = router;
