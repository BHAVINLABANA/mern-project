const express = require("express");
const router = express.Router();

const {
  createStore,
  getDashboardStats,
} = require("../controllers/storeController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// Create Store
router.post(
  "/",
  protect,
  authorize("vendor"),
  createStore
);

// Dashboard Statistics
router.get(
  "/dashboard-stats",
  protect,
  authorize("vendor"),
  getDashboardStats
);

module.exports = router;