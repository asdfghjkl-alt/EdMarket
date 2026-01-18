import { Router } from "express";
import { isAdmin, isLoggedIn } from "../middleware/user";
import { validateProduct } from "../middleware/product";
import { addProduct, allProducts, findProduct } from "../controllers/product";

const router = Router();

router.post("/", isLoggedIn, isAdmin, validateProduct, addProduct);
router.get("/", allProducts);
router.get("/:id", findProduct);

export default router;
