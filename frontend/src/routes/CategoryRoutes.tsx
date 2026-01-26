import { Route, Routes } from "react-router-dom";
import ManageCategories from "@/pages/category/admin/ManageCategories";
import AdminRestrict from "@/components/auth/AdminRestrict";
import EditCategory from "@/pages/category/admin/EditCategory";

export default function CategoryRoutes() {
  return (
    <Routes>
      <Route
        path="manage"
        element={<AdminRestrict element={<ManageCategories />} />}
      />
      <Route
        path="edit/:id"
        element={<AdminRestrict element={<EditCategory />} />}
      />
    </Routes>
  );
}
