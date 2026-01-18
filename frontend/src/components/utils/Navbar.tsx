import { useState } from "react";
import { NavLink } from "react-router";
import { useAuth } from "../../contexts/UserContext";
import CartImg from "../../assets/cart.png";
import Dropdown from "./Dropdown";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
];
const unauthLinks = [{ href: "/auth/login", label: "Login" }];
const authLinks = [{ href: "/products", label: "Products" }];
const adminLinks = [
  { href: "/products/add", label: "Add Products" },
  { href: "/products/manage", label: "Manage Products" },
];

const linkBaseClass =
  "tracking-wide px-5 py-2 rounded-xl text-teal-50 hover:bg-sky-600 transition-colors";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((open) => !open);
  const closeMenu = () => setIsMenuOpen(false);

  const { user, logout } = useAuth();

  return (
    <header
      className="sticky top-0 z-50 bg-sky-700 font-normal text-teal-50 shadow-lg shadow-black/30"
      role="banner"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-2">
        <a
          href="/"
          className="flex items-center no-underline"
          onClick={closeMenu}
        >
          <div className="ps-1 leading-snug">
            <div className="text-xl font-extrabold tracking-wide">EdMarket</div>
            <div className="text-xs font-light tracking-[0.3em] text-teal-100 uppercase">
              Since 2025
            </div>
          </div>
        </a>

        <nav className="hidden items-center gap-3 md:flex" aria-label="Primary">
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
          {user ? (
            <>
              {authLinks.map((link) => (
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
              <button
                className={`${linkBaseClass} bg-sky-700`}
                onClick={logout}
              >
                Logout
              </button>
              <p className="text-sm text-gray-200">Welcome {user.username}</p>
              {user.isAdmin && (
                <Dropdown title="Admin Options" links={adminLinks} />
              )}
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `${linkBaseClass} flex items-center border-2 border-white/30 shadow-lg shadow-black/50 ${
                    isActive ? "bg-sky-500" : "bg-sky-700"
                  }`
                }
              >
                <img src={CartImg} /> <p>Cart</p>
              </NavLink>
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

        <div className="flex items-center gap-2 md:hidden">
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

      {isMenuOpen && (
        <div className="md:hidden">
          <nav
            className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-teal-100 bg-sky-700 p-5 text-base font-semibold tracking-wide"
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
            {user ? (
              <>
                {authLinks.map((link) => (
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
                <button
                  className={`${linkBaseClass} bg-sky-700 text-left`}
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                >
                  Logout
                </button>
                <p className="text-sm text-gray-200">Welcome {user.username}</p>
                {user.isAdmin && (
                  <Dropdown title="Admin Options" links={adminLinks} />
                )}
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `${linkBaseClass} flex items-center border-2 border-white/30 shadow-lg shadow-black/50 ${
                      isActive ? "bg-sky-500" : "bg-sky-700"
                    }`
                  }
                  onClick={closeMenu}
                >
                  <img src={CartImg} /> <p>Cart</p>
                </NavLink>
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
      )}
    </header>
  );
}
