import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate } from "react-router";
import Joi from "joi";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import type { ProductFormData } from "@/types/product";
import InputField from "@/components/ui/inputs/InputField";
import api from "@/api/axios";
import TextArea from "@/components/ui/inputs/TextArea";
import Loading from "@/components/ui/Loading";
import Close from "@/assets/close.png";

const productSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Please enter a name",
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
  images: Joi.array().min(1).required().messages({
    "array.min": "Please upload at least one image",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Please enter a description",
  }),
});

export default function AddProductForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: joiResolver(productSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      price: 0,
      quantity: 0,
      images: [],
      description: "",
    },
  });

  useEffect(() => {
    register("images");
  }, [register]);

  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: ProductFormData) {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append("quantity", data.quantity.toString());

      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
      }

      formData.append("description", data.description);

      await api.post("/products", formData);
      setIsLoading(false);
      navigate("/products/manage");
    } catch (e) {
      setIsLoading(false);
      if (e instanceof AxiosError) {
        setErrMsg(e.response?.data.message);
      } else {
        setErrMsg("Unexpected error occurred");
      }
    }
  }

  const images = watch("images");

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
        <h1 className="text-xl font-semibold">Add a product</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <p className="text-red-500">{errMsg}</p>
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
          <div className="mb-4 text-left">
            <label
              htmlFor="images"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Upload Image
            </label>
            <input
              type="file"
              multiple={true}
              name="images"
              id="images"
              accept="image/png, image/jpeg, image/webp, image/jpg"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (images.length + files.length > 5) {
                  e.target.value = "";
                  return setError("images", {
                    message: "You can send up to 5 images",
                  });
                }

                setValue("images", [...images, ...files], {
                  shouldValidate: true,
                });
                e.target.value = "";
              }}
              className="w-full rounded border border-gray-300 p-2"
            />
            <div className="mt-2 grid grid-cols-3 gap-4">
              {[...images].map((image, index) => (
                <div key={index} className="relative inline-block">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Image ${index}`}
                    className="h-24 w-full rounded border border-gray-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = [...images];
                      newImages.splice(index, 1);
                      setValue("images", newImages);
                    }}
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-center text-xs leading-none text-red-500 shadow-sm transition-colors hover:bg-red-300"
                  >
                    <img className="h-2/3 w-2/3" src={Close} />
                  </button>
                </div>
              ))}
            </div>
            {errors.images && (
              <p className="mt-1 text-xs text-red-500">
                {errors.images.message}
              </p>
            )}
          </div>
          <TextArea
            name="description"
            label="Description"
            placeholder="Description"
            register={register}
            error={errors.description}
            rows={3}
          />
          <button type="submit" className="btn-submit cursor-pointer">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
