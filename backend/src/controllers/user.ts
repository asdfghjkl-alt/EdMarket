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
        statusCode: 200,
        data: { username: registeredUser.username },
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
    statusCode: 200,
    data: { username: req.user?.username },
  });
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.json({ message: "Successfully logged out!", statusCode: 200 });
  });
};

export { register, login, logout };
