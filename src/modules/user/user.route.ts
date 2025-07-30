import { Request, Response, Router } from "express";
import { UserController } from "./user.controller";

const router = Router();
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello User" });
});
router.post("/create", UserController.userCreate);
export const UserRoutes = router;
