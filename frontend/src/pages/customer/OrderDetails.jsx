import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
  }, []);

  const cancelOrder = async () => {
  if (!window.confirm("Cancel this order?")) return;

  try {
    await api.put(`/orders/${order._id}/cancel`);

    toast.success("Order cancelled successfully.");

    fetchOrder();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Unable to cancel order."
    );
  }
};

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.order);
    } catch (error) {
      toast.error("Failed to load order.");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Shipped":
        return "bg-purple-100 text-purple-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-2xl">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        Order not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">

      <Link
        to="/my-orders"
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 hover:shadow transition-all duration-200 text-gray-700 font-medium"
        >
        <span className="text-lg">←</span>
        <span><b>Back to Orders</b></span>
        </Link>

      <h1 className="text-4xl font-bold mt-4 mb-8">
        Order Details
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Left */}

        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-2xl font-bold mb-4">
              Products
            </h2>

            {order.items.map((item) => (

              <div
                key={item._id}
                className="flex gap-4 border-b py-4"
              >

                <img
                  src={
                    item.product.images?.length
                      ? item.product.images[0].url
                      : "https://via.placeholder.com/100"
                  }
                  className="w-24 h-24 rounded object-cover"
                  alt=""
                />

                <div className="flex-1">

                  <h3 className="font-bold">
                    {item.product.name}
                  </h3>

                  <p>
                    Quantity : {item.quantity}
                  </p>

                  <p>
                    ₹{item.price}
                  </p>

                </div>

                <div className="font-bold text-blue-600">
                  ₹{item.price * item.quantity}
                </div>

              </div>

            ))}

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-2xl font-bold mb-4">
              Shipping Address
            </h2>

            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.state}
            </p>
            <p>{order.shippingAddress.pincode}</p>

          </div>

        </div>

        {/* Right */}

        <div className="bg-white rounded-xl shadow p-6 h-fit">

          <h2 className="text-2xl font-bold mb-6">
            Order Summary
          </h2>

          <p>
            <strong>Order ID</strong>
          </p>

          <p className="text-gray-500 break-all mb-5">
            {order._id}
          </p>

          <p>
            <strong>Date</strong>
          </p>

          <p className="mb-5">
            {new Date(order.createdAt).toLocaleString()}
          </p>

          <p className="mt-5">
            <strong>Payment Method</strong>
          </p>

          <p className="mb-5">
            {order.paymentMethod === "COD"
              ? "Cash on Delivery"
              : order.paymentMethod}
          </p>

          <p>
            <strong>Payment Status</strong>
          </p>

          <p className="mb-5">
            <span
              className={
                order.paymentStatus === "Paid"
                  ? "text-green-600 font-semibold"
                  : "text-orange-600 font-semibold"
              }
            >
              {order.paymentStatus}
            </span>
          </p>

          <span
            className={`inline-block px-3 py-1 rounded-full mt-2 ${statusColor(
              order.orderStatus
            )}`}
          >
            {order.orderStatus}
          </span>
            
            {(order.orderStatus === "Pending" ||
                order.orderStatus === "Confirmed") && (

                <button
                    onClick={cancelOrder}
                    className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
                >
                    Cancel Order
                </button>

            )}
          <div className="border-t mt-6 pt-6">

            <div className="flex justify-between">

              <span>Total</span>

              <span className="font-bold text-2xl text-blue-600">
                ₹{order.totalAmount}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default OrderDetails;