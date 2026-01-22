import "../src/loaders/loader";
import app from "../src/loaders/app";
import { connectDB } from "../src/loaders/db";

connectDB();

export default app;
