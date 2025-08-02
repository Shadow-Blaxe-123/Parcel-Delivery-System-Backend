import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { Routes } from "./routes.interface";
import { AuthRoutes } from "../modules/auth/auth.route";

const moduleRoutes: Routes[] = [
  {
    path: "/user",
    router: UserRoutes,
  },
  {
    path: "/auth",
    router: AuthRoutes,
  },
];

const router = Router();

moduleRoutes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
