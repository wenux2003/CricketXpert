import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

export default function AddProduct() {
    const [formData, setFormData] = useState({
        productId: '', name: '', description: '', category: '', brand: '',
        price: '', stock_quantity: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
        multiple: false,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            setMessage({ type: 'error', text: 'Please select an image for the product.' });
            return;
        }

        const productData = new FormData();
        productData.append('image', imageFile);
        for (const key in formData) {
            productData.append(key, formData[key]);
        }
        
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            await axios.post('http://localhost:5000/api/products/', productData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            });

            setMessage({ type: 'success', text: 'Product added successfully!' });
            setFormData({ productId: '', name: '', description: '', category: '', brand: '', price: '', stock_quantity: '' });
            setImageFile(null);
            setImagePreview('');
        } catch (err) {
            setMessage({ type: 'error', text: 'Error adding product: ' + (err.response?.data?.message || err.message) });
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold text-[#072679] mb-6">Add New Product</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name*" className="w-full p-3 border border-gray-300 rounded-lg" required />
                    <input type="text" name="productId" value={formData.productId} onChange={handleChange} placeholder="Product ID (Unique)*" className="w-full p-3 border border-gray-300 rounded-lg" required />
                </div>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-3 border border-gray-300 rounded-lg" rows="4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required>
                        <option value="">Select Category*</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Bat">Bat</option>
                        <option value="Ball">Ball</option>
                    </select>
                    <select name="brand" value={formData.brand} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required>
                        <option value="">Select Brand*</option>
                        <option value="MRF">MRF</option>
                        <option value="SG">SG</option>
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price (LKR)*" className="w-full p-3 border border-gray-300 rounded-lg" required min="0" />
                    <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} placeholder="Stock Quantity*" className="w-full p-3 border border-gray-300 rounded-lg" required min="0" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Image*</label>
                    <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                        <input {...getInputProps()} />
                        <p>{isDragActive ? "Drop the image here..." : "Drag & drop an image here, or click to select"}</p>
                    </div>
                    {imagePreview && (
                        <div className="mt-4"><p>Preview:</p><img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-md" /></div>
                    )}
                </div>
                <button type="submit" className="w-full bg-[#42ADF5] text-white px-6 py-3 rounded-lg hover:bg-[#2C8ED1] font-bold">Add Product</button>
                {message.text && (
                    <p className={`text-center font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>
                )}
            </form>
        </div>
    );
}
