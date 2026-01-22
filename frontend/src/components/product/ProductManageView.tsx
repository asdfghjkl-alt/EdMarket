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
    <tr className="m-5 h-full border-collapse rounded-md p-3 text-left shadow-gray-400 *:border-t-2 *:p-2 hover:shadow-md">
      <td>
        <img
          className="h-30 object-contain object-center"
          src={product.images[0].url}
        />
      </td>
      <td>{product.name}</td>
      <td>{product.quantity}g</td>
      <td>${product.price}</td>
      <td className="whitespace-pre-wrap">{product.description}</td>
      <td>
        <Link className="edit-btn" to={`/products/edit/${product._id}`}>
          Edit
        </Link>
      </td>
      <td>
        <form
          action={() => {
            setDisableDelete(true);
            deleteProduct(product._id);
          }}
        >
          <button
            disabled={disableDelete}
            className="delete-btn disabled:cursor-not-allowed disabled:opacity-30"
          >
            Delete
          </button>
        </form>
      </td>
    </tr>
  );
}
