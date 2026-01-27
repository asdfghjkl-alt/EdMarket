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
  const [errMsg, setErrMsg] = useState(null as null | string);

  useEffect(() => {
    const controller = new AbortController();

    // Fetches all existing categories
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get("/categories");
        setCategories(data.body.categories);
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

  /**
   * Function to submit the new category
   * @param data category data
   */
  async function onSubmit(data: CategoryFormData) {
    try {
      // Attempts to add new category
      const { data: response } = await api.post("/categories", data);
      setCategories((prevCategories) => [
        ...prevCategories,
        response.body.category,
      ]);
    } catch (e) {
      if (e instanceof AxiosError) {
        setErrMsg(e.response?.data.message);
      } else {
        setErrMsg("Unexpected error occurred");
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
      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
        <AddCategoryForm onSubmit={onSubmit} />
        <h1 className="ml-2">Manage Categories</h1>
      </div>
      {errMsg && (
        <p className="text-center text-xl font-bold text-red-500">{errMsg}</p>
      )}
      <div className="flex flex-col gap-4 p-4">
        <div className="hidden rounded-md bg-gray-100 p-4 font-bold text-gray-700 md:grid md:grid-cols-4 md:gap-4 md:text-center">
          <div className="col-span-2">Name</div>
          <div className="col-span-2">Actions</div>
        </div>

        <div className="flex flex-col gap-4">
          {categories.map((category: CategoryType) => (
            <CategoryManageView
              key={category._id}
              category={category}
              setCategories={setCategories}
              setError={setErrMsg}
            />
          ))}
        </div>
      </div>
    </>
  );
}
