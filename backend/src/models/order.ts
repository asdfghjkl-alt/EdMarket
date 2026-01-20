import { Schema, model } from "mongoose";
import { productSchema } from "@/models/product";
import User from "@/models/user";

const orderSchema = new Schema({
  cart: [
    {
      _id: { _id: false },
      product: {
        type: productSchema,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, min: 1, required: true },
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: async function (value: Schema.Types.ObjectId) {
        const isValid = await User.exists({ _id: value });
        if (isValid) {
          return true;
        }
        return false;
      },
      message: "User id does not exist",
    },
  },
  completed: {
    type: Boolean,
    required: true,
  },
});

const Order = model("Order", orderSchema);

export default Order;
