import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// =========================
// CUSTOMER PAGES
// =========================
import Home from "./pages/customer/Home";
import ProductDetails from "./pages/customer/ProductDetails";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import MyOrders from "./pages/customer/MyOrders";
import OrderDetails from "./pages/customer/OrderDetails";
import Wishlist from "./pages/customer/Wishlist";

// =========================
// AUTH PAGES
// =========================
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// =========================
// VENDOR PAGES
// =========================
import Dashboard from "./pages/vendor/Dashboard";
import Products from "./pages/vendor/Products";
import AddProduct from "./pages/vendor/AddProduct";
import EditProduct from "./pages/vendor/EditProduct";
import VendorOrders from "./pages/vendor/VendorOrders";
import Store from "./pages/vendor/Store";

// =========================
// OTHER PAGES / COMPONENTS
// =========================
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  const location = useLocation();

  // Hide customer Navbar on auth and vendor pages
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/vendor");

  return (
    <>
      {/* =========================
          CUSTOMER NAVBAR
      ========================= */}

      {!hideNavbar && <Navbar />}

      {/* =========================
          ROUTES
      ========================= */}

      <Routes>

        {/* =====================================
            PUBLIC ROUTES
        ===================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =====================================
            CUSTOMER ROUTES
        ===================================== */}

        <Route
          path="/cart"
          element={
            <ProtectedRoute role="customer">
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute role="customer">
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute role="customer">
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order/:id"
          element={
            <ProtectedRoute role="customer">
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute role="customer">
              <Wishlist />
            </ProtectedRoute>
          }
        />


        {/* =====================================
            PROFILE
        ===================================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* =====================================
            VENDOR ROUTES
        ===================================== */}

        <Route
          path="/vendor"
          element={
            <ProtectedRoute role="vendor">
              <Navigate
                to="/vendor/dashboard"
                replace
              />
            </ProtectedRoute>
          }
        />

        {/* Vendor Dashboard */}

        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute role="vendor">
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* Vendor Store */}

        <Route
          path="/vendor/store"
          element={
            <ProtectedRoute role="vendor">
              <Store />
            </ProtectedRoute>
          }
        />


        {/* Vendor Products */}

        <Route
          path="/vendor/products"
          element={
            <ProtectedRoute role="vendor">
              <Products />
            </ProtectedRoute>
          }
        />


        {/* Add Product */}

        <Route
          path="/vendor/products/add"
          element={
            <ProtectedRoute role="vendor">
              <AddProduct />
            </ProtectedRoute>
          }
        />


        {/* Edit Product */}

        <Route
          path="/vendor/products/edit/:id"
          element={
            <ProtectedRoute role="vendor">
              <EditProduct />
            </ProtectedRoute>
          }
        />


        {/* Vendor Orders */}

        <Route
          path="/vendor/orders"
          element={
            <ProtectedRoute role="vendor">
              <VendorOrders />
            </ProtectedRoute>
          }
        />


        {/* =====================================
            404
        ===================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </>
  );
}

export default App;