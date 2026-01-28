import { Router } from "express";
import passport from "passport";
import {
  changeUserRole,
  getAllUsers,
  login,
  logout,
  me,
  register,
} from "@/controllers/user";
import { authLimit } from "@/utils/limiter";
import { isAdmin, isLoggedIn } from "@/middleware/user";

const router = Router();

router.use(authLimit);

router.post("/register", register);
router.post("/login", passport.authenticate("local"), login);
router.post("/logout", logout);
router.get("/me", me);
router.get("/", isLoggedIn, isAdmin, getAllUsers);
router.put("/:id/:role", isLoggedIn, isAdmin, changeUserRole);

export default router;
