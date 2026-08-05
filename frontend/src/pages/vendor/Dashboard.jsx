import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardCard from "../../components/DashboardCard";
import api from "../../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data } = await api.get("/stores/dashboard-stats");

      setStats(data.stats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-3xl font-bold mb-6">
        Welcome to your Dashboard 👋
      </h2>

      {loading ? (
        <div className="text-center text-lg font-semibold">
          Loading Dashboard...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Products"
            value={stats.totalProducts}
          />

          <DashboardCard
            title="Orders"
            value={stats.totalOrders}
          />

          <DashboardCard
            title="Revenue"
            value={`₹${stats.totalRevenue}`}
          />

          <DashboardCard
            title="Customers"
            value={stats.totalCustomers}
          />
        </div>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;