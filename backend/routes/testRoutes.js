const express = require("express");

const router = express.Router();

const {
  adminDashboard,
  vendorDashboard,
  customerDashboard,
} = require("../controllers/testController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// Customer
router.get(
  "/customer",
  protect,
  authorize("Customer"),
  customerDashboard
);

// Vendor
router.get(
  "/vendor",
  protect,
  authorize("Vendor"),
  vendorDashboard
);

// SuperAdmin
router.get(
  "/admin",
  protect,
  authorize("SuperAdmin"),
  adminDashboard
);

module.exports = router;