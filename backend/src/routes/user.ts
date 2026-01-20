import { Router } from "express";
import passport from "passport";
import { login, logout, me, register } from "@/controllers/user";
import { authLimit } from "@/utils/limiter";

const router = Router();

router.use(authLimit);

router.post("/register", register);
router.post("/login", passport.authenticate("local"), login);
router.post("/logout", logout);
router.get("/me", me);

export default router;
