const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  getWishlist,
  removeWishlistItem,
  clearWishlist,
} = require("../controllers/wishlistController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// Customer Wishlist Routes

router.post(
  "/",
  protect,
  authorize("customer"),
  addToWishlist
);

router.get(
  "/",
  protect,
  authorize("customer"),
  getWishlist
);

router.delete(
  "/:id",
  protect,
  authorize("customer"),
  removeWishlistItem
);

router.delete(
  "/",
  protect,
  authorize("customer"),
  clearWishlist
);

module.exports = router;