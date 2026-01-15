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
      res.status(200).json({ message: `Welcome ${username}`, statusCode: 200 });
    });
  } catch (e) {
    console.log("HI");
    if (e instanceof Error) {
      throw new ShopError(e.message, 400);
    } else {
      throw new ShopError("Unknown error occurred", 500);
    }
  }
};

export { register };
