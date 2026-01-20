import { NextFunction, Request, Response } from "express";
import Product from "@/models/product";

interface CartItem {
  product: string;
  quantity: number;
}

const filterInvalidItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { cart } = req.body;
  const cartProductIds = cart.map((item: CartItem) => item.product);

  const validProducts = await Product.find({
    _id: { $in: cartProductIds },
  }).select("_id");

  const validIdSet = new Set(validProducts.map((p) => p._id.toString()));

  req.body.cart = cart.filter((item: CartItem) => {
    return validIdSet.has(item.product);
  });

  next();
};

export { filterInvalidItems };
