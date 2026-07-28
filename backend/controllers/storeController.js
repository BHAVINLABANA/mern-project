const Store = require("../models/Store");

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

module.exports = {
  createStore,
};