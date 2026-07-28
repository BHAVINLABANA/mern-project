const express = require("express");
const router = express.Router();

const { createStore } = require("../controllers/storeController");
const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// Vendor only
router.post(
  "/",
  protect,
  authorize("Vendor"),
  createStore
);

module.exports = router;