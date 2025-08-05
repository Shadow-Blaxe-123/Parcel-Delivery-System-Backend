import { Request, Response } from "express";
import catchPromise from "../../utils/Controller.Layer.Helper";
import { ParcelServices } from "./parcel.service";
import AppError from "../../error/AppError";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";

const createParcel = catchPromise(async (req: Request, res: Response) => {
  const payload = req.body;
  const sender = req.user;
  if (!sender) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Unauthorized access. Please login again."
    );
  }
  const parcel = await ParcelServices.createParcel(payload, sender.userId);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Parcel created successfully",
    data: parcel,
  });
});
const deleteParcel = catchPromise(async (req: Request, res: Response) => {
  const id = req.params.id;
  const parcel = await ParcelServices.deleteParcel(id);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Parcel deleted successfully",
    data: parcel,
  });
});

export const ParcelController = { createParcel, deleteParcel };
