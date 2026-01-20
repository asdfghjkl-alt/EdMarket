import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import session from "express-session";
import methodOverride from "method-override";
import MongoStore from "connect-mongo";
import cors from "cors";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import ShopError from "@/utils/ShopError.js";
import userRoutes from "@/routes/user";
import productRoutes from "@/routes/product";
import orderRoutes from "@/routes/order";
import User, { type IUser } from "@/models/user.js";
import { dbUrl } from "@/loaders/db";
import { rateLimit } from "express-rate-limit";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: process.env.SECRET as string,
  },
});

const sessionConfig = {
  store,
  name: "session",
  secret: process.env.SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 1,
    secure: process.env.NODE_ENV === "production",
  },
};

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
app.use(session(sessionConfig));

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends IUser {}
  }
}
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/auth", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.all(/(.*)/, (req, res, next) => {
  next(new ShopError("Unable to access the resource requested", 404));
});

app.use(
  (
    err: { statusCode?: number; message?: string },
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    void next;
    const { statusCode = 500 } = err as {
      statusCode?: number;
    };
    if (!err.message) {
      err.message = "Something unknown has gone wrong, sorry.";
    }

    res.status(statusCode).json({ message: err.message });
  },
);

export default app;
