import { Router } from "express";
import { isLoggedIn } from "../middleware/user";
import { addOrder, viewUserOrders } from "../controllers/order";
import { filterInvalidItems } from "../middleware/order";

const router = Router();

router.post("/", isLoggedIn, filterInvalidItems, addOrder);
router.get("/", isLoggedIn, viewUserOrders);

export default router;
