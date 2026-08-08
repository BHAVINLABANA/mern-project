import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  SearchX,
  ShoppingBag,
} from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">

      <main className="flex min-h-screen items-center justify-center px-4 py-16">

        <div className="w-full max-w-xl text-center">

          {/* Icon */}

          <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">

            <SearchX
              size={52}
              strokeWidth={1.5}
            />

            <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-xs font-black text-white shadow-lg">
              404
            </span>

          </div>

          {/* Heading */}

          <p className="mt-8 text-sm font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            Page Not Found
          </p>

          <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-6xl">
            Oops!
          </h1>

          <h2 className="mt-2 text-2xl font-black text-slate-700 dark:text-slate-200 sm:text-3xl">
            We couldn't find that page.
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            The page you're looking for may have been
            removed, renamed, or the URL might be incorrect.
          </p>

          {/* Actions */}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-800 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
            >
              <ArrowLeft size={17} />
              Go Back
            </button>

            <Link
              to="/"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl dark:shadow-indigo-950"
            >
              <Home size={17} />
              Back to Home

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

          </div>

          {/* Shop link */}

          <div className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800">

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <ShoppingBag size={16} />
              Continue Shopping
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
}

export default NotFound;