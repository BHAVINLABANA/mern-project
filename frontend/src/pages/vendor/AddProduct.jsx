import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ImagePlus,
  PackagePlus,
  Save,
  X,
} from "lucide-react";

import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";

function AddProduct() {
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
  const [saving, setSaving] = useState(false);

  /* =========================================================
     CLEANUP IMAGE PREVIEWS
  ========================================================= */

  useEffect(() => {
    return () => {
      previewImages.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [previewImages]);

  /* =========================================================
     HANDLE INPUT
  ========================================================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* =========================================================
     HANDLE IMAGES
  ========================================================= */

  const handleImageChange = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    if (files.length === 0) return;

    const imageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length !== files.length) {
      toast.error(
        "Only image files are allowed."
      );
    }

    const maxImages = 6;

    const remainingSlots =
      maxImages - images.length;

    if (remainingSlots <= 0) {
      toast.error(
        `Maximum ${maxImages} images allowed.`
      );
      return;
    }

    const selectedFiles =
      imageFiles.slice(0, remainingSlots);

    if (
      selectedFiles.length <
      imageFiles.length
    ) {
      toast.error(
        `Maximum ${maxImages} images allowed.`
      );
    }

    const newPreviews = selectedFiles.map(
      (file) => URL.createObjectURL(file)
    );

    setImages((prev) => [
      ...prev,
      ...selectedFiles,
    ]);

    setPreviewImages((prev) => [
      ...prev,
      ...newPreviews,
    ]);

    e.target.value = "";
  };

  /* =========================================================
     REMOVE IMAGE
  ========================================================= */

  const removeImage = (index) => {
    const preview = previewImages[index];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setPreviewImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter product name.");
      return;
    }

    if (!formData.description.trim()) {
      toast.error(
        "Please enter product description."
      );
      return;
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      toast.error(
        "Please enter a valid product price."
      );
      return;
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      toast.error(
        "Please enter a valid stock quantity."
      );
      return;
    }

    if (!formData.category.trim()) {
      toast.error("Please enter a category.");
      return;
    }

    try {
      setSaving(true);

      const productData = new FormData();

      productData.append(
        "name",
        formData.name.trim()
      );

      productData.append(
        "description",
        formData.description.trim()
      );

      productData.append(
        "price",
        formData.price
      );

      productData.append(
        "stock",
        formData.stock
      );

      productData.append(
        "category",
        formData.category.trim()
      );

      productData.append(
        "brand",
        formData.brand.trim()
      );

      productData.append(
        "featured",
        formData.featured
      );

      images.forEach((image) => {
        productData.append(
          "images",
          image
        );
      });

      await api.post(
        "/products",
        productData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        "Product added successfully!"
      );

      navigate("/vendor/products");
    } catch (error) {
      console.error(
        "Add Product Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to add product."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <DashboardLayout>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8">

        <Link
          to="/vendor/products"
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft size={17} />
          Back to Products
        </Link>

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <PackagePlus size={23} />
          </div>

          <div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Add Product
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Add a new product to your store.
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          FORM
      ===================================================== */}

      <form
        onSubmit={handleSubmit}
        className="grid items-start gap-6 lg:grid-cols-3"
      >

        {/* ===================================================
            LEFT
        =================================================== */}

        <div className="space-y-6 lg:col-span-2">

          {/* Basic Information */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="mb-6">

              <h2 className="text-xl font-black">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Enter the main details of your product.
              </p>

            </div>

            <div className="space-y-5">

              {/* Name */}

              <div>

                <label className="mb-2 block text-sm font-bold">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-600 dark:focus:ring-indigo-950"
                  required
                />

              </div>

              {/* Description */}

              <div>

                <label className="mb-2 block text-sm font-bold">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product..."
                  rows={6}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-600 dark:focus:ring-indigo-950"
                  required
                />

              </div>

              {/* Price + Stock */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-bold">
                    Price
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-600 dark:focus:ring-indigo-950"
                      required
                    />

                  </div>

                </div>

                <div>

                  <label className="mb-2 block text-sm font-bold">
                    Stock Quantity
                  </label>

                  <input
                    type="number"
                    name="stock"
                    min="0"
                    step="1"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-600 dark:focus:ring-indigo-950"
                    required
                  />

                </div>

              </div>

              {/* Category + Brand */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-bold">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Electronics"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-600 dark:focus:ring-indigo-950"
                    required
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-bold">
                    Brand
                  </label>

                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g. Samsung"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-600 dark:focus:ring-indigo-950"
                  />

                </div>

              </div>

            </div>

          </section>

          {/* Images */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="mb-6">

              <h2 className="text-xl font-black">
                Product Images
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Upload up to 6 product images.
              </p>

            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50/40 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/20">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <ImagePlus size={26} />
              </div>

              <p className="mt-4 text-sm font-bold">
                Click to upload images
              </p>

              <p className="mt-1 text-xs text-slate-400">
                PNG, JPG, JPEG, WEBP
              </p>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

            </label>

            {/* Image previews */}

            {previewImages.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">

                {previewImages.map(
                  (image, index) => (
                    <div
                      key={image}
                      className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800"
                    >

                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(index)
                        }
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <X size={16} />
                      </button>

                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-bold text-white">
                          Main Image
                        </span>
                      )}

                    </div>
                  )
                )}

              </div>
            )}

          </section>

        </div>

        {/* ===================================================
            RIGHT
        =================================================== */}

        <aside className="space-y-6 lg:sticky lg:top-24">

          {/* Publish */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <h2 className="text-xl font-black">
              Publish Product
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Choose how this product appears in your store.
            </p>

            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">

              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="mt-1 h-4 w-4 accent-indigo-600"
              />

              <div>

                <p className="text-sm font-bold">
                  Featured Product
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Highlight this product in featured sections.
                </p>

              </div>

            </label>

            <button
              type="submit"
              disabled={saving}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-indigo-950"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Adding Product...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Add Product
                </>
              )}
            </button>

          </section>

          {/* Tips */}

          <section className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 dark:border-indigo-950 dark:bg-indigo-950/20">

            <h3 className="font-black text-indigo-700 dark:text-indigo-400">
              Product Tips
            </h3>

            <ul className="mt-3 space-y-2 text-xs leading-5 text-indigo-700/80 dark:text-indigo-400/80">

              <li>
                • Use a clear and descriptive product name.
              </li>

              <li>
                • Add detailed information in the description.
              </li>

              <li>
                • Upload high-quality product images.
              </li>

              <li>
                • Keep your stock quantity updated.
              </li>

            </ul>

          </section>

        </aside>

      </form>

    </DashboardLayout>
  );
}

export default AddProduct;