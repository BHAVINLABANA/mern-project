import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Package,
  Tag,
  Trash2,
} from "lucide-react";

import api from "../../services/api";
import { useCart } from "../../context/CartContext";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const { fetchCartCount } = useCart();

  /* =========================================================
     FETCH CART
  ========================================================= */

  useEffect(() => {
    fetchCart();
  }, []);

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
     UPDATE QUANTITY
  ========================================================= */

  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;

    const stock = Number(item.product?.stock || 0);

    if (newQuantity > stock) {
      toast.error(
        `Only ${stock} items available.`
      );
      return;
    }

    try {
      setUpdating(item._id);

      await api.put(`/cart/${item._id}`, {
        quantity: newQuantity,
      });

      await fetchCart();
      await fetchCartCount();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update quantity."
      );
    } finally {
      setUpdating(null);
    }
  };

  /* =========================================================
     REMOVE ITEM
  ========================================================= */

  const removeItem = async (id) => {
    try {
      setUpdating(id);

      await api.delete(`/cart/${id}`);

      toast.success("Item removed from cart.");

      await fetchCart();
      await fetchCartCount();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to remove item."
      );
    } finally {
      setUpdating(null);
    }
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

  const shipping =
    subtotal === 0 || subtotal >= 1000
      ? 0
      : 100;

  const total = subtotal + shipping;

  const remainingForFreeShipping =
    Math.max(0, 1000 - subtotal);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="h-10 w-52 rounded-lg bg-slate-200 dark:bg-slate-800" />

          <div className="mt-3 h-5 w-72 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-8 grid gap-6 lg:grid-cols-3">

            <div className="space-y-4 lg:col-span-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-36 rounded-2xl bg-slate-200 dark:bg-slate-800"
                />
              ))}
            </div>

            <div className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />

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
      <div className="min-h-screen bg-slate-50 px-4 py-16 dark:bg-slate-950">

        <div className="mx-auto max-w-xl text-center">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/30 dark:text-indigo-400">
            <ShoppingCart
              size={45}
              strokeWidth={1.6}
            />
          </div>

          <h1 className="mt-7 text-3xl font-black text-slate-900 dark:text-white">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Looks like you haven't added anything to
            your cart yet.
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
            HEADER
        ================================================= */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>

            <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <ShoppingCart size={17} />
              Shopping Cart
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Your Cart
            </h1>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Review your items before checkout.
            </p>

          </div>

          <div className="self-start rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 sm:self-auto">
            {cart.length}{" "}
            {cart.length === 1 ? "Item" : "Items"}
          </div>

        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="grid items-start gap-6 lg:grid-cols-3">

          {/* =================================================
              CART ITEMS
          ================================================= */}

          <section className="space-y-4 lg:col-span-2">

            {cart.map((item) => {
              const product = item.product;

              const image =
                product?.images?.length
                  ? product.images[0].url
                  : "https://via.placeholder.com/200x200?text=No+Image";

              const itemTotal =
                Number(product?.price || 0) *
                Number(item.quantity || 0);

              const stock = Number(
                product?.stock || 0
              );

              const isUpdating =
                updating === item._id;

              return (
                <article
                  key={item._id}
                  className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5"
                >

                  <div className="flex flex-col gap-5 sm:flex-row">

                    {/* Product Image */}

                    <Link
                      to={`/product/${product?._id}`}
                      className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-32 sm:w-32 dark:bg-slate-800"
                    >
                      <img
                        src={image}
                        alt={product?.name}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </Link>

                    {/* Product Details */}

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-4">

                        <div className="min-w-0">

                          <Link
                            to={`/product/${product?._id}`}
                            className="line-clamp-2 text-lg font-black text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
                          >
                            {product?.name}
                          </Link>

                          {product?.category && (
                            <span className="mt-2 inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                              {product.category}
                            </span>
                          )}

                        </div>

                        {/* Remove */}

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(item._id)
                          }
                          disabled={isUpdating}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                          aria-label="Remove item"
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                      {/* Bottom Section */}

                      <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                        {/* Price */}

                        <div>

                          <p className="text-xs font-semibold text-slate-400">
                            Unit price
                          </p>

                          <p className="mt-1 text-lg font-black text-indigo-600 dark:text-indigo-400">
                            ₹{product?.price}
                          </p>

                        </div>

                        {/* Quantity + Total */}

                        <div className="flex items-center justify-between gap-4 sm:justify-end">

                          {/* Quantity */}

                          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-950">

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item,
                                  item.quantity - 1
                                )
                              }
                              disabled={
                                item.quantity <= 1 ||
                                isUpdating
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-white hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                            >
                              <Minus size={16} />
                            </button>

                            <span className="flex w-10 items-center justify-center text-sm font-black">

                              {isUpdating ? (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                              ) : (
                                item.quantity
                              )}

                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item,
                                  item.quantity + 1
                                )
                              }
                              disabled={
                                isUpdating ||
                                item.quantity >= stock
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-white hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                            >
                              <Plus size={16} />
                            </button>

                          </div>

                          {/* Item Total */}

                          <div className="text-right">

                            <p className="text-xs font-semibold text-slate-400">
                              Total
                            </p>

                            <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                              ₹{itemTotal}
                            </p>

                          </div>

                        </div>

                      </div>

                      {/* Stock Warning */}

                      {stock > 0 &&
                        item.quantity >= stock && (
                          <p className="mt-3 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            Maximum available quantity reached.
                          </p>
                        )}

                      {stock === 0 && (
                        <p className="mt-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                          This product is currently out of stock.
                        </p>
                      )}

                    </div>

                  </div>

                </article>
              );
            })}

            {/* Continue Shopping */}

            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-xl px-2 py-3 text-sm font-bold text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
            >
              <ArrowLeft
                size={17}
                className="transition-transform group-hover:-translate-x-1"
              />

              Continue Shopping
            </Link>

          </section>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <aside className="lg:sticky lg:top-24">

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

              {/* Summary Header */}

              <div className="border-b border-slate-200 p-6 dark:border-slate-800">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                    <Tag size={19} />
                  </div>

                  <div>

                    <h2 className="text-xl font-black">
                      Order Summary
                    </h2>

                    <p className="text-xs text-slate-400">
                      {cart.length}{" "}
                      {cart.length === 1
                        ? "item"
                        : "items"}{" "}
                      in your cart
                    </p>

                  </div>

                </div>

              </div>

              <div className="space-y-4 p-6">

                {/* Subtotal */}

                <div className="flex justify-between text-sm">

                  <span className="text-slate-500 dark:text-slate-400">
                    Subtotal
                  </span>

                  <span className="font-bold">
                    ₹{subtotal}
                  </span>

                </div>

                {/* Shipping */}

                <div className="flex justify-between text-sm">

                  <span className="text-slate-500 dark:text-slate-400">
                    Shipping
                  </span>

                  <span
                    className={
                      shipping === 0
                        ? "font-bold text-emerald-600 dark:text-emerald-400"
                        : "font-bold"
                    }
                  >
                    {shipping === 0
                      ? "FREE"
                      : `₹${shipping}`}
                  </span>

                </div>

                {/* Free Shipping Message */}

                {shipping > 0 &&
                  remainingForFreeShipping > 0 && (
                    <div className="rounded-xl bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                      Add ₹
                      {remainingForFreeShipping} more
                      to unlock free shipping.
                    </div>
                  )}

                {/* Total */}

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

                {/* Checkout */}

                <Link
                  to={updating ? "#" : "/checkout"}
                  onClick={(e) => {
                    if (updating) {
                      e.preventDefault();

                      toast.error(
                        "Please wait for the cart to update."
                      );
                    }
                  }}
                  className={`group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl dark:shadow-indigo-950 ${
                    updating
                      ? "pointer-events-none opacity-60"
                      : ""
                  }`}
                >
                  Proceed to Checkout

                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

              </div>

            </div>

            {/* Benefits */}

            <div className="mt-4 grid grid-cols-3 gap-2">

              <div className="rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-slate-800 dark:bg-slate-900">

                <Truck
                  size={18}
                  className="mx-auto text-indigo-500"
                />

                <p className="mt-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  Fast Delivery
                </p>

              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-slate-800 dark:bg-slate-900">

                <ShieldCheck
                  size={18}
                  className="mx-auto text-emerald-500"
                />

                <p className="mt-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  Secure
                </p>

              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-slate-800 dark:bg-slate-900">

                <Package
                  size={18}
                  className="mx-auto text-violet-500"
                />

                <p className="mt-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  Quality
                </p>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default Cart;