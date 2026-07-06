import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DashboardService } from "./meta.service";
import { JwtUserPayload } from "../../middlewares/auth";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtUserPayload;
  const result = await DashboardService.getDashboardStats(user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Dashboard data retrieved successfully.",
    data: result,
  });
});

export const DashboardController = {
  getDashboardStats,
};
