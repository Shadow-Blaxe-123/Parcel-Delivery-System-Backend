import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { ParcelValidation } from "./parcel.validation";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "../user/user.interface";
import { ParcelController } from "./parcel.controller";

const router = Router();

router.post(
  "/create",
  checkAuth(UserRole.SENDER, UserRole.ADMIN),
  validateRequest(ParcelValidation.createParcelSchema),
  ParcelController.createParcel
);
router.delete(
  "/delete/:id",
  checkAuth(UserRole.ADMIN, UserRole.SENDER),
  ParcelController.deleteParcel
);

// ******************************************* The Updates ******************************************* //
router.patch(
  "/update/admin/:trackingId",
  checkAuth(UserRole.ADMIN),
  validateRequest(ParcelValidation.updateAdminParcelSchema),
  ParcelController.updateParcelAdmin
);
router.patch(
  "/update/receiver/:trackingId",
  checkAuth(UserRole.RECEIVER),
  validateRequest(ParcelValidation.updateReceiverParcelSchema),
  ParcelController.updateParcelReceiver
);
router.patch(
  "/update/sender/:trackingId",
  checkAuth(UserRole.SENDER),
  validateRequest(ParcelValidation.updateSenderParcelSchema),
  ParcelController.updateParcelSender
);

router.get(
  "/get/:trackingId",
  checkAuth(...Object.values(UserRole)),
  ParcelController.getSingleParcel
);

router.get(
  "/get-all",
  checkAuth(UserRole.ADMIN),
  ParcelController.getAllParcel
);
router.get(
  "/get-all/me",
  checkAuth(...Object.values(UserRole)),
  ParcelController.getAllMeParcel
);
export const ParcelRoutes = router;
