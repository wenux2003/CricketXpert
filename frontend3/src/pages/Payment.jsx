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
    country: 'India'
  });

  const handleChange = (field, value) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePay = async () => {
    try {
      const orderItems = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtOrder: totalData.subtotal / cart.reduce((sum, i) => sum + i.quantity, 0) // Approximate, better to use product price
      }));

      const res = await axios.post('http://localhost:5000/api/orders/', {
        items: orderItems,
        status: 'created',
        address,
        amount: totalData.total,
        customerId: 'guest-user' // Replace with actual if authenticated
      });

      navigate('/orders', { state: { order: res.data } });
    } catch (err) {
      console.error('Error creating order:', err);
      alert('Error creating order.');
    }
  };

  return (
    <div className="bg-[#F1F2F7] min-h-screen text-[#36516C] p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-2xl font-bold mb-4">Pay Order</div>
          <div className="text-3xl font-bold text-green-600 mb-6">₹{totalData.total}.00</div>
          
          <div className="space-y-3">
            {cart.map((item) => {
              const product = { price: totalData.subtotal / cart.reduce((sum, i) => sum + i.quantity, 0) }; // Approximate
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
          <h3 className="font-bold text-lg mb-6">Pay with card</h3>
          
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="Email"
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
            
            <select 
              value={paymentInfo.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
            </select>
            
            <button 
              onClick={handlePay}
              className="w-full bg-[#42ADF5] text-white py-3 rounded-lg hover:bg-[#2C8ED1] transition-colors"
            >
              Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;