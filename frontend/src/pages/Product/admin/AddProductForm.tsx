import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate } from "react-router";
import Joi from "joi";
import { useState } from "react";
import { AxiosError } from "axios";
import type { ProductFormData } from "../../../types/product";
import InputField from "../../../components/utils/inputs/InputField";
import api from "../../../api/axios";
import TextArea from "../../../components/utils/inputs/TextArea";

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

export default function AddProductForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: joiResolver(productSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      price: 0,
      quantity: 0,
      image: "",
      description: "",
    },
  });
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  async function onSubmit(data: ProductFormData) {
    try {
      await api.post("/products", data);
      navigate("/");
    } catch (e) {
      if (e instanceof AxiosError) {
        setErrMsg(e.response?.data.message);
      } else {
        setErrMsg("Unexpected error occurred");
      }
      reset();
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
        <h1 className="text-xl font-semibold">Add a product</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {errMsg}
          <InputField
            name="name"
            label="Product Name"
            placeholder="Name"
            register={register}
            error={errors.name}
          />
          <div className="flex">
            <InputField
              name="price"
              type="number"
              label="Price"
              placeholder="Price"
              register={register}
              error={errors.price}
              className="mr-5 w-70"
            />
            <InputField
              name="quantity"
              type="number"
              label="Quantity (g)"
              className="w-40"
              placeholder="Quantity"
              register={register}
              error={errors.quantity}
            />
          </div>
          <InputField
            name="image"
            label="Image Url"
            placeholder="Image"
            register={register}
            error={errors.image}
          />
          <TextArea
            name="description"
            label="Description"
            placeholder="Description"
            register={register}
            error={errors.description}
            rows={3}
          />
          <button type="submit" className="btn-auth">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
