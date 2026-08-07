import { Link, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
} from "@heroicons/react/24/outline";

function VendorNavbar({ onMenuClick }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 shadow">

      <div className="flex items-center justify-between h-16 px-4 md:px-6 lg:px-8">

        {/* Left */}

        <div className="flex items-center gap-4">

          <button
            onClick={onMenuClick}
            className="lg:hidden text-white"
          >
            <Bars3Icon className="w-7 h-7" />
          </button>

          <h1 className="text-white text-xl font-bold tracking-wide">
            MERN Shop
          </h1>

        </div>

        {/* Right */}

        <div className="flex items-center gap-3">

          <Link
            to="/profile"
            className="flex items-center gap-2"
          >
            <img
              src={
                user?.avatar?.url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name || "Vendor"
                )}`
              }
              alt=""
              className="w-10 h-10 rounded-full border-2 border-white"
            />

            <span className="hidden lg:block text-white font-medium">
              {user?.name}
            </span>
          </Link>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>

        </div>

      </div>

    </header>
  );
}

export default VendorNavbar;