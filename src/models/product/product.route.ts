import express from "express";
import { auth } from "../../middlewares/auth";
import {
  cacheMiddleware,
  clearCacheMiddleware,
} from "../../middlewares/cacheMiddleware";
import { ProductValidations } from "./product.validation";
import { ProductController } from "./product.controller";
import validateRequest from "../../shared/validateRequest";

const router = express.Router();

router.get(
  "/get-all",
  auth("common"),
  cacheMiddleware("products", 60),
  ProductController.getAll,
);

router.post(
  "/create",
  auth("admin"),
  clearCacheMiddleware("products"),
  multiUploadHandler([{ name: "productImage", maxCount: 1 }]),
  validateRequest(ProductValidations.createProductValidationSchema),
  ProductController.createProduct,
);

export const ProductRoutes = router;
