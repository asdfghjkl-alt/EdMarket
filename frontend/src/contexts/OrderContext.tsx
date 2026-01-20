import { createContext, useContext } from "react";
import type { OrderContextType } from "../types/order";

export const OrderContext = createContext<OrderContextType | undefined>(
  undefined,
);

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
