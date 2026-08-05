const express = require("express");
const router = express.Router();

const {
  createStore,
  getMyStore,
  updateStore,
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

router.get(
  "/my-store",
  protect,
  authorize("vendor"),
  getMyStore
);

router.put(
  "/",
  protect,
  authorize("vendor"),
  updateStore
);

module.exports = router;