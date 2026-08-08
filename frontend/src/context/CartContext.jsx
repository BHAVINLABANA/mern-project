import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // =========================================================
  // FETCH CART COUNT
  // =========================================================

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");

      // No login
      if (!token) {
        setCartCount(0);
        return;
      }

      let user;

      try {
        user = JSON.parse(
          localStorage.getItem("user")
        );
      } catch {
        user = null;
      }

      // Cart belongs only to customers
      if (user?.role !== "customer") {
        setCartCount(0);
        return;
      }

      const { data } = await api.get("/cart");

      setCartCount(
        Number(data?.count || 0)
      );
    } catch (error) {
      console.error(
        "Cart Count Error:",
        error.response?.data || error
      );

      setCartCount(0);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        fetchCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// =========================================================
// CUSTOM HOOK
// =========================================================

export const useCart = () =>
  useContext(CartContext);