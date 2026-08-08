import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Heart,
  PackageSearch,
  ShoppingBag,
  Trash2,
  Sparkles,
} from "lucide-react";

import api from "../../services/api";
import { useWishlist } from "../../context/WishlistContext";

function Wishlist() {
  const [loading, setLoading] = useState(true);
  const { wishlist, fetchWishlist } = useWishlist();

  useEffect(() => {
    loadWishlist();
  }, []);

  /* =========================================================
     LOAD WISHLIST
  ========================================================= */

  const loadWishlist = async () => {
    try {
      setLoading(true);
      await fetchWishlist();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load wishlist."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     REMOVE ITEM
  ========================================================= */

  const removeItem = async (id) => {
    try {
      await api.delete(`/wishlist/${id}`);

      toast.success("Removed from wishlist");

      await fetchWishlist();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong."
      );
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">

        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="h-10 w-56 rounded-lg bg-slate-200 dark:bg-slate-800" />

          <div className="mt-3 h-5 w-80 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900"
              >

                <div className="aspect-square bg-slate-200 dark:bg-slate-800" />

                <div className="space-y-3 p-5">

                  <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />

                  <div className="h-6 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />

                  <div className="h-10 w-full rounded bg-slate-200 dark:bg-slate-800" />

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    );
  }

  /* =========================================================
     EMPTY WISHLIST
  ========================================================= */

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16 dark:bg-slate-950">

        <div className="mx-auto max-w-xl text-center">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-rose-50 text-rose-500 dark:bg-rose-950/30 dark:text-rose-400">
            <Heart
              size={44}
              strokeWidth={1.7}
            />
          </div>

          <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Sparkles size={14} />
            Your Wishlist
          </div>

          <h1 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">
            Your Wishlist is Empty
          </h1>

          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Save products you love and come back to
            them whenever you're ready to shop.
          </p>

          <Link
            to="/"
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl dark:shadow-indigo-950"
          >
            <ShoppingBag size={18} />

            Continue Shopping

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

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>

            <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-rose-500">
              <Heart
                size={17}
                fill="currentColor"
              />
              Saved Products
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              My Wishlist
            </h1>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Products you've saved for later.
            </p>

          </div>

          <div className="inline-flex self-start rounded-full bg-rose-50 px-4 py-2 text-sm font-bold text-rose-600 sm:self-auto dark:bg-rose-950/30 dark:text-rose-400">
            {wishlist.length}{" "}
            {wishlist.length === 1
              ? "Item"
              : "Items"}
          </div>

        </div>

        {/* =================================================
            WISHLIST GRID
        ================================================= */}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {wishlist.map((item) => {

            const product = item.product;

            const image =
              product?.images?.length
                ? product.images[0].url
                : "https://via.placeholder.com/500x500?text=No+Image";

            return (
              <article
                key={item._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >

                {/* =================================================
                    IMAGE
                ================================================= */}

                <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">

                  <img
                    src={image}
                    alt={product?.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient */}

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  {/* Wishlist */}

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(item._id)
                    }
                    aria-label="Remove from wishlist"
                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/95 text-rose-500 shadow-lg transition-all hover:scale-105 hover:bg-rose-50 dark:border-slate-700 dark:bg-slate-900/95 dark:hover:bg-rose-950/40"
                  >
                    <Heart
                      size={19}
                      fill="currentColor"
                    />
                  </button>

                </div>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="p-5">

                  <div className="min-h-[3.5rem]">

                    <h2 className="line-clamp-2 text-lg font-black text-slate-900 dark:text-white">
                      {product?.name}
                    </h2>

                  </div>

                  {/* Category */}

                  {product?.category && (
                    <div className="mt-3">

                      <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                        {product.category}
                      </span>

                    </div>
                  )}

                  {/* Price */}

                  <div className="mt-4 flex items-end justify-between">

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Price
                      </p>

                      <p className="mt-1 text-2xl font-black text-indigo-600 dark:text-indigo-400">
                        ₹{product?.price}
                      </p>

                    </div>

                    {product?.stock === 0 ? (
                      <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
                        Out of Stock
                      </span>
                    ) : product?.stock <= 5 ? (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                        {product.stock} left
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                        In Stock
                      </span>
                    )}

                  </div>

                  {/* Actions */}

                  <div className="mt-5 flex gap-2">

                    <Link
                      to={`/product/${product?._id}`}
                      className="group/button flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-700"
                    >
                      View Product

                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover/button:translate-x-0.5"
                      />
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        removeItem(item._id)
                      }
                      aria-label="Remove item"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-rose-900 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                </div>

              </article>
            );
          })}

        </div>

        {/* =================================================
            BOTTOM CTA
        ================================================= */}

        <div className="mt-10 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-6 dark:border-indigo-950 dark:from-indigo-950/30 dark:to-violet-950/30">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400">
                <PackageSearch size={21} />
              </div>

              <div>

                <h3 className="font-black">
                  Looking for something else?
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Explore our latest products and
                  discover something new.
                </p>

              </div>

            </div>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
            >
              Browse Products
              <ArrowRight size={16} />
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Wishlist;