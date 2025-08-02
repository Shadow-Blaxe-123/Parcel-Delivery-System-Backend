import { Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { userValidation } from "./user.validation";

const router = Router();
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello User" });
});
router.post(
  "/create",
  validateRequest(userValidation.userCreateSchema),
  UserController.userCreate
);
export const UserRoutes = router;
