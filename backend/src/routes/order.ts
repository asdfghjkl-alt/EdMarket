import { Router } from "express";
import { isLoggedIn } from "@/middleware/user";
import { addOrder, viewUserOrders } from "@/controllers/order";
import { filterInvalidItems } from "@/middleware/order";
import { orderLimit } from "@/utils/limiter";

const router = Router();

router.use(orderLimit);

router.post("/", isLoggedIn, filterInvalidItems, addOrder);
router.get("/", isLoggedIn, viewUserOrders);

export default router;
