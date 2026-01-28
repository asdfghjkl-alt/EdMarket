import { Route, Routes } from "react-router-dom";
import ProductDetails from "@/pages/product/ProductDetails";
import ManageProducts from "@/pages/product/admin/ManageProducts";
import AddProductForm from "@/pages/product/admin/AddProductForm";
import EditProductForm from "@/pages/product/admin/EditProductForm";
import ProductsView from "@/pages/product/ProductsView";
import SellerRestrict from "@/components/auth/SellerRestrict";
import AdminSellerRestrict from "@/components/auth/AdminSellerRestrict";

export default function ProductRoutes() {
  return (
    <Routes>
      <Route index element={<ProductsView />} />
      <Route
        path="add"
        element={<SellerRestrict element={<AddProductForm />} />}
      />
      <Route
        path="manage"
        element={<AdminSellerRestrict element={<ManageProducts />} />}
      />
      <Route path=":id" element={<ProductDetails />} />
      <Route
        path="edit/:id"
        element={<SellerRestrict element={<EditProductForm />} />}
      />
    </Routes>
  );
}
