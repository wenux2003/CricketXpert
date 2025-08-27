import { useState, useCallback } from 'react'; // Import useCallback
import axios from 'axios';
import { useDropzone } from 'react-dropzone'; // Import useDropzone

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    description: '',
    category: '',
    brand: '',
    price: 0,
    stock_quantity: 0,
  });
  // New state to hold the image file itself
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // --- NEW: Handler for the dropzone ---
  const onDrop = useCallback((acceptedFiles) => {
    // We only take the first file
    if (acceptedFiles.length > 0) {
      setImageFile(acceptedFiles[0]);
    }
  }, []);

  // --- NEW: Initialize react-dropzone ---
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/gif': []
    },
    multiple: false, // Ensure only one file can be selected
  });

  // --- MODIFIED: Handle submission with file upload ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Please select an image for the product.');
      return;
    }

    // Use FormData to send both file and text data
    const productData = new FormData();
    productData.append('image', imageFile); // 'image' is the field name for the file

    // Append all other form fields to the FormData object
    for (const key in formData) {
      productData.append(key, formData[key]);
    }

    try {
      await axios.post('http://localhost:5000/api/products/', productData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });

      alert('Product added successfully!');
      // Reset form and file state
      setFormData({
        productId: '', name: '', description: '', category: '', brand: '',
        price: 0, stock_quantity: 0,
      });
      setImageFile(null);
    } catch (err) {
      alert('Error adding product: ' + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-primary">Add New Product</h2>
      <form onSubmit={handleSubmit}>
        {/* All other input fields remain the same... */}
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
          <label className="block text-textSoft mb-1">Stock Quantity</label>
          <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" min="0" />
        </div>

        {/* --- NEW: Image Dropzone --- */}
        <div className="mb-4">
          <label className="block text-textSoft mb-1">Product Image</label>
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-6 text-center rounded-md cursor-pointer hover:border-blue-500">
            <input {...getInputProps()} />
            {
              isDragActive ?
                <p>Drop the image here ...</p> :
                <p>Drag 'n' drop an image here, or click to select one</p>
            }
          </div>
          {/* --- NEW: Image Preview --- */}
          {imageFile && (
            <div className="mt-4">
              <p>Preview:</p>
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <button type="submit" className="bg-secondary text-white px-6 py-2 rounded hover:bg-blue-600">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;