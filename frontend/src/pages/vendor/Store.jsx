import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function Store() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [store, setStore] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
  });

  const [exists, setExists] = useState(false);

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      const { data } = await api.get("/stores/my-store");

      if (data.store) {
        setStore({
          name: data.store.name || "",
          description: data.store.description || "",
          address: data.store.address || "",
          phone: data.store.phone || "",
        });

        setExists(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setStore({
      ...store,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (exists) {
        await api.put("/stores", store);

        toast.success("Store updated successfully.");
      } else {
        await api.post("/stores", store);

        toast.success("Store created successfully.");

        setExists(true);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center text-xl font-semibold py-10">
          Loading Store...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-8">
        {exists ? "Edit Store" : "Create Store"}
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>

            <label className="block font-semibold mb-2">
              Store Name
            </label>

            <input
              type="text"
              name="name"
              value={store.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />

          </div>

          <div>

            <label className="block font-semibold mb-2">
              Description
            </label>

            <textarea
              name="description"
              rows="4"
              value={store.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block font-semibold mb-2">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={store.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block font-semibold mb-2">
              Address
            </label>

            <textarea
              name="address"
              rows="3"
              value={store.address}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : exists
              ? "Update Store"
              : "Create Store"}
          </button>

        </form>

      </div>

    </DashboardLayout>
  );
}

export default Store;