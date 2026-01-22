import type { CartItem } from "@/types/order";

export default function OrderItem({ item }: { item: CartItem }) {
  return (
    <div
      key={item.product._id}
      className="grid grid-cols-5 items-center border-t p-1"
    >
      <img
        className="object-contain object-center"
        src={item.product.images[0].thumbnail}
      />
      <div className="col-span-2 flex flex-col">
        <span className="font-semibold text-gray-800">{item.product.name}</span>
        <span className="text-sm text-gray-500">1250g</span>
      </div>
      <p className="text-gray-500">x{item.quantity}</p>
      <p className="font-medium text-gray-900">
        ${(item.product.price * item.quantity).toFixed(2)}
      </p>
    </div>
  );
}
