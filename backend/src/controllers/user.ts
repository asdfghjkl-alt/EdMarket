import type { NextFunction, Request, Response } from "express";
import ShopError from "@/utils/ShopError";
import User from "@/models/user";
import { refreshCsrfToken } from "@/middleware/csrf";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username, isAdmin: false });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) next(err);
      res.status(200).json({
        message: `Welcome ${username}`,
        body: {
          user: {
            username: registeredUser.username,
            _id: registeredUser._id,
            isAdmin: registeredUser.isAdmin,
          },
        },
      });
    });
  } catch (e) {
    if (e instanceof Error) {
      throw new ShopError(e.message, 400);
    } else {
      throw new ShopError("Unknown error occurred", 500);
    }
  }
};

const login = async (req: Request, res: Response) => {
  refreshCsrfToken(req, res);
  res.json({
    message: `Welcome ${req.user?.username}`,
    body: {
      user: {
        username: req.user?.username,
        _id: req.user?._id,
        isAdmin: req.user?.isAdmin,
      },
    },
  });
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    refreshCsrfToken(req, res);
    res.json({ message: "Successfully logged out!" });
  });
};

const me = async (req: Request, res: Response) => {
  if (req.user) {
    const { _id, username, isAdmin } = req.user;
    return res.json({
      message: "Was authenticated",
      body: {
        user: {
          _id,
          username,
          isAdmin,
        },
      },
    });
  }
  res.status(401).json({ message: "Not authenticated" });
};

export { register, login, logout, me };
