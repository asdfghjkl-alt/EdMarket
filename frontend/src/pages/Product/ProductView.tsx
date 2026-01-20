import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";
import ErrorPg from "@/components/ui/Error";
import { AxiosError } from "axios";
import api from "@/api/axios";
import type { Product } from "@/types/product";
import { useParams } from "react-router";

export default function ProductView() {
  const [product, setProduct] = useState(null as null | Product);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null as null | string);

  const { id } = useParams();

  useEffect(() => {
    async function fetchProduct() {}
    fetchProduct();
  }, []);
  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.body.product);
      } catch (err) {
        if (err instanceof AxiosError && err.name !== "AbortError") {
          setError(err.response?.data.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorPg error={error} />;
  }

  return (
    <div>
      <h1>{product?.name}</h1>
    </div>
  );
}
