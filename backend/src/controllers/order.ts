import { Request, Response } from "express";
import Order from "../models/order";
import Product from "../models/product";

interface CartItem {
  product: string;
  quantity: number;
}

const addOrder = async (req: Request, res: Response) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Somehow you were not authenticated" });
  }

  if (req.body.cart.length < 1) {
    return res
      .status(400)
      .json({ message: "Must have at least 1 valid item in the cart!" });
  }

  const sentCart = await Promise.all(
    req.body.cart.map(async (item: CartItem) => {
      const product = await Product.findById(item.product);
      return { product, quantity: item.quantity };
    }),
  );

  const order = new Order({
    user: req.user._id,
    cart: sentCart,
    completed: false,
  });

  await order.save();

  res.json({ message: "Order successfully sent!" });
};

const viewUserOrders = async (req: Request, res: Response) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Somehow you were not authenticated" });
  }

  const userOrders = await Order.find({ user: req.user._id });

  const userOrdersFiltered = userOrders.map((order) => {
    return { cart: order.cart, _id: order._id };
  });

  res.json({
    message: "Successfully retrieved user orders",
    body: { orders: userOrdersFiltered },
  });
};

const viewAllOrders = async (req: Request, res: Response) => {
  const allOrders = await Order.find();

  res.json({
    message: "Successfully retrieved all orders!",
    body: {
      orders: allOrders,
    },
  });
};

export { addOrder, viewUserOrders };
