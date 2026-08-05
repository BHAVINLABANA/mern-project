const Product = require("../models/Product");
const Order = require("../models/Order");

exports.getDashboardStats = async (req, res) => {
  try {
    // Total Products
    const totalProducts = await Product.countDocuments({
      createdBy: req.user._id,
    });

    // Vendor Orders
    const orders = await Order.find({
      "items.vendor": req.user._id,
    })
      .populate("user", "name")
      .sort("-createdAt");

    const totalOrders = orders.length;

    // Revenue
    let totalRevenue = 0;

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.vendor.toString() === req.user._id.toString()) {
          totalRevenue += item.price * item.quantity;
        }
      });
    });

    // Unique Customers
    const customers = new Set();

    orders.forEach((order) => {
      customers.add(order.user._id.toString());
    });

    // Recent Orders
    const recentOrders = orders.slice(0, 5).map((order) => ({
      _id: order._id,
      customer: order.user.name,
      amount: order.totalAmount,
      status: order.orderStatus,
      createdAt: order.createdAt,
    }));

    // Low Stock Products
    const lowStockProducts = await Product.find({
      createdBy: req.user._id,
      stock: { $lte: 5 },
    })
      .select("name stock")
      .sort("stock")
      .limit(5);

    // Monthly Revenue
    const monthlyRevenue = new Array(12).fill(0);

    orders.forEach((order) => {
    const month = new Date(order.createdAt).getMonth();

    order.items.forEach((item) => {
        if (item.vendor.toString() === req.user._id.toString()) {
        monthlyRevenue[month] += item.price * item.quantity;
        }
    });
    });

    res.status(200).json({
      success: true,

      stats: {
        totalProducts,
        totalOrders,
        totalRevenue,
        totalCustomers: customers.size,
      },

      recentOrders,

      lowStockProducts,

      monthlyRevenue,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};