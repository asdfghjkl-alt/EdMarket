import type { Request, Response } from "express";
import Category from "@/models/categories";

const findAllCategories = async (req: Request, res: Response) => {
  const categories = await Category.find();

  res.json({
    message: "Successfully retrieved categories",
    body: { categories },
  });
};

const addCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  const category = new Category({ name });
  await category.save();

  res.json({
    message: "Successfully added new category",
    body: { category },
  });
};

const getCategory = async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      message: "Category not found",
    });
  }

  res.json({
    message: "Successfully retrieved category",
    body: { category },
  });
};

const deleteCategory = async (req: Request, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return res.status(404).json({
      message: "Category not found",
    });
  }

  res.json({
    message: "Successfully deleted category",
    body: { category },
  });
};

const editCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      message: "Category not found",
    });
  }

  category.name = name;
  await category.save();

  res.json({
    message: "Successfully deleted category",
    body: { category },
  });
};

export {
  findAllCategories,
  addCategory,
  getCategory,
  deleteCategory,
  editCategory,
};
