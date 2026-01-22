import type { Product } from "@/types/product";
import QuantityControl from "./QuantityControl";
import { Link } from "react-router";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="m-2 h-full rounded-md border border-solid border-gray-300 text-left shadow-gray-400 hover:shadow-md">
      <div className="flex h-full flex-col gap-20 p-3">
        <Link to={`/products/${product._id}`}>
          <img
            className="h-50 w-full object-contain object-center"
            src={product.images[0].display}
          />
          <p className="font-semibold">
            {product.name} | {product.quantity}g
          </p>
          <h3 className="text-xl font-bold">${product.price}</h3>
          <p className="text-sm">
            ${((product.price / product.quantity) * 100).toFixed(2)} / 100g
          </p>
        </Link>
        <QuantityControl product={product} />
      </div>
    </div>
  );
}
