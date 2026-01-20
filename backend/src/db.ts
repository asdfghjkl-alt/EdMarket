import mongoose from "mongoose";

let dbUrl: string;

if (process.env.NODE_ENV !== "production") {
  dbUrl = "mongodb://localhost:27017/edmarket";
} else {
  dbUrl = process.env.DB_URL as string;
}

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("Database connected");
  } catch (err) {
    console.error("connection error: ", err);
  }
};

export { connectDB, dbUrl };
