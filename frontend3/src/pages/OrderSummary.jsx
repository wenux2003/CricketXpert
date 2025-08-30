import { useLocation } from 'react-router-dom';

const OrderSummary = () => {
  const location = useLocation();
  const { order } = location.state || {};

  if (!order) {
    return <div className="text-center p-8 text-red-500">No order details available.</div>;
  }

  return (
    <div className="bg-[#F1F2F7] min-h-screen text-[#36516C] p-8">
      <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Amount:</strong> ₹{order.amount}.00</p>
        <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
        <h3 className="text-xl font-bold mt-4">Items</h3>
        <ul className="list-disc pl-5">
          {order.items.map((item, index) => (
            <li key={index}>
              {item.productId} - Qty: {item.quantity}, Price: ₹{item.priceAtOrder}.00
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderSummary;