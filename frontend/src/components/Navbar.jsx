import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Menu,
  X,
  Sun,
  Moon,
  Heart,
  ShoppingCart,
  Package,
  LayoutDashboard,
  Boxes,
  ClipboardList,
  User,
  LogOut,
  ChevronDown,
  Store,
  Home,
  LogIn,
  UserPlus,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* =========================================================
     USER
  ========================================================= */

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  /* =========================================================
     THEME
  ========================================================= */

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      return savedTheme === "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* =========================================================
     USER SYNC
  ========================================================= */

  useEffect(() => {
    const updateUser = () => {
      try {
        const storedUser = localStorage.getItem("user");

        setUser(
          storedUser
            ? JSON.parse(storedUser)
            : null
        );
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  /* =========================================================
     CLOSE MOBILE MENU WHEN ROUTE CHANGES
  ========================================================= */

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setMobileMenuOpen(false);

    navigate("/login");

    window.location.reload();
  };

  /* =========================================================
     MOBILE
  ========================================================= */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  /* =========================================================
     ACTIVE ROUTE
  ========================================================= */

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  /* =========================================================
     NAV ITEM
  ========================================================= */

  const NavItem = ({
    to,
    icon: Icon,
    children,
    badge,
  }) => {
    const active = isActive(to);

    return (
      <Link
        to={to}
        onClick={closeMobileMenu}
        className={`
          group relative flex items-center gap-2
          rounded-xl px-3 py-2 text-sm font-semibold
          transition-all duration-200

          ${
            active
              ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
              : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
          }
        `}
      >
        <Icon
          size={17}
          className="transition-transform duration-200 group-hover:scale-110"
        />

        <span>{children}</span>

        {badge > 0 && (
          <span
            className="
              ml-1 flex min-w-5 items-center justify-center
              rounded-full bg-rose-500 px-1.5 py-0.5
              text-[10px] font-black leading-none text-white
            "
          >
            {badge > 99 ? "99+" : badge}
          </span>
        )}

        {/* Active indicator */}

        {active && (
          <span
            className="
              absolute bottom-0 left-1/2 h-0.5 w-5
              -translate-x-1/2 rounded-full
              bg-indigo-600 dark:bg-indigo-400
            "
          />
        )}
      </Link>
    );
  };

  /* =========================================================
     AVATAR
  ========================================================= */

  const avatarUrl =
    user?.avatar?.url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User"
    )}&background=6366f1&color=fff`;

  return (
    <header
      className="
        sticky top-0 z-50
        border-b border-slate-200/80
        bg-white/90 shadow-sm backdrop-blur-xl
        transition-colors duration-300
        dark:border-slate-800
        dark:bg-slate-950/90
      "
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =================================================
            MAIN BAR
        ================================================= */}

        <div className="flex h-16 items-center justify-between gap-4">

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="group flex shrink-0 items-center gap-3"
          >
            <div
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl
                bg-gradient-to-br from-indigo-600 to-violet-600
                text-white shadow-lg shadow-indigo-200
                transition-transform duration-300
                group-hover:scale-105
                dark:shadow-indigo-950
              "
            >
              <Store size={21} />
            </div>

            <div className="hidden sm:block">
              <p
                className="
                  text-lg font-black tracking-tight
                  text-slate-900 dark:text-white
                "
              >
                MERN
                <span className="text-indigo-600 dark:text-indigo-400">
                  Shop
                </span>
              </p>

              <p
                className="
                  -mt-1 text-[9px] font-bold uppercase
                  tracking-[0.18em] text-slate-400
                "
              >
                Shop smarter
              </p>
            </div>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <div className="hidden items-center gap-1 md:flex">

            <NavItem to="/" icon={Home}>
              Home
            </NavItem>

            {/* CUSTOMER */}

            {user?.role === "customer" && (
              <>
                <NavItem
                  to="/wishlist"
                  icon={Heart}
                  badge={wishlistCount}
                >
                  Wishlist
                </NavItem>

                <NavItem
                  to="/cart"
                  icon={ShoppingCart}
                  badge={cartCount}
                >
                  Cart
                </NavItem>

                <NavItem
                  to="/my-orders"
                  icon={Package}
                >
                  My Orders
                </NavItem>
              </>
            )}

            {/* VENDOR */}

            {user?.role === "vendor" && (
              <>
                <NavItem
                  to="/vendor/dashboard"
                  icon={LayoutDashboard}
                >
                  Dashboard
                </NavItem>

                <NavItem
                  to="/vendor/products"
                  icon={Boxes}
                >
                  Products
                </NavItem>

                <NavItem
                  to="/vendor/orders"
                  icon={ClipboardList}
                >
                  Orders
                </NavItem>
              </>
            )}
          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="flex items-center gap-2">

            {/* THEME TOGGLE */}

            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className="
                relative flex h-10 w-10 items-center
                justify-center overflow-hidden rounded-xl
                border border-slate-200
                bg-slate-50 text-slate-600
                transition-all
                hover:border-indigo-200
                hover:bg-indigo-50
                hover:text-indigo-600

                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-300
                dark:hover:border-indigo-800
                dark:hover:bg-slate-800
                dark:hover:text-indigo-400
              "
            >
              <Sun
                size={18}
                className={`
                  absolute transition-all duration-300
                  ${
                    darkMode
                      ? "rotate-90 scale-0 opacity-0"
                      : "rotate-0 scale-100 opacity-100"
                  }
                `}
              />

              <Moon
                size={18}
                className={`
                  absolute transition-all duration-300
                  ${
                    darkMode
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-90 scale-0 opacity-0"
                  }
                `}
              />
            </button>

            {/* =================================================
                DESKTOP USER
            ================================================= */}

            {user ? (
              <div className="group relative hidden md:block">

                <Link
                  to="/profile"
                  className="
                    flex items-center gap-2 rounded-xl
                    border border-slate-200
                    bg-white px-2 py-1.5
                    transition-all

                    hover:border-indigo-200
                    hover:bg-indigo-50

                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:hover:border-indigo-800
                    dark:hover:bg-slate-800
                  "
                >
                  <img
                    src={avatarUrl}
                    alt={user.name || "User"}
                    className="h-8 w-8 rounded-lg object-cover"
                  />

                  <div className="hidden lg:block">
                    <p
                      className="
                        max-w-24 truncate text-xs font-bold
                        text-slate-900 dark:text-white
                      "
                    >
                      {user.name}
                    </p>

                    <p className="text-[10px] capitalize text-slate-400">
                      {user.role}
                    </p>
                  </div>

                  <ChevronDown
                    size={15}
                    className="
                      text-slate-400
                      transition-transform
                      group-hover:rotate-180
                    "
                  />
                </Link>

                {/* DROPDOWN */}

                <div
                  className="
                    invisible absolute right-0 top-full
                    w-52 translate-y-2 pt-2
                    opacity-0 transition-all duration-200

                    group-hover:visible
                    group-hover:translate-y-0
                    group-hover:opacity-100
                  "
                >
                  <div
                    className="
                      overflow-hidden rounded-2xl
                      border border-slate-200
                      bg-white p-2 shadow-xl

                      dark:border-slate-700
                      dark:bg-slate-900
                    "
                  >
                    <Link
                      to="/profile"
                      className="
                        flex items-center gap-3 rounded-xl
                        px-3 py-2.5 text-sm font-semibold
                        text-slate-600
                        hover:bg-slate-100

                        dark:text-slate-300
                        dark:hover:bg-slate-800
                      "
                    >
                      <User size={17} />
                      Profile
                    </Link>

                    <button
                      type="button"
                      onClick={logout}
                      className="
                        flex w-full items-center gap-3
                        rounded-xl px-3 py-2.5
                        text-left text-sm font-semibold
                        text-rose-600
                        hover:bg-rose-50

                        dark:text-rose-400
                        dark:hover:bg-rose-950/30
                      "
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* LOGIN / REGISTER */

              <div className="hidden items-center gap-2 md:flex">

                <Link
                  to="/login"
                  className="
                    flex items-center gap-2 rounded-xl
                    px-4 py-2 text-sm font-bold
                    text-slate-600 transition-colors

                    hover:bg-slate-100
                    hover:text-indigo-600

                    dark:text-slate-300
                    dark:hover:bg-slate-800
                    dark:hover:text-indigo-400
                  "
                >
                  <LogIn size={17} />
                  Login
                </Link>

                <Link
                  to="/register"
                  className="
                    flex items-center gap-2 rounded-xl
                    bg-gradient-to-r from-indigo-600 to-violet-600
                    px-4 py-2.5 text-sm font-bold text-white
                    shadow-md shadow-indigo-200
                    transition-all
                    hover:-translate-y-0.5
                    hover:shadow-lg

                    dark:shadow-indigo-950
                  "
                >
                  <UserPlus size={17} />
                  Register
                </Link>

              </div>
            )}

            {/* MOBILE MENU BUTTON */}

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen((prev) => !prev)
              }
              aria-label="Toggle menu"
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl border border-slate-200
                bg-slate-50 text-slate-700
                transition-all

                hover:bg-indigo-50
                hover:text-indigo-600

                md:hidden

                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-300
                dark:hover:bg-slate-800
                dark:hover:text-indigo-400
              "
            >
              {mobileMenuOpen ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}
            </button>
          </div>
        </div>

        {/* =================================================
            MOBILE MENU
        ================================================= */}

        {mobileMenuOpen && (
          <div
            className="
              border-t border-slate-200 py-4
              md:hidden
              dark:border-slate-800
            "
          >
            <div className="space-y-1">

              <NavItem to="/" icon={Home}>
                Home
              </NavItem>

              {user?.role === "customer" && (
                <>
                  <NavItem
                    to="/wishlist"
                    icon={Heart}
                    badge={wishlistCount}
                  >
                    Wishlist
                  </NavItem>

                  <NavItem
                    to="/cart"
                    icon={ShoppingCart}
                    badge={cartCount}
                  >
                    Cart
                  </NavItem>

                  <NavItem
                    to="/my-orders"
                    icon={Package}
                  >
                    My Orders
                  </NavItem>
                </>
              )}

              {user?.role === "vendor" && (
                <>
                  <NavItem
                    to="/vendor/dashboard"
                    icon={LayoutDashboard}
                  >
                    Dashboard
                  </NavItem>

                  <NavItem
                    to="/vendor/products"
                    icon={Boxes}
                  >
                    Products
                  </NavItem>

                  <NavItem
                    to="/vendor/orders"
                    icon={ClipboardList}
                  >
                    Orders
                  </NavItem>
                </>
              )}
            </div>

            {/* MOBILE USER */}

            <div
              className="
                mt-4 border-t border-slate-200 pt-4
                dark:border-slate-800
              "
            >
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="
                      mb-3 flex items-center gap-3
                      rounded-xl bg-slate-50 p-3
                      dark:bg-slate-900
                    "
                  >
                    <img
                      src={avatarUrl}
                      alt={user.name || "User"}
                      className="h-11 w-11 rounded-xl object-cover"
                    />

                    <div className="min-w-0">
                      <p
                        className="
                          truncate font-bold
                          text-slate-900 dark:text-white
                        "
                      >
                        {user.name}
                      </p>

                      <p
                        className="
                          text-xs capitalize
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        {user.role}
                      </p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={logout}
                    className="
                      flex w-full items-center
                      justify-center gap-2 rounded-xl
                      border border-rose-200
                      bg-rose-50 py-3
                      text-sm font-bold text-rose-600

                      dark:border-rose-900
                      dark:bg-rose-950/30
                      dark:text-rose-400
                    "
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">

                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="
                      flex items-center justify-center
                      gap-2 rounded-xl
                      border border-slate-200 py-3
                      text-sm font-bold text-slate-600

                      dark:border-slate-700
                      dark:text-slate-300
                    "
                  >
                    <LogIn size={17} />
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="
                      flex items-center justify-center
                      gap-2 rounded-xl
                      bg-indigo-600 py-3
                      text-sm font-bold text-white
                      hover:bg-indigo-700
                    "
                  >
                    <UserPlus size={17} />
                    Register
                  </Link>

                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;