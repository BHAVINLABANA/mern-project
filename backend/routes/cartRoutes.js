const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Customer Cart Routes
router.post("/", protect, authorize("customer"), addToCart);

router.get("/", protect, authorize("customer"), getCart);

router.put("/:id", protect, authorize("customer"), updateCartItem);

router.delete("/:id", protect, authorize("customer"), removeCartItem);

router.delete("/", protect, authorize("customer"), clearCart);

module.exports = router;