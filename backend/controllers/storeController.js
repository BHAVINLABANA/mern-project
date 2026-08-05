const Store = require("../models/Store");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Create Store
const createStore = async (req, res) => {
  try {
    const { name, description, address, phone } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Store name is required.",
      });
    }

    // Check if vendor already has a store
    const existingStore = await Store.findOne({
      owner: req.user._id,
    });

    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: "You already have a store.",
      });
    }

    // Create store
    const store = await Store.create({
      name,
      description,
      address,
      phone,
      owner: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Store created successfully.",
      store,
    });
  } catch (error) {
    console.error("Create Store Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Vendor Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    // Total Products
    const totalProducts = await Product.countDocuments({
      createdBy: req.user._id,
    });

    // Get vendor products
    const vendorProducts = await Product.find({
      createdBy: req.user._id,
    }).select("_id");

    const productIds = vendorProducts.map((product) => product._id.toString());

    // Get all orders
    const orders = await Order.find().populate("items.product");

    let totalOrders = 0;
    let totalRevenue = 0;

    const customers = new Set();

    orders.forEach((order) => {
      let hasVendorProduct = false;

      order.items.forEach((item) => {
        if (
          item.product &&
          productIds.includes(item.product._id.toString())
        ) {
          hasVendorProduct = true;
          totalRevenue += item.price * item.quantity;
        }
      });

      if (hasVendorProduct) {
        totalOrders++;
        customers.add(order.user.toString());
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue,
        totalCustomers: customers.size,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createStore,
  getDashboardStats,
};