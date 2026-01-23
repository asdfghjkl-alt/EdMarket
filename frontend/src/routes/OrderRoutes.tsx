import { Route, Routes } from "react-router-dom";
import UserOrders from "@/pages/order/UserOrders";
import AdminRestrict from "@/components/auth/AdminRestrict";
import ManageOrders from "@/pages/order/ManageOrders";

export default function OrderRoutes() {
  return (
    <Routes>
      <Route index element={<UserOrders />} />
      <Route
        path="manage"
        element={<AdminRestrict element={<ManageOrders />} />}
      />
    </Routes>
  );
}
