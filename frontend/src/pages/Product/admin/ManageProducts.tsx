import { AxiosError } from "axios";
import api from "../../../api/axios";
import { useEffect, useState } from "react";
import type { Product } from "../../../types/product";
import ProductCard from "../../../components/product/ProductCard";
import ErrorPg from "../../../components/utils/Error";
import Loading from "../../../components/utils/Loading";

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

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorPg error={error} />;
  }

  return (
    <div className="m-6 text-center">
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3 lg:grid-cols-5">
        {products.map((product: Product) => (
          <ProductCard product={product} />
        ))}
      </div>
    </div>
  );
}
