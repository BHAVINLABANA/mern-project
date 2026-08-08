import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  PackageCheck,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  User,
  XCircle,
} from "lucide-react";

import api from "../../services/api";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  /* =========================================================
     FETCH ORDER
  ========================================================= */

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/orders/${id}`
      );

      setOrder(data.order);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load order."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     CANCEL ORDER
  ========================================================= */

  const cancelOrder = async () => {
    if (!order) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);

      await api.put(
        `/orders/${order._id}/cancel`
      );

      toast.success(
        "Order cancelled successfully."
      );

      await fetchOrder();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to cancel order."
      );
    } finally {
      setCancelling(false);
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
          color: "text-amber-500",
          bg: "bg-amber-50 dark:bg-amber-950/30",
          border:
            "border-amber-200 dark:border-amber-900",
          description:
            "Your order has been received and is waiting for confirmation.",
        };

      case "Confirmed":
        return {
          label: "Confirmed",
          icon: CheckCircle2,
          color: "text-blue-500",
          bg: "bg-blue-50 dark:bg-blue-950/30",
          border:
            "border-blue-200 dark:border-blue-900",
          description:
            "Your order has been confirmed and is being prepared.",
        };

      case "Shipped":
        return {
          label: "Shipped",
          icon: Truck,
          color: "text-violet-500",
          bg: "bg-violet-50 dark:bg-violet-950/30",
          border:
            "border-violet-200 dark:border-violet-900",
          description:
            "Your order is on its way to you.",
        };

      case "Delivered":
        return {
          label: "Delivered",
          icon: PackageCheck,
          color: "text-emerald-500",
          bg: "bg-emerald-50 dark:bg-emerald-950/30",
          border:
            "border-emerald-200 dark:border-emerald-900",
          description:
            "Your order has been delivered successfully.",
        };

      case "Cancelled":
        return {
          label: "Cancelled",
          icon: XCircle,
          color: "text-rose-500",
          bg: "bg-rose-50 dark:bg-rose-950/30",
          border:
            "border-rose-200 dark:border-rose-900",
          description:
            "This order has been cancelled.",
        };

      default:
        return {
          label: status || "Unknown",
          icon: Package,
          color: "text-slate-500",
          bg: "bg-slate-100 dark:bg-slate-800",
          border:
            "border-slate-200 dark:border-slate-700",
          description:
            "Order status information.",
        };
    }
  };

  /* =========================================================
     STATUS INDEX
  ========================================================= */

  const getStatusIndex = (status) => {
    const statuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
    ];

    const index = statuses.indexOf(status);

    return statuses.indexOf(status);
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">

        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="h-10 w-40 rounded-lg bg-slate-200 dark:bg-slate-800" />

          <div className="mt-8 grid gap-8 lg:grid-cols-3">

            <div className="space-y-6 lg:col-span-2">

              <div className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800" />

              <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />

              <div className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800" />

            </div>

            <div className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />

          </div>

        </div>

      </div>
    );
  }

  /* =========================================================
     NOT FOUND
  ========================================================= */

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-20 text-center dark:bg-slate-950">

        <Package
          size={55}
          className="mx-auto text-slate-400"
        />

        <h1 className="mt-5 text-3xl font-black">
          Order Not Found
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          We couldn't find the order you're
          looking for.
        </p>

        <button
          type="button"
          onClick={() => navigate("/my-orders")}
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </button>

      </div>
    );
  }

  const statusConfig = getStatusConfig(
    order.orderStatus
  );

  const StatusIcon = statusConfig.icon;

  const currentStatusIndex =
    getStatusIndex(order.orderStatus);

  const canCancel =
    order.orderStatus === "Pending" ||
    order.orderStatus === "Confirmed";

  /* =========================================================
     STATUS STEPS
  ========================================================= */

  const statusSteps = [
    {
      name: "Pending",
      icon: Clock3,
    },
    {
      name: "Confirmed",
      icon: CheckCircle2,
    },
    {
      name: "Shipped",
      icon: Truck,
    },
    {
      name: "Delivered",
      icon: PackageCheck,
    },
  ];

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        {/* =================================================
            BACK
        ================================================= */}

        <Link
          to="/my-orders"
          className="mb-7 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </Link>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>

            <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Package size={17} />
              Order Details
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Order #
              {order._id
                .slice(-8)
                .toUpperCase()}
            </h1>

            <p className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <CalendarDays size={15} />
              Placed on{" "}
              {new Date(
                order.createdAt
              ).toLocaleString()}
            </p>

          </div>

          <div
            className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-sm font-bold md:self-auto ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}`}
          >
            <StatusIcon size={17} />
            {statusConfig.label}
          </div>

        </div>

        {/* =================================================
            STATUS TIMELINE
        ================================================= */}

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="mb-6">

            <h2 className="text-xl font-black">
              Order Status
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {statusConfig.description}
            </p>

          </div>

          {order.orderStatus ===
          "Cancelled" ? (
            <div className="flex items-center gap-4 rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/30">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                <XCircle size={22} />
              </div>

              <div>

                <p className="font-black text-rose-700 dark:text-rose-400">
                  Order Cancelled
                </p>

                <p className="mt-1 text-sm text-rose-600/80 dark:text-rose-400/80">
                  This order will not be processed
                  or delivered.
                </p>

              </div>

            </div>
          ) : (
            <div className="relative">

              {/* Desktop connecting line */}

              <div className="absolute left-[10%] right-[10%] top-6 hidden h-1 rounded-full bg-slate-200 sm:block dark:bg-slate-800" />

              <div
                className="absolute left-[10%] top-6 hidden h-1 rounded-full bg-indigo-600 transition-all duration-500 sm:block"
                style={{
                  width:
                    currentStatusIndex <= 0
                      ? "0%"
                      : `${(currentStatusIndex / 3) * 80}%`,
                }}
              />

              <div className="relative grid grid-cols-2 gap-6 sm:grid-cols-4">

                {statusSteps.map(
                  (
                    step,
                    index
                  ) => {

                    const StepIcon =
                      step.icon;

                    const completed =
                      currentStatusIndex >=
                      index;

                    const current =
                      currentStatusIndex ===
                      index;

                    return (
                      <div
                        key={step.name}
                        className="flex flex-col items-center text-center"
                      >

                        <div
                          className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white shadow-sm transition-all dark:border-slate-900 ${
                            completed
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                          } ${
                            current
                              ? "ring-4 ring-indigo-100 dark:ring-indigo-950"
                              : ""
                          }`}
                        >
                          {completed ? (
                            index <
                            currentStatusIndex ? (
                              <Check
                                size={20}
                              />
                            ) : (
                              <StepIcon
                                size={20}
                              />
                            )
                          ) : (
                            <StepIcon
                              size={20}
                            />
                          )}
                        </div>

                        <p
                          className={`mt-3 text-sm font-bold ${
                            completed
                              ? "text-indigo-600 dark:text-indigo-400"
                              : "text-slate-400"
                          }`}
                        >
                          {step.name}
                        </p>

                      </div>
                    );
                  }
                )}

              </div>

            </div>
          )}

        </section>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid items-start gap-8 lg:grid-cols-3">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-6 lg:col-span-2">

            {/* =================================================
                PRODUCTS
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">

              <div className="mb-5 flex items-center justify-between">

                <div>

                  <h2 className="text-xl font-black">
                    Products
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {order.items.length}{" "}
                    {order.items.length ===
                    1
                      ? "product"
                      : "products"}{" "}
                    in this order
                  </p>

                </div>

                <Package
                  size={22}
                  className="text-indigo-500"
                />

              </div>

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

                    return (
                      <div
                        key={
                          item._id ||
                          index
                        }
                        className="flex gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800"
                      >

                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">

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

                        <div className="min-w-0 flex-1">

                          <h3 className="line-clamp-2 font-black">
                            {
                              item
                                .product
                                ?.name
                            }
                          </h3>

                          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Quantity:{" "}
                            <span className="font-bold text-slate-700 dark:text-slate-200">
                              {item.quantity}
                            </span>
                          </p>

                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Price: ₹
                            {item.price}
                          </p>

                        </div>

                        <div className="text-right">

                          <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                            ₹
                            {Number(
                              item.price
                            ) *
                              item.quantity}
                          </p>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </section>

            {/* =================================================
                SHIPPING ADDRESS
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <MapPin size={20} />
                </div>

                <div>

                  <h2 className="text-xl font-black">
                    Shipping Address
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Delivery information
                  </p>

                </div>

              </div>

              <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-950">

                <div className="flex items-start gap-3">

                  <User
                    size={18}
                    className="mt-0.5 shrink-0 text-indigo-500"
                  />

                  <div>

                    <p className="font-black">
                      {
                        order
                          .shippingAddress
                          .fullName
                      }
                    </p>

                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Phone
                        size={14}
                      />
                      {
                        order
                          .shippingAddress
                          .phone
                      }
                    </p>

                  </div>

                </div>

                <div className="mt-4 flex items-start gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">

                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-indigo-500"
                  />

                  <div className="text-sm leading-6 text-slate-600 dark:text-slate-400">

                    <p>
                      {
                        order
                          .shippingAddress
                          .address
                      }
                    </p>

                    <p>
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
                      }{" "}
                      -{" "}
                      {
                        order
                          .shippingAddress
                          .pincode
                      }
                    </p>

                  </div>

                </div>

              </div>

            </section>

          </div>

          {/* =================================================
              RIGHT SUMMARY
          ================================================= */}

          <aside className="lg:sticky lg:top-24">

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <ShoppingBag size={20} />
                </div>

                <div>

                  <h2 className="text-xl font-black">
                    Order Summary
                  </h2>

                  <p className="text-xs text-slate-400">
                    Payment & order information
                  </p>

                </div>

              </div>

              {/* Order ID */}

              <div className="border-b border-slate-200 pb-4 dark:border-slate-800">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Order ID
                </p>

                <p className="mt-2 break-all text-sm font-bold">
                  {order._id}
                </p>

              </div>

              {/* Date */}

              <div className="border-b border-slate-200 py-4 dark:border-slate-800">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Order Date
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm font-bold">
                  <CalendarDays
                    size={15}
                    className="text-indigo-500"
                  />

                  {new Date(
                    order.createdAt
                  ).toLocaleString()}
                </p>

              </div>

              {/* Payment */}

              <div className="border-b border-slate-200 py-4 dark:border-slate-800">

                <div className="flex items-center gap-2">

                  <CreditCard
                    size={17}
                    className="text-indigo-500"
                  />

                  <p className="text-sm font-bold">
                    Payment Method
                  </p>

                </div>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {order.paymentMethod ===
                  "COD"
                    ? "Cash on Delivery"
                    : order.paymentMethod}
                </p>

              </div>

              {/* Payment Status */}

              <div className="border-b border-slate-200 py-4 dark:border-slate-800">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Payment Status
                </p>

                <div className="mt-2 flex items-center gap-2">

                  <span
                    className={`h-2 w-2 rounded-full ${
                      order.paymentStatus ===
                      "Paid"
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                    }`}
                  />

                  <span
                    className={
                      order.paymentStatus ===
                      "Paid"
                        ? "text-sm font-bold text-emerald-600 dark:text-emerald-400"
                        : "text-sm font-bold text-amber-600 dark:text-amber-400"
                    }
                  >
                    {order.paymentStatus}
                  </span>

                </div>

              </div>

              {/* Total */}

              <div className="py-5">

                <div className="flex items-end justify-between">

                  <span className="font-bold">
                    Total Amount
                  </span>

                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                    ₹{order.totalAmount}
                  </span>

                </div>

              </div>

              {/* Cancel */}

              {canCancel && (
                <button
                  type="button"
                  onClick={cancelOrder}
                  disabled={cancelling}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3 font-bold text-rose-600 transition-all hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50"
                >
                  {cancelling ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-rose-300 border-t-rose-600" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle
                        size={17}
                      />
                      Cancel Order
                    </>
                  )}
                </button>
              )}

              {/* Security */}

              <div className="mt-5 flex items-start gap-3 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/30">

                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                />

                <div>

                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    Secure Order
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-emerald-700/80 dark:text-emerald-400/80">
                    Your order and payment information
                    are securely protected.
                  </p>

                </div>

              </div>

            </section>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default OrderDetails;