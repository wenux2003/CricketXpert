import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Edit, Trash2 } from 'lucide-react';

export default function ListProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            let url = `http://localhost:5000/api/products/search?query=${searchQuery}&category=${selectedCategory}`;
            const { data } = await axios.get(url);
            setProducts(data.products || data);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/products/categories');
                setCategories(data);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => fetchProducts(), 300); // Debounce search
        return () => clearTimeout(handler);
    }, [searchQuery, selectedCategory]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                await axios.delete(`http://localhost:5000/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                fetchProducts();
            } catch (err) {
                alert('Error deleting product: ' + (err.response?.data?.message || err.message));
            }
        }
    };
    
    // In a real app, this would open a modal with an edit form.
    const handleEdit = (product) => {
        alert(`Editing product: ${product.name}`);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold text-[#072679] mb-6">Product List</h1>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" placeholder="Search by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg"/>
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-400 w-5 h-5" />
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="border rounded-lg px-4 py-2">
                        <option value="">All Categories</option>
                        {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading products...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500">No products found.</td></tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4"><img src={product.image_url || '[https://placehold.co/64](https://placehold.co/64)'} alt={product.name} className="w-16 h-16 object-cover rounded-md" /></td>
                                    <td className="p-4 font-medium text-gray-800">{product.name}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            product.stock_quantity <= 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                        }`}>{product.stock_quantity || 0}</span>
                                    </td>
                                    <td className="p-4 text-gray-600">{product.category}</td>
                                    <td className="p-4 font-semibold text-[#072679]">LKR {product.price}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
