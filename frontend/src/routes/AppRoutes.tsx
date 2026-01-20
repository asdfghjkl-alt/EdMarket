import { Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import MainLayout from "@/layouts/MainLayout";
import NotFound from "@/pages/NotFound";
import UserRestrict from "@/components/auth/UserRestrict";
import UserOrders from "@/pages/order/UserOrders";
import AuthRoutes from "@/routes/AuthRoutes";
import ProductRoutes from "@/routes/ProductRoutes";
import Cart from "@/pages/Cart";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="auth/*" element={<AuthRoutes />} />
        <Route path="products/*" element={<ProductRoutes />} />
        <Route path="cart" element={<UserRestrict element={<Cart />} />} />
        <Route
          path="orders"
          element={<UserRestrict element={<UserOrders />} />}
        />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
