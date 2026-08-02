import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setCartCount(0);
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));

      if (user?.role !== "customer") {
        setCartCount(0);
        return;
      }

      const { data } = await api.get("/cart");

      setCartCount(data.count);
    } catch (error) {
      setCartCount(0);
    }
  };

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

export const useCart = () => useContext(CartContext);