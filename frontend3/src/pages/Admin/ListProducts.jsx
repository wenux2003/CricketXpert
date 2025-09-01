import { useEffect, useState } from 'react';
import axios from 'axios';

const ListProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

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
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr><td colSpan="5" className="p-3 text-center">No products found</td></tr>
          ) : (
            products.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="p-3">
                  <img src={product.image_url || 'https://placehold.co/50'} alt={product.name} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">LKR {product.price}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(product._id)} className="text-red-500 font-bold text-xl">x</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListProducts;