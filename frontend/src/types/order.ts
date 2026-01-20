import type { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderType {
  _id: string;
  cart: CartItem[];
}

export interface OrderContextType {
  cart: CartItem[];
  addItem: (product: Product) => void;
  removeOneItem: (product: Product) => void;
  removeAllItem: (product: Product) => void;
  resetCart: () => void;
}
