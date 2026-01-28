import type { Request, Response } from "express";
import Product from "@/models/product";
import { cloudinary } from "@/cloudinary/index";
import { Readable } from "stream";
import Category from "@/models/categories";

interface ImageType {
  url: string;
  filename: string;
  size: number;
}

/**
 * Processes uploaded images on multer to cloudinary
 * @param files Files that were uploaded to multer
 */
const processProductImages = async (
  files: Express.Multer.File[],
): Promise<ImageType[]> => {
  const uploadedImages = (await Promise.all(
    files.map(async (file) => {
      // Promise wrapper when uploading the image to cloudinary
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "EdMarket",
            transformation: [{ quality: "auto", fetch_format: "auto" }],
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error("Upload failed"));

            resolve({
              url: result.secure_url,
              filename: result.public_id,
              size: result.bytes,
            });
          },
        );

        // Converts multer buffer into readable stream and pipes it to cloudinary
        Readable.from(file.buffer).pipe(uploadStream);
      });
    }),
  )) as ImageType[];

  return uploadedImages;
};

/**
 * Method to add a new product
 */
const addProduct = async (req: Request, res: Response) => {
  const { name, quantity, price, description, unit, category } = req.body;

  const realCategory = await Category.findOne({ name: category });
  // Checks that category exists in the database
  if (!realCategory) {
    return res.status(404).json({ message: "Category does not exist" });
  }
  // Checks that user is logged in (TS angry)
  if (!req.user) {
    return res.status(401).json({ message: "Somehow you are not logged in" });
  }
  // Checks that files exist (TS angry)
  if (!req.files) {
    return res.status(400).json({ message: "You need to upload an image" });
  }

  const files = req.files as Express.Multer.File[];
  const uploadedImages = await processProductImages(files);

  // Creates new product with the uploaded files
  const newProduct = new Product({
    name,
    unit,
    quantity,
    price,
    images: uploadedImages,
    category: realCategory._id,
    description,
    seller: req.user._id,
  });

  await newProduct.save();
  res.json({ message: "Successfully added new product" });
};

/**
 * Method to retrieve all products with filtration based on category
 */
const allProducts = async (req: Request, res: Response) => {
  const categoryName = req.query.category;
  let filter = {};

  // Modifies filter based on if the user has inputted a category search
  if (categoryName) {
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({
        message: "Category does not exist",
      });
    }
    filter = { category: category._id };
  }

  // Retrieves all products with filtering
  const products = await Product.find(filter).populate("category");

  res.json({
    message: "Successfully retrieved new products",
    body: { products },
  });
};

/**
 * Finds specific product by its id
 */
const findProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate("category");

  // Checks that product exists
  if (!product) {
    return res
      .status(404)
      .json({ message: "Product with specified id does not exist" });
  }
  res.json({
    message: "Successfully retrieved information about the product",
    body: { product },
  });
};

/**
 * Deletes a specific product by its id
 */
const deleteProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res
      .status(404)
      .json({ message: "Product with specified id does not exist" });
  }
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Somehow you were not authenticated" });
  }

  if (!product.seller.equals(req.user._id) && req.user.role !== "admin") {
    return res
      .status(401)
      .json({ message: "You are not authorized to edit this product" });
  }

  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Successfully deleted product!" });
};

/**
 * Edits a specific product by its id
 */
const editProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, quantity, price, description, unit, category } = req.body;

  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Somehow you were not authenticated" });
  }

  const product = await Product.findById(id);

  // Checks that product to be edited exists
  if (!product) {
    return res
      .status(404)
      .json({ message: "Product with specified id does not exist" });
  }

  if (!product.seller.equals(req.user._id)) {
    return res
      .status(401)
      .json({ message: "You are not authorized to edit this product" });
  }

  // Attempts to link category name with actual category
  const realCategory = await Category.findOne({ name: category });
  if (!realCategory) {
    return res.status(404).json({ message: "Category does not exist" });
  }

  // Enters updated fields of product
  product.name = name;
  product.quantity = quantity;
  product.price = price;
  product.description = description;
  product.unit = unit;
  product.category = realCategory._id;

  if (req.files) {
    // Appends uploaded images to product
    const files = req.files as Express.Multer.File[];
    const uploadedImages = await processProductImages(files);
    product.images.push(...uploadedImages);
  }

  await product.save();
  res.json({ message: "Product successfully updated!" });
};

/**
 * Gets all products sold by the seller
 */
const getProductsBySeller = async (req: Request, res: Response) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Somehow you were not authenticated" });
  }

  if (req.user.role === "admin") {
    const products = await Product.find();
    return res.json({
      message: "Successfully retrieved products",
      body: { products },
    });
  }

  const products = await Product.find({ seller: req.user._id });
  res.json({ message: "Successfully retrieved products", body: { products } });
};

export {
  addProduct,
  allProducts,
  findProduct,
  deleteProduct,
  editProduct,
  getProductsBySeller,
};
