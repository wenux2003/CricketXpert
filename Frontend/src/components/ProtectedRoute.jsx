import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check if user information is in localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // If the user is logged in (userInfo exists), allow them to see the page.
  // The <Outlet /> component renders the actual page they were trying to visit.
  // Otherwise, redirect them to the /login page.
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
