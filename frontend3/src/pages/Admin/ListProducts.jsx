import { useEffect, useState } from 'react';
import axios from 'axios';

const ListProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    stock_quantity: '',
    image_url: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };
//search quary 
  const fetchProducts = async () => {
    try {
      let url = 'http://localhost:5000/api/products/';
      if (searchQuery || selectedCategory) {
        url = `http://localhost:5000/api/products/search?query=${searchQuery}&category=${selectedCategory}`;
      }
      const res = await axios.get(url);
      setProducts(res.data.products || res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  //hedale the delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        fetchProducts();
        alert('Product deleted successfully!');
      } catch (err) {
        alert('Error deleting product: ' + err.message);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || '',
      description: product.description || '',
      category: product.category || '',
      brand: product.brand || '',
      price: product.price || '',
      stock_quantity: product.stock_quantity || '',
      image_url: product.image_url || ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!editForm.name.trim()) {
      alert('Product name is required');
      return;
    }
    if (!editForm.category.trim()) {
      alert('Category is required');
      return;
    }
    if (!editForm.price || editForm.price <= 0) {
      alert('Price must be greater than 0');
      return;
    }
    if (!editForm.stock_quantity || editForm.stock_quantity < 0) {
      alert('Stock quantity must be 0 or greater');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, editForm);
      setEditingProduct(null);
      setEditForm({
        name: '',
        description: '',
        category: '',
        brand: '',
        price: '',
        stock_quantity: '',
        image_url: ''
      });
      fetchProducts();
      alert('Product updated successfully!');
    } catch (err) {
      alert('Error updating product: ' + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setEditForm({
      name: '',
      description: '',
      category: '',
      brand: '',
      price: '',
      stock_quantity: '',
      image_url: ''
    });
  };

  return (
    <div className="bg-white p-8 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-primary">All Products List</h2>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border border-gray-300 p-2 rounded"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-bgLight text-textDark">
            <th className="p-3 text-left">Image</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Stock Quantity</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr><td colSpan="6" className="p-3 text-center">No products found</td></tr>
          ) : (
            products.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="p-3">
                  <img src={product.image_url || 'https://placehold.co/50'} alt={product.name} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="p-3">{product.name}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    product.stock_quantity <= 10 
                      ? 'bg-red-100 text-red-800' 
                      : product.stock_quantity <= 25 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {product.stock_quantity || 0}
                  </span>
                </td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">LKR {product.price}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(product)} 
                      className="text-blue-500 hover:text-blue-700 font-medium px-2 py-1 rounded border border-blue-500 hover:border-blue-700 transition-colors"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id)} 
                      className="text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded border border-red-500 hover:border-red-700 transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Product: {editingProduct.name}</h3>
              <button 
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={editForm.category}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={editForm.brand}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (LKR) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={editForm.stock_quantity}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image_url"
                    value={editForm.image_url}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProducts;