import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/my-orders");
      setOrders(data.orders);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
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
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-10 text-center">

          <h2 className="text-2xl font-semibold">
            No Orders Yet
          </h2>

          <p className="text-gray-500 mt-3">
            Start shopping to place your first order.
          </p>

          <Link
            to="/"
            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </Link>

        </div>
      ) : (
        <div className="space-y-6">

          {orders.map((order) => (

            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md p-6"
            >

              <div className="flex justify-between items-center flex-wrap gap-4">

                <div>

                  <h2 className="font-bold text-lg">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-2xl font-bold text-blue-600">
                    ₹{order.totalAmount}
                  </p>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>

                </div>

              </div>

              <div className="mt-6 space-y-4">

                {order.items.map((item) => (

                  <div
                    key={item._id}
                    className="flex items-center gap-4 border rounded-lg p-3"
                  >

                    <img
                      src={
                        item.product.images?.length
                          ? item.product.images[0].url
                          : "https://via.placeholder.com/80"
                      }
                      alt={item.product.name}
                      className="w-20 h-20 rounded object-cover"
                    />

                    <div className="flex-1">

                      <h3 className="font-semibold">
                        {item.product.name}
                      </h3>

                      <p className="text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                    </div>

                    <div className="font-bold text-blue-600">
                      ₹{item.price * item.quantity}
                    </div>

                  </div>

                ))}

              </div>

              <div className="mt-6 flex justify-between items-center">

                <div>

                  <div className="space-y-1">

                    <p>
                      <strong>Payment Method:</strong>{" "}
                      {order.paymentMethod === "COD"
                        ? "Cash on Delivery"
                        : order.paymentMethod}
                    </p>

                    <p>
                      <strong>Payment Status:</strong>{" "}
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

                  </div>

                  <p>
                    <strong>Shipping:</strong>{" "}
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state}
                  </p>

                </div>

                <Link
                  to={`/order/${order._id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                >
                  View Details
                </Link>

              </div>

            </div>

          ))}

        </div>
      )}
    </div>
  );
}

export default MyOrders;