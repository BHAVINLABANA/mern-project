import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CalendarDays,
  ChevronRight,
  Eye,
  Package,
  RefreshCw,
  User,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  /* =========================================================
     FETCH ORDERS
  ========================================================= */

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/orders/vendor-orders"
      );

      setOrders(data.orders || []);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     UPDATE STATUS
  ========================================================= */

  const updateStatus = async (id, status) => {
    try {
      setUpdating(id);

      await api.put(`/orders/${id}/status`, {
        status,
      });

      toast.success(
        "Order status updated successfully."
      );

      await fetchOrders();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to update order."
      );
    } finally {
      setUpdating(null);
    }
  };

  /* =========================================================
     STATUS STYLE
  ========================================================= */

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900";

      case "Confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900";

      case "Shipped":
        return "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-900";

      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900";

      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900";

      default:
        return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">

          <div className="h-10 w-56 rounded-lg bg-slate-200 dark:bg-slate-800" />

          <div className="mt-3 h-5 w-80 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-8 space-y-4">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800"
              />
            ))}

          </div>

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

      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

        <div>

          <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Package size={17} />
            Sales Management
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Vendor Orders
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            View and manage orders containing your products.
          </p>

        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      {/* =====================================================
          ORDER COUNT
      ===================================================== */}

      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
        <Package size={16} />

        {orders.length}{" "}
        {orders.length === 1
          ? "Order"
          : "Orders"}
      </div>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/30 dark:text-indigo-400">
            <Package size={38} />
          </div>

          <h2 className="mt-6 text-2xl font-black">
            No Orders Found
          </h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Orders containing your products will appear here.
          </p>

        </div>
      ) : (
        <>
          {/* =================================================
              DESKTOP TABLE
          ================================================= */}

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:block">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px]">

                <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">

                  <tr>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Products
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Payment
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Total
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Payment Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {orders.map((order) => (

                    <tr
                      key={order._id}
                      className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
                    >

                      {/* Customer */}

                      <td className="px-5 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                            <User size={18} />
                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-bold">
                              {order.user?.name ||
                                order.shippingAddress?.fullName ||
                                "Customer"}
                            </p>

                            <p className="max-w-[180px] truncate text-xs text-slate-500 dark:text-slate-400">
                              {order.user?.email ||
                                "No email"}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Products */}

                      <td className="px-5 py-5">

                        <div className="max-w-[250px] space-y-1">

                          {order.items?.map(
                            (item, index) => (

                              <div
                                key={
                                  item._id ||
                                  index
                                }
                                className="text-sm"
                              >

                                <span className="font-semibold">
                                  {item.product?.name ||
                                    "Product"}
                                </span>

                                <span className="ml-2 text-xs text-slate-400">
                                  × {item.quantity}
                                </span>

                              </div>

                            )
                          )}

                        </div>

                      </td>

                      {/* Payment */}

                      <td className="px-5 py-5">

                        <span className="inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                          {order.paymentMethod ===
                          "COD"
                            ? "COD"
                            : order.paymentMethod}
                        </span>

                      </td>

                      {/* Total */}

                      <td className="px-5 py-5">

                        <p className="font-black text-indigo-600 dark:text-indigo-400">
                          ₹
                          {Number(
                            order.totalAmount || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </td>

                      {/* Status */}

                      <td className="px-5 py-5">

                        <select
                          value={
                            order.orderStatus
                          }
                          disabled={
                            updating ===
                            order._id
                          }
                          onChange={(e) =>
                            updateStatus(
                              order._id,
                              e.target.value
                            )
                          }
                          className={`rounded-xl border px-3 py-2 text-xs font-bold outline-none ${getStatusClass(
                            order.orderStatus
                          )}`}
                        >

                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Confirmed">
                            Confirmed
                          </option>

                          <option value="Shipped">
                            Shipped
                          </option>

                          <option value="Delivered">
                            Delivered
                          </option>

                          <option value="Cancelled">
                            Cancelled
                          </option>

                        </select>

                      </td>

                      {/* Payment Status */}

                      <td className="px-5 py-5">

                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
                            order.paymentStatus ===
                            "Paid"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                          }`}
                        >
                          {order.paymentStatus ||
                            "Pending"}
                        </span>

                      </td>

                      {/* Action */}

                      <td className="px-5 py-5 text-right">

                        <Link
                          to={`/vendor/orders/${order._id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700"
                        >
                          <Eye size={15} />
                          View
                          <ChevronRight
                            size={14}
                          />
                        </Link>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

          {/* =================================================
              MOBILE / TABLET CARDS
          ================================================= */}

          <div className="space-y-4 lg:hidden">

            {orders.map((order) => (

              <article
                key={order._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >

                {/* Card Header */}

                <div className="border-b border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/40">

                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">

                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Order #
                        {order._id
                          .slice(-6)
                          .toUpperCase()}
                      </p>

                      <div className="mt-2 flex items-center gap-2">

                        <User
                          size={16}
                          className="text-indigo-500"
                        />

                        <p className="font-black">
                          {order.user?.name ||
                            order.shippingAddress?.fullName ||
                            "Customer"}
                        </p>

                      </div>

                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusClass(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>

                  </div>

                  <p className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <CalendarDays size={14} />

                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </p>

                </div>

                {/* Products */}

                <div className="space-y-3 p-5">

                  {order.items?.map(
                    (item, index) => (

                      <div
                        key={
                          item._id ||
                          index
                        }
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800"
                      >

                        <div className="min-w-0">

                          <p className="truncate text-sm font-bold">
                            {item.product?.name ||
                              "Product"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Quantity:{" "}
                            {item.quantity}
                          </p>

                        </div>

                        <p className="shrink-0 font-bold text-indigo-600 dark:text-indigo-400">
                          ₹
                          {Number(
                            item.price || 0
                          ) *
                            Number(
                              item.quantity || 0
                            )}
                        </p>

                      </div>

                    )
                  )}

                </div>

                {/* Card Footer */}

                <div className="border-t border-slate-200 p-5 dark:border-slate-800">

                  <div className="mb-4 grid grid-cols-2 gap-3">

                    <div>

                      <p className="text-xs font-semibold text-slate-400">
                        Payment
                      </p>

                      <p className="mt-1 text-sm font-bold">
                        {order.paymentMethod ===
                        "COD"
                          ? "Cash on Delivery"
                          : order.paymentMethod}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-xs font-semibold text-slate-400">
                        Total
                      </p>

                      <p className="mt-1 text-xl font-black text-indigo-600 dark:text-indigo-400">
                        ₹
                        {Number(
                          order.totalAmount ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>

                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">

                    <select
                      value={
                        order.orderStatus
                      }
                      disabled={
                        updating ===
                        order._id
                      }
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      className={`h-11 flex-1 rounded-xl border px-3 text-sm font-bold outline-none ${getStatusClass(
                        order.orderStatus
                      )}`}
                    >

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Confirmed">
                        Confirmed
                      </option>

                      <option value="Shipped">
                        Shipped
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>

                    </select>

                    <Link
                      to={`/vendor/orders/${order._id}`}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white hover:bg-indigo-700"
                    >
                      <Eye size={16} />
                      View Details
                    </Link>

                  </div>

                </div>

              </article>

            ))}

          </div>
        </>
      )}

    </DashboardLayout>
  );
}

export default VendorOrders;