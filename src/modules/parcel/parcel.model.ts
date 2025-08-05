import { model, Schema } from "mongoose";
import {
  IParcel,
  ParcelStatus,
  ParcelTypes,
  ParcelStatusLog,
} from "./parcel.interface";

const ParcelStatusLogSchema = new Schema<ParcelStatusLog>(
  {
    status: { type: String, required: true, enum: Object.values(ParcelStatus) },
    notes: { type: String },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now },
  },
  { timestamps: false, _id: false }
);

const ParcelSchema = new Schema<IParcel>(
  {
    trackingId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    weight: { type: Number, required: true },
    deliveryDate: { type: Date, required: true },
    fee: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: Object.values(ParcelStatus),
      default: ParcelStatus.Requested,
    },
    type: { type: String, required: true, enum: Object.values(ParcelTypes) },
    isBlocked: { type: Boolean, default: false },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fromAddress: { type: String, required: true },
    fromPhone: { type: String, required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    toAddress: { type: String, required: true },
    toPhone: { type: String, required: true },
    statusLogs: { type: [ParcelStatusLogSchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ParcelSchema.pre("save", function (next) {
  if (!this.trackingId) {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const randomPart = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    this.trackingId = `TRK-${datePart}-${randomPart}`;
  }
  next();
});

export const Parcel = model<IParcel>("Parcel", ParcelSchema);
