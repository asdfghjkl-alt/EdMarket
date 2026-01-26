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
import Close from "@/assets/close.png";
import type { CategoryType } from "@/types/category";

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
  images: Joi.array().min(1).required().messages({
    "array.min": "Please upload at least one image",
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
      unit: "g",
      images: [],
      description: "",
    },
  });

  useEffect(() => {
    register("images");
  }, [register]);

  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [errMsg, setErrMsg] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/categories`);
        setCategories(
          data.body.categories.map((category: CategoryType) => category.name),
        );
      } catch (err) {
        if (err instanceof AxiosError && err.name !== "AbortError") {
          setErrMsg(err.response?.data.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();

    return () => controller.abort();
  }, []);

  async function onSubmit(data: ProductFormData) {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append("quantity", data.quantity.toString());
      formData.append("unit", data.unit);

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

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
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
          <div className="flex flex-col gap-4 sm:flex-row">
            <InputField
              name="price"
              type="number"
              label="Price"
              placeholder="Price"
              register={register}
              error={errors.price}
              className="w-full"
            />
            <InputField
              name="quantity"
              type="number"
              label="Quantity"
              className="w-full"
              placeholder="Quantity"
              register={register}
              error={errors.quantity}
            />
            <div className="w-full text-left">
              <label htmlFor="unit" className="font-medium">
                Unit
              </label>
              <select
                id="unit"
                {...register("unit")}
                className="w-full rounded-xl border-2 border-gray-400 p-4"
              >
                {allowedUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              {errors.unit && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.unit.message}
                </p>
              )}
            </div>
          </div>
          <div className="text-left">
            <label htmlFor="category" className="font-medium">
              Category
            </label>
            <select
              id="category"
              {...register("category")}
              className="w-full rounded-xl border-2 border-gray-400 p-4"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">
                {errors.category.message}
              </p>
            )}
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
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-submit w-full"
          >
            {isLoading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
