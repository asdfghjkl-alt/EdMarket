import Joi from "joi";

const allowedUnits = ["g", "kg", "ml", "L", "each"];

const productSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Please enter a name",
  }),
  price: Joi.number().multiple(0.01).required().greater(0).messages({
    "number.multiple": "Price can only have 2 decimal places",
    "number.greater": "Price must be greater than 0",
    "number.base": "Please enter a quantity",
  }),
  quantity: Joi.number().multiple(0.001).required().greater(0).messages({
    "number.multiple": "Quantity can only have 3 decimal places",
    "number.greater": "Quantity must be greater than 0",
    "number.base": "Please enter a quantity",
  }),
  category: Joi.string().required().messages({
    "string.empty": "Please enter a category",
  }),
  unit: Joi.string()
    .valid(...allowedUnits)
    .required()
    .messages({
      "string.empty": "Please enter a unit",
      "any.only":
        "Unit must be one of the following: " + allowedUnits.join(", "),
    }),
  description: Joi.string().required().messages({
    "string.empty": "Please enter a description",
  }),
});

export { productSchema };
