import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
  Trash2,
  Truck,
} from "lucide-react";

import api from "../../services/api";
import ProductCard from "../../components/customer/ProductCard";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

function ProductDetails() {
  const { id } = useParams();

  const { fetchCartCount } = useCart();
  const { wishlist, fetchWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [numReviews, setNumReviews] = useState(0);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  /* =========================================================
     FETCH DATA
  ========================================================= */

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
    fetchReviews();
  }, [id]);

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("user")));
    } catch {
      setUser(null);
    }
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(`/products/${id}`);

      setProduct(data.product);

      if (data.product?.images?.length > 0) {
        setSelectedImage(data.product.images[0].url);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load product."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const { data } = await api.get(
        `/products/${id}/related`
      );

      setRelatedProducts(data.products || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(
        `/products/${id}/reviews`
      );

      setReviews(data.reviews || []);
      setAverageRating(Number(data.averageRating) || 0);
      setNumReviews(Number(data.numReviews) || 0);
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================================================
     WISHLIST
  ========================================================= */

  const wishlistItem = wishlist.find(
    (item) => item.product?._id === product?._id
  );

  const isWishlisted = Boolean(wishlistItem);

  const toggleWishlist = async () => {
    if (!product?._id) return;

    try {
      if (isWishlisted) {
        await api.delete(
          `/wishlist/${wishlistItem._id}`
        );

        toast.success("Removed from wishlist");
      } else {
        await api.post("/wishlist", {
          productId: product._id,
        });

        toast.success("Added to wishlist ❤️");
      }

      await fetchWishlist();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to update wishlist."
      );
    }
  };

  /* =========================================================
     CART
  ========================================================= */

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const addToCart = async () => {
    if (!product?._id) return;

    if (product.stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    if (quantity > product.stock) {
      toast.error("Not enough stock available.");
      return;
    }

    try {
      setAddingToCart(true);

      await api.post("/cart", {
        productId: product._id,
        quantity,
      });

      await fetchCartCount();

      toast.success(
        `${product.name} added to cart!`
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to add product to cart."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  /* =========================================================
     REVIEWS
  ========================================================= */

  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => ({
      star,
      count: reviews.filter(
        (review) => review.rating === star
      ).length,
    })
  );

  const submitReview = async () => {
    if (!comment.trim()) {
      toast.error("Please write a review.");
      return;
    }

    try {
      setReviewLoading(true);

      await api.post(
        `/products/${id}/review`,
        {
          rating,
          comment,
        }
      );

      toast.success(
        editingReview
          ? "Review updated successfully!"
          : "Review submitted successfully!"
      );

      setEditingReview(null);
      setRating(5);
      setComment("");

      await fetchReviews();
      await fetchProduct();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to submit review."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) {
      return;
    }

    try {
      await api.delete(
        `/products/${id}/review/${reviewId}`
      );

      toast.success(
        "Review deleted successfully."
      );

      await fetchReviews();
      await fetchProduct();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete review."
      );
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

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-8 w-32 rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div className="aspect-square rounded-3xl bg-slate-200 dark:bg-slate-800" />

            <div className="space-y-5">
              <div className="h-10 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-6 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-12 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-32 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-14 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <Package
            size={50}
            className="mx-auto text-slate-400"
          />

          <h1 className="mt-5 text-3xl font-black text-slate-900 dark:text-white">
            Product not found
          </h1>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-700"
          >
            <ArrowLeft size={17} />
            Back to Shopping
          </Link>
        </div>
      </div>
    );
  }

  const productRating = Math.min(
    5,
    Math.max(0, Math.round(averageRating))
  );

  const productImage =
    selectedImage ||
    product.images?.[0]?.url ||
    "https://via.placeholder.com/600x600?text=No+Image";

  const stock = Number(product.stock) || 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        {/* =====================================================
            BACK
        ===================================================== */}

        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft size={17} />
          Back to Products
        </Link>

        {/* =====================================================
            PRODUCT
        ===================================================== */}

        <section className="grid gap-10 lg:grid-cols-2">

          {/* IMAGE */}

          <div>
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

              <img
                src={productImage}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />

              {/* Wishlist */}

              <button
                type="button"
                onClick={toggleWishlist}
                className={`
                  absolute right-5 top-5
                  flex h-12 w-12 items-center justify-center
                  rounded-full border shadow-lg
                  backdrop-blur-md transition
                  hover:scale-110

                  ${
                    isWishlisted
                      ? "border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-900 dark:bg-rose-950/70 dark:text-rose-400"
                      : "border-white/70 bg-white/95 text-slate-500 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-300"
                  }
                `}
              >
                <Heart
                  size={22}
                  fill={
                    isWishlisted
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>

              {stock > 0 && stock <= 5 && (
                <div className="absolute bottom-5 left-5 rounded-full bg-amber-500 px-4 py-2 text-xs font-black text-white shadow-lg">
                  Only {stock} left
                </div>
              )}
            </div>

            {/* Thumbnails */}

            {product.images?.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {product.images.map(
                  (image, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setSelectedImage(
                          image.url
                        )
                      }
                      className={`
                        h-20 w-20 shrink-0
                        overflow-hidden rounded-xl
                        border-2 transition
                        ${
                          selectedImage === image.url
                            ? "border-indigo-600"
                            : "border-slate-200 dark:border-slate-700"
                        }
                      `}
                    >
                      <img
                        src={image.url}
                        alt={`Product ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* INFORMATION */}

          <div className="flex flex-col">

            {/* Category */}

            {product.category && (
              <span className="mb-4 w-fit rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                {product.category}
              </span>
            )}

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            {/* Rating */}

            <div className="mt-5 flex items-center gap-3">

              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <Star
                      key={star}
                      size={19}
                      className={
                        star <= productRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300 dark:text-slate-700"
                      }
                    />
                  )
                )}
              </div>

              <span className="font-bold">
                {averageRating.toFixed(1)}
              </span>

              <span className="text-sm text-slate-400">
                ({numReviews} reviews)
              </span>

            </div>

            {/* Price */}

            <div className="mt-7">
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Price
              </p>

              <p className="mt-1 text-4xl font-black text-indigo-600 dark:text-indigo-400">
                ₹
                {Number(
                  product.price || 0
                ).toLocaleString("en-IN")}
              </p>
            </div>

            {/* Description */}

            <p className="mt-6 text-base leading-7 text-slate-600 dark:text-slate-400">
              {product.description}
            </p>

            {/* Details */}

            <div className="mt-7 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">

              <div className="flex justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400">
                  Brand
                </span>

                <span className="font-bold">
                  {product.brand || "N/A"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400">
                  Category
                </span>

                <span className="font-bold">
                  {product.category || "N/A"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400">
                  Availability
                </span>

                <span
                  className={
                    stock > 0
                      ? "font-bold text-emerald-600 dark:text-emerald-400"
                      : "font-bold text-rose-600 dark:text-rose-400"
                  }
                >
                  {stock > 0
                    ? `${stock} available`
                    : "Out of Stock"}
                </span>
              </div>

              {product.store?.name && (
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 dark:text-slate-400">
                    Store
                  </span>

                  <span className="flex items-center gap-1 font-bold">
                    <Store size={15} />
                    {product.store.name}
                  </span>
                </div>
              )}

            </div>

            {/* Quantity */}

            {stock > 0 && (
              <div className="mt-7">

                <p className="mb-3 text-sm font-bold">
                  Quantity
                </p>

                <div className="flex items-center gap-3">

                  <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">

                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="flex h-11 w-11 items-center justify-center hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"
                    >
                      <Minus size={17} />
                    </button>

                    <span className="flex h-11 w-12 items-center justify-center border-x border-slate-200 font-bold dark:border-slate-700">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= stock}
                      className="flex h-11 w-11 items-center justify-center hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"
                    >
                      <Plus size={17} />
                    </button>

                  </div>

                  <span className="text-sm text-slate-400">
                    {stock} available
                  </span>

                </div>
              </div>
            )}

            {/* Add Cart */}

            <button
              type="button"
              onClick={addToCart}
              disabled={
                stock <= 0 || addingToCart
              }
              className="
                mt-7 flex h-13 w-full
                items-center justify-center
                gap-2 rounded-xl
                bg-gradient-to-r
                from-indigo-600 to-violet-600
                px-6 py-4
                font-bold text-white
                shadow-lg shadow-indigo-200
                transition-all
                hover:-translate-y-0.5
                hover:shadow-xl
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:shadow-indigo-950
              "
            >
              <ShoppingCart size={19} />

              {addingToCart
                ? "Adding..."
                : stock > 0
                  ? `Add to Cart • ₹${(
                      Number(product.price || 0) *
                      quantity
                    ).toLocaleString("en-IN")}`
                  : "Out of Stock"}
            </button>

            {/* Benefits */}

            <div className="mt-7 grid grid-cols-3 gap-3">

              <div className="rounded-xl bg-slate-100 p-3 text-center dark:bg-slate-900">
                <Truck
                  size={20}
                  className="mx-auto text-indigo-500"
                />

                <p className="mt-2 text-[11px] font-bold">
                  Fast Delivery
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 p-3 text-center dark:bg-slate-900">
                <ShieldCheck
                  size={20}
                  className="mx-auto text-emerald-500"
                />

                <p className="mt-2 text-[11px] font-bold">
                  Secure
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 p-3 text-center dark:bg-slate-900">
                <Package
                  size={20}
                  className="mx-auto text-violet-500"
                />

                <p className="mt-2 text-[11px] font-bold">
                  Quality
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            RELATED PRODUCTS
        ===================================================== */}

        <section className="mt-20">

          <div className="mb-7">
            <p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              You may also like
            </p>

            <h2 className="mt-1 text-3xl font-black">
              Related Products
            </h2>
          </div>

          {relatedProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
              <Package
                size={35}
                className="mx-auto text-slate-400"
              />

              <p className="mt-3 text-slate-500 dark:text-slate-400">
                No related products found.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map(
                (item) => (
                  <ProductCard
                    key={item._id}
                    product={item}
                  />
                )
              )}
            </div>
          )}

        </section>

        {/* =====================================================
            REVIEWS
        ===================================================== */}

        <section className="mt-20">

          <div className="mb-7">
            <p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Customer feedback
            </p>

            <h2 className="mt-1 text-3xl font-black">
              Customer Reviews
            </h2>
          </div>

          {/* Rating summary */}

          <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-3 dark:border-slate-800 dark:bg-slate-900">

            {/* Average */}

            <div className="flex flex-col items-center justify-center text-center">

              <p className="text-5xl font-black">
                {averageRating.toFixed(1)}
              </p>

              <div className="mt-3 flex gap-1">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <Star
                      key={star}
                      size={20}
                      className={
                        star <= productRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300 dark:text-slate-700"
                      }
                    />
                  )
                )}
              </div>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Based on {numReviews}{" "}
                {numReviews === 1
                  ? "review"
                  : "reviews"}
              </p>

            </div>

            {/* Distribution */}

            <div className="space-y-3 md:col-span-2">

              {ratingCounts.map(
                ({ star, count }) => {

                  const percentage =
                    numReviews > 0
                      ? (count /
                          numReviews) *
                        100
                      : 0;

                  return (
                    <div
                      key={star}
                      className="flex items-center gap-3"
                    >
                      <span className="w-10 text-sm font-bold">
                        {star} ★
                      </span>

                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-amber-400 transition-all"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      <span className="w-8 text-right text-sm text-slate-500">
                        {count}
                      </span>
                    </div>
                  );
                }
              )}

            </div>

          </div>

          {/* Write review */}

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="flex items-center justify-between gap-4">

              <div>
                <h3 className="text-xl font-black">
                  {editingReview
                    ? "Edit Your Review"
                    : "Write a Review"}
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Share your experience with
                  other customers.
                </p>
              </div>

              {editingReview && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingReview(null);
                    setRating(5);
                    setComment("");
                  }}
                  className="text-sm font-bold text-slate-400 hover:text-rose-500"
                >
                  Cancel
                </button>
              )}

            </div>

            {/* Stars */}

            <div className="mt-6">

              <p className="mb-3 text-sm font-bold">
                Your Rating
              </p>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setRating(star)
                      }
                      className="transition hover:scale-110"
                    >
                      <Star
                        size={30}
                        className={
                          star <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 dark:text-slate-700"
                        }
                      />
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Comment */}

            <textarea
              rows={5}
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              placeholder="Write your review..."
              className="
                mt-6 w-full resize-none
                rounded-xl
                border border-slate-200
                bg-slate-50
                p-4 text-sm
                outline-none
                transition
                focus:border-indigo-400
                focus:bg-white
                focus:ring-4
                focus:ring-indigo-100

                dark:border-slate-700
                dark:bg-slate-950
                dark:text-white
                dark:focus:border-indigo-500
                dark:focus:bg-slate-950
                dark:focus:ring-indigo-950
              "
            />

            <button
              type="button"
              onClick={submitReview}
              disabled={
                reviewLoading ||
                !comment.trim()
              }
              className="
                mt-4 inline-flex
                items-center gap-2
                rounded-xl
                bg-indigo-600
                px-6 py-3
                font-bold text-white
                transition
                hover:bg-indigo-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {reviewLoading
                ? "Submitting..."
                : editingReview
                  ? "Update Review"
                  : "Submit Review"}
            </button>

          </div>

          {/* Reviews */}

          <div className="mt-6 space-y-4">

            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">

                <Star
                  size={40}
                  className="mx-auto text-amber-400"
                />

                <h3 className="mt-4 text-xl font-black">
                  No Reviews Yet
                </h3>

                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Be the first customer to
                  review this product.
                </p>

              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="
                    rounded-2xl
                    border border-slate-200
                    bg-white p-6
                    shadow-sm

                    dark:border-slate-800
                    dark:bg-slate-900
                  "
                >

                  <div className="flex flex-wrap items-start justify-between gap-4">

                    <div>
                      <h3 className="font-black">
                        {review.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        {new Date(
                          review.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(
                        (star) => (
                          <Star
                            key={star}
                            size={16}
                            className={
                              star <=
                              review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300 dark:text-slate-700"
                            }
                          />
                        )
                      )}
                    </div>

                  </div>

                  <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
                    {review.comment}
                  </p>

                  {user &&
                    review.user ===
                      user._id && (
                      <div className="mt-5 flex gap-4">

                        <button
                          type="button"
                          onClick={() =>
                            editReview(
                              review
                            )
                          }
                          className="text-sm font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteReview(
                              review._id
                            )
                          }
                          className="inline-flex items-center gap-1 text-sm font-bold text-rose-600 hover:underline dark:text-rose-400"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>

                      </div>
                    )}

                </div>
              ))
            )}

          </div>

        </section>

      </main>
    </div>
  );
}

export default ProductDetails;