import type { Product } from "@/types/product";
import { useState } from "react";

export default function ProductManageView({
  product,
  onDelete,
}: {
  product: Product;
  onDelete: Function;
}) {
  const [disableDelete, setDisableDelete] = useState(false);

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
        <a className="edit-btn" href={`/products/edit/${product._id}`}>
          Edit
        </a>
      </td>
      <td>
        <form
          action={() => {
            setDisableDelete(true);
            onDelete(product._id);
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
