import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useAuth } from "@/contexts/UserContext";
import Dropdown from "@/components/ui/Dropdown";
import CartLink from "@/components/ui/CartLink";
import EdMarket from "@/assets/EdMarket.png";
import type { CategoryType } from "@/types/category";
import api from "@/api/axios";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
];
const unauthLinks = [{ href: "/auth/login", label: "Login" }];
const authLinks = [{ href: "/orders", label: "My Orders" }];
const adminLinks = [
  { href: "/products/manage", label: "Manage Products" },
  { href: "/categories/manage", label: "Manage Categories" },
  { href: "/orders/manage", label: "Manage Orders" },
  { href: "/auth/manage", label: "Manage Users" },
];

export const linkBaseClass =
  "tracking-wide px-5 py-2 rounded-xl text-teal-50 hover:bg-sky-600 transition-colors";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([] as string[]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(
          data.body.categories.map((category: CategoryType) => category.name),
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
    return () => controller.abort();
  }, []);

  const toggleMenu = () => setIsMenuOpen((open) => !open);
  const closeMenu = () => setIsMenuOpen(false);

  const { user, logout } = useAuth();

  const userElements = [
    <button
      className="block w-full text-left text-sm font-bold text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
      onClick={logout}
    >
      Logout
    </button>,
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full bg-sky-700 font-normal text-teal-50 shadow-lg shadow-black/30"
      role="banner"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-2">
        <NavLink
          to="/"
          className="flex items-center no-underline"
          onClick={closeMenu}
        >
          <img src={EdMarket} alt="EdMarket" className="h-12 w-12" />
          <div className="ps-1 leading-snug">
            <div className="text-xl font-extrabold tracking-wide">EdMarket</div>
            <div className="text-xs font-light tracking-[0.3em] text-teal-100 uppercase">
              Since 2025
            </div>
          </div>
        </NavLink>

        <div className="flex items-center gap-3">
          <nav
            className="hidden items-center gap-3 lg:flex"
            aria-label="Primary"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `${linkBaseClass} ${isActive ? "bg-sky-500" : "bg-sky-700"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Dropdown
              title={"Product Categories"}
              links={categories.map((category) => ({
                href: `/products?category=${category}`,
                label: category,
              }))}
            />
            {user ? (
              <>
                <Dropdown
                  elements={userElements}
                  title={`Welcome ${user.username}`}
                  links={authLinks}
                />
                {user.role === "admin" && (
                  <Dropdown title="Admin Tools" links={adminLinks} />
                )}
              </>
            ) : (
              unauthLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `${linkBaseClass} ${isActive ? "bg-sky-500" : "bg-sky-700"}`
                  }
                >
                  {link.label}
                </NavLink>
              ))
            )}
          </nav>

          <CartLink onClick={closeMenu} />

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              className="flex h-10 w-11 flex-col items-center justify-center gap-1.5 rounded-md border border-teal-50/50 text-teal-50 transition hover:bg-sky-500"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <span className="sr-only">Menu</span>
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-50 w-96 transform bg-sky-800 shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-sky-600 p-4">
          <span className="text-xl font-bold text-white">Menu</span>
          <button
            onClick={closeMenu}
            className="rounded-md p-1 text-teal-100 hover:bg-sky-700 hover:text-white"
            aria-label="Close menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav
          className="flex flex-col gap-2 p-4 text-base font-semibold tracking-wide"
          aria-label="Mobile"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `${linkBaseClass} ${isActive ? "bg-sky-500" : "bg-sky-700"}`
              }
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}
          <Dropdown
            title={"Product Categories"}
            links={categories.map((category) => ({
              href: `/products?category=${category}`,
              label: category,
            }))}
            fullWidth
            onItemClick={closeMenu}
          />
          {user ? (
            <>
              <Dropdown
                elements={userElements}
                title={`Welcome ${user.username}`}
                links={authLinks}
                fullWidth
                onItemClick={closeMenu}
              />
              {user.role === "admin" && (
                <Dropdown
                  title="Admin Tools"
                  links={adminLinks}
                  fullWidth
                  onItemClick={closeMenu}
                />
              )}
            </>
          ) : (
            unauthLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `${linkBaseClass} ${isActive ? "bg-sky-500" : "bg-sky-700"}`
                }
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            ))
          )}
        </nav>
      </div>
    </header>
  );
}
