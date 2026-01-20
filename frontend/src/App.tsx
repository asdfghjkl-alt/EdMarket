import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/user/Login";
import MainLayout from "./MainLayout";
import Register from "./pages/user/Register";
import { AuthProvider } from "./contexts/UserContext";
import NotFound from "./pages/utils/NotFound";
import ProductView from "./pages/product/ProductView";
import ManageProducts from "./pages/product/admin/ManageProducts";
import AdminRestrict from "./pages/utils/AdminRestrict";
import AddProductForm from "./pages/product/admin/AddProductForm";
import EditProductForm from "./pages/product/admin/EditProductForm";
import { OrderProvider } from "./contexts/OrderProvider";
import Cart from "./pages/Cart";
import UserRestrict from "./pages/utils/UserRestrict";
import "./App.css";
import UserOrders from "./pages/order/UserOrders";

function App() {
  return (
    <>
      <BrowserRouter>
        <OrderProvider>
          <AuthProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="auth">
                  <Route index element={<NotFound />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                </Route>
                <Route path="products">
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
                </Route>
                <Route
                  path="cart"
                  element={<UserRestrict element={<Cart />} />}
                />
                <Route
                  path="orders"
                  element={<UserRestrict element={<UserOrders />} />}
                />
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthProvider>
        </OrderProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
