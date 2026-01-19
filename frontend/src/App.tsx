import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/user/Login";
import MainLayout from "./MainLayout";
import Register from "./pages/user/Register";
import { AuthProvider } from "./contexts/UserContext";
import NotFound from "./pages/utils/NotFound";
import "./App.css";
import ProductView from "./pages/product/ProductView";
import ManageProducts from "./pages/product/admin/ManageProducts";
import AdminRestrict from "./pages/utils/AdminRestrict";
import AddProductForm from "./pages/product/admin/AddProductForm";

function App() {
  return (
    <>
      <BrowserRouter>
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
              </Route>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
