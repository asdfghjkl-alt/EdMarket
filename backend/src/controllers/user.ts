import { type NextFunction, type Request, type Response } from "express";
import ShopError from "../utils/ShopError";
import User from "../models/user";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) next(err);
      res.status(200).json({
        message: `Welcome ${username}`,
        data: {
          user: { username: registeredUser.username, _id: registeredUser._id },
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
  res.json({
    message: `Welcome ${req.user?.username}`,
    data: { user: { username: req.user?.username, _id: req.user?._id } },
  });
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.json({ message: "Successfully logged out!" });
  });
};

const me = async (req: Request, res: Response) => {
  if (req.user) {
    const { _id, username } = req.user;
    return res.json({
      message: "Was authenticated",
      data: {
        user: {
          _id,
          username,
        },
      },
    });
  }
  res.status(401).json({ message: "Not authenticated" });
};

export { register, login, logout, me };
