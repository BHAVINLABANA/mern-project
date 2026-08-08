import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/outline";

function VendorNavbar({ onMenuClick }) {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
    window.location.reload();
  };

  // =========================================================
  // NAVBAR
  // =========================================================

  return (
    <header className="bg-slate-900 shadow-lg">

      <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">

        {/* =================================================
            LEFT
        ================================================= */}

        <div className="flex items-center gap-4">

          {/* Mobile Menu */}

          <button
            type="button"
            onClick={onMenuClick}
            className="text-white transition-colors hover:text-indigo-400 lg:hidden"
            aria-label="Open menu"
          >
            <Bars3Icon className="h-7 w-7" />
          </button>

          {/* Logo */}

          <Link
            to="/vendor/dashboard"
            className="text-xl font-black tracking-wide text-white transition-colors hover:text-indigo-400"
          >
            MERN Shop
          </Link>

          <span className="hidden rounded-full bg-indigo-600/20 px-3 py-1 text-xs font-bold text-indigo-400 sm:inline-block">
            Vendor Panel
          </span>

        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="flex items-center gap-3">

          {/* Profile */}

          <Link
            to="/profile"
            className="group flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-slate-800"
          >

            <img
              src={
                user?.avatar?.url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name || "Vendor"
                )}&background=4f46e5&color=fff`
              }
              alt="Profile"
              className="h-10 w-10 rounded-full border-2 border-slate-600 object-cover transition-colors group-hover:border-indigo-400"
            />

            <div className="hidden lg:block">

              <p className="text-sm font-bold text-white">
                {user?.name || "Vendor"}
              </p>

              <p className="text-xs text-slate-400">
                Vendor
              </p>

            </div>

          </Link>

          {/* Logout */}

          <button
            type="button"
            onClick={logout}
            className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-bold text-white transition-all hover:bg-rose-600 hover:shadow-lg disabled:opacity-50"
          >
            Logout
          </button>

        </div>

      </div>

    </header>
  );
}

export default VendorNavbar;