import type { Product } from "../../types/product";

export default function ProductManageView({
  product,
  onDelete,
}: {
  product: Product;
  onDelete: Function;
}) {
  return (
    <tr className="m-5 h-full border-collapse rounded-md p-3 text-left shadow-gray-400 *:border-t-2 *:p-2 hover:shadow-md">
      <td>
        <img
          className="m-5 h-30 w-2xl object-contain object-center"
          src={product.image}
        />
      </td>
      <td>{product.name}</td>
      <td>{product.quantity}g</td>
      <td>${product.price}</td>
      <td>{product.description}</td>
      <td>
        <a className="edit-btn" href={`/products/edit/${product._id}`}>
          Edit
        </a>
      </td>
      <td>
        <form action={() => onDelete(product._id)}>
          <button className="delete-btn">Delete</button>
        </form>
      </td>
    </tr>
  );
}
