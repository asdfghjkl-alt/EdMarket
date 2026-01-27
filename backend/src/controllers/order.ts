import { Request, Response } from "express";
import Order from "@/models/order";
import Product from "@/models/product";

interface CartItem {
  product: string;
  quantity: number;
}

/**
 * Creates a new user order from the sent shopping cart
 */
const addOrder = async (req: Request, res: Response) => {
  // Checks existence of user object (TS check)
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Somehow you were not authenticated" });
  }

  // Checks that filtration of invalid items doesn't leave no items in cart
  if (req.body.cart.length < 1) {
    return res
      .status(400)
      .json({ message: "Must have at least 1 valid item in the cart!" });
  }

  // Maps cart item ids to the actual product objects
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

/**
 * Allows users to view their own orders
 */
const viewUserOrders = async (req: Request, res: Response) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Somehow you were not authenticated" });
  }

  // Finds all orders associated with the user
  const userOrders = await Order.find({ user: req.user._id });

  // Filters out unnecessary fields
  const userOrdersFiltered = userOrders.map((order) => {
    return {
      cart: order.cart,
      _id: order._id,
      completed: order.completed,
      date: order.date,
      completionDate: order.completionDate,
    };
  });

  res.json({
    message: "Successfully retrieved user orders",
    body: { orders: userOrdersFiltered },
  });
};

/**
 * Admin level function to allow viewing of all orders, including user details
 */
const viewAllOrders = async (req: Request, res: Response) => {
  const allOrders = await Order.find().populate("user", "username");

  res.json({
    message: "Successfully retrieved all orders!",
    body: {
      orders: allOrders,
    },
  });
};

/**
 * Allows admins to mark order as completed
 */
const markAsDelivered = async (req: Request, res: Response) => {
  // Checks user object exists (TS)
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Somehow you were not authenticated" });
  }

  // Checks that order exists
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Marks order as completed and saves completion date
  order.completed = true;
  order.completionDate = new Date();

  await order.save();

  res.json({ message: "Order successfully marked as delivered!" });
};

/**
 * Allows admins to mark order as uncompleted
 */
const markAsUndelivered = async (req: Request, res: Response) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Somehow you were not authenticated" });
  }

  // Checks that order exists
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Marks order as uncompleted
  order.completed = false;

  await order.save();

  res.json({ message: "Order successfully marked as undelivered!" });
};

export {
  addOrder,
  viewUserOrders,
  viewAllOrders,
  markAsDelivered,
  markAsUndelivered,
};
