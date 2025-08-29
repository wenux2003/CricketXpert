import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart } from 'lucide-react';

const Delivery = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalData } = location.state || { cart: [], totalData: { subtotal: 0, deliveryFee: 450, total: 0 } };
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });

  useEffect(() => {
    // Log state to debug if it's empty
    if (!location.state) {
      console.warn('No state passed to Delivery page. Cart and totalData are empty.');
    }
  }, [location.state]);

  const handleChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleProceedToPayment = () => {
    const fullAddress = `${address.firstName} ${address.lastName}, ${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}, Phone: ${address.phone}, Email: ${address.email}`;
    if (!fullAddress.trim() || cart.length === 0) {
      alert('Please fill in the delivery details and ensure cart is not empty.');
      return;
    }
    navigate('/payment', { state: { cart, totalData, address: fullAddress } });
  };

  return (
    <div className="bg-[#F1F2F7] min-h-screen text-[#36516C] p-8">
      {/* Header */}
      <nav className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div className="text-2xl font-bold text-[#072679]">CricketExpert.</div>
        <div className="flex space-x-6 text-gray-600">
          <span>home</span>
          <span>menu</span>
          <span>mobile app</span>
          <span>contact us</span>
        </div>
        <div className="flex items-center space-x-4">
          <Search className="w-5 h-5 text-gray-600" />
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <User className="w-5 h-5 text-gray-600" />
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Delivery Information Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Delivery Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="First name"
                value={address.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
              <input 
                type="text" 
                placeholder="Last name"
                value={address.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
              <input 
                type="email" 
                placeholder="Email address"
                value={address.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="col-span-2 border rounded-lg px-3 py-2"
              />
              <input 
                type="text" 
                placeholder="Street"
                value={address.street}
                onChange={(e) => handleChange('street', e.target.value)}
                className="col-span-2 border rounded-lg px-3 py-2"
              />
              <input 
                type="text" 
                placeholder="City"
                value={address.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
              <input 
                type="text" 
                placeholder="State"
                value={address.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
              <input 
                type="text" 
                placeholder="Zip code"
                value={address.zipCode}
                onChange={(e) => handleChange('zipCode', e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
              <input 
                type="text" 
                placeholder="Country"
                value={address.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
              <input 
                type="tel" 
                placeholder="Phone"
                value={address.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="col-span-2 border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Cart Totals */}
        <div className="bg-white rounded-lg p-6 shadow-sm h-fit">
          <h3 className="font-bold text-lg mb-4">Cart Totals</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totalData.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{totalData.deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>₹{totalData.total}</span>
            </div>
          </div>
          <button 
            onClick={handleProceedToPayment}
            className="w-full bg-[#42ADF5] text-white py-3 rounded-lg mt-4 hover:bg-[#2C8ED1] transition-colors"
            disabled={!cart.length || !Object.values(address).some(val => val.trim())}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delivery;