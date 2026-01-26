import { Route, Routes } from "react-router-dom";
import ProductDetails from "@/pages/product/ProductDetails";
import ManageProducts from "@/pages/product/admin/ManageProducts";
import AdminRestrict from "@/components/auth/AdminRestrict";
import AddProductForm from "@/pages/product/admin/AddProductForm";
import EditProductForm from "@/pages/product/admin/EditProductForm";
import ProductsView from "@/pages/product/ProductsView";

export default function ProductRoutes() {
  return (
    <Routes>
      <Route index element={<ProductsView />} />
      <Route
        path="add"
        element={<AdminRestrict element={<AddProductForm />} />}
      />
      <Route
        path="manage"
        element={<AdminRestrict element={<ManageProducts />} />}
      />
      <Route path=":id" element={<ProductDetails />} />
      <Route
        path="edit/:id"
        element={<AdminRestrict element={<EditProductForm />} />}
      />
    </Routes>
  );
}
