import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Home,
  Loader2,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";

import api from "../../services/api";
import { useCart } from "../../context/CartContext";

function Checkout() {
  const navigate = useNavigate();
  const { fetchCartCount } = useCart();

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] =
    useState(false);
  const [cart, setCart] = useState([]);

  const [shippingAddress, setShippingAddress] =
    useState({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  useEffect(() => {
    fetchCart();
  }, []);

  /* =========================================================
     FETCH CART
  ========================================================= */

  const fetchCart = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/cart");

      setCart(data.cart || []);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load cart."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FORM
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     TOTALS
  ========================================================= */

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.product?.price || 0) *
        Number(item.quantity || 0),
    0
  );

  const shippingCharge =
    subtotal > 1000 || subtotal === 0
      ? 0
      : 100;

  const total = subtotal + shippingCharge;

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateForm = () => {
    const {
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
    } = shippingAddress;

    if (!fullName.trim()) {
      toast.error("Please enter your full name.");
      return false;
    }

    if (!phone.trim()) {
      toast.error("Please enter your phone number.");
      return false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error(
        "Please enter a valid 10-digit phone number."
      );
      return false;
    }

    if (!address.trim()) {
      toast.error("Please enter your address.");
      return false;
    }

    if (!city.trim()) {
      toast.error("Please enter your city.");
      return false;
    }

    if (!state.trim()) {
      toast.error("Please enter your state.");
      return false;
    }

    if (!/^[0-9]{6}$/.test(pincode)) {
      toast.error(
        "Please enter a valid 6-digit pincode."
      );
      return false;
    }

    return true;
  };

  /* =========================================================
     PLACE ORDER
  ========================================================= */

  const placeOrder = async () => {
    if (placingOrder) return;

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!validateForm()) return;

    try {
      setPlacingOrder(true);

      await api.post("/orders", {
        shippingAddress,
        paymentMethod,
      });

      toast.success(
        paymentMethod === "COD"
          ? "Order placed successfully!"
          : "Payment successful!"
      );

      await fetchCartCount();

      navigate("/my-orders");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to place order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950">

        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="h-10 w-52 rounded-lg bg-slate-200 dark:bg-slate-800" />

          <div className="mt-3 h-5 w-80 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-8 grid gap-6 lg:grid-cols-3">

            <div className="h-[600px] rounded-2xl bg-slate-200 dark:bg-slate-800 lg:col-span-2" />

            <div className="h-[500px] rounded-2xl bg-slate-200 dark:bg-slate-800" />

          </div>

        </div>

      </div>
    );
  }

  /* =========================================================
     EMPTY CART
  ========================================================= */

  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">

        <div className="max-w-md text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/30 dark:text-indigo-400">
            <ShoppingBag size={38} />
          </div>

          <h1 className="mt-6 text-3xl font-black text-slate-900 dark:text-white">
            Your cart is empty
          </h1>

          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Add some products before proceeding to
            checkout.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">

          <button
            onClick={() => navigate("/cart")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            <ArrowLeft size={17} />
            Back to Cart
          </button>

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <CreditCard size={22} />
            </div>

            <div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Checkout
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Complete your order securely.
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            CHECKOUT STEPS
        ================================================= */}

        <div className="mb-8 hidden items-center sm:flex">

          <div className="flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
              <CheckCircle2 size={17} />
            </div>

            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              Cart
            </span>

          </div>

          <div className="mx-4 h-px flex-1 bg-indigo-200 dark:bg-indigo-900" />

          <div className="flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
              2
            </div>

            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              Checkout
            </span>

          </div>

          <div className="mx-4 h-px flex-1 bg-slate-200 dark:bg-slate-800" />

          <div className="flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-400 dark:bg-slate-800">
              3
            </div>

            <span className="text-sm font-bold text-slate-400">
              Complete
            </span>

          </div>

        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid items-start gap-6 lg:grid-cols-3">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-6 lg:col-span-2">

            {/* =================================================
                SHIPPING ADDRESS
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

              <div className="border-b border-slate-200 p-6 dark:border-slate-800">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                    <MapPin size={19} />
                  </div>

                  <div>

                    <h2 className="text-xl font-black">
                      Shipping Address
                    </h2>

                    <p className="text-xs text-slate-400">
                      Where should we deliver your order?
                    </p>

                  </div>

                </div>

              </div>

              <div className="p-6">

                <div className="grid gap-5 md:grid-cols-2">

                  {/* Full Name */}

                  <div>

                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      Full Name
                    </label>

                    <div className="relative">

                      <User
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        name="fullName"
                        value={
                          shippingAddress.fullName
                        }
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-950 dark:focus:ring-indigo-950"
                      />

                    </div>

                  </div>

                  {/* Phone */}

                  <div>

                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      Phone Number
                    </label>

                    <div className="relative">

                      <Phone
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="tel"
                        name="phone"
                        value={
                          shippingAddress.phone
                        }
                        onChange={handleChange}
                        placeholder="10-digit phone number"
                        maxLength={10}
                        autoComplete="tel"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-950 dark:focus:ring-indigo-950"
                      />

                    </div>

                  </div>

                  {/* Address */}

                  <div className="md:col-span-2">

                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      Complete Address
                    </label>

                    <div className="relative">

                      <Home
                        size={17}
                        className="absolute left-4 top-4 text-slate-400"
                      />

                      <textarea
                        name="address"
                        value={
                          shippingAddress.address
                        }
                        onChange={handleChange}
                        placeholder="House number, street, area..."
                        rows={3}
                        autoComplete="street-address"
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-950 dark:focus:ring-indigo-950"
                      />

                    </div>

                  </div>

                  {/* City */}

                  <div>

                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={
                        shippingAddress.city
                      }
                      onChange={handleChange}
                      placeholder="City"
                      autoComplete="address-level2"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-950 dark:focus:ring-indigo-950"
                    />

                  </div>

                  {/* State */}

                  <div>

                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={
                        shippingAddress.state
                      }
                      onChange={handleChange}
                      placeholder="State"
                      autoComplete="address-level1"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-950 dark:focus:ring-indigo-950"
                    />

                  </div>

                  {/* Pincode */}

                  <div>

                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={
                        shippingAddress.pincode
                      }
                      onChange={handleChange}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      inputMode="numeric"
                      autoComplete="postal-code"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-950 dark:focus:ring-indigo-950"
                    />

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                PAYMENT
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

              <div className="border-b border-slate-200 p-6 dark:border-slate-800">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                    <CreditCard size={19} />
                  </div>

                  <div>

                    <h2 className="text-xl font-black">
                      Payment Method
                    </h2>

                    <p className="text-xs text-slate-400">
                      Choose how you'd like to pay.
                    </p>

                  </div>

                </div>

              </div>

              <div className="p-6">

                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition-all ${
                    paymentMethod === "COD"
                      ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100 dark:border-indigo-500 dark:bg-indigo-950/20 dark:ring-indigo-950"
                      : "border-slate-200 hover:border-indigo-200 dark:border-slate-700 dark:hover:border-indigo-800"
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={
                      paymentMethod === "COD"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                    className="h-5 w-5 accent-indigo-600"
                  />

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm dark:bg-slate-800 dark:text-emerald-400">
                    <Truck size={21} />
                  </div>

                  <div className="flex-1">

                    <div className="flex items-center justify-between gap-3">

                      <h3 className="font-black">
                        Cash on Delivery
                      </h3>

                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                        AVAILABLE
                      </span>

                    </div>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Pay when your order arrives at your
                      doorstep.
                    </p>

                  </div>

                </label>

                <div className="mt-4 flex items-start gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">

                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-500"
                  />

                  <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Your order information is securely
                    processed. You will only be charged
                    according to the selected payment
                    method.
                  </p>

                </div>

              </div>

            </section>

          </div>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <aside className="lg:sticky lg:top-24">

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

              <div className="border-b border-slate-200 p-6 dark:border-slate-800">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400">
                    <Package size={19} />
                  </div>

                  <div>

                    <h2 className="text-xl font-black">
                      Order Summary
                    </h2>

                    <p className="text-xs text-slate-400">
                      {cart.length}{" "}
                      {cart.length === 1
                        ? "item"
                        : "items"}
                    </p>

                  </div>

                </div>

              </div>

              <div className="p-6">

                {/* Products */}

                <div className="max-h-80 space-y-4 overflow-y-auto pr-1">

                  {cart.map((item) => {

                    const product =
                      item.product;

                    const image =
                      product?.images?.length
                        ? product.images[0].url
                        : "https://via.placeholder.com/100";

                    const itemTotal =
                      Number(
                        product?.price || 0
                      ) *
                      Number(
                        item.quantity || 0
                      );

                    return (
                      <div
                        key={item._id}
                        className="flex gap-3"
                      >

                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">

                          <img
                            src={image}
                            alt={product?.name}
                            className="h-full w-full object-cover"
                          />

                          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                            {item.quantity}
                          </span>

                        </div>

                        <div className="min-w-0 flex-1">

                          <h3 className="line-clamp-2 text-sm font-bold">
                            {product?.name}
                          </h3>

                          <p className="mt-1 text-xs text-slate-400">
                            ₹{product?.price} ×{" "}
                            {item.quantity}
                          </p>

                        </div>

                        <p className="text-sm font-black">
                          ₹{itemTotal}
                        </p>

                      </div>
                    );
                  })}

                </div>

                {/* Totals */}

                <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 dark:border-slate-800">

                  <div className="flex justify-between text-sm">

                    <span className="text-slate-500 dark:text-slate-400">
                      Subtotal
                    </span>

                    <span className="font-bold">
                      ₹{subtotal}
                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span className="text-slate-500 dark:text-slate-400">
                      Shipping
                    </span>

                    <span
                      className={
                        shippingCharge === 0
                          ? "font-bold text-emerald-600 dark:text-emerald-400"
                          : "font-bold"
                      }
                    >
                      {shippingCharge === 0
                        ? "FREE"
                        : `₹${shippingCharge}`}
                    </span>

                  </div>

                  {shippingCharge > 0 && (
                    <div className="rounded-xl bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                      Add ₹
                      {1000 - subtotal} more
                      for free shipping.
                    </div>
                  )}

                  <div className="border-t border-slate-200 pt-4 dark:border-slate-800">

                    <div className="flex items-end justify-between">

                      <span className="font-bold">
                        Total
                      </span>

                      <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                        ₹{total}
                      </span>

                    </div>

                  </div>

                </div>

                {/* Place Order */}

                <button
                  type="button"
                  onClick={placeOrder}
                  disabled={placingOrder}
                  className="group mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-indigo-950"
                >

                  {placingOrder ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Place Order
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}

                </button>

                {/* Secure note */}

                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
                  <ShieldCheck size={15} />
                  Secure checkout
                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default Checkout;