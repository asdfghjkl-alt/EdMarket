import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useState } from "react";
import type { CategoryFormData } from "@/types/category";

const categorySchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Please enter a name",
  }),
});

export default function AddCategoryForm({
  onSubmit,
}: {
  onSubmit: (data: CategoryFormData) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: joiResolver(categorySchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  async function submittingForm(data: CategoryFormData) {
    setIsLoading(true);
    await onSubmit(data);
    setIsLoading(false);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(submittingForm)}
      noValidate
      className="flex gap-4 p-4"
    >
      <div>
        <div className="text-left">
          <label className="font-medium" htmlFor="name">
            Category Name
          </label>
          <div className="flex gap-4">
            <input id="name" placeholder="Name" {...register("name")} />
            <button
              type="submit"
              className="btn btn-submit h-12 w-full"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Category"}
            </button>
          </div>
        </div>
        <div className="text-red-500">
          {errors.name && <span>{errors.name.message}</span>}
        </div>
      </div>
    </form>
  );
}
