import { type NextFunction, type Request, type Response } from "express";
import { generateCsrfToken } from "@/utils/csrf";
import ShopError from "@/utils/ShopError";

declare module "express-session" {
  interface SessionData {
    csrfToken: string;
  }
}

export const csrfMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // 1. Ensure a CSRF token exists in the session
  if (!req.session.csrfToken) {
    req.session.csrfToken = generateCsrfToken();
  }

  // 2. Check if the method is safe
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // 3. For unsafe methods, validate the token
  const requestToken =
    req.body?._csrf ||
    req.query?._csrf ||
    req.headers["csrf-token"] ||
    req.headers["xsrf-token"] ||
    req.headers["x-csrf-token"] ||
    req.headers["x-xsrf-token"];

  if (!requestToken || requestToken !== req.session.csrfToken) {
    return next(new ShopError("Invalid CSRF Token", 403));
  }

  next();
};
