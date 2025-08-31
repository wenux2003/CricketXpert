import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Hardcoded user ID for now - in real app this would come from authentication
  const userId = '68a34c9c6c30e2b6fa15c978';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Fetch orders for the specific user
      const res = await axios.get(`http://localhost:5000/api/orders/`);
      // Filter orders for the current user (in real app, backend should handle this)
      const userOrders = res.data.filter(order => order.customerId === userId);
      setOrders(userOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'created':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'cart_pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'created':
        return <Package className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'cart_pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleTrackOrder = (orderId) => {
    navigate('/track-order', { state: { orderId } });
  };

  const handleViewOrderDetails = (order) => {
    navigate(`/orders/${order._id}`, { state: { order } });
  };

  if (loading) {
    return (
      <div className="bg-[#F1F2F7] min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#42ADF5] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F1F2F7] min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold text-[#072679] mb-6">My Orders</h2>
          
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
              <button 
                onClick={() => navigate('/')}
                className="bg-[#42ADF5] text-white px-6 py-3 rounded-lg hover:bg-[#2C8ED1] transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: '#D88717' }}>
                      📦
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-1" style={{ color: '#000000' }}>
                            Order #{order._id.slice(-8)}...
                          </h3>
                          <p className="text-sm mb-2" style={{ color: '#36516C' }}>
                            Items: {order.items?.length || 0}
                          </p>
                          <p className="text-lg font-bold" style={{ color: '#072679' }}>
                            LKR {order.amount?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
                          </span>
                          <div className="mt-3 space-y-2">
                            <button 
                              onClick={() => handleTrackOrder(order._id)}
                              className="bg-[#42ADF5] text-white px-4 py-2 rounded text-sm hover:bg-[#2C8ED1] transition-colors"
                            >
                              Track Order
                            </button>
                            <button 
                              onClick={() => handleViewOrderDetails(order)}
                              className="block w-full border border-[#42ADF5] text-[#42ADF5] px-4 py-2 rounded text-sm hover:bg-[#42ADF5] hover:text-white transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-medium mb-2" style={{ color: '#36516C' }}>
                          Delivery Information
                        </h4>
                        <p className="text-sm" style={{ color: '#36516C' }}>
                          {order.address || 'No address provided'}
                        </p>
                        <p className="text-sm mt-1" style={{ color: '#36516C' }}>
                          Ordered on: {new Date(order.date || order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;