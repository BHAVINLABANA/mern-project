const Store = require("../models/Store");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Create Store
const createStore = async (req, res) => {
  try {
    const { name, description, address, phone } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Store name is required.",
      });
    }

    // Check if vendor already has a store
    const existingStore = await Store.findOne({
      owner: req.user._id,
    });

    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: "You already have a store.",
      });
    }

    // Create store
    const store = await Store.create({
      name,
      description,
      address,
      phone,
      owner: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Store created successfully.",
      store,
    });
  } catch (error) {
    console.error("Create Store Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// Get My Store
const getMyStore = async (req, res) => {
  try {
    const store = await Store.findOne({
      owner: req.user._id,
    });

    res.status(200).json({
      success: true,
      store,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Store
const updateStore = async (req, res) => {
  try {
    const { name, description, address, phone } = req.body;

    const store = await Store.findOne({
      owner: req.user._id,
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    store.name = name;
    store.description = description;
    store.address = address;
    store.phone = phone;

    await store.save();

    res.status(200).json({
      success: true,
      message: "Store updated successfully.",
      store,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createStore,
  getMyStore,
  updateStore,
};