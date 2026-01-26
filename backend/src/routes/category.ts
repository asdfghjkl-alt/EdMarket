import { Router } from "express";
import { isAdmin, isLoggedIn } from "@/middleware/user";
import { categoryLimit } from "@/utils/limiter";
import { checkNoProductsInCat } from "@/middleware/category";
import {
  addCategory,
  deleteCategory,
  editCategory,
  findAllCategories,
} from "@/controllers/category";

const router = Router();

router.use(categoryLimit);

router
  .route("/")
  .get(isLoggedIn, isAdmin, findAllCategories)
  .post(isLoggedIn, isAdmin, addCategory);

router
  .route("/:id")
  .delete(isLoggedIn, isAdmin, checkNoProductsInCat, deleteCategory)
  .put(isLoggedIn, isAdmin, editCategory);

export default router;
