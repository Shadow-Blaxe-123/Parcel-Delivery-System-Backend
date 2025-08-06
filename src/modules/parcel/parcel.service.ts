import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import {
  ICreateParcel,
  IParcel,
  ParcelStatus,
  ParcelStatusLog,
} from "./parcel.interface";
import User from "../user/user.model";
import { Parcel } from "./parcel.model";
import { JwtPayload } from "jsonwebtoken";
import { generateTrackingId } from "../../utils/parcelTrackingId";

const createParcel = async (payload: ICreateParcel, sender: JwtPayload) => {
  const receiver = await User.findOne({ email: payload.receiverEmail });
  if (!receiver) {
    throw new AppError(StatusCodes.NOT_FOUND, "Receiver not found");
  }
  const trackingId = generateTrackingId(receiver.email);

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

  const { status, statusLog, isBlocked, isDeleted, fee, deliveryDate } =
    payload;

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
  if (deliveryDate !== undefined) result.deliveryDate = deliveryDate;

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

const receiver = async (
  trackingId: string,
  status: ParcelStatus.Cancelled | ParcelStatus.Delivered,
  receiver: JwtPayload
) => {
  const result = await Parcel.findOne({ trackingId });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");
  }
  if (result.receiver.toString() !== receiver.userId) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "You are not authorized to access this parcel!"
    );
  }
  const wasDispatched = result.statusLogs.some(
    (log) => log.status === ParcelStatus.Dispatched
  );
  if (status === ParcelStatus.Cancelled && wasDispatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Parcel already dispatched!");
  }
  if (status === ParcelStatus.Delivered && !wasDispatched) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Parcel has not been dispatched yet!"
    );
  }

  result.status = status;

  const logEntry: ParcelStatusLog = {
    status: status,
    updatedBy: receiver.userId,
    location: receiver.address,
    timestamp: new Date(),
    notes:
      status === ParcelStatus.Delivered
        ? "Parcel delivered to receiver"
        : "Parcel cancelled by receiver",
  };

  result.statusLogs.push(logEntry);

  await result.save({ validateBeforeSave: true });

  // ✅ Populate and remove sensitive data
  const populated = await result.populate(
    "sender receiver statusLogs.updatedBy",
    "-__v -password -email -isDeleted -isBlocked -createdAt -updatedAt"
  );

  return populated.toObject();
};
const sender = async (
  trackingId: string,
  payload: JwtPayload,
  sender: JwtPayload
) => {
  const result = await Parcel.findOne({ trackingId });

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");
  }

  if (result.sender.toString() !== sender.userId) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "You are not authorized to access this parcel!"
    );
  }

  const wasDispatched = result.statusLogs.some(
    (log) => log.status === ParcelStatus.Dispatched
  );

  if (wasDispatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Parcel already dispatched!");
  }

  // Disallowed fields for sender
  const blacklistedFields = ["status", "isBlocked", "isDeleted", "statusLogs"];
  const invalidFields = Object.keys(payload).filter((key) =>
    blacklistedFields.includes(key)
  );

  if (invalidFields.length > 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `You cannot update these fields: ${invalidFields.join(", ")}`
    );
  }

  // Add update log entry
  const logEntry: ParcelStatusLog = {
    status: result.status,
    location: sender.address,
    timestamp: new Date(),
    updatedBy: sender.userId,
    notes: `Sender updated: ${Object.keys(payload).join(", ")}`,
  };

  result.statusLogs.push(logEntry);
  await result.save({ validateBeforeSave: true });

  // Apply the updates
  const updatedParcel = await Parcel.findOneAndUpdate({ trackingId }, payload, {
    runValidators: true,
    new: true,
  });

  if (!updatedParcel) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Update failed");
  }

  const populated = await updatedParcel.populate(
    "sender receiver statusLogs.updatedBy",
    "-__v -password -email -isDeleted -isBlocked -createdAt -updatedAt"
  );

  return populated.toObject();
};

const UpdateParcel = { admin, receiver, sender };
export const ParcelServices = { createParcel, deleteParcel, UpdateParcel };
