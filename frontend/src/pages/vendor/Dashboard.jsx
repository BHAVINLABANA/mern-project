import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardCard from "../../components/DashboardCard";
import api from "../../services/api";
import RevenueChart from "../../components/RevenueChart";
import RecentOrders from "../../components/RecentOrders";
import LowStockProducts from "../../components/LowStockProducts";

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data } = await api.get("/dashboard/stats");

      setStats(data.stats);
      setRecentOrders(data.recentOrders || []);
      setLowStockProducts(data.lowStockProducts || []);
      setMonthlyRevenue(data.monthlyRevenue);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center text-xl font-semibold py-10">
          Loading Dashboard...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="flex justify-between items-center mb-8">

        <div>

          <div className="mb-8">

            <h1 className="text-4xl font-bold">
              Dashboard Overview
            </h1>

            <p className="text-gray-500 mt-2">
              Welcome back 👋 Here's what's happening with your business today.
            </p>

          </div>

        </div>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <DashboardCard
          title="Products"
          value={stats.totalProducts}
          icon="📦"
          color="bg-gradient-to-r from-blue-500 to-blue-700"
        />

        <DashboardCard
          title="Orders"
          value={stats.totalOrders}
          icon="🛒"
          color="bg-gradient-to-r from-green-500 to-green-700"
        />

        <DashboardCard
          title="Revenue"
          value={`₹${stats.totalRevenue}`}
          icon="💰"
          color="bg-gradient-to-r from-yellow-500 to-orange-500"
        />

        <DashboardCard
          title="Customers"
          value={stats.totalCustomers}
          icon="👥"
          color="bg-gradient-to-r from-purple-500 to-pink-500"
        />

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

        <div className="xl:col-span-2">
          <RevenueChart data={monthlyRevenue} />
        </div>

        <LowStockProducts
          products={lowStockProducts}
        />

      </div>

      <div className="mt-8">
        <RecentOrders
          orders={recentOrders}
        />
      </div>

    </DashboardLayout>
  );
}

export default Dashboard;