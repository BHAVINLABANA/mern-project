import { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  IndianRupee,
  Users,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardCard from "../../components/DashboardCard";
import RevenueChart from "../../components/RevenueChart";
import RecentOrders from "../../components/RecentOrders";
import LowStockProducts from "../../components/LowStockProducts";

import api from "../../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  /* =========================================================
     FETCH DASHBOARD
  ========================================================= */

  const fetchDashboardStats = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const { data } = await api.get("/dashboard/stats");

      setStats({
        totalProducts: data.stats?.totalProducts || 0,
        totalOrders: data.stats?.totalOrders || 0,
        totalRevenue: data.stats?.totalRevenue || 0,
        totalCustomers: data.stats?.totalCustomers || 0,
      });

      setRecentOrders(data.recentOrders || []);
      setLowStockProducts(data.lowStockProducts || []);
      setMonthlyRevenue(data.monthlyRevenue || []);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">

          <div className="h-10 w-64 rounded-lg bg-slate-200 dark:bg-slate-800" />

          <div className="mt-3 h-5 w-96 max-w-full rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-36 rounded-2xl bg-slate-200 dark:bg-slate-800"
              />
            ))}

          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-3">

            <div className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 xl:col-span-2" />

            <div className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800" />

          </div>

          <div className="mt-6 h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />

        </div>
      </DashboardLayout>
    );
  }

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <DashboardLayout>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

        <div>

          <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <TrendingUp size={17} />
            Vendor Dashboard
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Welcome back 👋 Here's what's happening with your business today.
          </p>

        </div>

        <button
          type="button"
          onClick={() => fetchDashboardStats(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
        >
          <RefreshCw
            size={16}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <DashboardCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package size={32} />}
          color="bg-gradient-to-r from-blue-500 to-blue-700"
        />

        <DashboardCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingCart size={32} />}
          color="bg-gradient-to-r from-emerald-500 to-emerald-700"
        />

        <DashboardCard
          title="Total Revenue"
          value={`₹${Number(
            stats.totalRevenue || 0
          ).toLocaleString("en-IN")}`}
          icon={<IndianRupee size={32} />}
          color="bg-gradient-to-r from-amber-500 to-orange-600"
        />

        <DashboardCard
          title="Customers"
          value={stats.totalCustomers}
          icon={<Users size={32} />}
          color="bg-gradient-to-r from-violet-500 to-pink-600"
        />

      </div>

      {/* =====================================================
          CHART + LOW STOCK
      ===================================================== */}

      <div className="mt-8 grid gap-6 xl:grid-cols-3">

        <div className="xl:col-span-2">
          <RevenueChart
            data={monthlyRevenue}
          />
        </div>

        <LowStockProducts
          products={lowStockProducts}
        />

      </div>

      {/* =====================================================
          RECENT ORDERS
      ===================================================== */}

      <div className="mt-8">
        <RecentOrders
          orders={recentOrders}
        />
      </div>

      {/* =====================================================
          LOW STOCK ALERT
      ===================================================== */}

      {lowStockProducts.length > 0 && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <AlertTriangle size={20} />
          </div>

          <div>

            <h3 className="font-black text-amber-800 dark:text-amber-400">
              Stock Attention Required
            </h3>

            <p className="mt-1 text-sm text-amber-700/80 dark:text-amber-400/80">
              {lowStockProducts.length}{" "}
              {lowStockProducts.length === 1
                ? "product has"
                : "products have"}{" "}
              low stock. Consider updating your inventory soon.
            </p>

          </div>

        </div>
      )}

    </DashboardLayout>
  );
}

export default Dashboard;