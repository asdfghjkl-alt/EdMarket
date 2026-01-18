import Joi from "joi";

const productSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Please enter an image url",
  }),
  price: Joi.number().multiple(0.01).required().greater(0).messages({
    "number.multiple": "Price can only have 2 decimal places",
    "number.greater": "Price must be greater than 0",
    "number.base": "Please enter a quantity",
  }),
  quantity: Joi.number().integer().required().greater(0).messages({
    "number.integer": "Quantity must be an integer",
    "number.greater": "Quantity must be greater than 0",
    "number.base": "Please enter a quantity",
  }),
  image: Joi.string().required().messages({
    "string.empty": "Please enter an image url",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Please enter a description",
  }),
});

export { productSchema };
