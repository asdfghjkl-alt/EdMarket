import type { Product } from "@/types/product";
import QuantityControl from "./QuantityControl";

export default function ProductCartView({ product }: { product: Product }) {
  return (
    <tr className="m-5 h-full border-collapse rounded-md p-3 text-left shadow-gray-400 *:border-t-2 *:text-center hover:shadow-md">
      <td>
        <img
          className="h-30 w-xl object-contain object-center"
          src={product.image}
        />
      </td>
      <td>{product.name}</td>
      <td>{product.quantity}g</td>
      <td>${product.price}</td>
      <td>
        <QuantityControl product={product} />
      </td>
    </tr>
  );
}
