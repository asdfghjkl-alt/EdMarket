import express, { NextFunction, Response, Request } from "express";
import passport from "passport";
import { login, logout, me, register } from "../controllers/user";

const router = express.Router();

router.post("/register", register);
router.post("/login", passport.authenticate("local"), login);
router.post("/logout", logout);
router.get("/me", me);

export default router;
