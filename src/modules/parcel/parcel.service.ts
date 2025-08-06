import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import { ICreateParcel, IParcel, ParcelStatus } from "./parcel.interface";
import User from "../user/user.model";
import { Parcel } from "./parcel.model";
import { JwtPayload } from "jsonwebtoken";

const createParcel = async (payload: ICreateParcel, sender: JwtPayload) => {
  const receiver = await User.findOne({ email: payload.receiverEmail });
  if (!receiver) {
    throw new AppError(StatusCodes.NOT_FOUND, "Receiver not found");
  }
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const trackingId = `TRK-${datePart}-${sender.userId}`;

  if (payload.deliveryDate < new Date()) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Delivery date cannot be in the past"
    );
  }
  const finalPayload: IParcel = {
    ...payload,
    trackingId: trackingId,
    sender: sender!.userId,
    fromAddress: sender!.address,
    fromPhone: sender!.phone,
    receiver: receiver._id,
    toAddress: receiver.address,
    toPhone: receiver.phone,
    fee: payload.fee + payload.weight * 200,
    isBlocked: false,
    isDeleted: false,
    status: ParcelStatus.Requested,
    statusLogs: [
      {
        location: sender!.address,
        timestamp: new Date(),
        status: ParcelStatus.Requested,
        updatedBy: sender!.userId,
        notes: "Parcel requested by sender",
      },
    ],
  };
  console.log(finalPayload);
  const parcel = await Parcel.create(finalPayload);
  const populatedParcel = await parcel.populate(
    "sender receiver",
    "-password -__v -_id"
  );

  return populatedParcel.toObject();
};

const deleteParcel = async (id: string) => {
  const result = await Parcel.findByIdAndUpdate(id, { isDeleted: true });
  if (!result) {
    throw new AppError(404, "Parcel not found");
  }

  return null; // or return result if you want to confirm deletion
};

const admin = async (
  trackingId: string,
  payload: JwtPayload,
  admin: JwtPayload
) => {
  const result = await Parcel.findOne({ trackingId });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");
  }

  const { status, statusLog, isBlocked, isDeleted, fee } = payload;

  if (!status) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Status is required");
  }

  if (!statusLog) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Status log is required");
  }

  // ✅ Update optional fields if present
  if (isBlocked !== undefined) result.isBlocked = isBlocked;
  if (isDeleted !== undefined) result.isDeleted = isDeleted;
  if (fee !== undefined) result.fee = fee;

  // ✅ Check if already dispatched
  const wasDispatched = result.statusLogs.some(
    (log) => log.status === ParcelStatus.Dispatched
  );

  if (wasDispatched) {
    if (status === ParcelStatus.Cancelled) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Parcel already dispatched, cannot be cancelled"
      );
    }

    if (
      status !== ParcelStatus.InTransit &&
      status !== ParcelStatus.Delivered
    ) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `Parcel already dispatched, status cannot be changed to ${status}`
      );
    }
  }

  // ✅ Create new status log entry
  const logEntry = {
    ...statusLog,
    updatedBy: admin.userId,
    timestamp: new Date(),
    status,
  };
  result.statusLogs.push(logEntry);

  result.status = status;

  await result.save();

  // ✅ Populate and remove sensitive data
  const populated = await result.populate(
    "sender receiver statusLogs.updatedBy",
    "-__v -password -email -isDeleted -isBlocked -createdAt -updatedAt"
  );

  return populated.toObject();
};

const UpdateParcel = { admin };
export const ParcelServices = { createParcel, deleteParcel, UpdateParcel };
