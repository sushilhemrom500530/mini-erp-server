import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { ProductService } from "./product.service";
import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { JwtUserPayload } from "../../middlewares/auth";

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getAll(req.query as any);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Products retrieved successfully.",
    data: result,
  });
});

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const { id: owner } = req.user as JwtUserPayload;
  const files = req.body.files as {
    productImage?: string;
  };
  const productData = {
    owner,
    ...req.body,
    ...(files.productImage && { productImage: files.productImage }),
  };

  const result = await ProductService.createProduct(productData);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Product created successfully.",
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  const result = await ProductService.getSingleProduct(productId as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product fetched successfully.",
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id: productId } = req.params;

  // Safely extract optional file layout from body
  const files = (req.body.files || {}) as { productImage?: string };

  const updatedData = {
    ...req.body,
    ...(files.productImage && { productImage: files.productImage }),
  };

  delete updatedData.files;

  const result = await ProductService.updateProduct(
    productId as string,
    updatedData,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product updated successfully.",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  await ProductService.deleteProduct(productId as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product deleted successfully.",
    data: null,
  });
});

export const ProductController = {
  getAll,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
