import express, { type Request, type Response } from "express";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("HI");
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${3314}!`);
});
