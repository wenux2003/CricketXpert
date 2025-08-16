const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

const router = express.Router();

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// CREATE product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { productId, name, description, category, brand, price, stock_quantity } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await Product.create({
      productId, name, description, category, brand, price, image_url, stock_quantity
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// READ single product
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
});

// DELETE product
router.delete('/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

module.exports = router;
