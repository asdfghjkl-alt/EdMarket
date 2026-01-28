import { cloudinary } from "@/cloudinary";
import { Schema, model } from "mongoose";
import Category from "./categories";

export enum ProductUnit {
  g = "g",
  kg = "kg",
  ml = "ml",
  L = "L",
  each = "each",
}

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
  return this.url.replace("/upload", "/upload/w_300,h_300,c_pad");
});
imageSchema.virtual("main").get(function () {
  return this.url.replace("/upload", "/upload/w_1200,h_1200,c_pad");
});
imageSchema.virtual("display").get(function () {
  return this.url.replace("/upload", "/upload/w_500,h_500,c_pad");
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
  unit: {
    type: String,
    required: true,
    enum: Object.values(ProductUnit),
    default: ProductUnit.g,
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
  seller: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
    validate: {
      // Custom validation software to check that associated category is valid
      validator: async function (value: Schema.Types.ObjectId) {
        const isValid = await Category.exists({ _id: value });
        if (isValid) {
          return true;
        }
        return false;
      },
      message: "Category id does not exist",
    },
  },
  description: {
    type: String,
    required: true,
  },
});

// Post middleware to delete images from Cloudinary when a product is deleted
productSchema.post("findOneAndDelete", async function (product) {
  for (const { filename } of product.images) {
    await cloudinary.uploader.destroy(filename);
  }
});

const Product = model("Product", productSchema);

export default Product;
