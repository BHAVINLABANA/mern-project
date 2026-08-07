import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Navbar() {
  const navigate = useNavigate();

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  useEffect(() => {
    const updateUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">

        <Link
          to="/"
          className="text-2xl font-bold"
        >
          MERN Shop
        </Link>

        {/* Desktop Menu */}

        <div className="hidden md:flex items-center gap-6">

          <Link to="/">Home</Link>

          {user?.role === "customer" && (
            <>
              <Link
                to="/wishlist"
                className="relative"
              >
                ❤️ Wishlist

                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-4 bg-pink-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative"
              >
                🛒 Cart

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-4 bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link to="/my-orders">
                My Orders
              </Link>
            </>
          )}

          {user?.role === "vendor" && (
            <>
              <Link to="/vendor/dashboard">
                Dashboard
              </Link>

              <Link to="/vendor/products">
                Products
              </Link>

              <Link to="/vendor/orders">
                Orders
              </Link>
            </>
          )}

          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-full"
              >
                <img
                  src={
                    user.avatar?.url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name
                    )}`
                  }
                  alt=""
                  className="w-9 h-9 rounded-full"
                />

                <span>{user.name}</span>
              </Link>

              <button
                onClick={logout}
                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 px-4 py-2 rounded-lg"
              >
                Register
              </Link>
            </>
          )}

        </div>

        {/* Mobile Button */}

        <button
          onClick={() =>
            setMobileMenuOpen(!mobileMenuOpen)
          }
          className="md:hidden"
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="w-8 h-8" />
          ) : (
            <Bars3Icon className="w-8 h-8" />
          )}
        </button>

      </div>

      {/* Mobile Menu */}

      {mobileMenuOpen && (

        <div className="md:hidden bg-slate-800 px-5 pb-5">

          <div className="flex flex-col gap-4">

            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            {user?.role === "customer" && (
              <>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ❤️ Wishlist ({wishlistCount})
                </Link>

                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🛒 Cart ({cartCount})
                </Link>

                <Link
                  to="/my-orders"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
              </>
            )}

            {user?.role === "vendor" && (
              <>
                <Link
                  to="/vendor/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>

                <Link
                  to="/vendor/products"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>

                <Link
                  to="/vendor/orders"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
              </>
            )}

            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>

                <button
                  onClick={logout}
                  className="bg-red-500 py-2 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}

          </div>

        </div>

      )}

    </nav>
  );
}

export default Navbar;