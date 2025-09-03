const mongoose = require('mongoose');
const Product = require('../models/Product');


exports.createProduct = async (req, res) => {
  try {
    // The text fields are in req.body
    const productData = req.body;

    // The uploaded file info is in req.file
    if (req.file) {
     
      productData.image_url = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, "/")}`;
    } else {
        
        productData.image_url = '';
    }

    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error); // Log the full error
    res.status(400).json({ message: error.message });
  }
};




// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
exports.getProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const { query, category, brand, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    let searchQuery = { is_active: true };
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    if (category) searchQuery.category = category;
    if (brand) searchQuery.brand = brand;
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = Number(minPrice);
      if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
    }
    const products = await Product.find(searchQuery)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ created_at: -1 });
    const total = await Product.countDocuments(searchQuery);
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ 
      category: category, 
      is_active: true 
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { is_active: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all brands
exports.getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand', { is_active: true });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
