import { useOrder } from "@/contexts/OrderContext";
import type { Product } from "@/types/product";

export default function QuantityControl({
  product,
  className,
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
          className="btn left-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border bg-rose-600 text-rose-100"
        >
          -
        </button>
        <p className="text-lg">
          {cart.find((item) => item.product._id === product._id)?.quantity}
        </p>
        <button
          onClick={() => addItem(product)}
          className="btn right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border bg-emerald-600 text-emerald-100"
        >
          +
        </button>
      </div>
    </div>
  ) : (
    <button
      onClick={() => addItem(product)}
      className={`btn mt-auto rounded-full bg-red-500 text-red-100 transition-opacity ${className}`}
    >
      Add to Cart
    </button>
  );
}
