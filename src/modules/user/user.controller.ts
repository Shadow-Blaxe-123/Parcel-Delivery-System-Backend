import { Request, Response } from "express";
import catchPromise from "../../utils/Controller.Layer.Helper";
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const userCreate = catchPromise(async (req: Request, res: Response) => {
  const user = await UserServices.userCreate(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
    data: user,
  });
});

export const UserController = { userCreate };
