import type { OrderType } from "@/types/order";
import OrderItem from "./OrderItem";
import { useState } from "react";

export default function OrderDetails({
  order,
  isManaging = false,
  markAsDelivered,
  markAsUndelivered,
}: {
  order: OrderType;
  isManaging?: boolean;
  markAsDelivered?: (orderId: string) => void;
  markAsUndelivered?: (orderId: string) => void;
}) {
  const [isPerformingAction, setIsPerformingAction] = useState(false);

  return (
    <div className="flex h-full flex-col rounded-xl border border-solid border-gray-400 p-3 text-center">
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
        className={`text-right font-semibold ${order.completed ? "text-green-500" : "text-red-400"}`}
      >
        {order.completed ? (
          <p>
            Delivered{" "}
            <span className="text-black">
              on{" "}
              {new Date(order.completionDate as Date).toLocaleString(
                undefined,
                {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                },
              )}
            </span>
          </p>
        ) : (
          "Undelivered"
        )}
      </p>
      <p className="text-right">
        Ordered on{" "}
        {new Date(order.date).toLocaleString(undefined, {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })}
      </p>
      {isManaging && (
        <>
          <p className="text-right">Ordered by {order.user?.username}</p>
          {!order.completed ? (
            <button
              disabled={isPerformingAction}
              onClick={() => {
                setIsPerformingAction(true);
                markAsDelivered?.(order._id);
                setIsPerformingAction(false);
              }}
              className="mt-auto w-full rounded-lg border border-emerald-600 bg-emerald-600 p-2 text-emerald-100 transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-400"
            >
              Mark as Delivered
            </button>
          ) : (
            <button
              disabled={isPerformingAction}
              onClick={() => {
                setIsPerformingAction(true);
                markAsUndelivered?.(order._id);
                setIsPerformingAction(false);
              }}
              className="mt-auto w-full rounded-lg border border-rose-600 bg-rose-600 p-2 text-rose-100 transition-colors hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-rose-400"
            >
              Mark as Undelivered
            </button>
          )}
        </>
      )}
    </div>
  );
}
