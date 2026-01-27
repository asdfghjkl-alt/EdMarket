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
 * @returns
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
 * @returns
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
  });

  await newProduct.save();
  res.json({ message: "Successfully added new product" });
};

/**
 * Method to retrieve all products
 * @returns
 */
const allProducts = async (req: Request, res: Response) => {
  const categoryName = req.query.category;
  let filter = {};

  if (categoryName) {
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({
        message: "Category does not exist",
      });
    }
    filter = { category: category._id };
  }

  const products = await Product.find(filter).populate("category");

  res.json({
    message: "Successfully retrieved new products",
    body: { products },
  });
};

const findProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate("category");
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

const deleteProduct = async (req: Request, res: Response) => {
  const deletedProd = await Product.findByIdAndDelete(req.params.id);
  if (!deletedProd) {
    return res
      .status(404)
      .json({ message: "Product with specified id does not exist" });
  }
  res.status(200).json({ message: "Successfully deleted product!" });
};

const editProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, quantity, price, description, unit, category } = req.body;

  const product = await Product.findById(id);

  if (!product) {
    return res
      .status(404)
      .json({ message: "Product with specified id does not exist" });
  }

  const realCategory = await Category.findOne({ name: category });
  if (!realCategory) {
    return res.status(404).json({ message: "Category does not exist" });
  }

  product.name = name;
  product.quantity = quantity;
  product.price = price;
  product.description = description;
  product.unit = unit;
  product.category = realCategory._id;

  if (req.files) {
    const files = req.files as Express.Multer.File[];
    const uploadedImages = await processProductImages(files);
    product.images.push(...uploadedImages);
  }

  await product.save();
  res.json({ message: "Product successfully updated!" });
};

export { addProduct, allProducts, findProduct, deleteProduct, editProduct };
