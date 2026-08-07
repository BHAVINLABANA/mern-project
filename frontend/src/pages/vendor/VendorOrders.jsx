import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function VendorOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/vendor-orders");
      setOrders(data.orders);
    } catch (error) {
      console.error(error);
    }
  };
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, {
        status,
      });

      toast.success("Order updated.");

      fetchOrders();
    } catch (error) {
      toast.error("Unable to update order.");
    }
  };
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">
        Vendor Orders
      </h1>

      {orders.length === 0 ? (
        <h2>No orders found.</h2>
      ) : (
        <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full border border-gray-300 rounded-xl">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Customer</th>
              <th className="text-left">Products</th>
              <th className="text-left">Payment</th>
              <th className="text-left">Total</th>
              <th className="text-left">Order Status</th>
              <th className="text-left">Payment Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4">
                  <div className="font-semibold">
                    {order.user?.name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {order.user?.email}
                  </div>
                </td>

                <td>
                  {order.items.map((item) => (
                    <div key={item._id} className="mb-2">
                      <div className="font-medium">
                        {item.product?.name}
                      </div>

                      <div className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </div>
                    </div>
                  ))}
                </td>

                <td>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                    {order.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : order.paymentMethod}
                  </span>
                </td>

                <td className="font-bold text-blue-600">
                  ₹{order.totalAmount}
                </td>

                <td>
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                    className="border rounded-lg px-3 py-2"
                  >
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}

export default VendorOrders;