import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  User, 
  Bell, 
  Home, 
  BookOpen, 
  Calendar, 
  Award,
  LogOut,
  Users
} from 'lucide-react';
import { useAuth, mockLogin } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  
  // Use auth context
  const { user, isAuthenticated, login, logout, isCoach, isManager } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      // Mock notifications for now
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Handle mock login for development
  const handleMockLogin = (role = 'customer') => {
    const { user: mockUser, token } = mockLogin(role);
    login(mockUser, token);
    toast.success(`Logged in as ${role}!`);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    setIsProfileOpen(false);
  };

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home
    },
    {
      name: 'Coaching Programs',
      path: '/programs',
      icon: BookOpen
    },
    {
      name: 'Our Coaches',
      path: '/coaches',
      icon: Users
    }
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleNotificationClick = async (notification) => {
    // Mock notification handling
    console.log('Notification clicked:', notification);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/Logo.jpg" 
                alt="CricketXpert Logo" 
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-lg sm:text-xl font-bold text-gray-800 whitespace-nowrap">
                CricketXpert
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActivePath(item.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side - notifications and profile */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications - hidden on very small screens */}
                <div className="relative hidden xs:block">
                  <button
                    className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-colors duration-200"
                    onClick={() => {/* Handle notifications dropdown */}}
                  >
                    <Bell size={18} className="sm:w-5 sm:h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-xs">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleProfile}
                    className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <img
                      src={user?.profileImageURL || '/api/placeholder/32/32'}
                      alt="Profile"
                      className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gray-300 object-cover"
                    />
                    <span className="hidden sm:block text-xs sm:text-sm font-medium text-gray-700 truncate max-w-20 sm:max-w-none">
                      {user?.firstName || user?.name || 'User'}
                    </span>
                  </button>

              {/* Profile dropdown menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User size={16} className="mr-2" />
                    My Profile
                  </Link>
                  {isCoach() ? (
                    <Link
                      to="/coach-dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <BookOpen size={16} className="mr-2" />
                      Coach Dashboard
                    </Link>
                  ) : isManager() ? (
                    <Link
                      to="/manager-dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <BookOpen size={16} className="mr-2" />
                      Manager Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <BookOpen size={16} className="mr-2" />
                      Dashboard
                    </Link>
                  )}
                  <hr className="my-1" />
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
              </>
            ) : (
              /* Login buttons for non-authenticated users */
              <div className="flex flex-col xs:flex-row space-y-1 xs:space-y-0 xs:space-x-1 sm:space-x-2">
                <button
                  onClick={() => handleMockLogin('customer')}
                  className="bg-blue-600 text-white px-2 xs:px-3 py-1.5 xs:py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm whitespace-nowrap"
                >
                  Customer
                </button>
                <button
                  onClick={() => handleMockLogin('coach')}
                  className="bg-green-600 text-white px-2 xs:px-3 py-1.5 xs:py-2 rounded-md hover:bg-green-700 transition-colors font-medium text-xs sm:text-sm whitespace-nowrap"
                >
                  Coach
                </button>
                <button
                  onClick={() => handleMockLogin('manager')}
                  className="bg-purple-600 text-white px-2 xs:px-3 py-1.5 xs:py-2 rounded-md hover:bg-purple-700 transition-colors font-medium text-xs sm:text-sm whitespace-nowrap"
                >
                  Manager
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActivePath(item.path)
                        ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile-only notifications for authenticated users */}
              {isAuthenticated && (
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <button
                    className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 w-full transition-colors duration-200"
                    onClick={() => {
                      setIsMenuOpen(false);
                      /* Handle notifications */
                    }}
                  >
                    <Bell size={20} />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


