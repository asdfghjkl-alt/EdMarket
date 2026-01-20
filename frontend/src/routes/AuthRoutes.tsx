import { Route, Routes } from "react-router-dom";
import Login from "@/pages/user/Login";
import Register from "@/pages/user/Register";
import NotFound from "@/pages/NotFound";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route index element={<NotFound />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Routes>
  );
}
