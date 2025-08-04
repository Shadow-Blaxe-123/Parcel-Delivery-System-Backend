import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error/AppError";
import { IUser, UserRole } from "./user.interface";
import User from "./user.model";
import httpStatus from "http-status-codes";

const userCreate = async (payload: IUser) => {
  const isExists = await User.findOne({ email: payload.email });
  if (isExists) {
    throw new AppError(httpStatus.CONFLICT, "User already exists");
  }
  if (payload.role === UserRole.ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "You cannot register as Admin");
  }

  const user = await User.create(payload);
  return user.toObject();
};

const userUpdate = async (
  id: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (payload.role) {
    if (decodedToken.role !== UserRole.ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to change roles"
      );
    }
  }
  if (payload.isBlocked || payload.isDeleted) {
    if (decodedToken.role !== UserRole.ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to change status"
      );
    }
  }
  if (payload.password) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You cannot update password. Use the reset password API."
    );
  }
  const updatedUser = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Upadte failed");
  }
  return updatedUser.toObject();
};

export const UserServices = {
  userCreate,
  userUpdate,
};
