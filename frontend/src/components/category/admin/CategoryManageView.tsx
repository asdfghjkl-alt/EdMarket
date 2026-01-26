import api from "@/api/axios";
import type { CategoryType } from "@/types/category";
import { AxiosError } from "axios";
import { useState } from "react";

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
    <tr className="m-5 h-full border-collapse rounded-md p-3 text-left shadow-gray-400 *:border-t-2 *:p-2 hover:shadow-md">
      <td>{category.name}</td>
      <td>
        <button className="btn btn-edit w-full">Edit</button>
      </td>
      <td>
        <form
          action={() => {
            setDisableDelete(true);
            deleteCategory(category._id);
          }}
        >
          <button disabled={disableDelete} className="btn btn-delete w-full">
            Delete
          </button>
        </form>
      </td>
    </tr>
  );
}
