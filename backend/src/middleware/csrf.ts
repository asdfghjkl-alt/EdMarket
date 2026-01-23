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

export const syncCsrfToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Ensure session has a CSRF token
  if (!req.session.csrfToken) {
    refreshCsrfToken(req, res);
  } else {
    // Always sync the cookie to the session token to recover from deleted cookies
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

  // Exempt auth routes as per user request to ensure they can always sign in/up/out
  // This prevents the "first request failure" issue when no token is present yet.
  const exemptedPaths = ["/auth/login", "/auth/register", "/auth/logout"];
  if (exemptedPaths.includes(req.path)) {
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
