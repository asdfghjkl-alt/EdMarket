import { useEffect, useState, type ReactNode } from "react";
import { OrderContext } from "./OrderContext";
import type { CartItem } from "../types/order";
import type { Product } from "../types/product";

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState(() => {
    const cartString = localStorage.getItem("cart");
    return (cartString ? JSON.parse(cartString) : []) as CartItem[];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (product: Product) => {
    if (cart.some((item) => item.product._id === product._id)) {
      setCart((prevCart) =>
        prevCart.map((item) => {
          if (item.product._id === product._id) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        }),
      );
    } else {
      setCart((prevCart) => [...prevCart, { product, quantity: 1 }]);
    }
  };

  const removeOneItem = (product: Product) => {
    const foundItem = cart.find((item) => item.product._id === product._id);
    if (!foundItem) {
      return;
    }

    if (foundItem.quantity <= 1) {
      removeAllItem(product);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => {
          if (item.product._id === product._id) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        }),
      );
    }
  };

  const removeAllItem = (product: Product) => {
    setCart((prevCart) =>
      prevCart.filter((item: CartItem) => item.product._id !== product._id),
    );
  };

  const resetCart = () => {
    setCart([]);
  };

  return (
    <OrderContext.Provider
      value={{ cart, addItem, removeOneItem, removeAllItem, resetCart }}
    >
      {children}
    </OrderContext.Provider>
  );
};
