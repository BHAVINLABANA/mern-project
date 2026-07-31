import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

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

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

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
      setExistingImages(data.product.images || []);
    } catch (err) {
      console.error(err);
      toast.success("Failed to load product.");
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

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
    const productData = new FormData();

    productData.append("name", formData.name);
    productData.append("description", formData.description);
    productData.append("price", formData.price);
    productData.append("stock", formData.stock);
    productData.append("category", formData.category);
    productData.append("brand", formData.brand);
    productData.append("featured", formData.featured);

    // Append selected images
    images.forEach((image) => {
      productData.append("images", image);
    });

    await api.put(`/products/${id}`, productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Product updated successfully!");
    navigate("/vendor/products");
  } catch (err) {
    console.error(err);
    toast.error("Failed to update product.");
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

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />

        <div className="flex flex-wrap gap-3 mt-4">
          {previewImages.length > 0
            ? previewImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded border"
                />
              ))
            : existingImages.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt="Product"
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
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"
        >
          Update Product
        </button>

      </form>
    </div>
  );
}

export default EditProduct;