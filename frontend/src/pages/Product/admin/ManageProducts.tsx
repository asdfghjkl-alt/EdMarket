import { AxiosError } from "axios";
import api from "@/api/axios";
import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import ErrorPg from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import ProductManageView from "@/components/product/ProductManageView";

export default function ManageProducts() {
  const [products, setProducts] = useState([] as Product[]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null as null | string);

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

    // 3. Cleanup function
    return () => controller.abort();
  }, []);

  async function deleteProduct(_id: string) {
    try {
      await api.delete(`/products/${_id}`);
    } catch (e) {
      if (e instanceof AxiosError) {
        console.error(e);
      } else {
        console.error(e);
      }
    } finally {
      setIsLoading(false);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== product._id),
      );
    }
  }

  return (
    <div className="m-6 text-center">
      <table>
        <thead>
          <tr className="m-5 h-full rounded-md *:p-2 *:text-center *:font-semibold">
            <td className="w-2/12">Image</td>
            <td className="w-2/12">Name</td>
            <td className="w-1/12">Quantity</td>
            <td className="w-1/24">Price</td>
            <td>Description</td>
          </tr>
        </thead>
        <tbody>
          {products.map((product: Product) => (
            <ProductManageView
              key={product._id}
              product={product}
              onDelete={deleteProduct}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
