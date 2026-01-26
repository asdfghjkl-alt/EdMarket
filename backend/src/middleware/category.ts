import Category from "@/models/categories";
import Product from "@/models/product";
import type { NextFunction, Request, Response } from "express";

const checkNoProductsInCat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const productInCat = await Product.find({ category: req.params.id });

  if (productInCat.length > 0) {
    return res.status(400).json({
      message: "Category has products, you cannot delete the category",
    });
  }

  next();
};

export { checkNoProductsInCat };
