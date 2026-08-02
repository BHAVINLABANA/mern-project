const express = require("express");
const router = express.Router();

const {placeOrder,getMyOrders,getVendorOrders,} = require("../controllers/orderController");

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

router.post(
  "/",
  protect,
  authorize("customer"),
  placeOrder
);

module.exports = router;