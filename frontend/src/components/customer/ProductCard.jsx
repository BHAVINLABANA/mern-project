import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Heart,
  Package,
  ShoppingBag,
  Star,
} from "lucide-react";

import api from "../../services/api";
import { useWishlist } from "../../context/WishlistContext";

function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);

  const { wishlist, fetchWishlist } = useWishlist();

  // Prevent rendering a broken product
  if (!product?._id) {
    return null;
  }

  const productId = product._id;

  /* =========================================================
     WISHLIST
  ========================================================= */

  const wishlistItem = wishlist.find(
    (item) => item.product?._id === productId
  );

  const isWishlisted = Boolean(wishlistItem);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    try {
      setLoading(true);

      if (isWishlisted) {
        if (!wishlistItem?._id) {
          toast.error("Wishlist item not found.");
          return;
        }

        await api.delete(
          `/wishlist/${wishlistItem._id}`
        );

        toast.success("Removed from wishlist");
      } else {
        await api.post("/wishlist", {
          productId,
        });

        toast.success("Added to wishlist ❤️");
      }

      await fetchWishlist();
    } catch (error) {
      console.error(
        "Wishlist Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     RATING
  ========================================================= */

  const rating = Math.min(
    5,
    Math.max(
      0,
      Math.round(Number(product.averageRating) || 0)
    )
  );

  /* =========================================================
     STOCK
  ========================================================= */

  const stock = Number(product.stock) || 0;

  const getStockInfo = () => {
    if (stock <= 0) {
      return {
        label: "Out of Stock",
        dot: "bg-rose-500",
        className:
          "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400",
      };
    }

    if (stock <= 5) {
      return {
        label: `Only ${stock} left`,
        dot: "bg-amber-500",
        className:
          "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
      };
    }

    return {
      label: "In Stock",
      dot: "bg-emerald-500",
      className:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
    };
  };

  const stockInfo = getStockInfo();

  /* =========================================================
     IMAGE
  ========================================================= */

  const image =
    product.images?.[0]?.url ||
   "https://via.placeholder.com/600x600?text=No+Image";

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <article
      className="
        group relative flex h-full flex-col
        overflow-hidden rounded-2xl
        border border-slate-200
        bg-white shadow-sm
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl

        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div
        className="
          relative aspect-square overflow-hidden
          bg-slate-100
          dark:bg-slate-800
        "
      >
        <Link
          to={`/product/${productId}`}
          className="block h-full w-full"
        >
          <img
            src={image}
            alt={product.name || "Product"}
            loading="lazy"
            className="
              h-full w-full object-cover
              transition-transform duration-500
              group-hover:scale-105
            "
          />
        </Link>

        {/* Image overlay */}

        <div
          className="
            pointer-events-none absolute inset-0
            bg-gradient-to-t
            from-black/20 via-transparent to-transparent
            opacity-0 transition-opacity duration-300
            group-hover:opacity-100
          "
        />

        {/* =================================================
            WISHLIST
        ================================================= */}

        <button
          type="button"
          onClick={toggleWishlist}
          disabled={loading}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          title={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className={`
            absolute right-3 top-3
            flex h-10 w-10 items-center justify-center
            rounded-full border shadow-lg
            backdrop-blur-md
            transition-all duration-200
            hover:scale-110
            disabled:cursor-not-allowed
            disabled:opacity-60

            ${
              isWishlisted
                ? `
                  border-rose-200
                  bg-rose-50
                  text-rose-500
                  dark:border-rose-900
                  dark:bg-rose-950/70
                  dark:text-rose-400
                `
                : `
                  border-white/70
                  bg-white/95
                  text-slate-500
                  hover:border-rose-200
                  hover:bg-rose-50
                  hover:text-rose-500

                  dark:border-slate-700
                  dark:bg-slate-900/95
                  dark:text-slate-300
                  dark:hover:border-rose-900
                  dark:hover:bg-rose-950/50
                  dark:hover:text-rose-400
                `
            }
          `}
        >
          {loading ? (
            <span
              className="
                h-4 w-4 animate-spin
                rounded-full border-2
                border-current border-t-transparent
              "
            />
          ) : (
            <Heart
              size={19}
              fill={
                isWishlisted
                  ? "currentColor"
                  : "none"
              }
            />
          )}
        </button>

        {/* =================================================
            CATEGORY
        ================================================= */}

        {product.category && (
          <span
            className="
              absolute left-3 top-3
              rounded-full
              border border-white/60
              bg-white/95
              px-3 py-1.5
              text-[11px] font-bold
              text-indigo-600
              shadow-sm
              backdrop-blur

              dark:border-slate-700
              dark:bg-slate-900/95
              dark:text-indigo-400
            "
          >
            {product.category}
          </span>
        )}

        {/* =================================================
            STOCK
        ================================================= */}

        <div className="absolute bottom-3 left-3">
          <span
            className={`
              inline-flex items-center gap-1.5
              rounded-full px-3 py-1.5
              text-[11px] font-bold shadow-sm
              ${stockInfo.className}
            `}
          >
            <span
              className={`
                h-1.5 w-1.5 rounded-full
                ${stockInfo.dot}
              `}
            />

            {stockInfo.label}
          </span>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="flex flex-1 flex-col p-5">

        {/* Product name */}

        <Link
          to={`/product/${productId}`}
          className="
            line-clamp-2 min-h-[3.5rem]
            text-lg font-black tracking-tight
            text-slate-900
            transition-colors
            hover:text-indigo-600

            dark:text-white
            dark:hover:text-indigo-400
          "
        >
          {product.name || "Unnamed Product"}
        </Link>

        {/* =================================================
            RATING
        ================================================= */}

        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(
              (star) => (
                <Star
                  key={star}
                  size={15}
                  className={
                    star <= rating
                      ? "fill-amber-400 text-amber-400"
                      : `
                        fill-slate-100
                        text-slate-300
                        dark:fill-slate-800
                        dark:text-slate-700
                      `
                  }
                />
              )
            )}
          </div>

          <span
            className="
              text-sm font-bold
              text-slate-700
              dark:text-slate-300
            "
          >
            {Number(
              product.averageRating || 0
            ).toFixed(1)}
          </span>

          <span className="text-xs text-slate-400">
            ({product.numReviews || 0})
          </span>
        </div>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <p
          className="
            mt-3 line-clamp-2 min-h-[2.75rem]
            text-sm leading-6
            text-slate-500
            dark:text-slate-400
          "
        >
          {product.description ||
            "Quality product available at MERN Shop."}
        </p>

        {/* =================================================
            PRICE
        ================================================= */}

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p
              className="
                text-[10px] font-bold uppercase
                tracking-wider text-slate-400
              "
            >
              Price
            </p>

            <p
              className="
                mt-0.5 text-2xl font-black
                text-indigo-600
                dark:text-indigo-400
              "
            >
              ₹{Number(product.price || 0).toLocaleString("en-IN")}
            </p>
          </div>

          {product.brand && (
            <span
              className="
                max-w-24 truncate
                text-xs font-semibold
                text-slate-400
              "
            >
              {product.brand}
            </span>
          )}
        </div>

        {/* =================================================
            ACTION
        ================================================= */}

        <Link
          to={`/product/${productId}`}
          className={`
            group/button mt-5
            flex h-11 items-center
            justify-center gap-2
            rounded-xl px-4
            text-sm font-bold
            transition-all

            ${
              stock > 0
                ? `
                  bg-indigo-600
                  text-white
                  hover:bg-indigo-700
                `
                : `
                  cursor-not-allowed
                  bg-slate-200
                  text-slate-400
                  dark:bg-slate-800
                  dark:text-slate-500
                `
            }
          `}
          onClick={(e) => {
            if (stock <= 0) {
              e.preventDefault();
            }
          }}
        >
          {stock > 0 ? (
            <>
              <ShoppingBag size={17} />

              View Product

              <ArrowRight
                size={16}
                className="
                  transition-transform duration-200
                  group-hover/button:translate-x-1
                "
              />
            </>
          ) : (
            <>
              <Package size={17} />
              Currently Unavailable
            </>
          )}
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;