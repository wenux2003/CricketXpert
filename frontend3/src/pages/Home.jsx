import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search

  // Static map for category images (using public folder)
  const categoryImages = {
    Accessories: '/bat1.png',
    Ball: '/bat1.png',
    Electronics: '/bat1.png',
    Gaming: '/bat1.png',
    Helmet: '/bat1.png',
    Sports: '/bat1.png',
    Wearables: '/bat1.png',
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]); // Trigger fetch on category or search change

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err.response ? err.response.data : err.message);
      setCategories(['Accessories', 'Ball', 'Electronics', 'Gaming', 'Helmet', 'Sports', 'Wearables']); // Fallback categories
    }
  };

  const fetchProducts = async () => {
    try {
      const params = {
        page: 1, // Default page
        limit: 10, // Default limit
      };
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.query = searchQuery;

      console.log('Fetching products with params:', params); // Debug log
      const url = 'http://localhost:5000/api/products/search';
      const res = await axios.get(url, { params });
      console.log('Response data:', res.data); // Debug log
      setProducts(res.data.products); // Extract products from the response
    } catch (err) {
      console.error('Error fetching products:', err.response ? err.response.data : err.message);
      setProducts([]); // Clear products on error
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="bg-bgLight min-h-screen text-textSoft">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="text-2xl font-bold text-primary">CricketExpert.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-secondary">Home</a>
          <a href="#" className="hover:text-secondary">Menu</a>
          <a href="#" className="hover:text-secondary">Mobile App</a>
          <a href="#" className="hover:text-secondary">Contact Us</a>
        </div>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search all products..."
            className="border border-gray-300 p-2 rounded"
            value={searchQuery} // Bind to searchQuery state
            onChange={handleSearchChange} // Update searchQuery on change
          />
          <button className="bg-accent text-white px-4 py-2 rounded hover:bg-orange-600">Sign In</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-16 flex justify-between items-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold mb-4">Order your favourite cricket equipment here</h1>
          <p className="text-lg mb-6">Choose from a diverse menu featuring a delectable array of cricket gears and skill development tools. Our mission is to satisfy your needs and elevate your cricket experience, one perfect gear at a time.</p>
          <button className="bg-accent text-white px-6 py-3 rounded hover:bg-orange-600">View Menu</button>
        </div>
        <img
          src="https://placehold.co/500x300?text=Cricket+Gear"
          alt="Cricket equipment"
          className="rounded-lg shadow-lg"
          onError={(e) => { e.target.src = 'https://placehold.co/500x300'; }}
        />
      </div>

      {/* Explore Menu (Category Circles) */}
      <section className="p-8 text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Explore our menu</h2>
        <p className="text-textSoft mb-8 max-w-2xl mx-auto">Choose from a diverse selection of cricket equipment and skill development tools crafted for enthusiasts and professionals alike.</p>
        <div className="flex justify-center gap-8 flex-wrap">
          {categories.map((cat) => (
            <div
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
              className={`cursor-pointer text-center w-32 ${selectedCategory === cat ? 'border-4 border-secondary rounded-full' : ''}`}
            >
              <img
                src={categoryImages[cat] || `https://placehold.co/100?text=${cat}`}
                alt={cat}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-2 shadow-md"
                onError={(e) => {
                  console.log('Image load failed for:', cat, e.target.src);
                  e.target.src = `https://placehold.co/100?text=${cat}`;
                }}
              />
              <p className="text-textDark font-medium">{cat}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products Display */}
      <section className="p-8">
        <h2 className="text-3xl font-bold text-primary mb-4 text-center">Top products near you</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <p className="text-center col-span-4">No products available matching your search or category.</p>
          ) : (
            products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={product.image_url || 'https://placehold.co/300x200'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    console.log('Product image failed:', product.name, e.target.src);
                    e.target.src = 'https://placehold.co/300x200';
                  }}
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-textDark mb-2">{product.name}</h3>
                  <p className="text-textSoft mb-2">{product.description?.slice(0, 100) || 'No description'}...</p>
                  <p className="text-primary font-bold mb-4">${product.price || 0}</p>
                  <button className="bg-secondary text-white px-4 py-2 rounded w-full hover:bg-blue-600">Add to Cart</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;