import type { OrderType } from "../../types/order";

export default function Order({ order }: { order: OrderType }) {
  return (
    <div className="rounded-xl border border-solid border-gray-400 p-3 text-center">
      <h1 className="text-2xl font-bold">Order Details</h1>
      {order.cart.map((item) => (
        <div className="grid grid-cols-4 items-center border-t-2">
          <img src={item.product.image} />
          <p className="col-span-2">
            {item.product.name} | {item.product.quantity}g
          </p>
          <p>x{item.quantity}</p>
        </div>
      ))}
    </div>
  );
}
