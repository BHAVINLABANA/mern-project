import { useEffect, useState } from "react";
import api from "../../services/api";

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

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">
        Vendor Orders
      </h1>

      {orders.length === 0 ? (
        <h2>No orders found.</h2>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Customer</th>
              <th>Products</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-t text-center"
              >
                <td className="p-3">
                  {order.user?.name}
                </td>

                <td>
                  {order.items.map((item) => (
                    <div key={item._id}>
                      {item.product?.name} × {item.quantity}
                    </div>
                  ))}
                </td>

                <td>₹{order.totalAmount}</td>

                <td>{order.orderStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VendorOrders;