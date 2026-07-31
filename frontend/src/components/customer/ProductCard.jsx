import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">

      <img
        src={
          product.images?.length > 0
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

        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-3 flex justify-between items-center">

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