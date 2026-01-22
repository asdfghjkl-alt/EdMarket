import { useOrder } from "@/contexts/OrderContext";
import type { Product } from "@/types/product";

export default function QuantityControl({
  product,
  className = "w-full",
}: {
  product: Product;
  className?: string;
}) {
  const { removeOneItem, addItem, cart } = useOrder();

  return cart.some((item) => item.product._id === product._id) ? (
    <div className={`mt-auto flex justify-center ${className}`}>
      <div className="flex w-full items-center justify-between rounded-full border border-solid border-black p-1">
        <button
          onClick={() => removeOneItem(product)}
          className="left-0 h-8 w-8 rounded-full border bg-rose-600 text-rose-100"
        >
          -
        </button>
        <p className="text-lg">
          {cart.find((item) => item.product._id === product._id)?.quantity}
        </p>
        <button
          onClick={() => addItem(product)}
          className="right-0 h-8 w-8 rounded-full border bg-emerald-600 text-emerald-100"
        >
          +
        </button>
      </div>
    </div>
  ) : (
    <button
      onClick={() => addItem(product)}
      className={`mt-auto rounded-full border bg-red-500 p-2 text-red-100 hover:bg-red-600 ${className}`}
    >
      Add to Cart
    </button>
  );
}
