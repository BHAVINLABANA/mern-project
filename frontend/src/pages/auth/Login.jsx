import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  Mail,
  ShieldCheck,
  ShoppingBag,
  UserPlus,
} from "lucide-react";

import api from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      window.dispatchEvent(
        new Event("storage")
      );

      toast.success("Login successful!");

      /* =====================================================
         ROLE BASED REDIRECT
      ===================================================== */

      if (res.data.user.role === "vendor") {
        navigate("/vendor/dashboard");
      } else if (
        res.data.user.role === "customer"
      ) {
        navigate("/");
      } else if (
        res.data.user.role === "superadmin"
      ) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
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

        <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">

          {/* Decorative circles */}

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10" />

          <div className="relative">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                <ShoppingBag size={23} />
              </div>

              <span className="text-xl font-black">
                MERN<span className="text-indigo-200">
                  Shop
                </span>
              </span>

            </div>

            <div className="mt-20 max-w-md">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                <ShieldCheck size={16} />
                Secure Shopping
              </div>

              <h1 className="text-4xl font-black leading-tight">
                Welcome back to
                <span className="block text-indigo-200">
                  MERN Shop.
                </span>
              </h1>

              <p className="mt-5 leading-7 text-indigo-100">
                Sign in to access your account, manage
                your orders, save your favorite products,
                and continue shopping.
              </p>

            </div>

          </div>

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
              Everything you need, in one place.
            </span>

          </div>

        </div>

        {/* =================================================
            LOGIN FORM
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

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <LogIn size={22} />
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Sign in to continue to your account.
            </p>

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}

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
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
                />

              </div>

            </div>

            {/* Password */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>

              </div>

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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
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

            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-indigo-950"
            >

              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}

            </button>

          </form>

          {/* =================================================
              REGISTER LINK
          ================================================= */}

          <div className="my-7 flex items-center gap-3">

            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              New here?
            </span>

            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

          </div>

          <Link
            to="/register"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-800 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
          >
            <UserPlus size={18} />
            Create an Account
          </Link>

          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            By signing in, you agree to our terms and
            conditions.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;