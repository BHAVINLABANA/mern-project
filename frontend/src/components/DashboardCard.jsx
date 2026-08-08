function DashboardCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <div
      className={`${color} relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
    >
      <div className="relative z-10 flex items-center justify-between gap-4">

        <div>
          <p className="text-sm font-semibold text-white/75">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-black">
            {value}
          </h2>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
          {icon}
        </div>

      </div>

      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />

      <div className="absolute -bottom-10 -left-5 h-24 w-24 rounded-full bg-black/5" />
    </div>
  );
}

export default DashboardCard;