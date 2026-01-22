import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";
import ErrorPg from "@/components/ui/Error";
import { AxiosError } from "axios";
import api from "@/api/axios";
import type { Product } from "@/types/product";
import { useParams } from "react-router";
import QuantityControl from "@/components/product/QuantityControl";
import Carousel from "@/components/ui/Carousel";

export default function ProductView() {
  const [product, setProduct] = useState(null as null | Product);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null as null | string);

  const { id } = useParams();

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
  if (product) {
    return (
      <>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2">
          <div className="row-span-2 flex flex-col p-3">
            <Carousel images={product.images} />
          </div>
          <div className="p-3">
            <h1 className="my-4">
              {product.name} | {product.quantity}g
            </h1>
            <h2 className="mb-4">${product.price}</h2>
            <p className="mb-4 text-sm text-gray-400">
              ${((product.price / product.quantity) * 100).toFixed(2)} / 100g
            </p>
            <QuantityControl
              className="sm:w-72 md:w-80 lg:w-96"
              product={product}
            />
            <div className="mr-20">
              <h1 className="mt-10 mb-4">Product Details</h1>
              <p className="text-lg whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }
}
