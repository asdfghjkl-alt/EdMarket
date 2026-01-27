import { NextFunction, Request, Response } from "express";
import Product from "@/models/product";

interface CartItem {
  product: string;
  quantity: number;
}

/**
 * Middleware to filter invalid items from the cart
 * @param req
 * @param res
 * @param next
 */
const filterInvalidItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { cart } = req.body;
  const cartProductIds = cart.map((item: CartItem) => item.product);

  // Finds all valid products that are in the cart
  const validProducts = await Product.find({
    _id: { $in: cartProductIds },
  }).select("_id");

  const validIdSet = new Set(validProducts.map((p) => p._id.toString()));

  // Filters out items not recorded in the database
  req.body.cart = cart.filter((item: CartItem) => validIdSet.has(item.product));

  next();
};

export { filterInvalidItems };
