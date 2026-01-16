import "./loader.js";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import session from "express-session";
import methodOverride from "method-override";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import ShopError from "./utils/ShopError.js";
import userRoutes from "./routes/user";
import User, { type IUser } from "./models/user.js";
import { isLoggedIn } from "./middleware/user.js";

let dbUrl: string;

if (process.env.NODE_ENV !== "production") {
  dbUrl = "mongodb://localhost:27017/edmarket";
} else {
  dbUrl = process.env.DB_URL as string;
}
mongoose.connect(dbUrl as string);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());

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
app.get("/protected", isLoggedIn, (req: Request, res: Response) => {
  res.send("Successful! You were authenticated!");
});

app.all(/(.*)/, (req, res, next) => {
  next(new ShopError("Page not found", 404));
});

app.use(
  (
    err: { statusCode?: number; message?: string },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    void next;
    const { statusCode = 500 } = err as {
      statusCode?: number;
    };
    if (!err.message) {
      err.message = "Something unknown has gone wrong, sorry.";
    }

    res.status(statusCode).json({ message: err.message, statusCode });
  }
);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${3314}!`);
});
