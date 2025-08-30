import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/users?username=${username}`);
      const user = response.data.find(u => u.username === username);
      if (user) {
        // Store userId in localStorage or context for later use
        localStorage.setItem('userId', user._id);
        navigate('/home');
      } else {
        setError('Invalid username. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login. Please check your username or try again later.');
    }
  };

  return (
    <div className="bg-[#F1F2F7] min-h-screen text-[#36516C] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#42ADF5] text-white py-2 rounded hover:bg-[#2C8ED1] transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;