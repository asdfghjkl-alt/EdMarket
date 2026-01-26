import { Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import MainLayout from "@/layouts/MainLayout";
import NotFound from "@/pages/NotFound";
import UserRestrict from "@/components/auth/UserRestrict";
import AuthRoutes from "@/routes/AuthRoutes";
import ProductRoutes from "@/routes/ProductRoutes";
import Cart from "@/pages/Cart";
import OrderRoutes from "./OrderRoutes";
import CategoryRoutes from "./CategoryRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="auth/*" element={<AuthRoutes />} />
        <Route path="categories/*" element={<CategoryRoutes />} />
        <Route path="products/*" element={<ProductRoutes />} />
        <Route path="orders/*" element={<OrderRoutes />} />
        <Route path="cart" element={<UserRestrict element={<Cart />} />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
