import React from 'react';

// A simple profile icon component using SVG.
// You can replace this with an icon from a library like react-icons if you prefer.
const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-gray-300 hover:text-white transition-colors duration-300"
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
// In your project, you would import and use this HomePage component within your App.js or router setup.
export default function App() {
  return <HomePage />;
}


// This is the main component for your home page.
// It includes the navigation bar and the main content section with buttons.
function HomePage() {
  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      {/* Navigation Bar Section */}
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo or Brand Name */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white">CricketExpert</h1>
            </div>

            {/* Primary Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {/* Home Page Link */}
                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
                
                {/* Buy Products Page Link */}
                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Buy Products</a>
                
                {/* Bookings Page Link */}
                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Bookings</a>
                
                {/* Repairs Page Link */}
                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Repairs</a>
                
                {/* Coaching Programs Page Link */}
                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Programs</a>
              </div>
            </div>

            {/* Profile Icon */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">View profile</span>
                  {/* This button will navigate to the user's profile page. */}
                  <ProfileIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Section */}
      <main>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to <span className="text-indigo-400">CricketExpert</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-lg text-gray-400 sm:text-xl md:mt-5 md:max-w-3xl">
            Your one-stop shop for everything cricket. From gear to coaching, we've got you covered.
          </p>
          
          {/* Action Buttons Section */}
          <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12 space-y-4 sm:space-y-0 sm:space-x-4">
            
            {/* Button to browse the product catalog */}
            <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              Explore Our Gear
            </button>
            
            {/* Button to book a coaching session */}
            <button className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              Book a Session
            </button>
            
            {/* Button to view repair services */}
            <button className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              Repair Services
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}
