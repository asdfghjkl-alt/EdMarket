import express from "express";
import passport from "passport";
import { login, logout, register } from "../controllers/user";

const router = express.Router();

router.post("/register", register);
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/auth/login",
  }),
  login
);
router.post("/logout", logout);

export default router;
