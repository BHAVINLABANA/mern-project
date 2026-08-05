import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-[calc(100vh-64px)]">

      <div className="p-6 border-b border-slate-700">

        <h2 className="text-2xl font-bold">
          Vendor Panel
        </h2>

      </div>

      <nav className="p-4 space-y-2">

        <NavLink
          to="/vendor/dashboard"
          className={linkClass}
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/vendor/store"
          className={linkClass}
        >
          🏪 Store
        </NavLink>

        <NavLink
          to="/vendor/products"
          className={linkClass}
        >
          📦 Products
        </NavLink>

        <NavLink
          to="/vendor/orders"
          className={linkClass}
        >
          📋 Orders
        </NavLink>

      </nav>

    </aside>
  );
}

export default Sidebar;