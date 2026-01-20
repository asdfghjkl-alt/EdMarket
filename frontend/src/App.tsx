import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/UserContext";
import { OrderProvider } from "@/contexts/OrderProvider";
import "./App.css";
import AppRoutes from "@/routes/AppRoutes";

function App() {
  return (
    <>
      <BrowserRouter>
        <OrderProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </OrderProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
