import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { ProductService } from "./product.service";
import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";

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
  const files = req.body.files as {
    productImage?: string;
  };
  const productData = {
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

export const ProductController = {
  createProduct,
  getAll,
};
