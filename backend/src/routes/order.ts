import { Router } from "express";
import { isAdmin, isLoggedIn } from "@/middleware/user";
import {
  addOrder,
  viewUserOrders,
  viewAllOrders,
  markAsDelivered,
  markAsUndelivered,
} from "@/controllers/order";
import { filterInvalidItems } from "@/middleware/order";
import { orderLimit } from "@/utils/limiter";

const router = Router();

router.use(orderLimit);

router.post("/", isLoggedIn, filterInvalidItems, addOrder);
router.get("/", isLoggedIn, viewUserOrders);
router.get("/all", isLoggedIn, isAdmin, viewAllOrders);
router.put("/:id/delivered", isLoggedIn, isAdmin, markAsDelivered);
router.put("/:id/undelivered", isLoggedIn, isAdmin, markAsUndelivered);

export default router;
