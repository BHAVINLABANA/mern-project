function DashboardCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <div
      className={`rounded-xl shadow-lg p-6 text-white transition transform hover:-translate-y-1 hover:shadow-2xl ${color}`}
    >
      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm opacity-90">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

        </div>

        <div className="text-5xl opacity-80">
          {icon}
        </div>

      </div>
    </div>
  );
}

export default DashboardCard;