import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PHome = ({ userId }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setUsername(response.data.username || 'User');
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details.');
        setUsername('Guest');
      }
    };
    if (userId) fetchUserDetails();
  }, [userId]);

  return (
    <div className="bg-[#F1F2F7] min-h-screen text-[#36516C] p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {username}!</h1>
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={() => navigate('/cart')}
        className="mt-4 bg-[#42ADF5] text-white px-4 py-2 rounded hover:bg-[#2C8ED1]"
      >
        Go to Cart
      </button>
    </div>
  );
};

export default PHome;