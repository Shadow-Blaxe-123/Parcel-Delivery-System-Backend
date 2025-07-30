import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { Routes } from "./routes.interface";

const moduleRoutes: Routes[] = [
  {
    path: "/user",
    router: UserRoutes,
  },
];

const router = Router();

moduleRoutes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
