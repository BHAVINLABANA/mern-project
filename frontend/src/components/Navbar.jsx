import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Navbar() {
  const navigate = useNavigate();

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

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
    <nav className="bg-slate-900 text-white px-8 py-4 shadow-lg">

      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo */}

        <Link
          to="/"
          className="text-2xl font-bold"
        >
          MERN Shop
        </Link>

        {/* Navigation */}

        <div className="flex items-center gap-6">

          <Link
            to="/"
            className="hover:text-blue-400 transition"
          >
            Home
          </Link>

          {/* Customer Menu */}

          {user?.role === "customer" && (
            <>
              <Link
                to="/wishlist"
                className="relative hover:text-pink-400 transition"
              >
                ❤️ Wishlist

                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-4 bg-pink-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative hover:text-green-400 transition"
              >
                🛒 Cart

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                to="/my-orders"
                className="hover:text-yellow-400 transition"
              >
                My Orders
              </Link>
            </>
          )}

          {/* Vendor Menu */}

          {user?.role === "vendor" && (
            <>
              <Link
                to="/vendor/dashboard"
                className="hover:text-blue-400 transition"
              >
                Dashboard
              </Link>

              <Link
                to="/vendor/products"
                className="hover:text-blue-400 transition"
              >
                Products
              </Link>

              <Link
                to="/vendor/orders"
                className="hover:text-blue-400 transition"
              >
                Orders
              </Link>
            </>
          )}

          {/* User Section */}

          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-full hover:bg-slate-700 transition"
              >
                <img
                  src={
                    user?.avatar?.url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || "User"
                    )}`
                  }
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover"
                />

                <span className="font-semibold">
                  {user.name}
                </span>
              </Link>

              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-400 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
              >
                Register
              </Link>
            </>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;