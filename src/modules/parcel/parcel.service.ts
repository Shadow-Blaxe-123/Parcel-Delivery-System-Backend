import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import { ICreateParcel, IParcel, ParcelStatus } from "./parcel.interface";
import User from "../user/user.model";
import { Parcel } from "./parcel.model";

const createParcel = async (payload: ICreateParcel, senderId: string) => {
  const sender = await User.findById(senderId);
  const receiver = await User.findOne({ email: payload.receiverEmail });
  if (!receiver) {
    throw new AppError(StatusCodes.NOT_FOUND, "Receiver not found");
  }
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const count = await Parcel.find({ senderId: senderId }).countDocuments();
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
export const ParcelServices = { createParcel, deleteParcel };
