import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="bg-slate-900 text-white px-8 py-4 flex justify-between">
      <Link to="/" className="font-bold text-2xl">
        MERN Shop
      </Link>

      <div className="flex gap-6 items-center">
        <Link to="/">Home</Link>

        <Link to="/cart" className="relative">
          🛒 Cart

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;