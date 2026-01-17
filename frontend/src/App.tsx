import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Different from "./components/Different";
import Login from "./components/User/Login";
import MainLayout from "./MainLayout";
import Register from "./components/User/Register";
import { AuthProvider } from "./contexts/UserContext";
import NotFound from "./components/NotFound";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="auth">
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>
              <Route path="/" element={<Home />} />
              <Route path="/different" element={<Different />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
