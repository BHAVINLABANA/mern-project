import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";

function Checkout() {
  const navigate = useNavigate();
  const { fetchCartCount } = useCart();

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [cart, setCart] = useState([]);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/cart");

      setCart(data.cart);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shippingCharge = subtotal > 1000 ? 0 : 100;

  const total = subtotal + shippingCharge;

    const placeOrder = async () => {
    try {
      if (
        !shippingAddress.fullName ||
        !shippingAddress.phone ||
        !shippingAddress.address ||
        !shippingAddress.city ||
        !shippingAddress.state ||
        !shippingAddress.pincode
      ) {
        return toast.error("Please fill all shipping details.");
      }

      setPlacingOrder(true);

      await api.post("/orders", {
        shippingAddress,
      });

      toast.success("Order placed successfully!");

      fetchCartCount();

      navigate("/my-orders");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to place order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Shipping Form */}

        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold mb-6">
            Shipping Address
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={shippingAddress.fullName}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={shippingAddress.phone}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <textarea
              name="address"
              placeholder="Address"
              value={shippingAddress.address}
              onChange={handleChange}
              className="border rounded-lg p-3 md:col-span-2"
              rows="3"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={shippingAddress.city}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={shippingAddress.state}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={shippingAddress.pincode}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

          </div>

        </div>

                {/* Order Summary */}

        <div className="bg-white rounded-xl shadow p-6 h-fit">

          <h2 className="text-2xl font-bold mb-6">
            Order Summary
          </h2>

          <div className="space-y-5">

            {cart.map((item) => (

              <div
                key={item._id}
                className="flex gap-4 border-b pb-4"
              >

                <img
                  src={
                    item.product.images?.length
                      ? item.product.images[0].url
                      : "https://via.placeholder.com/80"
                  }
                  alt={item.product.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />

                <div className="flex-1">

                  <h3 className="font-semibold">
                    {item.product.name}
                  </h3>

                  <p className="text-gray-500">
                    Qty: {item.quantity}
                  </p>

                  <p className="font-bold text-blue-600">
                    ₹{item.product.price * item.quantity}
                  </p>

                </div>

              </div>

            ))}

          </div>

          <div className="border-t mt-6 pt-6 space-y-3">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {shippingCharge === 0
                  ? "FREE"
                  : `₹${shippingCharge}`}
              </span>
            </div>

            <div className="flex justify-between text-xl font-bold">

              <span>Total</span>

              <span className="text-blue-600">
                ₹{total}
              </span>

            </div>

          </div>

          <button
            onClick={placeOrder}
            disabled={placingOrder || cart.length === 0}
            className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition disabled:opacity-50"
          >
            {placingOrder
              ? "Placing Order..."
              : "Place Order"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Checkout;