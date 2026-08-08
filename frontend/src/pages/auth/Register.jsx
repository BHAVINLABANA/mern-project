import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShoppingBag,
  User,
  UserPlus,
  Store,
  ShieldCheck,
} from "lucide-react";

import api from "../../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] =
    useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/auth/register",
        formData
      );

      toast.success(
        "Registration successful! Please login."
      );

      /*
       * If your backend returns a token during
       * registration, keep it.
       */

      if (res.data.token) {
        localStorage.setItem(
          "token",
          res.data.token
        );
      }

      /*
       * Some backends also return the created user.
       * Save it only when available.
       */

      if (res.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );
      }

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "customer",
      });

      /*
       * Your existing flow goes to login after
       * registration.
       */

      navigate("/login");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-10 transition-colors duration-300 dark:bg-slate-950 sm:px-6">

      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30 lg:grid-cols-2">

        {/* =================================================
            LEFT BRAND PANEL
        ================================================= */}

        <div className="relative hidden overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">

          {/* Decorative elements */}

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10" />

          <div className="relative">

            {/* Logo */}

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                <ShoppingBag size={23} />
              </div>

              <span className="text-xl font-black">
                MERN
                <span className="text-indigo-200">
                  Shop
                </span>
              </span>

            </div>

            {/* Content */}

            <div className="mt-20 max-w-md">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                <ShieldCheck size={16} />
                Join our community
              </div>

              <h1 className="text-4xl font-black leading-tight">
                Start your
                <span className="block text-indigo-200">
                  shopping journey.
                </span>
              </h1>

              <p className="mt-5 leading-7 text-indigo-100">
                Create your MERN Shop account and
                discover products, save your favorites,
                and manage your orders with ease.
              </p>

            </div>

          </div>

          {/* Bottom */}

          <div className="relative flex items-center gap-3 text-sm text-indigo-100">

            <div className="flex -space-x-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-indigo-600 bg-indigo-400">
                🛍️
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-indigo-600 bg-violet-400">
                ❤️
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-indigo-600 bg-purple-400">
                ⭐
              </div>

            </div>

            <span>
              Simple. Modern. Convenient.
            </span>

          </div>

        </div>

        {/* =================================================
            REGISTER FORM
        ================================================= */}

        <div className="p-6 sm:p-10 lg:p-12">

          {/* Mobile Logo */}

          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg">
              <ShoppingBag size={22} />
            </div>

            <span className="text-xl font-black text-slate-900 dark:text-white">
              MERN
              <span className="text-indigo-600 dark:text-indigo-400">
                Shop
              </span>
            </span>

          </div>

          {/* Heading */}

          <div className="mb-8">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
              <UserPlus size={22} />
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Create your account
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Join MERN Shop and start shopping today.
            </p>

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* =================================================
                NAME
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                Full Name
              </label>

              <div className="relative">

                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
                />

              </div>

            </div>

            {/* =================================================
                EMAIL
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-950 dark:focus:ring-indigo-950"
                />

              </div>

            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-950 dark:focus:ring-indigo-950"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Password must contain at least 6
                characters.
              </p>

            </div>

            {/* =================================================
                ACCOUNT TYPE
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                Account Type
              </label>

              <div className="grid grid-cols-2 gap-3">

                {/* Customer */}

                <label
                  className={`relative cursor-pointer rounded-xl border p-4 transition-all ${
                    formData.role === "customer"
                      ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100 dark:border-indigo-500 dark:bg-indigo-950/30 dark:ring-indigo-950"
                      : "border-slate-200 bg-slate-50 hover:border-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-indigo-800"
                  }`}
                >

                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={
                      formData.role ===
                      "customer"
                    }
                    onChange={handleChange}
                    className="sr-only"
                  />

                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        formData.role ===
                        "customer"
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-slate-400 dark:bg-slate-900"
                      }`}
                    >
                      <User size={18} />
                    </div>

                    <div>

                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Customer
                      </p>

                      <p className="text-[11px] text-slate-400">
                        Shop products
                      </p>

                    </div>

                  </div>

                </label>

                {/* Vendor */}

                <label
                  className={`relative cursor-pointer rounded-xl border p-4 transition-all ${
                    formData.role === "vendor"
                      ? "border-violet-500 bg-violet-50 ring-2 ring-violet-100 dark:border-violet-500 dark:bg-violet-950/30 dark:ring-violet-950"
                      : "border-slate-200 bg-slate-50 hover:border-violet-200 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-violet-800"
                  }`}
                >

                  <input
                    type="radio"
                    name="role"
                    value="vendor"
                    checked={
                      formData.role ===
                      "vendor"
                    }
                    onChange={handleChange}
                    className="sr-only"
                  />

                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        formData.role ===
                        "vendor"
                          ? "bg-violet-600 text-white"
                          : "bg-white text-slate-400 dark:bg-slate-900"
                      }`}
                    >
                      <Store size={18} />
                    </div>

                    <div>

                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Vendor
                      </p>

                      <p className="text-[11px] text-slate-400">
                        Sell products
                      </p>

                    </div>

                  </div>

                </label>

              </div>

            </div>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-indigo-950"
            >

              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}

            </button>

          </form>

          {/* =================================================
              LOGIN LINK
          ================================================= */}

          <div className="my-7 flex items-center gap-3">

            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Already registered?
            </span>

            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

          </div>

          <Link
            to="/login"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-800 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
          >
            <LogInIcon />
            Sign In Instead
          </Link>

          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            By creating an account, you agree to our
            terms and conditions.
          </p>

        </div>

      </div>

    </div>
  );
}

/* Small wrapper so the login icon remains clean */

function LogInIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line
        x1="15"
        y1="12"
        x2="3"
        y2="12"
      />
    </svg>
  );
}

export default Register;