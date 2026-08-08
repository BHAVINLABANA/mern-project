import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  PackageCheck,
  Phone,
  Save,
  ShieldCheck,
  Truck,
  User,
  XCircle,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function VendorOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  /* =========================================================
     FETCH ORDER
  ========================================================= */

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(`/orders/${id}`);

      setOrder(data.order);
      setStatus(data.order?.orderStatus || "Pending");
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
     UPDATE STATUS
  ========================================================= */

  const updateStatus = async () => {
    if (!order || !status) return;

    if (status === order.orderStatus) {
      toast("Order status is already " + status);
      return;
    }

    try {
      setSaving(true);

      await api.put(`/orders/${order._id}/status`, {
        status,
      });

      toast.success("Order status updated successfully.");

      await fetchOrder();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to update order status."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     STATUS CONFIG
  ========================================================= */

  const getStatusConfig = (orderStatus) => {
    switch (orderStatus) {
      case "Pending":
        return {
          icon: Clock3,
          color:
            "text-amber-600 dark:text-amber-400",
          bg:
            "bg-amber-50 dark:bg-amber-950/30",
          border:
            "border-amber-200 dark:border-amber-900",
        };

      case "Confirmed":
        return {
          icon: CheckCircle2,
          color:
            "text-blue-600 dark:text-blue-400",
          bg:
            "bg-blue-50 dark:bg-blue-950/30",
          border:
            "border-blue-200 dark:border-blue-900",
        };

      case "Shipped":
        return {
          icon: Truck,
          color:
            "text-violet-600 dark:text-violet-400",
          bg:
            "bg-violet-50 dark:bg-violet-950/30",
          border:
            "border-violet-200 dark:border-violet-900",
        };

      case "Delivered":
        return {
          icon: PackageCheck,
          color:
            "text-emerald-600 dark:text-emerald-400",
          bg:
            "bg-emerald-50 dark:bg-emerald-950/30",
          border:
            "border-emerald-200 dark:border-emerald-900",
        };

      case "Cancelled":
        return {
          icon: XCircle,
          color:
            "text-rose-600 dark:text-rose-400",
          bg:
            "bg-rose-50 dark:bg-rose-950/30",
          border:
            "border-rose-200 dark:border-rose-900",
        };

      default:
        return {
          icon: Package,
          color:
            "text-slate-600 dark:text-slate-300",
          bg:
            "bg-slate-100 dark:bg-slate-800",
          border:
            "border-slate-200 dark:border-slate-700",
        };
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">

          <div className="h-10 w-40 rounded-lg bg-slate-200 dark:bg-slate-800" />

          <div className="mt-8 grid gap-6 lg:grid-cols-3">

            <div className="space-y-6 lg:col-span-2">

              <div className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800" />

              <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />

              <div className="h-56 rounded-2xl bg-slate-200 dark:bg-slate-800" />

            </div>

            <div className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />

          </div>

        </div>
      </DashboardLayout>
    );
  }

  /* =========================================================
     NOT FOUND
  ========================================================= */

  if (!order) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center">

          <Package
            size={55}
            className="mx-auto text-slate-400"
          />

          <h1 className="mt-5 text-3xl font-black">
            Order Not Found
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            We couldn't find this order.
          </p>

          <button
            type="button"
            onClick={() => navigate("/vendor/orders")}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>

        </div>
      </DashboardLayout>
    );
  }

  const statusConfig = getStatusConfig(
    order.orderStatus
  );

  const StatusIcon = statusConfig.icon;

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <DashboardLayout>

      {/* =====================================================
          BACK
      ===================================================== */}

      <Link
        to="/vendor/orders"
        className="mb-7 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
      >
        <ArrowLeft size={17} />
        Back to Orders
      </Link>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

        <div>

          <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Package size={17} />
            Vendor Order
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Order #
            {order._id
              .slice(-8)
              .toUpperCase()}
          </h1>

          <p className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <CalendarDays size={15} />

            {new Date(
              order.createdAt
            ).toLocaleString()}
          </p>

        </div>

        <div
          className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-sm font-bold md:self-auto ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}`}
        >
          <StatusIcon size={17} />
          {order.orderStatus}
        </div>

      </div>

      {/* =====================================================
          GRID
      ===================================================== */}

      <div className="grid items-start gap-6 lg:grid-cols-3">

        {/* ===================================================
            LEFT
        =================================================== */}

        <div className="space-y-6 lg:col-span-2">

          {/* =================================================
              CUSTOMER
          ================================================= */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <User size={20} />
              </div>

              <div>

                <h2 className="text-xl font-black">
                  Customer
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Customer information
                </p>

              </div>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Name
                </p>

                <p className="mt-1 font-black">
                  {order.user?.name ||
                    order.shippingAddress?.fullName ||
                    "Customer"}
                </p>

              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Email
                </p>

                <p className="mt-1 break-all font-semibold text-slate-600 dark:text-slate-300">
                  {order.user?.email ||
                    "Not available"}
                </p>

              </div>

            </div>

          </section>

          {/* =================================================
              PRODUCTS
          ================================================= */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-black">
                  Order Products
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {order.items?.length || 0}{" "}
                  {order.items?.length === 1
                    ? "product"
                    : "products"}
                </p>

              </div>

              <Package
                size={22}
                className="text-indigo-500"
              />

            </div>

            <div className="space-y-3">

              {order.items?.map(
                (item, index) => {

                  const image =
                    item.product?.images
                      ?.length
                      ? item.product
                          .images[0]?.url
                      : "https://via.placeholder.com/100?text=No+Image";

                  const itemTotal =
                    Number(item.price || 0) *
                    Number(item.quantity || 0);

                  return (
                    <div
                      key={
                        item._id ||
                        index
                      }
                      className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center dark:border-slate-800"
                    >

                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">

                        <img
                          src={image}
                          alt={
                            item.product?.name ||
                            "Product"
                          }
                          className="h-full w-full object-cover"
                        />

                      </div>

                      <div className="min-w-0 flex-1">

                        <h3 className="line-clamp-2 font-black">
                          {item.product?.name ||
                            "Product"}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">

                          <span>
                            Qty:{" "}
                            <b className="text-slate-700 dark:text-slate-200">
                              {item.quantity}
                            </b>
                          </span>

                          <span>
                            Price: ₹
                            {item.price}
                          </span>

                        </div>

                      </div>

                      <div className="text-left sm:text-right">

                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Total
                        </p>

                        <p className="mt-1 text-xl font-black text-indigo-600 dark:text-indigo-400">
                          ₹{itemTotal}
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

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <MapPin size={20} />
              </div>

              <div>

                <h2 className="text-xl font-black">
                  Shipping Address
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Customer delivery information
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
                      order.shippingAddress
                        ?.fullName
                    }
                  </p>

                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Phone size={14} />

                    {
                      order.shippingAddress
                        ?.phone
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
                      order.shippingAddress
                        ?.address
                    }
                  </p>

                  <p>
                    {
                      order.shippingAddress
                        ?.city
                    }
                    ,{" "}
                    {
                      order.shippingAddress
                        ?.state
                    }{" "}
                    -{" "}
                    {
                      order.shippingAddress
                        ?.pincode
                    }
                  </p>

                </div>

              </div>

            </div>

          </section>

        </div>

        {/* ===================================================
            RIGHT
        =================================================== */}

        <aside className="lg:sticky lg:top-24">

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

            {/* Header */}

            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                  <Package size={21} />
                </div>

                <div>

                  <h2 className="text-xl font-black">
                    Manage Order
                  </h2>

                  <p className="text-xs text-white/70">
                    Update order status
                  </p>

                </div>

              </div>

            </div>

            <div className="space-y-6 p-6">

              {/* Status */}

              <div>

                <label className="mb-2 block text-sm font-bold">
                  Order Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value
                    )
                  }
                  disabled={saving}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-indigo-950"
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

              </div>

              <button
                type="button"
                onClick={updateStatus}
                disabled={
                  saving ||
                  status ===
                    order.orderStatus
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Update Status
                  </>
                )}

              </button>

              {/* Payment */}

              <div className="border-t border-slate-200 pt-5 dark:border-slate-800">

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

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Payment Status
                </p>

                <div className="mt-2 flex items-center gap-2">

                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
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
                        ? "font-bold text-emerald-600 dark:text-emerald-400"
                        : "font-bold text-amber-600 dark:text-amber-400"
                    }
                  >
                    {order.paymentStatus}
                  </span>

                </div>

              </div>

              {/* Total */}

              <div className="border-t border-slate-200 pt-5 dark:border-slate-800">

                <div className="flex items-end justify-between">

                  <span className="font-bold">
                    Order Total
                  </span>

                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                    ₹{order.totalAmount}
                  </span>

                </div>

              </div>

              {/* Security */}

              <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/30">

                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                />

                <div>

                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    Secure Order
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-emerald-700/80 dark:text-emerald-400/80">
                    Customer and payment
                    information is securely
                    protected.
                  </p>

                </div>

              </div>

            </div>

          </section>

        </aside>

      </div>

    </DashboardLayout>
  );
}

export default VendorOrderDetails;