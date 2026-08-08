import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Store as StoreIcon,
  MapPin,
  Phone,
  FileText,
  Save,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function Store() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [exists, setExists] = useState(false);

  const [store, setStore] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
  });

  /* =========================================================
     FETCH STORE
  ========================================================= */

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/stores/my-store"
      );

      if (data.store) {
        setStore({
          name: data.store.name || "",
          description:
            data.store.description || "",
          address: data.store.address || "",
          phone: data.store.phone || "",
        });

        setExists(true);
      } else {
        setExists(false);
      }
    } catch (error) {
      console.error(
        "Fetch Store Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load store."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     HANDLE CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setStore((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!store.name.trim()) {
      toast.error("Store name is required.");
      return;
    }

    try {
      setSaving(true);

      if (exists) {
        await api.put("/stores", store);

        toast.success(
          "Store updated successfully."
        );
      } else {
        await api.post("/stores", store);

        toast.success(
          "Store created successfully."
        );

        setExists(true);
      }
    } catch (error) {
      console.error(
        "Store Save Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to save store."
      );
    } finally {
      setSaving(false);
    }
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

          <div className="mt-8 max-w-4xl rounded-2xl bg-slate-200 p-8 dark:bg-slate-800">

            <div className="space-y-6">

              <div className="h-12 rounded-lg bg-slate-300 dark:bg-slate-700" />

              <div className="h-28 rounded-lg bg-slate-300 dark:bg-slate-700" />

              <div className="h-12 rounded-lg bg-slate-300 dark:bg-slate-700" />

              <div className="h-24 rounded-lg bg-slate-300 dark:bg-slate-700" />

              <div className="h-12 w-40 rounded-lg bg-slate-300 dark:bg-slate-700" />

            </div>

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

          <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <StoreIcon size={17} />
            Vendor Store
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {exists
              ? "Manage Your Store"
              : "Create Your Store"}
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Manage your store information and
            customer-facing details.
          </p>

        </div>

        <button
          type="button"
          onClick={fetchStore}
          disabled={loading || saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      {/* =====================================================
          STORE STATUS
      ===================================================== */}

      <div
        className={`mb-6 flex items-center gap-3 rounded-2xl border p-4 ${
          exists
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20"
            : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20"
        }`}
      >

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            exists
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
              : "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
          }`}
        >
          {exists ? (
            <CheckCircle2 size={20} />
          ) : (
            <StoreIcon size={20} />
          )}
        </div>

        <div>

          <p
            className={`font-bold ${
              exists
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-amber-700 dark:text-amber-400"
            }`}
          >
            {exists
              ? "Your store is active"
              : "Your store has not been created yet"}
          </p>

          <p
            className={`mt-0.5 text-sm ${
              exists
                ? "text-emerald-600/80 dark:text-emerald-400/80"
                : "text-amber-600/80 dark:text-amber-400/80"
            }`}
          >
            {exists
              ? "Keep your store information updated for customers."
              : "Complete the information below to create your store."}
          </p>

        </div>

      </div>

      {/* =====================================================
          FORM
      ===================================================== */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Form */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">

          <div className="border-b border-slate-200 p-6 dark:border-slate-800">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <StoreIcon size={20} />
              </div>

              <div>

                <h2 className="text-xl font-black">
                  Store Information
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Enter the details customers should see.
                </p>

              </div>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6"
          >

            {/* Store Name */}

            <div>

              <label className="mb-2 block text-sm font-bold">
                Store Name
              </label>

              <div className="relative">

                <StoreIcon
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="name"
                  value={store.name}
                  onChange={handleChange}
                  placeholder="Enter your store name"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
                  required
                />

              </div>

            </div>

            {/* Description */}

            <div>

              <label className="mb-2 block text-sm font-bold">
                Store Description
              </label>

              <div className="relative">

                <FileText
                  size={18}
                  className="absolute left-3 top-3 text-slate-400"
                />

                <textarea
                  name="description"
                  rows="5"
                  value={store.description}
                  onChange={handleChange}
                  placeholder="Tell customers about your store..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
                />

              </div>

            </div>

            {/* Phone */}

            <div>

              <label className="mb-2 block text-sm font-bold">
                Phone Number
              </label>

              <div className="relative">

                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="tel"
                  name="phone"
                  value={store.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
                />

              </div>

            </div>

            {/* Address */}

            <div>

              <label className="mb-2 block text-sm font-bold">
                Store Address
              </label>

              <div className="relative">

                <MapPin
                  size={18}
                  className="absolute left-3 top-3 text-slate-400"
                />

                <textarea
                  name="address"
                  rows="3"
                  value={store.address}
                  onChange={handleChange}
                  placeholder="Enter your complete store address"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
                />

              </div>

            </div>

            {/* Submit */}

            <div className="border-t border-slate-200 pt-6 dark:border-slate-800">

              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-indigo-950"
              >

                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    {exists
                      ? "Update Store"
                      : "Create Store"}
                  </>
                )}

              </button>

            </div>

          </form>

        </section>

        {/* Preview */}

        <aside>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">

              <StoreIcon size={28} />

              <h2 className="mt-5 text-xl font-black">
                Store Preview
              </h2>

              <p className="mt-1 text-sm text-white/75">
                This is how your store information is organized.
              </p>

            </div>

            <div className="space-y-5 p-6">

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Store Name
                </p>

                <p className="mt-1 font-black">
                  {store.name ||
                    "Your Store Name"}
                </p>

              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Description
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {store.description ||
                    "Your store description will appear here."}
                </p>

              </div>

              <div className="border-t border-slate-200 pt-5 dark:border-slate-800">

                <div className="flex items-start gap-3">

                  <Phone
                    size={17}
                    className="mt-0.5 shrink-0 text-indigo-500"
                  />

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {store.phone ||
                        "Not provided"}
                    </p>

                  </div>

                </div>

              </div>

              <div className="flex items-start gap-3">

                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-indigo-500"
                />

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Address
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-400">
                    {store.address ||
                      "Not provided"}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </aside>

      </div>

    </DashboardLayout>
  );
}

export default Store;