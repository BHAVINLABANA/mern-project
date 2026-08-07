import { NavLink } from "react-router-dom";

function Sidebar({ closeSidebar }) {
  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="w-64 h-full bg-slate-900 text-white">

      <div className="p-6 border-b border-slate-700">

        <h2 className="text-2xl font-bold">
          Vendor Panel
        </h2>

      </div>

      <nav className="p-4 space-y-2">

        <NavLink
          to="/vendor/dashboard"
          onClick={closeSidebar}
          className={linkClass}
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/vendor/store"
          onClick={closeSidebar}
          className={linkClass}
        >
          🏪 Store
        </NavLink>

        <NavLink
          to="/vendor/products"
          onClick={closeSidebar}
          className={linkClass}
        >
          📦 Products
        </NavLink>

        <NavLink
          to="/vendor/orders"
          onClick={closeSidebar}
          className={linkClass}
        >
          📋 Orders
        </NavLink>

      </nav>

    </aside>
  );
}

export default Sidebar;