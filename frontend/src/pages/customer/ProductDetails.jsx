import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import ProductCard from "../../components/customer/ProductCard";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
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

    </div>
  );
}

export default ProductDetails;