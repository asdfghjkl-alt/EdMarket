import { useOrder } from "@/contexts/OrderContext";
import type { Product } from "@/types/product";

export default function QuantityControl({ product }: { product: Product }) {
  const { removeOneItem, addItem, cart } = useOrder();
  return (
    <div className="mt-auto flex justify-center">
      <div className="flex w-fit items-center justify-center rounded-full border border-solid border-black p-1">
        <button
          onClick={() => removeOneItem(product)}
          className="mr-6 ml-1 h-8 w-8 rounded-full border bg-rose-600 text-rose-100"
        >
          -
        </button>
        <p className="text-lg">
          {cart.find((item) => item.product._id === product._id)?.quantity}
        </p>
        <button
          onClick={() => addItem(product)}
          className="mr-1 ml-6 h-8 w-8 rounded-full border bg-emerald-600 text-emerald-100"
        >
          +
        </button>
      </div>
    </div>
  );
}
