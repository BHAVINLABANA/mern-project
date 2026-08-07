const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Place Order
exports.placeOrder = async (req, res) => {
  try {
    const { 
      shippingAddress,
      paymentMethod,
     } = req.body;

    // Get user's cart
    const cartItems = await Cart.find({
      user: req.user._id,
    }).populate("product");

    // Check product stock
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${item.product.name} is out of stock.`,
        });
      }
    }

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    // Prepare order items
    const items = cartItems.map((item) => ({
      product: item.product._id,
      store: item.product.store,
      vendor: item.product.createdBy,
      quantity: item.quantity,
      price: item.product.price,
    }));

    // Calculate total
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      totalAmount,

      paymentMethod:
        paymentMethod || "COD",

      paymentStatus:
        paymentMethod === "Online"
          ? "Paid"
          : "Pending",
    });

    // Reduce product stock
    for (const item of cartItems) {
      await Product.findByIdAndUpdate(
        item.product._id,
        {
          $inc: {
            stock: -item.quantity,
          },
        }
      );
    }

    // Clear cart
    await Cart.deleteMany({
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product", "name images price")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "name images price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Vendor Orders
exports.getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      "items.vendor": req.user._id,
    })
      .populate("user", "name email")
      .populate("items.product", "name images price")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Restore stock if order is cancelled
    if (
      status === "Cancelled" &&
      order.orderStatus !== "Cancelled"
    ) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          {
            $inc: {
              stock: item.quantity,
            },
          }
        );
      }
    }

    order.orderStatus = status;
    if (
      status === "Delivered" &&
      order.paymentMethod === "COD"
    ) {
      order.paymentStatus = "Paid";
    }
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel Order (Customer)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Check ownership
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // Only Pending or Confirmed orders can be cancelled
    if (
      order.orderStatus !== "Pending" &&
      order.orderStatus !== "Confirmed"
    ) {
      return res.status(400).json({
        success: false,
        message: "This order cannot be cancelled.",
      });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};