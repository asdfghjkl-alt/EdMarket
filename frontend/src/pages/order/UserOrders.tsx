import { useEffect, useState } from "react";
import Loading from "../../components/utils/Loading";
import ErrorPg from "../../components/utils/Error";
import api from "../../api/axios";
import { AxiosError } from "axios";
import type { OrderType } from "../../types/order";
import Order from "../../components/order/Order";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null as null | string);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get("/orders");
        setOrders(data.body.orders);
      } catch (err) {
        if (err instanceof AxiosError && err.name !== "AbortError") {
          setError(err.response?.data.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    // 3. Cleanup function
    return () => controller.abort();
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorPg error={error} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order: OrderType) => (
        <Order order={order} key={order._id} />
      ))}
    </div>
  );
}
