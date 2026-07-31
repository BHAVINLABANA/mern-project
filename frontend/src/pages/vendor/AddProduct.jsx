import { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    featured: false,
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));

    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      for (let i = 0; i < images.length; i++) {
        data.append("images", images[i]);
      }

      await api.post("/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product added successfully!");

      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        brand: "",
        featured: false,
      });

      setImages([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          className="w-full border p-3 rounded"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-3 rounded"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          className="w-full border p-3 rounded"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          className="w-full border p-3 rounded"
          value={formData.stock}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          className="w-full border p-3 rounded"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="brand"
          placeholder="Brand"
          className="w-full border p-3 rounded"
          value={formData.brand}
          onChange={handleChange}
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />

        <div className="flex flex-wrap gap-3 mt-4">
          {previewImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Preview"
              className="w-24 h-24 object-cover rounded border"
            />
          ))}
        </div>

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
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
        >
          Add Product
        </button>

      </form>
    </div>
  );
}

export default AddProduct;