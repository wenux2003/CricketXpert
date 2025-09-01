import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-text-on-dark/80 group-hover:text-text-on-dark transition-colors duration-300"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// The main App component which renders the HomePage.
export default function App() {
  return <HomePage />;
}

function HomePage() {
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    const handleProfileClick = () => {
        if (userInfo) {
            if (userInfo.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/customer/profile');
            }
        } else {
            navigate('/login');
        }
    };

  return (
    // Main background color updated to light gray
    <div className="bg-background min-h-screen font-sans">
      
      {/* Navigation Bar Section - Updated with primary brand color */}
      <nav className="bg-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo or Brand Name - Text color updated for dark backgrounds */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-text-on-dark">CricketExpert</h1>
            </div>

            {/* Primary Navigation Links - Text colors updated */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="SignUpMultiStep.js" className="text-text-on-dark/80 hover:text-text-on-dark px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</a>
                <a href="#" className="text-text-on-dark/80 hover:text-text-on-dark px-3 py-2 rounded-md text-sm font-medium transition-colors">Buy Products</a>
                <a href="#" className="text-text-on-dark/80 hover:text-text-on-dark px-3 py-2 rounded-md text-sm font-medium transition-colors">Bookings</a>
                <a href="#" className="text-text-on-dark/80 hover:text-text-on-dark px-3 py-2 rounded-md text-sm font-medium transition-colors">Repairs</a>
                <a href="#" className="text-text-on-dark/80 hover:text-text-on-dark px-3 py-2 rounded-md text-sm font-medium transition-colors">Programs</a>
              </div>
            </div>

            {/* Profile Icon */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button onClick={handleProfileClick} className="group p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white">
                  <span className="sr-only">View profile</span>
                  <ProfileIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Section */}
      <main>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Heading text color updated to black, accent color updated to sky blue */}
          <h1 className="text-4xl font-extrabold tracking-tight text-text-heading sm:text-5xl md:text-6xl">
            This is only for <span className="text-secondary">Testing Purposes</span>
          </h1>
          
          {/* Body text color updated to steel blue */}
          <p className="mt-3 max-w-md mx-auto text-lg text-text-body sm:text-xl md:mt-5 md:max-w-3xl">
            For test Front-End files related to crud operations, till we make our official home page.
          </p>
          
          {/* Action Buttons Section - Updated with new button colors */}
          <div className="mt-10 max-w-lg mx-auto sm:flex sm:justify-center md:mt-12 space-y-4 sm:space-y-0 sm:space-x-4">
            
            {/* Primary Button: Sky blue with darker hover state */}
            <button className="w-full sm:w-auto bg-secondary hover:bg-secondary-hover text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
              Test 1
            </button>
            
            {/* Secondary Button: Orange-brown */}
            <button className="w-full sm:w-auto bg-accent hover:opacity-90 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
              Test 2
            </button>
            
            {/* Secondary Button: Orange-brown */}
            <button className="w-full sm:w-auto bg-accent hover:opacity-90 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
              Test 3
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}
