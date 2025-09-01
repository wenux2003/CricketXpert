import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { notificationsAPI } from '../services/api';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage (in real app, you'd get this from context/state management)
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Get unread notifications count
      fetchUnreadCount(parsedUser.id);
    }
  }, []);

  const fetchUnreadCount = async (userId) => {
    try {
      const response = await notificationsAPI.getUnreadCount(userId);
      setUnreadCount(response.data.data.unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="CricketXpert" className="logo-image" />
          <span className="logo-text">CricketXpert</span>
        </Link>

        {/* Desktop Menu */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-item" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/programs" className="navbar-item" onClick={() => setIsMenuOpen(false)}>
            Coaching Programs
          </Link>
          <Link to="/coaches" className="navbar-item" onClick={() => setIsMenuOpen(false)}>
            Our Coaches
          </Link>
          <Link to="/about" className="navbar-item" onClick={() => setIsMenuOpen(false)}>
            About Us
          </Link>
          <Link to="/contact" className="navbar-item" onClick={() => setIsMenuOpen(false)}>
            Contact
          </Link>

          {/* User Menu */}
          {user ? (
            <div className="navbar-user-menu">
              <div className="navbar-item dropdown">
                <button className="dropdown-toggle">
                  <span className="user-name">Welcome, {user.firstName}</span>
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>
                <div className="dropdown-menu">
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/my-programs" 
                    className="dropdown-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Programs
                  </Link>
                  <Link 
                    to="/sessions" 
                    className="dropdown-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Sessions
                  </Link>
                  <Link 
                    to="/certificates" 
                    className="dropdown-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Certificates
                  </Link>
                  <Link 
                    to="/notifications" 
                    className="dropdown-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Notifications
                    {unreadCount > 0 && (
                      <span className="notification-count">({unreadCount})</span>
                    )}
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link 
                to="/login" 
                className="navbar-item auth-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="navbar-item auth-link register-btn"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;














