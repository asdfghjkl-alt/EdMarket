import type { OrderType } from "@/types/order";
import OrderItem from "./OrderItem";

export default function OrderDetails({ order }: { order: OrderType }) {
  return (
    <div className="rounded-xl border border-solid border-gray-400 p-3 text-center">
      <h1 className="text-2xl font-bold">Order Details</h1>
      {order.cart.map((item) => (
        <OrderItem key={item.product._id} item={item} />
      ))}
      <p className="text-bold m-2 border-t-4 text-right text-2xl">
        Total Cost: $
        {order.cart
          .reduce((acc, item) => acc + item.product.price * item.quantity, 0)
          .toFixed(2)}
      </p>
      <p
        className={`text-right ${order.completed ? "text-green-500" : "text-red-400"}`}
      >
        {order.completed ? "Delivered" : "Undelivered"}
      </p>
    </div>
  );
}
