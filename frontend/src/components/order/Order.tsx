import type { OrderType } from "../../types/order";

export default function Order({ order }: { order: OrderType }) {
  return (
    <div className="rounded-xl border border-solid border-gray-400 p-3 text-center">
      <h1 className="text-2xl font-bold">Order Details</h1>
      {order.cart.map((item) => (
        <div className="grid grid-cols-5 items-center border-t">
          <img src={item.product.image} />
          <div className="col-span-2 flex flex-col">
            <span className="font-semibold text-gray-800">
              {item.product.name}
            </span>
            <span className="text-sm text-gray-500">1250g</span>
          </div>
          <p className="text-gray-500">x{item.quantity}</p>
          <p className="font-medium text-gray-900">
            ${item.product.price * item.quantity}
          </p>
        </div>
      ))}
      <p className="text-bold m-2 border-t-4 text-right text-2xl">
        Total Cost: $
        {order.cart.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0,
        )}
      </p>
    </div>
  );
}
