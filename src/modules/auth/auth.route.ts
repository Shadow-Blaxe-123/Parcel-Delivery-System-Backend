import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middleware/validateRequest";
import { authValidation } from "./auth.validation";

const router = Router();

router.post(
  "/login",
  validateRequest(authValidation.loginSchema),
  AuthController.credsentialsLogin
);

export const AuthRoutes = router;
