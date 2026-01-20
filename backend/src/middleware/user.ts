import { Request, Response, NextFunction } from "express";
import ShopError from "../utils/ShopError";

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return next(
      new ShopError("You need to be logged in to make this request", 400),
    );
  }
  next();
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return next(new ShopError("Page does not exist", 404));
  }

  next();
};

export { isLoggedIn, isAdmin };
