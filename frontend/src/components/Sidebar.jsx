import { NavLink } from "react-router-dom";
import {
  ChartBarIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function Sidebar({ closeSidebar }) {
  const links = [
    {
      name: "Dashboard",
      path: "/vendor/dashboard",
      icon: ChartBarIcon,
    },
    {
      name: "My Store",
      path: "/vendor/store",
      icon: BuildingStorefrontIcon,
    },
    {
      name: "Products",
      path: "/vendor/products",
      icon: CubeIcon,
    },
    {
      name: "Orders",
      path: "/vendor/orders",
      icon: ClipboardDocumentListIcon,
    },
  ];

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/40"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="flex h-full min-h-screen w-64 flex-col bg-slate-900 text-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-400">
            Management
          </p>

          <h2 className="mt-1 text-xl font-black">
            Vendor Panel
          </h2>
        </div>

        {/* Mobile close button */}

        {closeSidebar && (
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}

      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="flex-1 space-y-2 p-4">

        <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
          Main Menu
        </p>

        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeSidebar}
              className={linkClass}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                      isActive
                        ? "text-white"
                        : "text-slate-500 group-hover:text-indigo-400"
                    }`}
                  />

                  <span>{link.name}</span>
                </>
              )}
            </NavLink>
          );
        })}

      </nav>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="border-t border-slate-800 p-4">

        <div className="rounded-xl bg-slate-800/70 p-4">

          <p className="text-xs font-bold text-slate-300">
            Vendor Dashboard
          </p>

          <p className="mt-1 text-[11px] leading-5 text-slate-500">
            Manage your store, products and orders from one place.
          </p>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;