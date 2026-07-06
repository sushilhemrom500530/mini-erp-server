import express from "express";
import { auth } from "../../middlewares/auth";
import {
  cacheMiddleware,
  clearCacheMiddleware,
} from "../../middlewares/cacheMiddleware";
import { ProductValidations } from "./product.validation";
import { ProductController } from "./product.controller";
import validateRequest from "../../shared/validateRequest";
import {
  multiUploadHandler,
  singleUploadHandler,
} from "../../handler/cloudinary/fileUploadHandler";

const router = express.Router();

router.get(
  "/get-all",
  auth("common"),
  cacheMiddleware("products", 60),
  ProductController.getAll,
);

router.get(
  "/find/:id",
  auth("common"),
  cacheMiddleware("products", 60),
  ProductController.getSingleProduct,
);

router.post(
  "/create",
  auth("admin"),
  clearCacheMiddleware("products"),
  singleUploadHandler("productImage"),
  // multiUploadHandler([{ name: "productImage", maxCount: 1 }]),
  validateRequest(ProductValidations.createProductValidationSchema),
  ProductController.createProduct,
);

router.patch(
  "/update/:id",
  auth("admin"),
  clearCacheMiddleware("products"),
  multiUploadHandler([{ name: "productImage", maxCount: 1 }]),
  validateRequest(ProductValidations.updateProductValidationSchema),
  ProductController.updateProduct,
);

router.delete(
  "/delete/:id",
  auth("admin"),
  clearCacheMiddleware("products"),
  ProductController.deleteProduct,
);

export const ProductRoutes = router;
