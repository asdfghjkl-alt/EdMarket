import "module-alias/register";
import "@/loaders/loader";
import { connectDB } from "@/loaders/db";
import app from "@/loaders/app";

connectDB();

const port = process.env.PORT || 3314;

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});