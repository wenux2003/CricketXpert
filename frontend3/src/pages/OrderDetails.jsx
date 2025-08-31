import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const OrderDetails = () => {
  const { orderId } = useParams(); // Extract orderId from URL (e.g., /orders/:orderId)
  const location = useLocation();
  const navigate = useNavigate();
  const { order: initialOrder, payment: initialPayment } = location.state || {};
  const [order, setOrder] = useState(initialOrder || {});
  const [payment, setPayment] = useState(initialPayment || {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = '68a34c9c6c30e2b6fa15c978';

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId && !initialOrder) {
        setError('No order ID provided.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${orderId || initialOrder._id}`);
        setOrder(response.data || initialOrder);
        
        const paymentResponse = await axios.get(`http://localhost:5000/api/payments/order/${orderId || initialOrder._id}`);
        setPayment(paymentResponse.data || initialPayment);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, initialOrder, initialPayment]);

  const handleBackToOrders = () => {
    navigate('/orders');
  };

  if (loading) return <div className="text-center p-8">Loading order details...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="bg-[#F1F2F7] min-h-screen text-[#36516C] p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Order Details</h2>

        {/* Order Information */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Order Information</h3>
          <p><strong>Order ID:</strong> {order._id || 'N/A'}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {order.status || 'N/A'}</p>
          <p><strong>Address:</strong> {order.address || 'N/A'}</p>
          <p><strong>Total Amount:</strong> ₹{order.amount || 0}.00</p>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Items</h3>
          {order.items && order.items.length > 0 ? (
            <ul className="space-y-2">
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between text-sm">
                  <span>{item.productId} (Qty: {item.quantity})</span>
                  <span>₹{(item.priceAtOrder * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No items in this order.</p>
          )}
        </div>

        {/* Payment Information */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Payment Information</h3>
          <p><strong>Payment ID:</strong> {payment._id || 'N/A'}</p>
          <p><strong>Amount Paid:</strong> ₹{payment.amount || 0}.00</p>
          <p><strong>Payment Status:</strong> {payment.status || 'N/A'}</p>
          <p><strong>Payment Date:</strong> {new Date(payment.paymentDate || Date.now()).toLocaleDateString()}</p>
        </div>

        {/* Actions */}
        <button
          onClick={handleBackToOrders}
          className="bg-[#42ADF5] text-white py-2 px-4 rounded-lg hover:bg-[#2C8ED1] transition-colors"
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;