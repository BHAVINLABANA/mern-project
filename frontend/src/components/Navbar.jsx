import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center">
      <Link
        to="/"
        className="text-2xl font-bold"
      >
        MERN Shop
      </Link>

      <div className="flex items-center gap-6">

        <Link to="/">Home</Link>

        {user?.role === "customer" && (
          <>
            <Link to="/my-orders">
              My Orders
            </Link>

            <Link
              to="/cart"
              className="relative"
            >
              🛒 Cart

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
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
            <span className="font-semibold">
              {user.name}
            </span>

            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;