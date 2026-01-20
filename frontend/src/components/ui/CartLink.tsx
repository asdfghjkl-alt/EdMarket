import { NavLink } from "react-router";
import { linkBaseClass } from "./Navbar";
import CartImg from "@/assets/cart.png";
import { useOrder } from "@/contexts/OrderContext";

export default function CartLink() {
  const { cart } = useOrder();

  return (
    <NavLink
      to="/cart"
      className={({ isActive }) =>
        `${linkBaseClass} flex items-center border-2 border-white/30 shadow-lg shadow-black/50 ${
          isActive ? "bg-sky-500" : "bg-sky-700"
        }`
      }
    >
      <img src={CartImg} /> <p>Cart</p>
      {cart.length !== 0 && (
        <div className="ml-1 flex items-center rounded-full bg-red-500 px-2">
          <p>{cart.reduce((acc, item) => acc + item.quantity, 0)}</p>
        </div>
      )}
    </NavLink>
  );
}
