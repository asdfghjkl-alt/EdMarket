import type { Request, Response } from "express";
import Product from "@/models/product";
import { cloudinary } from "@/cloudinary/index";
import { destroyAllUploads } from "@/middleware/product";

const processCampImages = async (files: Express.Multer.File[]) => {
  const uploadedImages = await Promise.all(
    files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "EdMarket",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      });

      return {
        url: result.secure_url,
        filename: result.public_id,
        size: result.bytes,
      };
    }),
  );

  destroyAllUploads(files);
  return uploadedImages;
};

const addProduct = async (req: Request, res: Response) => {
  const { name, quantity, price, description } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Somehow you are not logged in" });
  }
  if (!req.files) {
    return res.status(400).json({ message: "You need to upload an image" });
  }

  // Declares files as array of files
  const files = req.files as Express.Multer.File[];
  const uploadedImages = await processCampImages(files);

  const newProduct = new Product({
    name,
    quantity,
    price,
    images: uploadedImages,
    description,
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
  const { name, quantity, price, description } = req.body;

  const product = await Product.findById(id);

  if (!product) {
    return res
      .status(404)
      .json({ message: "Product with specified id does not exist" });
  }

  product.name = name;
  product.quantity = quantity;
  product.price = price;
  product.description = description;

  if (req.files) {
    const files = req.files as Express.Multer.File[];
    const uploadedImages = await processCampImages(files);
    product.images.push(...uploadedImages);
  }

  await product.save();
  res.json({ message: "Product successfully updated!" });
};

export { addProduct, allProducts, findProduct, deleteProduct, editProduct };
