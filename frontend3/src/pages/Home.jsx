import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import bat1 from '../assets/merch1.png';
import Accessories1 from '../assets/Accessories1.jpg';
import Electronics1 from '../assets/electronic.jpg';
import Gaming1 from '../assets/Gaming.jpg';
import Wearables1 from '../assets/Wearables.jpg';
import Ball1 from '../assets/ball.jpeg';
import Sports1 from '../assets/sports.jpg';
import { ShoppingCart } from 'lucide-react';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const categoryImages = useMemo(
    () => ({
      Accessories: Accessories1,
      Bat: bat1,
      Ball: Ball1,
      Electronics: Electronics1,
      Gaming: Gaming1,
      Sports: Sports1,
      Wearables: Wearables1,
    }),
    []
  );

  useEffect(() => {
    fetchCategories();
    fetchCartCount();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/categories');
      setCategories(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err.response ? err.response.data : err.message);
      setCategories(['Accessories', 'Bat', 'Ball', 'Electronics', 'Gaming', 'Sports', 'Wearables']);
      setError('Failed to load categories. Showing default options.');
    }
  };

  const fetchProducts = async () => {
    try {
      const params = {
        page: 1,
        limit: 10,
        ...(selectedCategory && { category: selectedCategory }),
        ...(searchQuery && { query: searchQuery }),
      };
      const res = await axios.get('http://localhost:5000/api/products/search', { params });
      setProducts(res.data.products || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err.response ? err.response.data : err.message);
      setProducts([]);
      setError('Failed to load products. Please try again.');
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cart/');
      setCartCount(res.data.items ? res.data.items.length : 0);
    } catch (err) {
      console.error('Error fetching cart count:', err);
      setCartCount(0);
    }
  };

  const handleSearchChange = debounce((value) => {
    setSearchQuery(value);
  }, 300);

  const handleAddToCart = async (productId) => {
    try {
      await axios.post('http://localhost:5000/api/cart/', { productId });
      fetchCartCount();
      alert('Item added to cart!');
    } catch (err) {
      alert('Error adding to cart: ' + err.message);
    }
  };

  const goToCart = () => {
    navigate('/cart');
  };

  return (
    <div className="bg-bgLight min-h-screen text-textSoft">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="text-2xl font-bold text-primary">CricketExpert.</div>
        <div className="flex gap-6">
          <a href="/" className="hover:text-secondary" aria-label="Home">Home</a>
          <a href="/menu" className="hover:text-secondary" aria-label="Menu">Menu</a>
          <a href="/app" className="hover:text-secondary" aria-label="Mobile App">Mobile App</a>
          <a href="/contact" className="hover:text-secondary" aria-label="Contact Us">Contact Us</a>
        </div>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search all products..."
            className="border border-gray-300 p-2 rounded"
            aria-label="Search products"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <button
            onClick={goToCart}
            className="relative bg-accent text-white px-4 py-2 rounded hover:bg-orange-600 flex items-center"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 mx-8 my-4 rounded" role="alert">
          {error}
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-16 flex justify-between items-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold mb-4">Order your favourite cricket equipment here</h1>
          <p className="text-lg mb-6">
            Choose from a diverse menu featuring a delectable array of cricket gears and skill development tools.
          </p>
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
        <p className="text-textSoft mb-8 max-w-2xl mx-auto">
          Choose from a diverse selection of cricket equipment and skill development tools.
        </p>
        <div className="flex justify-center gap-8 flex-wrap">
          {categories.map((cat) => (
            <div
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
              className={`cursor-pointer text-center w-32 ${
                selectedCategory === cat ? 'border-4 border-secondary rounded-full' : ''
              }`}
            >
              <img
                src={categoryImages[cat] || `https://placehold.co/100?text=${cat}`}
                alt={cat}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-2 shadow-md"
                onError={(e) => {
                  console.error(`Image load failed for category: ${cat}`);
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
                  src={product.image_url || 'https://placehold.co/600x500'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    console.error(`Product image failed for: ${product.name}`);
                    e.target.src = 'https://placehold.co/300x200';
                  }}
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-textDark mb-2">{product.name}</h3>
                  <p className="text-textSoft mb-2">{product.description?.slice(0, 100) || 'No description'}...</p>
                  <p className="text-primary font-bold mb-4">${product.price || 0}</p>
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    className="bg-secondary text-white px-4 py-2 rounded w-full hover:bg-blue-600"
                  >
                    Add to Cart
                  </button>
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