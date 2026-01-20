import type { Request, Response, NextFunction } from "express";
import { productSchema } from "@/schemas";
import ShopError from "@/utils/ShopError";
import type { ValidationErrorItem } from "joi";

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

export { validateProduct };
