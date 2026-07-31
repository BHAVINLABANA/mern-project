import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// adjust path if needed
const Products = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products/my-products");
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    }
  };
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );

      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.success("Failed to delete product.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Products</h1>

        <Link
            to="/vendor/products/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
            + Add Product
            </Link>
      </div>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="text-center border-t">
              <td className="p-2">
                {product.images?.length > 0 && (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded mx-auto"
                  />
                )}
              </td>

              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>{product.category}</td>

              <td>
                <Link
                    to={`/vendor/products/edit/${product._id}`}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                    >
                    Edit
                </Link>

                <button 
                  onClick={() => deleteProduct(product._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                 >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;