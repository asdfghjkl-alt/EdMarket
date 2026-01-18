import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/User/Login";
import MainLayout from "./MainLayout";
import Register from "./pages/User/Register";
import { AuthProvider } from "./contexts/UserContext";
import NotFound from "./pages/NotFound";
import "./App.css";
import AddProduct from "./pages/Product/admin/AddProduct";
import ProductView from "./pages/Product/ProductView";

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
                <Route path="add" element={<AddProduct />} />
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
