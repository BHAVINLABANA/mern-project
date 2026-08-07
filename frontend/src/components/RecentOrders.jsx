function RecentOrders({ orders }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 overflow-x-auto">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-bold">
            🛒 Recent Orders
        </h2>

        <span className="text-sm text-blue-600">
            Last 5 Orders
        </span>

        </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">
          No recent orders found.
        </p>
      ) : (
        <div className="overflow-x-auto">

          <table className="min-w-[700px] w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">Customer</th>

                <th className="text-left py-3">Amount</th>

                <th className="text-left py-3">Status</th>

                <th className="text-left py-3">Date</th>

              </tr>

            </thead>

            <tbody>

              {orders.map((order) => (

                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="py-4">
                    {order.customer}
                  </td>

                  <td className="font-semibold">
                    ₹{order.amount}
                  </td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>

                  </td>

                  <td>
                    {new Date(order.createdAt).toLocaleDateString()}
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

export default RecentOrders;