import { type NextFunction, type Request, type Response } from "express";
import { generateCsrfToken } from "@/utils/csrf";
import ShopError from "@/utils/ShopError";

declare module "express-session" {
  interface SessionData {
    csrfToken: string;
  }
}

/**
 * Middleware to validate CSRF token to prevent csrf attacks
 */
export const csrfMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Checks CSRF token exists on the session
  if (!req.session.csrfToken) {
    // If not, generate one and store it in session
    req.session.csrfToken = generateCsrfToken();
  }

  // Safe methods against csrf attacks are the following
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // For unsafe requests, token is needed to be validated
  const requestToken = req.headers["x-csrf-token"];

  if (!requestToken || requestToken !== req.session.csrfToken) {
    return next(new ShopError("Invalid CSRF Token", 403));
  }

  next();
};
