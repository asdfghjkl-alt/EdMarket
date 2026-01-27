import { useState } from "react";
import api from "@/api/axios";
import ProductCartView from "@/components/product/ProductCartView";
import { useOrder } from "@/contexts/OrderContext";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";

export default function Cart() {
  const { cart } = useOrder();
  const [error, setError] = useState("");
  const { resetCart } = useOrder();

  const [isSubmittingCart, setIsSubmittingCart] = useState(false);

  const navigate = useNavigate();

  const submitOrder = async () => {
    setIsSubmittingCart(true);

    try {
      setError("");
      // Only sends product ids with the cart
      const cartToSend = cart.map(({ product, quantity }) => {
        return { product: product._id, quantity };
      });

      await api.post("/orders", { cart: cartToSend });
      resetCart();
      navigate("/orders");
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e.response?.data.message);
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setIsSubmittingCart(false);
    }
  };

  return (
    <div className="m-6 text-center">
      <div className="flex flex-col gap-4">
        {/* Desktop Header */}
        <div className="hidden rounded-md bg-gray-100 p-4 font-bold text-gray-700 md:grid md:grid-cols-12 md:gap-4 md:text-center">
          <div className="col-span-3">Image</div>
          <div className="col-span-3">Name</div>
          <div className="col-span-2">Stock</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Units Purchased</div>
        </div>
        <div className="flex flex-col gap-4">
          {cart.map((cartItem) => (
            <ProductCartView
              key={cartItem.product._id}
              product={cartItem.product}
            />
          ))}
        </div>
      </div>
      {cart.length === 0 ? (
        <div className="my-5 rounded-xl border-2 border-solid border-gray-500 p-5">
          <p className="text-3xl font-bold">Cart is empty!</p>
          <p>Please order at least 1 item to order.</p>
        </div>
      ) : (
        <div>
          <p className="my-3">
            Total Cost: $
            {cart
              .reduce(
                (acc, item) => acc + item.quantity * item.product.price,
                0,
              )
              .toFixed(2)}
          </p>
        </div>
      )}
      <button
        disabled={cart.length === 0 || isSubmittingCart}
        onClick={submitOrder}
        className="btn btn-submit w-full"
      >
        {isSubmittingCart ? "Processing order..." : "Proceed to Order"}
      </button>
      {error && <p className="text-rose-400">{error}</p>}
    </div>
  );
}
