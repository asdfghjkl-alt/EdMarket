import type { NextFunction, Request, Response } from "express";
import ShopError from "@/utils/ShopError";
import User from "@/models/user";

const allowedRoles = ["admin", "seller", "buyer"];

/**
 * Function to register a user
 */
const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username, isAdmin: false });
    const registeredUser = await User.register(user, password);

    // Auto logs in after registration
    req.login(registeredUser, (err) => {
      if (err) next(err);
      res.status(200).json({
        message: `Welcome ${username}`,
        body: {
          user: {
            username: registeredUser.username,
            _id: registeredUser._id,
            role: registeredUser.role,
          },
        },
      });
    });
  } catch (e) {
    if (e instanceof Error) {
      throw new ShopError("Invalid credentials", 400);
    } else {
      throw new ShopError("Unknown error occurred", 500);
    }
  }
};

/**
 * On login success, returns the user object
 */
const login = async (req: Request, res: Response) => {
  res.json({
    message: `Welcome ${req.user?.username}`,
    body: {
      user: {
        username: req.user?.username,
        _id: req.user?._id,
        role: req.user?.role,
      },
    },
  });
};

/**
 * Logs out the user
 */
const logout = async (req: Request, res: Response, next: NextFunction) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.json({ message: "Successfully logged out!" });
  });
};

/**
 * Gets user information from session
 */
const me = async (req: Request, res: Response) => {
  if (req.user) {
    const { _id, username, role } = req.user;
    return res.json({
      message: "Was authenticated",
      body: {
        user: {
          _id,
          username,
          role,
        },
      },
    });
  }
  res.status(401).json({ message: "Not authenticated" });
};

/**
 * Admin route to get all users and information
 */
const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  const usersRet = users.map((user) => {
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  });

  res.json({
    message: "Users fetched successfully",
    body: { users: usersRet },
  });
};

const changeUserRole = async (req: Request, res: Response) => {
  const { id, role } = req.params;

  if (req.user?._id.equals(id as string)) {
    throw new ShopError("You cannot modify your own role", 400);
  }
  if (!allowedRoles.includes(role as string)) {
    throw new ShopError("Invalid role", 400);
  }

  const user = await User.findByIdAndUpdate(id, { role });
  if (!user) {
    throw new ShopError("User not found", 404);
  }

  res.json({ message: "User made seller successfully", body: { user } });
};

export { register, login, logout, me, getAllUsers, changeUserRole };
