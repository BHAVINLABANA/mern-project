import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import ProductCard from "../../components/customer/ProductCard";
import { useCart } from "../../context/CartContext";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [numReviews, setNumReviews] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const [editingReview, setEditingReview] = useState(null);
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((review) => review.rating === star).length,
  }));
  const { fetchCartCount } = useCart();

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(`/products/${id}`);

      setProduct(data.product);
      if (data.product.images.length > 0) {
         setSelectedImage(data.product.images[0].url);
        }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const { data } = await api.get(`/products/${id}/related`);
      setRelatedProducts(data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/products/${id}/reviews`);

      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setNumReviews(data.numReviews);
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = async () => {
    try {
      await api.post("/cart", {
        productId: product._id,
        quantity: 1,
      });
      fetchCartCount();
      alert("Product added to cart!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add to cart.");
    }
  };

  const submitReview = async () => {
    try {
      await api.post(`/products/${id}/review`, {
        rating,
        comment,
      });

      alert(
        editingReview
          ? "Review updated successfully!"
          : "Review submitted successfully!"
      );

      setEditingReview(null);

      setRating(5);
      setComment("");

      fetchReviews();
      fetchProduct();

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to submit review.");
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await api.delete(`/products/${id}/review/${reviewId}`);

      alert("Review deleted successfully.");

      fetchReviews();
      fetchProduct();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete review.");
    }
  };

  const editReview = (review) => {
    setEditingReview(review);

    setRating(review.rating);
    setComment(review.comment);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-2xl font-semibold">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-2xl font-semibold">
        Product not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Product Details */}
      <div className="grid md:grid-cols-2 gap-12">

        {/* Product Image */}
        <div>
          <img
            src={
              selectedImage ||
              "https://via.placeholder.com/600x500?text=No+Image"
            }
            alt={product.name}
            className="w-full h-[500px] object-cover rounded-xl shadow-lg"
          />
          <div className="flex gap-3 mt-4 flex-wrap">
            {product.images?.map((image, index) => (
                <img
                key={index}
                src={image.url}
                alt={`Thumbnail ${index}`}
                onClick={() => setSelectedImage(image.url)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${
                    selectedImage === image.url
                    ? "border-blue-600"
                    : "border-gray-300"
                }`}
                />
            ))}
            </div>
        </div>

        {/* Product Information */}
        <div>

          <h1 className="text-4xl font-bold mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-5">

            <div className="text-yellow-500 text-xl tracking-wide">
              {"★".repeat(Math.round(averageRating))}
              {"☆".repeat(5 - Math.round(averageRating))}
            </div>

            <span className="text-gray-700 font-medium">
              {averageRating.toFixed(1)}
            </span>

            <span className="text-gray-400">
              ({numReviews} {numReviews === 1 ? "Review" : "Reviews"})
            </span>

          </div>

          <p className="text-3xl text-blue-600 font-bold mb-6">
            ₹{product.price}
          </p>

          <p className="text-gray-600 leading-7 mb-8">
            {product.description}
          </p>

          <div className="space-y-3 text-lg">

            <p>
              <strong>Category:</strong> {product.category}
            </p>

            <p>
              <strong>Brand:</strong> {product.brand || "N/A"}
            </p>

            <p>
              <strong>Stock:</strong>{" "}
              <span
                className={
                  product.stock > 0
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {product.stock > 0
                  ? `${product.stock} Available`
                  : "Out of Stock"}
              </span>
            </p>

            <p>
              <strong>Store:</strong>{" "}
              {product.store?.name || "Unknown"}
            </p>

          </div>

          <button
            onClick={addToCart}
            className="mt-10 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition"
          >
            Add to Cart
          </button>

        </div>

      </div>

      {/* Related Products */}
      <div className="mt-20">

        <h2 className="text-3xl font-bold mb-8">
          Related Products
        </h2>

        {relatedProducts.length === 0 ? (
          <p className="text-gray-500">
            No related products found.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard
                key={item._id}
                product={item}
              />
            ))}
          </div>
        )}

      </div>

      {/* Reviews */}

      <div className="mt-20">

        <h2 className="text-3xl font-bold mb-8">
          Customer Reviews
        </h2>

        <div className="bg-gray-50 rounded-xl p-6 border mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">

            <div className="text-yellow-500 text-4xl">
              {"★".repeat(Math.round(averageRating))}
              {"☆".repeat(5 - Math.round(averageRating))}
            </div>

            <div>
              <h3 className="text-3xl font-bold">
                {averageRating.toFixed(1)} / 5
              </h3>

              <p className="text-gray-500">
                Based on {numReviews} {numReviews === 1 ? "review" : "reviews"}
              </p>
            </div>

          </div>

          <div className="space-y-3">

            {ratingCounts.map(({ star, count }) => (
              <div
                key={star}
                className="flex items-center gap-3"
              >
                <span className="w-12">
                  {star} ★
                </span>

                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-yellow-400 h-3 rounded-full"
                    style={{
                      width: `${
                        numReviews
                          ? (count / numReviews) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>

                <span className="w-8 text-right">
                  {count}
                </span>
              </div>
            ))}

          </div>

        </div>

        <div className="border rounded-xl p-6 shadow-sm mb-8">

          <h3 className="text-2xl font-bold mb-4">
            Write a Review
          </h3>

          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Rating
            </label>

            <div className="flex gap-2 text-4xl">

            {[1, 2, 3, 4, 5].map((star) => (

              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-4xl transition-all duration-200 hover:scale-125 hover:rotate-6 ${
                  star <= rating
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </button>

            ))}

          </div>

          <p className="mt-2 text-gray-600">
            {rating} out of 5 Stars
          </p>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Comment
            </label>

            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border rounded-lg p-3 w-full"
              placeholder="Write your review..."
            />
          </div>

          <button
            onClick={submitReview}
            disabled={!comment.trim()}
           className={`px-6 py-3 rounded-lg text-white transition ${
              comment.trim()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {editingReview ? "Update Review" : "Submit Review"}
          </button>

        </div>

        {reviews.length === 0 ? (
          
          <div className="text-center py-10 border rounded-xl">

            <div className="text-5xl mb-3">
              ⭐
            </div>

            <h3 className="text-xl font-semibold">
              No Reviews Yet
            </h3>

            <p className="text-gray-500 mt-2">
              Be the first customer to review this product.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {reviews.map((review) => (

              <div
                key={review._id}
                className="bg-white rounded-xl border shadow-md p-6 hover:shadow-xl transition"
              >

                <div className="flex justify-between items-start">

                  <div>
                    <h3 className="text-lg font-bold">
                      {review.name}
                    </h3>

                    <p className="text-gray-400 text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span className="text-yellow-500 text-lg">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>

                </div>

                <p className="text-gray-600 mt-3">
                  {review.comment}
                </p>

                {user && review.user === user._id && (
                  <div className="flex gap-3 mt-4">

                    <button
                      onClick={() => editReview(review)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteReview(review._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>

                  </div>
                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default ProductDetails;