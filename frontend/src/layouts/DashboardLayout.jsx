import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import VendorNavbar from "../components/VendorNavbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">

      <VendorNavbar
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="flex">

        {/* Desktop Sidebar */}

        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 lg:hidden ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          <div className="flex justify-end p-4">

            <button
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="w-8 h-8 text-white" />
            </button>

          </div>

          <Sidebar closeSidebar={() => setSidebarOpen(false)} />

        </div>

        {/* Content */}

        <main className="flex-1 p-4 md:p-6 lg:p-8">

          {children}

        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;