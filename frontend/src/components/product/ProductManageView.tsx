import api from "@/api/axios";
import type { Product } from "@/types/product";
import { AxiosError } from "axios";
import { useState } from "react";
import { Link } from "react-router";

export default function ProductManageView({
  product,
  setProducts,
  setError,
}: {
  product: Product;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const displayUnit =
    product.unit !== "each" ? product.unit : ` ${product.unit}`;
  const [disableDelete, setDisableDelete] = useState(false);

  async function deleteProduct(_id: string) {
    try {
      setError(null);
      await api.delete(`/products/${_id}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== _id),
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
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md md:grid md:grid-cols-12 md:items-center md:gap-4 md:text-center">
      <div className="flex justify-center md:col-span-2">
        <img
          className="h-24 w-24 rounded-md object-cover"
          src={product.images[0].url}
          alt={product.name}
        />
      </div>

      <div className="flex flex-col md:col-span-2">
        <span className="font-bold md:hidden">Name:</span>
        <span>{product.name}</span>
      </div>

      <div className="flex flex-col md:col-span-2">
        <span className="font-bold md:hidden">Quantity:</span>
        <span>
          {product.quantity}
          {displayUnit}
        </span>
      </div>

      <div className="flex flex-col md:col-span-1">
        <span className="font-bold md:hidden">Price:</span>
        <span>${product.price.toFixed(2)}</span>
      </div>

      <div className="flex flex-col md:col-span-1">
        <span className="font-bold md:hidden">Category:</span>
        <span>{product.category?.name || "No Category"}</span>
      </div>

      <div className="flex flex-col md:col-span-2">
        <span className="font-bold md:hidden">Description:</span>
        <span
          className="mx-auto max-w-xs truncate md:w-full"
          title={product.description}
        >
          {product.description}
        </span>
      </div>

      <div className="mt-4 flex justify-center gap-2 md:col-span-2 md:mt-0">
        <Link
          className="btn btn-edit px-4 py-2 text-sm"
          to={`/products/edit/${product._id}`}
        >
          Edit
        </Link>
        <form
          className="inline-block"
          action={() => {
            setDisableDelete(true);
            deleteProduct(product._id);
          }}
        >
          <button
            disabled={disableDelete}
            className="btn btn-delete px-4 py-2 text-sm"
          >
            {disableDelete ? "Deleting..." : "Delete"}
          </button>
        </form>
      </div>
    </div>
  );
}
