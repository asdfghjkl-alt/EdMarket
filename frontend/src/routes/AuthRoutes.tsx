import { Route, Routes } from "react-router-dom";
import Login from "@/pages/user/Login";
import Register from "@/pages/user/Register";
import NotFound from "@/pages/NotFound";
import AdminRestrict from "@/components/auth/AdminRestrict";
import ManageUsers from "@/pages/user/admin/ManageUsers";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route index element={<NotFound />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route
        path="manage"
        element={<AdminRestrict element={<ManageUsers />} />}
      />
    </Routes>
  );
}
