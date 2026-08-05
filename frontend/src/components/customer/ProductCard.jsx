import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useWishlist } from "../../context/WishlistContext";

function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);

  const { wishlist, fetchWishlist } = useWishlist();

  const wishlistItem = wishlist.find(
    (item) => item.product._id === product._id
  );

  const isWishlisted = Boolean(wishlistItem);

  const toggleWishlist = async () => {
    if (loading) return;

    try {
      setLoading(true);

      if (isWishlisted) {
        const res = await api.delete(`/wishlist/${wishlistItem._id}`);
        console.log("DELETE SUCCESS:", res.data);
        toast.success("Removed from Wishlist");
      } else {
        const res = await api.post("/wishlist", {
          productId: product._id,
        });
        console.log("ADD SUCCESS:", res.data);
        toast.success("Added to Wishlist ❤️");
      }

      await fetchWishlist();
    } catch (error) {
      console.log("FULL ERROR:", error);

      if (error.response) {
        console.log("STATUS:", error.response.status);
        console.log("DATA:", error.response.data);
      }

      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        disabled={loading}
        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-red-50 z-10"
      >
        <span
          className={`text-2xl ${
            isWishlisted ? "text-red-500" : "text-gray-400"
          }`}
        >
          {isWishlisted ? "❤️" : "🤍"}
        </span>
      </button>

      {/* Product Image */}
      <img
        src={
          product.images?.length
            ? product.images[0].url
            : "https://via.placeholder.com/300x250?text=No+Image"
        }
        alt={product.name}
        className="w-full h-56 object-cover"
      />

      <div className="p-4">

        <h2 className="text-lg font-semibold line-clamp-1">
          {product.name}
        </h2>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-yellow-500">
            {"★".repeat(Math.round(product.averageRating || 0))}
            {"☆".repeat(5 - Math.round(product.averageRating || 0))}
          </span>

          <span className="text-sm text-gray-500">
            ({product.numReviews || 0})
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-3 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-4 flex justify-between items-center">

          <span className="text-2xl font-bold text-blue-600">
            ₹{product.price}
          </span>

          <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
            {product.category}
          </span>

        </div>

        <Link
          to={`/product/${product._id}`}
          className="block mt-5 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          View Details
        </Link>

      </div>
    </div>
  );
}

export default ProductCard;