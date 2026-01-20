import { useOrder } from "@/contexts/OrderContext";
import type { Product } from "@/types/product";
import QuantityControl from "./QuantityControl";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, cart } = useOrder();
  return (
    <div className="m-2 h-full rounded-md border border-solid border-gray-300 text-left shadow-gray-400 hover:shadow-md">
      <div className="flex h-full flex-col gap-20 p-3">
        <a href={`/products/${product._id}`}>
          <img
            className="h-50 w-full object-contain object-center"
            src={product.image}
          />
          <p className="font-semibold">
            {product.name} | {product.quantity}g
          </p>
          <h3 className="text-xl font-bold">${product.price}</h3>
          <p className="text-sm">
            ${((product.price / product.quantity) * 100).toFixed(2)} / 100g
          </p>
        </a>
        {cart.some((item) => item.product._id === product._id) ? (
          <QuantityControl product={product} />
        ) : (
          <button
            onClick={() => addItem(product)}
            className="mt-auto w-full rounded-full border bg-red-500 p-2 text-red-100 hover:bg-red-600"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
