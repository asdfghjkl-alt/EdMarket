import { Link } from "react-router";
import Github from "@/assets/Github.png";
import LinkedIn from "@/assets/LinkedIn.png";
import EdMarket from "@/assets/EdMarket.png";

export default function Home() {
  return (
    <div className="m-5 flex h-screen flex-col items-center justify-center text-center">
      <img src={EdMarket} alt="Logo" className="h-50 w-50" />
      <h1 className="text-4xl">Welcome to EdMarket!</h1>
      <p className="text-xl">Your one-stop shop for all your grocery needs.</p>
      <p className="mx-30 mt-4">
        A full-stack e-commerce application built with MERN stack (MongoDB,
        Express, React, Node.js) by Edward Liu.
      </p>
      <p className="mx-30 mt-4">
        The project constructs a full shopping website experience featuring
        secure user authentication, an admin dashboard for product, category and
        order management, dynamic cart display, and order processing.
      </p>
      <a
        href="https://www.linkedin.com/in/edward-liu-50a205267"
        className="btn mt-4 flex items-center"
      >
        <img src={LinkedIn} alt="Github" className="h-10 w-12" />
        <p>View Owner's LinkedIn</p>
      </a>
      <a
        href="https://github.com/asdfghjkl-alt/EdMarket"
        className="btn mt-4 flex items-center"
      >
        <img src={Github} alt="Github" className="h-10 w-10" />
        <p>View on GitHub</p>
      </a>
      <Link
        to="/products"
        className="btn mt-4 flex items-center bg-emerald-600 text-emerald-100"
      >
        <p>Browse Products</p>
      </Link>
    </div>
  );
}
