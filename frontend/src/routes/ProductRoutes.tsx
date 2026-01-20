import { Route, Routes } from "react-router-dom";
import ProductView from "@/pages/product/ProductView";
import ManageProducts from "@/pages/product/admin/ManageProducts";
import AdminRestrict from "@/components/auth/AdminRestrict";
import AddProductForm from "@/pages/product/admin/AddProductForm";
import EditProductForm from "@/pages/product/admin/EditProductForm";

export default function ProductRoutes() {
  return (
    <Routes>
      <Route
        path="add"
        element={<AdminRestrict element={<AddProductForm />} />}
      />
      <Route
        path="manage"
        element={<AdminRestrict element={<ManageProducts />} />}
      />
      <Route path=":id" element={<ProductView />} />
      <Route
        path="edit/:id"
        element={<AdminRestrict element={<EditProductForm />} />}
      />
    </Routes>
  );
}
