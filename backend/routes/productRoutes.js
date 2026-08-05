const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getCustomerProducts,
  getRelatedProducts,
  addProductReview,
  getProductReviews,
  deleteProductReview,
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

router.put("/:id", protect, authorize("vendor"),upload. array("images", 5), updateProduct);
router.delete("/:id", protect, authorize("vendor"), deleteProduct);

// Customer Review Routes
router.post(
  "/:id/review",
  protect,
  authorize("customer"),
  addProductReview
);

router.get(
  "/:id/reviews",
  getProductReviews
);

router.delete(
  "/:id/review/:reviewId",
  protect,
  authorize("customer"),
  deleteProductReview
);

// Public Routes
router.get("/", getProducts);
router.get(
    "/my-products",
    protect,
    authorize("vendor"),
    getMyProducts
    );
router.get("/customer", getCustomerProducts);   
router.get("/:id/related", getRelatedProducts);
router.get("/:id", getProduct);

module.exports = router;