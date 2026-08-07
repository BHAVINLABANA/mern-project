const express = require("express");
const router = express.Router();

const {
    placeOrder,
    getMyOrders,
    getVendorOrders,
    updateOrderStatus,
    getOrderById,
    cancelOrder,
} = require("../controllers/orderController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Customer Routes
router.get(
  "/my-orders",
  protect,
  authorize("customer"),
  getMyOrders
);

router.get(
  "/vendor-orders",
  protect,
  authorize("vendor"),
  getVendorOrders
);

router.get(
  "/:id",
  protect,
  getOrderById
);

router.put(
  "/:id/cancel",
  protect,
  authorize("customer"),
  cancelOrder
);

router.put(
  "/:id/status",
  protect,
  authorize("vendor"),
  updateOrderStatus
);

router.post(
  "/",
  protect,
  authorize("customer"),
  placeOrder
);


module.exports = router;