import type { Request, Response } from "express";
import Product from "../models/product";

const addProduct = async (req: Request, res: Response) => {
  const { name, quantity, price, image } = req.body;

  const newProduct = new Product({
    name,
    quantity,
    price,
    image,
  });
  await newProduct.save();
  res.json({ message: "Successfully added new product" });
};

const allProducts = async (req: Request, res: Response) => {
  const products = await Product.find();

  res.json({
    message: "Successfully retrieved new products",
    body: { products },
  });
};

const findProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(404)
      .json({ message: "Product with inputted id does not exist" });
  }
  res.json({
    message: "Successfully retrieved information about the product",
    body: { product },
  });
};

export { addProduct, allProducts, findProduct };
