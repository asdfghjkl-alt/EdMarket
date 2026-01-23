import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";
import api from "@/api/axios";
import { AxiosError } from "axios";
import type { OrderType } from "@/types/order";
import OrderDetails from "@/components/order/OrderDetails";

export default function ManageOrders() {
  const [orders, setOrders] = useState([] as OrderType[]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null as null | string);

  useEffect(() => {
    const controller = new AbortController();

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get("/orders/all");
        setOrders(data.body.orders);
      } catch (err) {
        if (err instanceof AxiosError && err.name !== "AbortError") {
          setError(err.response?.data.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();

    return () => controller.abort();
  }, []);

  const markAsDelivered = async (orderId: string) => {
    try {
      await api.put(`/orders/${orderId}/delivered`);
      const updatedOrders = orders.map((order: OrderType) => {
        if (order._id === orderId) {
          return { ...order, completed: true, completionDate: new Date() };
        }
        return order;
      });
      setOrders(updatedOrders);
    } catch (err) {
      if (err instanceof AxiosError && err.name !== "AbortError") {
        setError(err.response?.data.message || err.response?.data);
      }
    }
  };

  const markAsUndelivered = async (orderId: string) => {
    try {
      await api.put(`/orders/${orderId}/undelivered`);
      const updatedOrders = orders.map((order: OrderType) => {
        if (order._id === orderId) {
          return { ...order, completed: false };
        }
        return order;
      });
      setOrders(updatedOrders);
    } catch (err) {
      if (err instanceof AxiosError && err.name !== "AbortError") {
        setError(err.response?.data.message || err.response?.data);
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return orders.length === 0 && !error ? (
    <div className="flex h-screen items-center justify-center">
      <p className="text-center text-xl font-bold">No orders found</p>
    </div>
  ) : (
    <>
      {error && (
        <p className="text-center text-xl font-bold text-red-500">{error}</p>
      )}
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
        {orders.map((order: OrderType) => (
          <OrderDetails
            isManaging={true}
            order={order}
            key={order._id}
            markAsDelivered={markAsDelivered}
            markAsUndelivered={markAsUndelivered}
          />
        ))}
      </div>
    </>
  );
}
