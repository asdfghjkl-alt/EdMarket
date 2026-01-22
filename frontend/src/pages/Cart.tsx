import { useRef, useState } from "react";
import api from "@/api/axios";
import ProductCartView from "@/components/product/ProductCartView";
import { useOrder } from "@/contexts/OrderContext";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";

export default function Cart() {
  const { cart } = useOrder();
  const [error, setError] = useState("");
  const { resetCart } = useOrder();

  const isSubmittingCart = useRef(false);

  const navigate = useNavigate();

  const submitOrder = async () => {
    isSubmittingCart.current = true;

    try {
      setError("");
      const cartToSend = cart.map(({ product, quantity }) => {
        return { product: product._id, quantity };
      });

      await api.post("/orders", { cart: cartToSend });
      resetCart();
      navigate("/orders");
    } catch (e) {
      isSubmittingCart.current = false;
      if (e instanceof AxiosError) {
        setError(e.response?.data.message);
      } else {
        setError("Unexpected error occurred");
      }
    }
  };

  return (
    <div className="m-6 text-center">
      <table>
        <thead>
          <tr className="m-5 h-full rounded-md *:p-2 *:text-center *:font-semibold">
            <td className="w-2/12">Image</td>
            <td className="w-2/12">Name</td>
            <td className="w-1/12">Quantity</td>
            <td className="w-1/24">Price</td>
            <td className="w-1/12">Units Purchased</td>
          </tr>
        </thead>
        <tbody>
          {cart.map((cartItem) => (
            <ProductCartView
              key={cartItem.product._id}
              product={cartItem.product}
            />
          ))}
        </tbody>
      </table>
      {cart.length === 0 ? (
        <div className="my-5 rounded-xl border-2 border-solid border-gray-500 p-5">
          <p className="text-3xl font-bold">Cart is empty!</p>
          <p>Please order at least 1 item to order.</p>
        </div>
      ) : (
        <div>
          <p>
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
        disabled={cart.length === 0 || isSubmittingCart.current}
        onClick={submitOrder}
        className="btn-submit cursor-pointer hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Proceed to Order
      </button>
      {error && <p className="text-rose-400">{error}</p>}
    </div>
  );
}
