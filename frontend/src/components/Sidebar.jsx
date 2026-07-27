import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white">
      <div className="p-6 text-2xl font-bold border-b border-slate-700">
        Vendor Panel
      </div>

      <nav className="flex flex-col p-4 gap-2">
        <Link
          to="/vendor/dashboard"
          className="px-4 py-2 rounded hover:bg-slate-700"
        >
          Dashboard
        </Link>

        <Link
          to="/vendor/store"
          className="px-4 py-2 rounded hover:bg-slate-700"
        >
          Store
        </Link>

        <Link
          to="/vendor/products"
          className="px-4 py-2 rounded hover:bg-slate-700"
        >
          Products
        </Link>

        <Link
          to="/vendor/orders"
          className="px-4 py-2 rounded hover:bg-slate-700"
        >
          Orders
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;