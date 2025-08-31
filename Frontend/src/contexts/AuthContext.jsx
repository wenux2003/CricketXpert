import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        setUser(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData, token = 'mock-jwt-token') => {
    try {
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUserData) => {
    try {
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      setUser(updatedUserData);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  // Check if user is customer (can enroll in programs)
  const isCustomer = () => {
    return user?.role === 'customer';
  };

  // Check if user is coach
  const isCoach = () => {
    return user?.role === 'coach';
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'manager';
  };

  // Check if user is manager
  const isManager = () => {
    return user?.role === 'manager';
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    hasRole,
    hasAnyRole,
    isCustomer,
    isCoach,
    isAdmin,
    isManager
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock user data for development (remove in production)
export const mockLogin = (role = 'customer') => {
  const mockUsers = {
    customer: {
      id: '60f1b2b0b3b4b4b4b4b4b4b4',
      username: 'johndoe',
      email: 'john.doe@example.com',
      name: 'John Doe',
      role: 'customer',
      firstName: 'John',
      lastName: 'Doe',
      contactNumber: '0771234567',
      profileImageURL: '/api/placeholder/32/32'
    },
    coach: {
      id: '60f1b2b0b3b4b4b4b4b4b4b5',
      username: 'coachsmith',
      email: 'coach.smith@example.com',
      name: 'Coach Smith',
      role: 'coach',
      firstName: 'Coach',
      lastName: 'Smith',
      contactNumber: '0771234568',
      profileImageURL: '/api/placeholder/32/32'
    },
    manager: {
      id: '60f1b2b0b3b4b4b4b4b4b4b6',
      username: 'managerjones',
      email: 'manager.jones@example.com',
      name: 'Manager Jones',
      role: 'manager',
      firstName: 'Manager',
      lastName: 'Jones',
      contactNumber: '0771234569',
      profileImageURL: '/api/placeholder/32/32'
    }
  };
  
  const mockUser = mockUsers[role] || mockUsers.customer;
  const mockToken = 'mock-jwt-token-for-development';
  
  return { user: mockUser, token: mockToken };
};

