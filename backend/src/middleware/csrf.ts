import { type Request, type Response, type NextFunction } from "express";
import crypto from "crypto";
import ShopError from "@/utils/ShopError";

/**
 * Helper to manually refresh the CSRF token.
 * Useful after session regeneration or logout.
 */
export const refreshCsrfToken = (req: Request, res: Response) => {
  req.session.csrfToken = crypto.randomBytes(32).toString("hex");
  res.cookie("XSRF-TOKEN", req.session.csrfToken, {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    httpOnly: false,
    path: "/",
  });
};

/**
 * Middleware to sync CSRF token from session to a non-HttpOnly cookie.
 * This allows the frontend to read the token and send it back in a header.
 */
export const syncCsrfToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Ensure session has a CSRF token
  if (!req.session.csrfToken) {
    refreshCsrfToken(req, res);
  } else {
    // Refresh the cookie on every GET request to keep it in sync
    res.cookie("XSRF-TOKEN", req.session.csrfToken, {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: false,
      path: "/",
    });
  }

  next();
};

/**
 * Middleware to verify the CSRF token from the request header.
 * Only applies to state-changing methods (POST, PUT, DELETE, PATCH).
 */
export const verifyCsrfToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];

  if (safeMethods.includes(req.method)) {
    return next();
  }

  const headerToken = req.get("X-CSRF-Token");
  const sessionToken = req.session.csrfToken;

  if (!headerToken || !sessionToken || headerToken !== sessionToken) {
    return next(new ShopError("Invalid or missing CSRF token", 403));
  }

  next();
};

declare module "express-session" {
  interface SessionData {
    csrfToken: string;
  }
}
