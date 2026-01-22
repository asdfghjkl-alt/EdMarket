import type { Request, Response, NextFunction } from "express";
import { productSchema } from "@/schemas";
import ShopError from "@/utils/ShopError";
import type { ValidationErrorItem } from "joi";

import Product from "@/models/product";

const MB_SIZE = 1024 * 1024;

const MAX_FILE_SIZE_MB = 7;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * MB_SIZE;

const MAX_TOTAL_SIZE_MB = 15;
const MAX_TOTAL_SIZE = MAX_TOTAL_SIZE_MB * MB_SIZE;

const MAX_FILES = 5;

const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  const result = productSchema.validate(req.body, { abortEarly: false });

  if (result.error) {
    const msg = result.error.details
      .map((el: ValidationErrorItem) => el.message)
      .join(", ");
    throw new ShopError(msg, 400);
  }

  next();
};

const validateImages = (
  req: Request,
  res: Response,
  initNoFiles: number,
  initFileSizes: number,
) => {
  if (!req.files) {
    return res.status(400).json({ message: `Need at least one image` });
  }
  const files = req.files as Express.Multer.File[];
  if (files.length + initNoFiles < 0) {
    return res.status(400).json({ message: `Need at least one image` });
  }
  if (files.length + initNoFiles > MAX_FILES) {
    return res.status(400).json({
      message: `Only ${MAX_FILES} are allowed to be uploaded in total.`,
    });
  }

  let totalSize = initFileSizes;
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        message: `File "${file.originalname}" is too large (Max ${MAX_FILE_SIZE_MB}MB).`,
      });
    }
    totalSize += file.size;
  }
  if (totalSize > MAX_TOTAL_SIZE) {
    return res
      .status(400)
      .json({ message: `Total size exceeds limit of ${MAX_TOTAL_SIZE_MB}MB.` });
  }
  return true;
};

const checkInitImagesValid = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (validateImages(req, res, 0, 0) !== true) {
    return;
  }

  next();
};

const checkEditImagesValid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.files) {
    return res.status(400).json({ message: `Need at least one image` });
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(400)
      .json({ message: "Product with sent id could not be found" });
  }

  const initNoFiles = product.images.length;
  const initFileSizes = product.images.reduce(
    (acc, file) => acc + file.size,
    0,
  );

  if (validateImages(req, res, initNoFiles, initFileSizes) !== true) {
    return;
  }
  next();
};



export {
  validateProduct,
  checkInitImagesValid,
  checkEditImagesValid,
};
