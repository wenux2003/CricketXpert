import { useState, useEffect } from 'react';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-center">No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: '#D88717' }}>
                  📦
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1" style={{ color: '#000000' }}>
                        Order #{order._id}
                      </h3>
                      <p className="text-sm mb-2" style={{ color: '#36516C' }}>
                        Items: {order.items.length}
                      </p>
                      <p className="text-lg font-bold" style={{ color: '#072679' }}>
                        ₹{order.amount}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm mb-2" style={{ color: '#36516C' }}>
                        Status: {order.status}
                      </p>
                      <button className="bg-pink-100 text-pink-500 px-4 py-2 rounded">Track Order</button>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium mb-2" style={{ color: '#36516C' }}>
                      {order.customerId ? 'Customer' : 'Guest'}
                    </h4>
                    <p className="text-sm" style={{ color: '#36516C' }}>
                      {order.address || 'No address provided'}
                    </p>
                    <p className="text-sm mt-1" style={{ color: '#36516C' }}>
                      {order.phone || 'No phone provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;