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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/vendor/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/vendor/products" element={<Products />} />
      <Route
        path="/vendor/products/add"
        element={
          <ProtectedRoute>
            <AddProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendor/products/edit/:id"
        element={
          <ProtectedRoute>
            <EditProduct />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;