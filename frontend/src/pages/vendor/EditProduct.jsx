import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    featured: false,
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);

      setFormData({
        name: data.product.name,
        description: data.product.description,
        price: data.product.price,
        stock: data.product.stock,
        category: data.product.category,
        brand: data.product.brand,
        featured: data.product.featured,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load product.");
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/products/${id}`, formData);

      alert("Product updated successfully!");
      navigate("/vendor/products");
    } catch (err) {
      console.error(err);
      alert("Failed to update product.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Product Name"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          rows="4"
        />

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />
          Featured Product
        </label>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"
        >
          Update Product
        </button>

      </form>
    </div>
  );
}

export default EditProduct;