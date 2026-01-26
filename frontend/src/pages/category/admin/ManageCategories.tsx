import api from "@/api/axios";
import CategoryManageView from "@/components/category/admin/CategoryManageView";
import Loading from "@/components/ui/Loading";
import type { CategoryFormData, CategoryType } from "@/types/category";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import AddCategoryForm from "../../../components/category/admin/AddCategoryForm";

export default function ManageCategories() {
  const [categories, setCategories] = useState([] as CategoryType[]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null as null | string);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get("/categories");
        setCategories(data.body.categories);
      } catch (err) {
        if (err instanceof AxiosError && err.name !== "AbortError") {
          setError(err.response?.data.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();

    return () => controller.abort();
  }, []);

  async function onSubmit(data: CategoryFormData) {
    try {
      const { data: response } = await api.post("/categories", data);
      setCategories((prevCategories) => [
        ...prevCategories,
        response.body.category,
      ]);
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e.response?.data.message);
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="grid grid-cols-2 items-center gap-4">
        <AddCategoryForm onSubmit={onSubmit} />
        <h1 className="text-center">Manage Categories</h1>
      </div>
      {error && (
        <p className="text-center text-xl font-bold text-red-500">{error}</p>
      )}
      <div className="gap-4 p-4">
        <table className="w-full">
          <thead>
            <tr className="m-5 h-full rounded-md *:p-2 *:text-center *:font-semibold">
              <td className="w-1/2">Name</td>
              <td className="w-1/4">Edit</td>
              <td className="w-1/4">Delete</td>
            </tr>
          </thead>
          <tbody>
            {categories.map((category: CategoryType) => (
              <CategoryManageView
                key={category._id}
                category={category}
                setCategories={setCategories}
                setError={setError}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
