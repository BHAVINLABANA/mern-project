import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  // =========================================================
  // FETCH WISHLIST
  // =========================================================

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setWishlist([]);
        setWishlistCount(0);
        return;
      }

      let user = null;

      try {
        user = JSON.parse(
          localStorage.getItem("user")
        );
      } catch {
        user = null;
      }

      // Wishlist is only available for customers
      if (user?.role !== "customer") {
        setWishlist([]);
        setWishlistCount(0);
        return;
      }

      const { data } = await api.get("/wishlist");

      setWishlist(
        Array.isArray(data?.wishlist)
          ? data.wishlist
          : []
      );

      setWishlistCount(
        Number(data?.count || 0)
      );
    } catch (error) {
      console.error(
        "Wishlist Error:",
        error.response?.data || error
      );

      setWishlist([]);
      setWishlistCount(0);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// =========================================================
// CUSTOM HOOK
// =========================================================

export const useWishlist = () =>
  useContext(WishlistContext);