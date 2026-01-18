import { Outlet } from "react-router-dom";
import Navbar from "./components/utils/Navbar";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
