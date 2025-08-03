import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middleware/validateRequest";
import { authValidation } from "./auth.validation";

const router = Router();

router.post(
  "/login",
  validateRequest(authValidation.loginSchema),
  AuthController.login
);
router.post("/logout", AuthController.logout);

export const AuthRoutes = router;
