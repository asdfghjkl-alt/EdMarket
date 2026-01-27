import { Request, Response, NextFunction } from "express";
import ShopError from "@/utils/ShopError";

/**
 * Middleware to check that user is logged in
 */
const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  // Uses passport js integrated function
  if (!req.isAuthenticated()) {
    return next(
      new ShopError("You need to be logged in to make this request", 400),
    );
  }
  next();
};

/**
 * Middleware to check that user is admin
 */
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Uses passport js integrated user object
  if (!req.user?.isAdmin) {
    return next(new ShopError("Page does not exist", 404));
  }

  next();
};

export { isLoggedIn, isAdmin };
