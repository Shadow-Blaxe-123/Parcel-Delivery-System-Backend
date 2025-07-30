import AppError from "../../utils/AppError";
import { IUser } from "./user.interface";
import User from "./user.model";
import httpStatus from "http-status-codes";

const userCreate = async (payload: IUser) => {
  const isExists = await User.findOne({ email: payload.email });
  if (isExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  const user = await User.create(payload);
  return user;
};

export const UserServices = {
  userCreate,
};
