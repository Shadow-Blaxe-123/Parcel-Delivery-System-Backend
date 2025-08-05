import { Types } from "mongoose";

export enum ParcelTypes {
  Document = "Document",
  Box = "Box",
  Fragile = "Fragile",
  Electronics = "Electronics",
  Clothing = "Clothing",
  Perishable = "Perishable",
  Other = "Other",
}

export enum ParcelStatus {
  Requested = "Requested",
  Approved = "Approved",
  Dispatched = "Dispatched",
  InTransit = "In Transit",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}
export interface ParcelStatusLog {
  location: string;
  timestamp: Date;
  status: ParcelStatus;
  notes?: string;
  updatedBy: Types.ObjectId;
}

export interface IParcel {
  _id?: string;
  title: string;
  weight: number;
  deliveryDate: Date;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  // Need extra logic
  trackingId?: string; // from pre save hook
  senderId: Types.ObjectId; // Req.Sender -> Service Layer -> Get Id from req.user -> Save
  receiverId: Types.ObjectId; // Req.ReceiverEmail -> Service Layer -> Fetch Id from DB -> Save
  toAddress: string; // Fetch from DB in service
  toPhone: string; // Fetch from DB in service
  fromAddress: string; // Fetch from DB in service
  fromPhone: string; // Fetch from DB in service
  fee: number; // Calculated sendercut + (sendercut * 20%) + (weight * distance * 20tk)
  // Enums
  type: ParcelTypes;
  status: ParcelStatus;
  statusLogs: ParcelStatusLog[];
}
export interface ICreateParcel {
  title: string;
  weight: number;
  deliveryDate: Date;
  // Need extra logic
  receiverEmail: string;
  fee: number;
  type: ParcelTypes;
}
