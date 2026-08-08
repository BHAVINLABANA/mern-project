import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Eye,
  Package,
} from "lucide-react";

function RecentOrders({ orders = [] }) {
  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400";

      case "Shipped":
        return "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400";

      case "Confirmed":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400";

      case "Cancelled":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400";

      case "Pending":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400";

      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Package size={21} />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Recent Orders
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Latest orders received by your store
            </p>
          </div>

        </div>

        <Link
          to="/vendor/orders"
          className="group inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400"
        >
          View All
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>

      </div>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center dark:border-slate-700">

          <Package
            size={40}
            className="mx-auto text-slate-300 dark:text-slate-600"
          />

          <h3 className="mt-4 font-bold text-slate-700 dark:text-slate-300">
            No Recent Orders
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            New customer orders will appear here.
          </p>

        </div>
      ) : (

        /* =====================================================
           TABLE
        ===================================================== */

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px]">

            <thead>
              <tr className="border-b border-slate-200 text-left dark:border-slate-800">

                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Customer
                </th>

                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Amount
                </th>

                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Status
                </th>

                <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Date
                </th>

                <th className="px-3 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {orders.map((order) => (

                <tr
                  key={order._id}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800/70 dark:hover:bg-slate-800/40"
                >

                  {/* Customer */}

                  <td className="px-3 py-4">

                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {order.customer ||
                        order.user?.name ||
                        "Customer"}
                    </div>

                    {order.user?.email && (
                      <div className="mt-1 text-xs text-slate-400">
                        {order.user.email}
                      </div>
                    )}

                  </td>

                  {/* Amount */}

                  <td className="px-3 py-4">

                    <span className="font-black text-indigo-600 dark:text-indigo-400">
                      ₹
                      {Number(
                        order.amount ??
                          order.totalAmount ??
                          0
                      ).toLocaleString("en-IN")}
                    </span>

                  </td>

                  {/* Status */}

                  <td className="px-3 py-4">

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                        order.status ||
                          order.orderStatus
                      )}`}
                    >
                      {order.status ||
                        order.orderStatus ||
                        "Unknown"}
                    </span>

                  </td>

                  {/* Date */}

                  <td className="px-3 py-4">

                    <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">

                      <CalendarDays size={14} />

                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "N/A"}

                    </div>

                  </td>

                  {/* Action */}

                  <td className="px-3 py-4 text-right">

                    <Link
                      to={`/vendor/orders`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
                      title="View Orders"
                    >
                      <Eye size={16} />
                    </Link>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default RecentOrders;