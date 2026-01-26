import type { Product } from "@/types/product";
import QuantityControl from "./QuantityControl";

export default function ProductCartView({ product }: { product: Product }) {
  const displayUnit =
    product.unit !== "each" ? product.unit : ` ${product.unit}`;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md md:grid md:grid-cols-12 md:items-center md:gap-4 md:text-center">
      <div className="flex justify-center md:col-span-3">
        <img
          className="h-24 w-24 rounded-md object-cover"
          src={product.images[0].url}
          alt={product.name}
        />
      </div>

      <div className="flex flex-col md:col-span-3">
        <span className="font-bold md:hidden">Name:</span>
        <span>{product.name}</span>
      </div>

      <div className="flex w-full justify-between px-8 md:contents md:px-0">
        <div className="flex flex-col md:col-span-2">
          <span className="font-bold md:hidden">Stock:</span>
          <span>
            {product.quantity}
            {displayUnit}
          </span>
        </div>

        <div className="flex flex-col md:col-span-2">
          <span className="font-bold md:hidden">Price:</span>
          <span>${product.price.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex flex-col items-center md:col-span-2">
        <span className="mb-2 font-bold md:hidden">Units Purchased:</span>
        <QuantityControl product={product} />
      </div>
    </div>
  );
}
