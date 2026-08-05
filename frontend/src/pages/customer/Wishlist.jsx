import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useWishlist } from "../../context/WishlistContext";

function Wishlist() {
  const [loading, setLoading] = useState(true);

  const { wishlist, fetchWishlist } = useWishlist();

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      await fetchWishlist();
      setLoading(false);
    };

    loadWishlist();
  }, []);

  const removeItem = async (id) => {
    try {
      await api.delete(`/wishlist/${id}`);

      toast.success("Removed from wishlist");

      await fetchWishlist();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">
        ❤️ My Wishlist
      </h1>

      {wishlist.length === 0 ? (

        <div className="text-center py-20">

          <h2 className="text-3xl font-bold">
            Your Wishlist is Empty
          </h2>

          <p className="text-gray-500 mt-3">
            Save products you like and buy them later.
          </p>

          <Link
            to="/"
            className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
          >
            Continue Shopping
          </Link>

        </div>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {wishlist.map((item) => (

            <div
              key={item._id}
              className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
            >

              <img
                src={
                  item.product.images?.length
                    ? item.product.images[0].url
                    : "https://via.placeholder.com/300"
                }
                alt={item.product.name}
                className="w-full h-56 object-cover"
              />

              <div className="p-5">

                <h2 className="text-xl font-bold">
                  {item.product.name}
                </h2>

                <p className="text-blue-600 text-2xl font-bold mt-2">
                  ₹{item.product.price}
                </p>

                <div className="flex gap-3 mt-5">

                  <Link
                    to={`/product/${item.product._id}`}
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-5 rounded-lg"
                  >
                    Remove
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Wishlist;