import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setWishlist([]);
        setWishlistCount(0);
        return;
      }

      const { data } = await api.get("/wishlist");

      setWishlist(data.wishlist);
      setWishlistCount(data.count);
    } catch (error) {
      setWishlist([]);
      setWishlistCount(0);
    }
  };

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

export const useWishlist = () => useContext(WishlistContext);