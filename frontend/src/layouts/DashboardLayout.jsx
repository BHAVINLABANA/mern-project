import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import VendorNavbar from "../components/VendorNavbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* =====================================================
          VENDOR NAVBAR
      ===================================================== */}

      <VendorNavbar
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="flex">

        {/* ===================================================
            DESKTOP SIDEBAR
        =================================================== */}

        <aside className="hidden shrink-0 lg:block">
          <Sidebar />
        </aside>

        {/* ===================================================
            MOBILE OVERLAY
        =================================================== */}

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* ===================================================
            MOBILE SIDEBAR
        =================================================== */}

        <aside
          className={`
            fixed inset-y-0 left-0 z-50
            w-72
            transform
            bg-slate-900
            shadow-2xl
            transition-transform duration-300
            lg:hidden

            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >

          {/* Mobile Sidebar Header */}

          <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">

            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                <span className="text-sm font-black">
                  M
                </span>
              </div>

              <span className="font-black text-white">
                Vendor Panel
              </span>

            </div>

            <button
              type="button"
              onClick={closeSidebar}
              aria-label="Close sidebar"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

          </div>

          {/* Sidebar */}

          <div className="h-[calc(100vh-4rem)] overflow-y-auto">

            <Sidebar
              closeSidebar={closeSidebar}
            />

          </div>

        </aside>

        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <main className="min-w-0 flex-1">

          <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">

            {children}

          </div>

        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;