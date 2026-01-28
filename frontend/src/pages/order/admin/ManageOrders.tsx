import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";
import api from "@/api/axios";
import { AxiosError } from "axios";
import type { OrderType } from "@/types/order";
import OrderDetails from "@/components/order/OrderDetails";

export default function ManageOrders() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // Attempts to get all orders
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

  /**
   * Function to mark an order as delivered
   * @param orderId id of order
   */
  const markAsDelivered = async (orderId: string) => {
    try {
      // Updates the order to be delivered
      await api.put(`/orders/${orderId}/delivered`);
      // Locally updates the order
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
      // Attempts to mark order as undelivered
      await api.put(`/orders/${orderId}/undelivered`);
      // Locally updates the order
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
      <h1 className="m-5 text-center text-4xl">Manage Orders</h1>
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
