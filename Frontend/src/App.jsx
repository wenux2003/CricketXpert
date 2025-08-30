import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages and Components
import Login from './components/Login.jsx';
import SignUpMultiStep from './components/SignUpMultiStep.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';

// Placeholder Dashboards (replace with your actual dashboards)
const AdminDashboard = () => <div>Admin Dashboard</div>;
const CustomerDashboard = () => <div>Customer Dashboard</div>;
const HomePage = () => <div>Home Page</div>;


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpMultiStep />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes (user must be logged in) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/customer" element={<CustomerDashboard />} />
          {/* Add other protected dashboard routes here */}
        </Route>

      </Routes>
    </Router>
  );
}
