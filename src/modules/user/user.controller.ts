import { Request, Response } from "express";
import catchPromise from "../../utils/Controller.Layer.Helper";
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

const userCreate = catchPromise(async (req: Request, res: Response) => {
  const user = await UserServices.userCreate(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "User created successfully",
    data: user,
  });
});
const userUpdate = catchPromise(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const decodedToken = req.user as JwtPayload;
  const newUser = await UserServices.userUpdate(id, payload, decodedToken);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "User updated successfully",
    data: newUser,
  });
});
const userDelete = catchPromise(async (req: Request, res: Response) => {
  const id = req.params.id;
  const decodedToken = req.user as JwtPayload;
  const newUser = await UserServices.deleteUser(id, decodedToken);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "User deleted successfully",
    data: newUser,
  });
});
const getSingleUser = catchPromise(async (req: Request, res: Response) => {
  const id = req.params.id;
  const decodedToken = req.user as JwtPayload;
  const user = await UserServices.getSingleUser(id, decodedToken);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User retrieved successfully",
    data: user,
  });
});
const getAllUser = catchPromise(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const decodedToken = req.user as JwtPayload;
  const users = await UserServices.getAllUsers(query, decodedToken);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Users retrieved successfully",
    data: users,
  });
});

export const UserController = {
  userCreate,
  userUpdate,
  userDelete,
  getSingleUser,
  getAllUser,
};
