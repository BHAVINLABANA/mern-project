import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  Boxes,
  Edit3,
  PackagePlus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =========================================================
     FETCH PRODUCTS
  ========================================================= */

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/products/my-products"
      );

      setProducts(data.products || []);
    } catch (error) {
      console.error("Products Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     DELETE PRODUCT
  ========================================================= */

  const deleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await api.delete(`/products/${id}`);

      setProducts((prev) =>
        prev.filter((product) => product._id !== id)
      );

      toast.success(
        "Product deleted successfully."
      );
    } catch (error) {
      console.error("Delete Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================================================
     CATEGORIES
  ========================================================= */

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.category)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [products]);

  /* =========================================================
     FILTER PRODUCTS
  ========================================================= */

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchValue =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        product.name
          ?.toLowerCase()
          .includes(searchValue) ||
        product.brand
          ?.toLowerCase()
          .includes(searchValue);

      const matchesCategory =
        category === "All" ||
        product.category === category;

      const stock = Number(product.stock) || 0;

      let matchesStock = true;

      if (stockFilter === "In Stock") {
        matchesStock = stock > 5;
      }

      if (stockFilter === "Low Stock") {
        matchesStock = stock > 0 && stock <= 5;
      }

      if (stockFilter === "Out of Stock") {
        matchesStock = stock <= 0;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStock
      );
    });
  }, [
    products,
    search,
    category,
    stockFilter,
  ]);

  /* =========================================================
     STOCK INFO
  ========================================================= */

  const getStockInfo = (stock) => {
    stock = Number(stock) || 0;

    if (stock <= 0) {
      return {
        label: "Out of Stock",
        className:
          "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400",
      };
    }

    if (stock <= 5) {
      return {
        label: `${stock} Left`,
        className:
          "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
      };
    }

    return {
      label: `${stock} In Stock`,
      className:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
    };
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">

          <div className="h-10 w-52 rounded-lg bg-slate-200 dark:bg-slate-800" />

          <div className="mt-3 h-5 w-80 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-8 h-20 rounded-2xl bg-slate-200 dark:bg-slate-800" />

          <div className="mt-6 overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800">
            <div className="h-96" />
          </div>

        </div>
      </DashboardLayout>
    );
  }

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <DashboardLayout>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

        <div>

          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Boxes size={14} />
            Inventory
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            My Products
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Manage your products, inventory and pricing.
          </p>

        </div>

        <Link
          to="/vendor/products/add"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl dark:shadow-indigo-950"
        >
          <PackagePlus size={18} />
          Add Product
        </Link>

      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Products
          </p>

          <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
            {products.length}
          </p>

        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm dark:border-amber-900 dark:bg-amber-950/20">

          <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Low Stock
          </p>

          <p className="mt-2 text-3xl font-black text-amber-700 dark:text-amber-400">
            {
              products.filter(
                (product) =>
                  Number(product.stock) > 0 &&
                  Number(product.stock) <= 5
              ).length
            }
          </p>

        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm dark:border-rose-900 dark:bg-rose-950/20">

          <p className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Out of Stock
          </p>

          <p className="mt-2 text-3xl font-black text-rose-700 dark:text-rose-400">
            {
              products.filter(
                (product) =>
                  Number(product.stock) <= 0
              ).length
            }
          </p>

        </div>

      </div>

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">

          {/* Search */}

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search products or brands..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm font-medium outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-600 dark:focus:ring-indigo-950"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            )}

          </div>

          {/* Category */}

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "All"
                  ? "All Categories"
                  : item}
              </option>
            ))}
          </select>

          {/* Stock */}

          <select
            value={stockFilter}
            onChange={(e) =>
              setStockFilter(e.target.value)
            }
            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
          >
            <option value="All">
              All Stock
            </option>
            <option value="In Stock">
              In Stock
            </option>
            <option value="Low Stock">
              Low Stock
            </option>
            <option value="Out of Stock">
              Out of Stock
            </option>
          </select>

        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">

          <span>
            Showing{" "}
            <strong className="text-slate-600 dark:text-slate-300">
              {filteredProducts.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-600 dark:text-slate-300">
              {products.length}
            </strong>{" "}
            products
          </span>

          {(search ||
            category !== "All" ||
            stockFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
                setStockFilter("All");
              }}
              className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Clear Filters
            </button>
          )}

        </div>

      </div>

      {/* =====================================================
          EMPTY FILTER RESULT
      ===================================================== */}

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            {products.length === 0 ? (
              <PackagePlus size={28} />
            ) : (
              <Search size={28} />
            )}
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-900 dark:text-white">
            {products.length === 0
              ? "No Products Yet"
              : "No Products Found"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
            {products.length === 0
              ? "Start building your store by adding your first product."
              : "Try changing your search or filters."}
          </p>

          {products.length === 0 && (
            <Link
              to="/vendor/products/add"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
            >
              <PackagePlus size={17} />
              Add Your First Product
            </Link>
          )}

        </div>
      ) : (

        /* =====================================================
           PRODUCT TABLE
        ===================================================== */

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="overflow-x-auto">

            <table className="min-w-[900px] w-full">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50">

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                    Product
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                    Category
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                    Price
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                    Stock
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                    Featured
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredProducts.map(
                  (product) => {

                    const stockInfo =
                      getStockInfo(
                        product.stock
                      );

                    const image =
                      product.images?.length
                        ? product.images[0]?.url
                        : null;

                    const isDeleting =
                      deletingId ===
                      product._id;

                    return (
                      <tr
                        key={product._id}
                        className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
                      >

                        {/* Product */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">

                              {image ? (
                                <img
                                  src={image}
                                  alt={
                                    product.name
                                  }
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <Boxes
                                    size={20}
                                    className="text-slate-400"
                                  />
                                </div>
                              )}

                            </div>

                            <div className="min-w-0">

                              <p className="max-w-[260px] truncate text-sm font-black text-slate-900 dark:text-white">
                                {product.name ||
                                  "Unnamed Product"}
                              </p>

                              {product.brand && (
                                <p className="mt-1 text-xs text-slate-400">
                                  {product.brand}
                                </p>
                              )}

                            </div>

                          </div>

                        </td>

                        {/* Category */}

                        <td className="px-5 py-4">

                          {product.category ? (
                            <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                              {product.category}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">
                              —
                            </span>
                          )}

                        </td>

                        {/* Price */}

                        <td className="px-5 py-4">

                          <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                            ₹
                            {Number(
                              product.price ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </span>

                        </td>

                        {/* Stock */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${stockInfo.className}`}
                          >
                            {Number(
                              product.stock
                            ) <= 5 && (
                              <AlertTriangle
                                size={13}
                              />
                            )}

                            {stockInfo.label}
                          </span>

                        </td>

                        {/* Featured */}

                        <td className="px-5 py-4">

                          {product.featured ? (
                            <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-600 dark:bg-violet-950/30 dark:text-violet-400">
                              Featured
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-slate-400">
                              No
                            </span>
                          )}

                        </td>

                        {/* Actions */}

                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-2">

                            <Link
                              to={`/vendor/products/edit/${product._id}`}
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                            >
                              <Edit3 size={14} />
                              Edit
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                deleteProduct(
                                  product._id
                                )
                              }
                              disabled={
                                isDeleting
                              }
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-200 px-3 text-xs font-bold text-rose-600 transition-all hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/30"
                            >
                              {isDeleting ? (
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-300 border-t-rose-600" />
                              ) : (
                                <Trash2 size={14} />
                              )}

                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </DashboardLayout>
  );
}

export default Products;