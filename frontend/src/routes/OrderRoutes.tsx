import { Route, Routes } from "react-router-dom";
import UserOrders from "@/pages/order/UserOrders";
import AdminRestrict from "@/components/auth/AdminRestrict";
import ManageOrders from "@/pages/order/admin/ManageOrders";
import UserRestrict from "@/components/auth/UserRestrict";

export default function OrderRoutes() {
  return (
    <Routes>
      <Route index element={<UserRestrict element={<UserOrders />} />} />
      <Route
        path="manage"
        element={<AdminRestrict element={<ManageOrders />} />}
      />
    </Routes>
  );
}
