import { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    description: '',
    category: '',
    brand: '',
    price: 0,
    image_url: '',
    stock_quantity: 0,
  });

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products/', formData);
      alert('Product added successfully!');
      setFormData({
        productId: '',
        name: '',
        description: '',
        category: '',
        brand: '',
        price: 0,
        image_url: '',
        stock_quantity: 0,
      });
    } catch (err) {
      alert('Error adding product: ' + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-primary">Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-textSoft mb-1">Product ID (Unique)</label>
          <input type="text" name="productId" value={formData.productId} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block text-textSoft mb-1">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block text-textSoft mb-1">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" rows="4" />
        </div>
        <div className="mb-4">
          <label className="block text-textSoft mb-1">Category (e.g., Bats, Balls)</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-textSoft mb-1">Brand</label>
          <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-textSoft mb-1">Price ($)</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" required min="0" />
        </div>
        <div className="mb-4">
          <label className="block text-textSoft mb-1">Image URL (or upload link)</label>
          <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-textSoft mb-1">Stock Quantity</label>
          <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" min="0" />
        </div>
        <button type="submit" className="bg-secondary text-white px-6 py-2 rounded hover:bg-blue-600">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;