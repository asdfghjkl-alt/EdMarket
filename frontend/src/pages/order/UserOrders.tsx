import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";
import ErrorPg from "@/components/ui/Error";
import api from "@/api/axios";
import { AxiosError } from "axios";
import type { OrderType } from "@/types/order";
import OrderDetails from "@/components/order/OrderDetails";

export default function UserOrders() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get("/orders");
        setOrders(data.body.orders);
      } catch (err) {
        if (err instanceof AxiosError && err.name !== "AbortError") {
          setError(err.response?.data.message || err.response?.data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorPg error={error} />;
  }

  return orders.length === 0 ? (
    <div className="flex h-screen items-center justify-center">
      <p className="text-center text-xl font-bold">No orders found</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
      {orders.map((order: OrderType) => (
        <OrderDetails order={order} key={order._id} />
      ))}
    </div>
  );
}
