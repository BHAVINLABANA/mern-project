const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/profileController");

const {
  protect,
} = require("../middleware/authMiddleware");

// ===============================
// Profile Routes
// ===============================

// Get Logged-in User Profile
router.get(
  "/",
  protect,
  getProfile
);

// Update Profile (Name, Email & Avatar)
router.put(
  "/",
  protect,
  upload.single("avatar"),
  updateProfile
);

// Change Password
router.put(
  "/change-password",
  protect,
  changePassword
);

module.exports = router;