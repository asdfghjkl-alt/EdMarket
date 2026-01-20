import "@/loader";
import { connectDB } from "@/db";
import app from "@/app";

connectDB();

const port = process.env.PORT || 3314;

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
