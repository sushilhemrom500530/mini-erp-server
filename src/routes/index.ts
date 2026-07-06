import express from "express";
import { UserRoutes } from "../models/user/user.route";
import { AuthRoutes } from "../models/auth/auth.route";
import { NotificationRoutes } from "../models/notification/notification.route";
import { ProductRoutes } from "../models/product/product.route";
import { SaleRoutes } from "../models/sale/sale.route";
const router = express.Router();

const apiRoutes: any[] = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/product",
    route: ProductRoutes,
  },
  {
    path: "/sale",
    route: SaleRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/notification",
    route: NotificationRoutes,
  },
];

apiRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
