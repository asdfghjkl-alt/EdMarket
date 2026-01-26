import { useEffect, useState } from "react";
import api from "@/api/axios";
import { AxiosError } from "axios";
import Loading from "@/components/ui/Loading";
import ErrorPg from "@/components/ui/ErrorPg";
import type { Product } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";
import { useSearchParams } from "react-router-dom";

export default function ProductsView() {
  const [products, setProducts] = useState([] as Product[]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null as null | string);

  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get("/products", {
          params: { category },
        });
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
  }, [category]);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorPg error={error} />;
  }

  return products.length === 0 ? (
    <div className="flex h-screen items-center justify-center">
      <p className="text-center text-xl font-bold">No products found</p>
    </div>
  ) : (
    <div className="m-6 text-center">
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3 lg:grid-cols-5">
        {products.map((product: Product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
