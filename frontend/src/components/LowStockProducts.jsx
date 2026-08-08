import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Package,
  CheckCircle2,
} from "lucide-react";

function LowStockProducts({ products = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex items-center justify-between gap-3">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
            <AlertTriangle size={21} />
          </div>

          <div>

            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Low Stock
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Products that need attention
            </p>

          </div>

        </div>

        {products.length > 0 && (
          <span className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
            {products.length}{" "}
            {products.length === 1
              ? "Product"
              : "Products"}
          </span>
        )}

      </div>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 px-4 py-10 text-center dark:border-emerald-900 dark:bg-emerald-950/20">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 size={24} />
          </div>

          <h3 className="mt-4 font-bold text-emerald-700 dark:text-emerald-400">
            Stock Looks Good
          </h3>

          <p className="mt-1 text-sm text-emerald-600/80 dark:text-emerald-400/70">
            All your products have sufficient stock.
          </p>

        </div>
      ) : (

        /* =====================================================
           PRODUCT LIST
        ===================================================== */

        <div className="space-y-3">

          {products.map((product) => {

            const stock = Number(product.stock) || 0;

            const critical = stock <= 2;

            return (
              <div
                key={product._id}
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
              >

                {/* Product Icon */}

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <Package size={18} />
                </div>

                {/* Product Name */}

                <div className="min-w-0 flex-1">

                  <h3 className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                    {product.name}
                  </h3>

                  {product.category && (
                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {product.category}
                    </p>
                  )}

                </div>

                {/* Stock */}

                <span
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                    critical
                      ? "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
                      : "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                  }`}
                >
                  {stock}{" "}
                  {stock === 1 ? "Left" : "Left"}
                </span>

              </div>
            );
          })}

        </div>
      )}

      {/* =====================================================
          FOOTER
      ===================================================== */}

      {products.length > 0 && (
        <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800">

          <Link
            to="/vendor/products"
            className="group flex items-center justify-center gap-2 text-sm font-bold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400"
          >
            Manage Products

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

        </div>
      )}

    </div>
  );
}

export default LowStockProducts;