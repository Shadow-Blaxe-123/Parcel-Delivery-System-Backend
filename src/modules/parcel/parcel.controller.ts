import { Request, Response } from "express";
import catchPromise from "../../utils/Controller.Layer.Helper";
import { ParcelServices } from "./parcel.service";
import AppError from "../../error/AppError";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createParcel = catchPromise(async (req: Request, res: Response) => {
  const payload = req.body;
  const sender = req.user;
  if (!sender) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Unauthorized access. Please login again."
    );
  }
  const parcel = await ParcelServices.createParcel(payload, sender);
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
const updateParcelAdmin = catchPromise(async (req: Request, res: Response) => {
  const trackingId = req.params.trackingId;
  const payload = req.body;
  const decodedToken = req.user as JwtPayload;
  const result = await ParcelServices.UpdateParcel.admin(
    trackingId,
    payload,
    decodedToken
  );
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Parcel updated successfully",
    data: result,
  });
});
const updateParcelReceiver = catchPromise(
  async (req: Request, res: Response) => {
    const trackingId = req.params.trackingId;
    const status = req.body.status;
    const decodedToken = req.user as JwtPayload;
    if (!decodedToken) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        "Unauthorized access. Please login again."
      );
    }
    const result = await ParcelServices.UpdateParcel.receiver(
      trackingId,
      status,
      decodedToken
    );
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Parcel updated successfully",
      data: result,
    });
  }
);

export const ParcelController = {
  createParcel,
  deleteParcel,
  updateParcelAdmin,
  updateParcelReceiver,
};
