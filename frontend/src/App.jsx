import { Routes, Route } from "react-router-dom";

import Home from "./pages/customer/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/vendor/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Products from "./pages/vendor/Products";
import AddProduct from "./pages/vendor/AddProduct";
import EditProduct from "./pages/vendor/EditProduct";
import ProductDetails from "./pages/customer/ProductDetails";
import Cart from "./pages/customer/Cart";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute role="vendor">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/products"
          element={
            <ProtectedRoute role="vendor">
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/products/add"
          element={
            <ProtectedRoute role="vendor">
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/products/edit/:id"
          element={
            <ProtectedRoute role="vendor">
              <EditProduct />
            </ProtectedRoute>
          }
        />

        <Route path="/product/:id" element={<ProductDetails />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute role="customer">
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;