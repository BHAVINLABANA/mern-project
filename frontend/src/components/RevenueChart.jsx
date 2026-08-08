import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";

function RevenueChart({ data = [] }) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = months.map((month, index) => ({
    month,
    revenue: Number(data?.[index] || 0),
  }));

  const totalRevenue = chartData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <TrendingUp size={21} />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Monthly Revenue
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Revenue performance throughout the year
            </p>
          </div>

        </div>

        <div className="sm:text-right">

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Revenue
          </p>

          <p className="mt-1 text-xl font-black text-indigo-600 dark:text-indigo-400">
            {formatCurrency(totalRevenue)}
          </p>

        </div>

      </div>

      {/* =====================================================
          CHART
      ===================================================== */}

      <div className="h-[280px] w-full">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fontSize: 11,
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                `₹${value >= 1000
                  ? `${value / 1000}k`
                  : value}`
              }
            />

            <Tooltip
              formatter={(value) => [
                formatCurrency(value),
                "Revenue",
              ]}
              labelFormatter={(label) =>
                `${label} Revenue`
              }
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.08)",
              }}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{
                r: 4,
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
              }}
            />

          </LineChart>
        </ResponsiveContainer>

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">

        <span className="text-xs font-medium text-slate-400">
          January - December
        </span>

        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
          This Year
        </span>

      </div>

    </div>
  );
}

export default RevenueChart;