import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Eye,
  MapPin,
  Package,
  PackageCheck,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

import api from "../../services/api";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  /* =========================================================
     FETCH ORDERS
  ========================================================= */

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/orders/my-orders"
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
     STATUS CONFIG
  ========================================================= */

  const getStatusConfig = (status) => {
    switch (status) {
      case "Pending":
        return {
          label: "Pending",
          icon: Clock3,
          className:
            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900",
        };

      case "Confirmed":
        return {
          label: "Confirmed",
          icon: CheckCircle2,
          className:
            "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900",
        };

      case "Shipped":
        return {
          label: "Shipped",
          icon: Truck,
          className:
            "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-900",
        };

      case "Delivered":
        return {
          label: "Delivered",
          icon: PackageCheck,
          className:
            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900",
        };

      case "Cancelled":
        return {
          label: "Cancelled",
          icon: XCircle,
          className:
            "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900",
        };

      default:
        return {
          label: status || "Unknown",
          icon: Package,
          className:
            "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
        };
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">

        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="h-10 w-52 rounded-lg bg-slate-200 dark:bg-slate-800" />

          <div className="mt-3 h-5 w-80 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-8 space-y-5">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800"
              />
            ))}

          </div>

        </div>

      </div>
    );
  }

  /* =========================================================
     EMPTY STATE
  ========================================================= */

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16 dark:bg-slate-950">

        <div className="mx-auto max-w-xl text-center">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400">
            <ShoppingBag size={42} />
          </div>

          <h1 className="mt-7 text-3xl font-black text-slate-900 dark:text-white">
            No Orders Yet
          </h1>

          <p className="mt-3 text-slate-500 dark:text-slate-400">
            You haven't placed an order yet.
            Start shopping and your orders will
            appear here.
          </p>

          <Link
            to="/"
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl dark:shadow-indigo-950"
          >
            <ShoppingBag size={18} />

            Start Shopping

            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

        </div>

      </div>
    );
  }

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>

            <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Package size={17} />
              Order History
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              My Orders
            </h1>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Track and manage all your orders in one
              place.
            </p>

          </div>

          <div className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            {orders.length}{" "}
            {orders.length === 1
              ? "Order"
              : "Orders"}
          </div>

        </div>

        {/* =================================================
            ORDER LIST
        ================================================= */}

        <div className="space-y-6">

          {orders.map((order) => {

            const status = getStatusConfig(
              order.orderStatus
            );

            const StatusIcon = status.icon;

            return (
              <article
                key={order._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >

                {/* =================================================
                    ORDER HEADER
                ================================================= */}

                <div className="border-b border-slate-200 bg-slate-50/70 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-950/40">

                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-lg font-black">
                          Order #
                          {order._id
                            .slice(-6)
                            .toUpperCase()}
                        </h2>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${status.className}`}
                        >
                          <StatusIcon
                            size={14}
                          />
                          {status.label}
                        </span>

                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">

                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays
                            size={14}
                          />

                          {new Date(
                            order.createdAt
                          ).toLocaleString()}
                        </span>

                        {order.shippingAddress
                          ?.city && (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin
                              size={14}
                            />

                            {
                              order
                                .shippingAddress
                                .city
                            }
                            ,{" "}
                            {
                              order
                                .shippingAddress
                                .state
                            }
                          </span>
                        )}

                      </div>

                    </div>

                    <div className="lg:text-right">

                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Order Total
                      </p>

                      <p className="mt-1 text-2xl font-black text-indigo-600 dark:text-indigo-400">
                        ₹{order.totalAmount}
                      </p>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    PRODUCTS
                ================================================= */}

                <div className="p-5 sm:p-6">

                  <div className="space-y-3">

                    {order.items.map(
                      (item, index) => {

                        const image =
                          item.product
                            ?.images?.length
                            ? item.product
                                .images[0]
                                .url
                            : "https://via.placeholder.com/100?text=No+Image";

                        const itemTotal =
                          Number(
                            item.price
                          ) *
                          item.quantity;

                        return (
                          <div
                            key={
                              item._id ||
                              index
                            }
                            className="flex items-center gap-4 rounded-xl border border-slate-200 p-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                          >

                            {/* Product image */}

                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">

                              <img
                                src={image}
                                alt={
                                  item
                                    .product
                                    ?.name ||
                                  "Product"
                                }
                                className="h-full w-full object-cover"
                              />

                            </div>

                            {/* Product details */}

                            <div className="min-w-0 flex-1">

                              <h3 className="line-clamp-2 font-bold text-slate-900 dark:text-white">
                                {
                                  item
                                    .product
                                    ?.name
                                }
                              </h3>

                              <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">

                                <span>
                                  Qty:{" "}
                                  {
                                    item.quantity
                                  }
                                </span>

                                <span>
                                  ₹
                                  {
                                    item.price
                                  }{" "}
                                  each
                                </span>

                              </div>

                            </div>

                            {/* Item total */}

                            <div className="text-right">

                              <p className="text-sm font-black sm:text-base">
                                ₹{itemTotal}
                              </p>

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>

                  {/* =================================================
                      ORDER FOOTER
                  ================================================= */}

                  <div className="mt-6 flex flex-col justify-between gap-5 border-t border-slate-200 pt-5 sm:flex-row sm:items-center dark:border-slate-800">

                    <div className="space-y-2">

                      <div className="flex items-center gap-2 text-sm">

                        <span className="text-slate-500 dark:text-slate-400">
                          Payment:
                        </span>

                        <span className="font-bold">
                          {order.paymentMethod ===
                          "COD"
                            ? "Cash on Delivery"
                            : order.paymentMethod}
                        </span>

                      </div>

                      <div className="flex items-center gap-2 text-sm">

                        <span className="text-slate-500 dark:text-slate-400">
                          Payment Status:
                        </span>

                        <span
                          className={
                            order.paymentStatus ===
                            "Paid"
                              ? "font-bold text-emerald-600 dark:text-emerald-400"
                              : "font-bold text-amber-600 dark:text-amber-400"
                          }
                        >
                          {order.paymentStatus}
                        </span>

                      </div>

                    </div>

                    <Link
                      to={`/order/${order._id}`}
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-700"
                    >
                      <Eye size={17} />

                      View Details

                      <ChevronRight
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>

                  </div>

                </div>

              </article>
            );
          })}

        </div>

      </main>

    </div>
  );
}

export default MyOrders;