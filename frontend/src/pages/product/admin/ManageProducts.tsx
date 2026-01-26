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
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get("/products");
        setProducts(data.body.products);
      } catch (err) {
        if (err instanceof AxiosError && err.name !== "AbortError") {
          setError(err.response?.data.message);
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
            Manage Product Category
          </Link>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <table>
        <thead>
          <tr className="m-5 h-full rounded-md *:p-2 *:text-center *:font-semibold">
            <td className="w-2/12">Image</td>
            <td className="w-2/12">Name</td>
            <td className="w-1/12">Quantity</td>
            <td className="w-1/24">Price</td>
            <td className="w-1/24">Category</td>
            <td>Description</td>
          </tr>
        </thead>
        <tbody>
          {products.map((product: Product) => (
            <ProductManageView
              key={product._id}
              product={product}
              setProducts={setProducts}
              setError={setError}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
