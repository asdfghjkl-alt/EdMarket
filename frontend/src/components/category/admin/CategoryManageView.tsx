import api from "@/api/axios";
import type { CategoryType } from "@/types/category";
import { AxiosError } from "axios";
import { useState } from "react";
import { Link } from "react-router";

export default function CategoryManageView({
  category,
  setCategories,
  setError,
}: {
  category: CategoryType;
  setCategories: React.Dispatch<React.SetStateAction<CategoryType[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [disableDelete, setDisableDelete] = useState(false);

  async function deleteCategory(_id: string) {
    try {
      setError(null);
      await api.delete(`/categories/${_id}`);
      setCategories((prevCategories) =>
        prevCategories.filter((c) => c._id !== _id),
      );
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e.response?.data.message);
      } else {
        setError("An unexpected error occurred");
      }
      setDisableDelete(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md md:grid md:grid-cols-4 md:items-center md:gap-4 md:text-center">
      <div className="flex flex-col md:col-span-2">
        <span className="font-bold md:hidden">Name:</span>
        <span>{category.name}</span>
      </div>

      <div className="flex gap-2 md:col-span-2 md:justify-center">
        <Link
          to={`/categories/edit/${category._id}`}
          className="btn btn-edit h-full text-sm"
        >
          Edit
        </Link>
        <form
          action={() => {
            setDisableDelete(true);
            deleteCategory(category._id);
          }}
        >
          <button
            disabled={disableDelete}
            className="btn btn-delete h-full text-sm"
          >
            {disableDelete ? "Deleting..." : "Delete"}
          </button>
        </form>
      </div>
    </div>
  );
}
