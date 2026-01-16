import { Request, Response, NextFunction } from "express";
import ShopError from "../utils/ShopError";

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return next(new ShopError("Page requires you to be logged in", 400));
  }
  next();
};

export { isLoggedIn };
