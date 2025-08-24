/*const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/productController');

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
// Add these routes to your existing productRoutes.js file

router.get('/search', searchProducts);
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/category/:category', getProductsByCategory);

module.exports = router;*/
// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createProduct, 
  getProducts, 
  getProduct, 
  updateProduct, 
  deleteProduct,
  searchProducts,
  getProductsByCategory,
  getCategories,
  getBrands
} = require('../controllers/productController');

// Search and filter routes (MUST come before /:id route)
router.get('/search', searchProducts);
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/category/:category', getProductsByCategory);

// Basic CRUD routes
router.post('/', createProduct);
router.get('/', getProducts);
router.get('/:id', getProduct);  // This MUST come after specific routes
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
