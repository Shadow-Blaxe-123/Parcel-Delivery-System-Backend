import { Types } from "mongoose";

export enum UserRole {
  ADMIN = "ADMIN",
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  address: string;
  role: UserRole;
  isBlocked?: boolean;
  isDeleted?: boolean;
}
