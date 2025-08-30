import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Delivery = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalData, userId } = location.state || { cart: [], totalData: { subtotal: 0, deliveryFee: 450, total: 0 }, userId: '689de49c6dc2a3b065e28c88' };
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [userId]);

  const handleProceedToPayment = () => {
    navigate('/payment', { state: { cart, totalData, userId } });
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="bg-[#F1F2F7] min-h-screen text-[#36516C] p-8">
      <h2 className="text-2xl font-bold mb-4">Delivery Details</h2>
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p><strong>Address:</strong> {user?.address || 'No address set'}</p>
        <button
          onClick={handleProceedToPayment}
          className="mt-4 w-full bg-[#42ADF5] text-white py-3 rounded-lg hover:bg-[#2C8ED1] transition-colors"
          disabled={!user?.address}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Delivery;