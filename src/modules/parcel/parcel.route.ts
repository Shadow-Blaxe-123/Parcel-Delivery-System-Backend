import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { ParcelValidation } from "./parcel.validation";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "../user/user.interface";
import { ParcelController } from "./parcel.controller";

const router = Router();

router.post(
  "/create",
  validateRequest(ParcelValidation.createParcelSchema),
  checkAuth(UserRole.SENDER, UserRole.ADMIN),
  ParcelController.createParcel
);

export const ParcelRoutes = router;
