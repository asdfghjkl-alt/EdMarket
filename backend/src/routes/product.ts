import { Router } from "express";
import { isAdmin, isLoggedIn } from "../middleware/user";
import { validateProduct } from "../middleware/product";
import {
  addProduct,
  allProducts,
  deleteProduct,
  findProduct,
  editProduct,
} from "../controllers/product";

const router = Router();

router.post("/", isLoggedIn, isAdmin, validateProduct, addProduct);
router.get("/", allProducts);
router.get("/:id", findProduct);
router.delete("/:id", isLoggedIn, isAdmin, deleteProduct);
router.put("/:id", isLoggedIn, isAdmin, editProduct);

export default router;
