import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardCard from "../../components/DashboardCard";

function Dashboard() {
  return (
    <DashboardLayout>
      <h2 className="text-3xl font-bold mb-6">
        Welcome to your Dashboard 👋
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Products" value="0" />
        <DashboardCard title="Orders" value="0" />
        <DashboardCard title="Revenue" value="$0" />
        <DashboardCard title="Customers" value="0" />
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;