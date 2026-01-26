import { Route, Routes } from "react-router-dom";
import ManageCategories from "@/pages/category/admin/ManageCategories";
import AdminRestrict from "@/components/auth/AdminRestrict";

export default function CategoryRoutes() {
  return (
    <Routes>
      <Route
        path="manage"
        element={<AdminRestrict element={<ManageCategories />} />}
      />
    </Routes>
  );
}
