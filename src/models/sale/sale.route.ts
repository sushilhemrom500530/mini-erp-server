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
  auth("common"),
  cacheMiddleware("products", 60),
  SaleController.getAll,
);

router.post(
  "/create",
  auth("common"),
  clearCacheMiddleware("products"),
  validateRequest(SaleValidations.createSaleValidationSchema),
  SaleController.createSale,
);

export const SaleRoutes = router;
