const Product = require("../models/Product");
const Store = require("../models/Store");
const APIFeatures = require("../utils/apiFeatures");

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      brand,
      featured,
    } = req.body;

    // Find vendor's store
    const store = await Store.findOne({ owner: req.user._id });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found. Please create a store first.",
      });
    }
    
    // Get uploaded images from Cloudinary
    let images = [];

    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => ({
        public_id: file.filename,
        url: file.path,
      }));
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      brand,
      images,
      featured,
      store: store._id,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Vendor Products
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      createdBy: req.user._id,
    }).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const resultPerPage = 10;

    const apiFeatures = new APIFeatures(
      Product.find()
        .populate("store", "name")
        .populate("createdBy", "name email"),
      req.query
    )
      .search()
      .filter()
      .sort()
      .paginate(resultPerPage);

    const products = await apiFeatures.query;

    res.status(200).json({
      success: true,
      count: products.length,
      resultPerPage,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("store", "name")
      .populate("createdBy", "name email");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Ensure only the owner can update
    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    // Build update data
    const updateData = {
      ...req.body,
    };

    // If new images are uploaded, replace old images
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => ({
        public_id: file.filename,
        url: file.path,
      }));
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Ensure only the owner can delete
    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Products For Customers
exports.getCustomerProducts = async (req, res) => {
  try {
    const resultPerPage = 12;

    const apiFeatures = new APIFeatures(
      Product.find({ status: "Active" }).populate("store", "name"),
      req.query
    )
      .search()
      .filter()
      .sort()
      .paginate(resultPerPage);

    const products = await apiFeatures.query;

    res.status(200).json({
      success: true,
      count: products.length,
      resultPerPage,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Related Products
exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: "Active",
    }).limit(4);

    res.status(200).json({
      success: true,
      products: relatedProducts,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add or Update Product Review
exports.addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const existingReview = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      existingReview.rating = Number(rating);
      existingReview.comment = comment;
    } else {
      product.reviews.push(review);
    }

    product.numReviews = product.reviews.length;

    product.averageRating =
      product.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
      product.numReviews;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review submitted successfully.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Product Reviews
exports.getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      averageRating: product.averageRating,
      numReviews: product.numReviews,
      reviews: product.reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Product Review
exports.deleteProductReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    // Only review owner can delete
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review.",
      });
    }

    review.deleteOne();

    product.numReviews = product.reviews.length;

    product.averageRating =
      product.numReviews === 0
        ? 0
        : product.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
          product.numReviews;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};