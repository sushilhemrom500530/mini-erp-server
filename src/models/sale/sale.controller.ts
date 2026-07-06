import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { SaleService } from "./sale.service";
import { JwtUserPayload } from "../../middlewares/auth";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await SaleService.getAll(req.query as any);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Sales retrieved successfully.",
    data: result,
  });
});

const createSale = catchAsync(async (req: Request, res: Response) => {
  const { id: soldBy } = req.user as JwtUserPayload;

  const result = await SaleService.createSale(soldBy, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Sale processed successfully and stock levels updated.",
    data: result,
  });
});

export const SaleController = {
  getAll,
  createSale,
};
