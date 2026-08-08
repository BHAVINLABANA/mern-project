import { useEffect, useState } from "react";
import api from "../../services/api";
import ProductCard from "../../components/customer/ProductCard";

import {
  Search,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  PackageSearch,
  RefreshCw,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

function Home() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("-createdAt");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [keyword, category, sort]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get(
        `/products/customer?keyword=${encodeURIComponent(
          keyword
        )}&category=${encodeURIComponent(category)}&sort=${sort}`
      );

      console.log("PRODUCTS FROM API:", data.products);
      
      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setKeyword("");
    setCategory("");
    setSort("-createdAt");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative overflow-hidden">
        {/* Background decoration */}

        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-600/10" />

        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-600/10" />

        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14 lg:pt-12">

          <div className="grid items-center gap-10 lg:grid-cols-2">

            {/* Hero Text */}

            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-400">
                <Sparkles size={16} />
                Your everyday shopping destination
              </div>

              <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                Discover products
                <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                  you'll love.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-400">
                Explore our latest collection of quality products, discover
                great deals, and find everything you need in one place.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#products"
                  className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:shadow-indigo-950"
                >
                  Shop Now
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>

                <a
                  href="#products"
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-700 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                >
                  Explore Products
                </a>
              </div>
            </div>

            {/* Hero Visual */}

            <div className="relative hidden lg:block">
              <div className="relative mx-auto flex h-[360px] max-w-[500px] items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 shadow-2xl shadow-indigo-200 dark:shadow-indigo-950">

                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
                <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10" />

                <div className="relative text-center text-white">
                  <ShoppingBag
                    size={90}
                    strokeWidth={1.3}
                    className="mx-auto mb-5 opacity-95"
                  />

                  <p className="text-3xl font-black">
                    MERN Shop
                  </p>

                  <p className="mt-2 text-sm text-indigo-100">
                    Simple. Modern. Convenient.
                  </p>
                </div>
              </div>

              {/* Floating badge */}

              <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/95 p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900/95">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Secure Shopping
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Shop with confidence
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-slate-200 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8 dark:divide-slate-800">

          <div className="flex items-center gap-4 px-4 py-6 sm:justify-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Truck size={21} />
            </div>

            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                Fast Delivery
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Get your orders quickly
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 py-6 sm:justify-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <ShieldCheck size={21} />
            </div>

            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                Secure Payment
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Safe and reliable checkout
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 py-6 sm:justify-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
              <RotateCcw size={21} />
            </div>

            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                Easy Returns
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Hassle-free shopping
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================
          PRODUCTS SECTION
      ===================================================== */}

      <section
        id="products"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      >

        {/* Section Header */}

        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <PackageSearch size={17} />
              Our Collection
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Latest Products
            </h2>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Discover our newest products and find something you'll love.
            </p>
          </div>

          {!loading && (
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              {products.length}{" "}
              {products.length === 1 ? "product" : "products"}
            </div>
          )}

        </div>

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="flex flex-col gap-3 lg:flex-row">

            {/* Search */}

            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search products..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-950 dark:focus:ring-indigo-950"
              />
            </div>

            {/* Category */}

            <div className="relative lg:w-56">
              <SlidersHorizontal
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
              />
            </div>

            {/* Sort */}

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-950 lg:w-48"
            >
              <option value="-createdAt">Newest</option>
              <option value="createdAt">Oldest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>

            {/* Clear */}

            {(keyword || category || sort !== "-createdAt") && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-rose-900 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
              >
                <RefreshCw size={17} />
                Reset
              </button>
            )}

          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-center dark:border-rose-900 dark:bg-rose-950/30">
            <p className="font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </p>

            <button
              onClick={fetchProducts}
              className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="aspect-square animate-pulse bg-slate-200 dark:bg-slate-800" />

                <div className="space-y-3 p-5">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}

          </div>
        ) : products.length > 0 ? (

          /* =================================================
             PRODUCT GRID
          ================================================= */

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}

          </div>

        ) : (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <PackageSearch size={30} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              No products found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              We couldn't find any products matching your search. Try
              changing your search or clearing the filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 dark:shadow-indigo-950"
            >
              Clear Filters
            </button>

          </div>
        )}

      </section>

    </div>
  );
}

export default Home;