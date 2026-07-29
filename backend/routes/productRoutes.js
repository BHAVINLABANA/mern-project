const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Vendor Routes
router.post(
  "/",
  protect,
  authorize("vendor"),
  upload.array("images", 5),
  createProduct
);
router.put("/:id", protect, authorize("vendor"), updateProduct);
router.delete("/:id", protect, authorize("vendor"), deleteProduct);

// Public Routes
router.get("/", getProducts);
router.get("/:id", getProduct);

module.exports = router;