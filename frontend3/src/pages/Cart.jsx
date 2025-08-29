import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const deliveryFee = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cart/');
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setCartItems([]);
    }
  };

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(total);
  }, [cartItems]);

  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`);
      fetchCart();
      alert('Item removed from cart!');
    } catch (err) {
      alert('Error removing item: ' + err.message);
    }
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const total = subtotal + deliveryFee;

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Cart</h2>
      <table className="w-full mb-6">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Item</th>
            <th className="text-left p-2">Title</th>
            <th className="text-left p-2">Price</th>
            <th className="text-left p-2">Quantity</th>
            <th className="text-left p-2">Total</th>
            <th className="text-left p-2">Remove</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-4 text-center">No items in cart</td>
            </tr>
          ) : (
            cartItems.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="p-2">
                  <img src={item.image_url || 'https://placehold.co/100x100'} alt={item.name} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="p-2">{item.name}</td>
                <td className="p-2">${item.price}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">${item.price * item.quantity}</td>
                <td className="p-2">
                  <button onClick={() => handleRemoveItem(item._id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <p>Subtotal</p>
          <p>${subtotal}</p>
        </div>
        <div className="flex justify-between mb-2">
          <p>Delivery Fee</p>
          <p>${deliveryFee}</p>
        </div>
        <div className="flex justify-between font-bold">
          <p>Total</p>
          <p>${total}</p>
        </div>
      </div>

      <button
        onClick={handleProceedToCheckout}
        className="bg-orange-500 text-white px-6 py-3 rounded mt-6 w-full"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;