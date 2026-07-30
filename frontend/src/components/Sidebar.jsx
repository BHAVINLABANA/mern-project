import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "hover:bg-slate-700 text-gray-200"
    }`;

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white">
      <div className="p-6 text-2xl font-bold border-b border-slate-700">
        Vendor Panel
      </div>

      <nav className="flex flex-col p-4 gap-2">
        <NavLink to="/vendor/dashboard" className={linkClass}>
          📊 Dashboard
        </NavLink>

        <NavLink to="/vendor/store" className={linkClass}>
          🏪 Store
        </NavLink>

        <NavLink to="/vendor/products" className={linkClass}>
          📦 Products
        </NavLink>

        <NavLink to="/vendor/orders" className={linkClass}>
          📋 Orders
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;