import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="bg-gradient-to-r from-[#0D13CC] to-[#42ADF5] text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white hover:text-[#D88717] transition-colors">
              🏏 CricketXpert
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="flex space-x-1">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/') && location.pathname === '/' 
                  ? 'bg-white/20 text-white' 
                  : 'text-blue-100 hover:text-white hover:bg-[#D88717]/20'
              }`}
            >
              Home
            </Link>
            
            <Link 
              to="/program" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/program') 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'text-blue-100 hover:text-white hover:bg-[#D88717]/20'
              }`}
            >
              🎯 Coaching Programs
            </Link>
            
            <Link 
              to="/enrollment" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/enrollment') 
                  ? 'bg-white/20 text-white' 
                  : 'text-blue-100 hover:text-white hover:bg-[#D88717]/20'
              }`}
            >
              📝 Enrollment
            </Link>
            
            <Link 
              to="/favourite" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/favourite') 
                  ? 'bg-white/20 text-white' 
                  : 'text-blue-100 hover:text-white hover:bg-[#D88717]/20'
              }`}
            >
              ⭐ Favourites
            </Link>
            
            <Link 
              to="/profile" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/profile') 
                  ? 'bg-white/20 text-white' 
                  : 'text-blue-100 hover:text-white hover:bg-[#D88717]/20'
              }`}
            >
              👤 Profile
            </Link>
          </div>
          
          {/* CTA Button */}
          <div className="flex items-center">
            <button className="bg-[#D88717] hover:bg-[#D88717]/80 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200">
              Book Trial
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
