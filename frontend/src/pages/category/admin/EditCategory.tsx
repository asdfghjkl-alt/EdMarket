import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate, useParams } from "react-router";
import Joi from "joi";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import InputField from "@/components/ui/inputs/InputField";
import api from "@/api/axios";
import Loading from "@/components/ui/Loading";
import type { CategoryFormData } from "@/types/category";

const categorySchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Please enter a name",
  }),
});

export default function EditCategory() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: joiResolver(categorySchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
    },
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const [errMsg, setErrMsg] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/categories/${id}`);
        setValue("name", data.body.category.name);
      } catch (err) {
        if (err instanceof AxiosError && err.name !== "AbortError") {
          setErrMsg(err.response?.data.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();

    return () => controller.abort();
  }, []);

  async function onSubmit(data: CategoryFormData) {
    try {
      setIsLoading(true);
      await api.put(`/categories/${id}`, data);
      setIsLoading(false);
      navigate("/categories/manage");
    } catch (e) {
      setIsLoading(false);
      if (e instanceof AxiosError) {
        setErrMsg(e.response?.data.message);
      } else {
        setErrMsg("Unexpected error occurred");
      }
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
        <h1 className="text-xl font-semibold">Edit a category</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {errMsg && <p className="text-red-500">{errMsg}</p>}
          <InputField
            name="name"
            label="Category Name"
            placeholder="Name"
            register={register}
            error={errors.name}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-edit w-full"
          >
            {isLoading ? "Editing..." : "Edit Category"}
          </button>
        </form>
      </div>
    </div>
  );
}
