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
  const count = await Parcel.find({ senderId: sender.userId }).countDocuments();
  const trackingId = `TRK-${datePart}-${count}`;

  if (payload.deliveryDate < new Date()) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Delivery date cannot be in the past"
    );
  }
  const finalPayload: IParcel = {
    ...payload,
    trackingId: trackingId,
    senderId: sender!._id,
    fromAddress: sender!.address,
    fromPhone: sender!.phone,
    receiverId: receiver._id,
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
        updatedBy: sender!._id,
        notes: "Parcel requested by sender",
      },
    ],
  };
  const parcel = await Parcel.create(finalPayload);
  return parcel.toObject();
};

const deleteParcel = async (id: string) => {
  const result = await Parcel.findByIdAndUpdate(id, { isDeleted: true });
  if (!result) {
    throw new AppError(404, "Parcel not found");
  }

  return null; // or return result if you want to confirm deletion
};

const admin = async (id: string, payload: JwtPayload, admin: JwtPayload) => {
  const result = await Parcel.findById(id);
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

  if (isBlocked !== undefined) {
    result.isBlocked = isBlocked;
  }
  if (isDeleted !== undefined) {
    result.isDeleted = isDeleted;
  }
  if (fee !== undefined) {
    result.fee = fee;
  }

  // const logsArray = Array.isArray(statusLogs) ? statusLogs : [statusLogs];
  // logsArray.forEach((log) => {
  //   const logEntry = {
  //     ...log,
  //     updatedBy: admin._id,
  //     timestamp: new Date(),
  //     status: status || log.status,
  //   };
  //   result.statusLogs.push(logEntry);
  // });

  const logEntry = {
    ...statusLog,
    updatedBy: admin.userId,
    timestamp: new Date(),
    status: status,
  };
  result.statusLogs.push(logEntry);

  // ✅ Set new status
  result.status = status;

  await result.save();
  return result.populate(
    "senderId receiverId statusLogs.updatedBy",
    "-__v -password -_id -email -createdAt -updatedAt -isDeleted -isBlocked"
  );
};

const UpdateParcel = { admin };
export const ParcelServices = { createParcel, deleteParcel, UpdateParcel };
