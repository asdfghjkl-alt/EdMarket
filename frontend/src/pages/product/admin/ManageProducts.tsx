import { AxiosError } from "axios";
import api from "@/api/axios";
import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import ProductManageView from "@/components/product/ProductManageView";
import Loading from "@/components/ui/Loading";
import { Link } from "react-router";

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<null | string>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Attempts to get all products from backend
        const { data } = await api.get("/products");
        setProducts(data.body.products);
      } catch (err) {
        if (err instanceof AxiosError && err.name !== "AbortError") {
          setErrMsg(err.response?.data.message);
        } else {
          console.error(err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="m-6">
      <div className="mb-4 grid grid-cols-2 items-center justify-between">
        <h1 className="w-full text-center text-2xl font-bold">
          Manage Products
        </h1>
        <div className="flex flex-col items-center justify-center gap-2">
          <Link
            to="/products/add"
            className="btn btn-submit w-full text-center"
          >
            Add New Product
          </Link>
          <Link
            to="/categories/manage"
            className="btn btn-manage w-full text-center"
          >
            Manage Product Categories
          </Link>
        </div>
      </div>
      {errMsg && <p className="text-red-500">{errMsg}</p>}
      <div className="flex flex-col gap-4">
        <div className="hidden rounded-md bg-gray-100 p-4 font-bold text-gray-700 md:grid md:grid-cols-12 md:gap-4 md:text-center">
          <div className="col-span-2">Image</div>
          <div className="col-span-2">Name</div>
          <div className="col-span-2">Quantity</div>
          <div className="col-span-1">Price</div>
          <div className="col-span-1">Category</div>
          <div className="col-span-2">Description</div>
          <div className="col-span-2">Actions</div>
        </div>

        {products.map((product: Product) => (
          <ProductManageView
            key={product._id}
            product={product}
            setProducts={setProducts}
            setError={setErrMsg}
          />
        ))}
      </div>
    </div>
  );
}
