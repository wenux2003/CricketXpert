import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalData, address } = location.state || { cart: [], totalData: { subtotal: 0, deliveryFee: 450, total: 0 }, address: '' };
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    country: 'India',
    email: ''
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = '689de49c6dc2a3b065e28c88';

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setUser(response.data);
        setPaymentInfo(prev => ({ ...prev, email: response.data.email || '' }));
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
    console.log('Received state in Payment:', location.state);
    if (!location.state) {
      console.warn('No state passed to Payment page.');
    }
  }, [location.state, userId]);

  const handleChange = (field, value) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const validatePaymentInfo = () => {
    const cardNumber = paymentInfo.cardNumber.replace(/\s/g, '');
    if (!cardNumber || cardNumber.length !== 16 || isNaN(cardNumber)) {
      setError('Please enter a valid 16-digit card number.');
      return false;
    }
    if (!paymentInfo.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      setError('Please enter a valid expiry date (MM/YY).');
      return false;
    }
    if (!paymentInfo.cvc || paymentInfo.cvc.length !== 3 || isNaN(paymentInfo.cvc)) {
      setError('Please enter a valid 3-digit CVC.');
      return false;
    }
    if (!paymentInfo.cardholderName.trim()) {
      setError('Please enter the cardholder name.');
      return false;
    }
    setError(null);
    return true;
  };

  const handlePay = async () => {
    if (!validatePaymentInfo()) return;

    setLoading(true);
    try {
      console.log('Cart:', cart);
      const orderItems = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtOrder: totalData.subtotal / cart.reduce((sum, i) => sum + i.quantity, 0)
      }));
      console.log('Creating order with:', { items: orderItems, status: 'created', address, amount: totalData.total, customerId: userId });
      const orderRes = await axios.post('http://localhost:5000/api/orders/', {
        items: orderItems,
        status: 'created',
        address,
        amount: totalData.total,
        customerId: userId
      });
      console.log('Order created:', orderRes.data);

      console.log('Creating payment with:', { userId, orderId: orderRes.data._id, paymentType: 'order_payment', amount: totalData.total, status: 'success', paymentDate: new Date() });
      const paymentRes = await axios.post('http://localhost:5000/api/payments/', {
        userId,
        orderId: orderRes.data._id,
        paymentType: 'order_payment',
        amount: totalData.total,
        status: 'success',
        paymentDate: new Date()
      });
      console.log('Payment created:', paymentRes.data);

      localStorage.removeItem('cricketCart');
      navigate('/orders', { state: { order: orderRes.data, payment: paymentRes.data } });
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message);
      setError(`Error processing payment: ${err.response?.data?.message || err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="bg-[#F1F2F7] min-h-screen text-[#36516C] p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-2xl font-bold mb-4">Pay Order</div>
          <div className="text-3xl font-bold text-green-600 mb-6">₹{totalData.total}.00</div>
          
          <div className="space-y-3">
            {cart.map((item) => {
              const product = { price: totalData.subtotal / cart.reduce((sum, i) => sum + i.quantity, 0) };
              return (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.productId} (Qty {item.quantity})</span>
                  <span>₹{(product.price * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
            <div className="flex justify-between text-sm border-t pt-2">
              <span>Delivery Charge</span>
              <span>₹{totalData.deliveryFee}.00</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Pay with Card</h3>
          
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="Email"
              value={paymentInfo.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="1234 1234 1234 1234"
                value={paymentInfo.cardNumber}
                onChange={(e) => handleChange('cardNumber', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 pr-20"
              />
              <div className="absolute right-3 top-2 flex space-x-1">
                <div className="w-6 h-4 bg-red-500 rounded"></div>
                <div className="w-6 h-4 bg-blue-500 rounded"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="MM/YY"
                value={paymentInfo.expiryDate}
                onChange={(e) => handleChange('expiryDate', e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
              <input 
                type="text" 
                placeholder="CVC"
                value={paymentInfo.cvc}
                onChange={(e) => handleChange('cvc', e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
            </div>
            
            <input 
              type="text" 
              placeholder="Cardholder name"
              value={paymentInfo.cardholderName}
              onChange={(e) => handleChange('cardholderName', e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
            
          
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button 
              onClick={handlePay}
              className="w-full bg-[#42ADF5] text-white py-3 rounded-lg hover:bg-[#2C8ED1] transition-colors"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;