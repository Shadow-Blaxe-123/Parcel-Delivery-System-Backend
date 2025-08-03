import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middleware/validateRequest";
import { authValidation } from "./auth.validation";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "../user/user.interface";

const router = Router();
// TODO: work on refresh token api
router.post(
  "/login",
  validateRequest(authValidation.loginSchema),
  AuthController.login
);
router.post("/logout", AuthController.logout);
router.post(
  "/reset-password",
  validateRequest(authValidation.resetPasswordSchema),
  checkAuth(...Object.values(UserRole)),
  AuthController.resetPassword
);

export const AuthRoutes = router;
