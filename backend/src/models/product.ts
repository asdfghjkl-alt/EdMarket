import { cloudinary } from "@/cloudinary";
import { Schema, model } from "mongoose";

const imageSchema = new Schema(
  {
    _id: { _id: false },
    url: { type: String, required: true },
    filename: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200,h_150,c_fill");
});
imageSchema.virtual("main").get(function () {
  return this.url.replace("/upload", "/upload/w_600,h_450,c_fill");
});
imageSchema.virtual("display").get(function () {
  return this.url.replace("/upload", "/upload/w_400,h_300,c_fill");
});

export const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  images: {
    type: [imageSchema],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

productSchema.post("findOneAndDelete", async function (product) {
  for (const { filename } of product.images) {
    await cloudinary.uploader.destroy(filename);
  }
});

const Product = model("Product", productSchema);

export default Product;
