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
  const finalPayload: IParcel = {
    ...payload,
    senderId: sender!._id,
    fromAddress: sender!.address,
    fromPhone: sender!.phone,
    receiverId: receiver._id,
    toAddress: receiver.address,
    toPhone: receiver.phone,
    fee: payload.fee + payload.weight * 200,
    isBlocked: false,
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
export const ParcelServices = { createParcel };
