import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- Security and Layout Components ---
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx';
import CustomerLayout from './components/CustomerLayout.jsx';
import AdminLayout from './components/AdminLayout.jsx'; // <-- Import the AdminLayout

// --- Page Components ---
import Login from './components/Login.jsx';
import SignUpMultiStep from './components/SignUpMultiStep.jsx';
import HomePage from './components/HomePage.jsx';
import Profile from './pages/Profile.jsx';
import EditAccount from './pages/EditAccount.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import UserManagement from './pages/UserManagement.jsx'; // <-- Import the real page

// --- Placeholder Pages for Admin Dashboard ---
const AdminDashboardOverview = () => <div className="p-4 bg-white rounded-lg shadow"><h2>Admin Dashboard Overview</h2><p>Here you can see site statistics.</p></div>;
const Payments = () => <div className="p-4 bg-white rounded-lg shadow"><h2>All Payments</h2></div>;
// ... (other placeholders)

export default function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUpMultiStep />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="/" element={<HomePage />} />

        {/* --- CUSTOMER ROUTES --- */}
        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route path="/customer" element={<CustomerLayout />}>
                <Route index element={<Navigate to="/profile" />} />
                <Route path="profile" element={<Profile />} />
                <Route path="edit-account" element={<EditAccount />} />
            </Route>
        </Route>

        {/* --- ADMIN ROUTES (NOW USING THE ADMIN LAYOUT) --- */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" />} />
                <Route path="dashboard" element={<AdminDashboardOverview />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="profile" element={<Profile />} />
                <Route path="edit-account" element={<EditAccount />} />
                <Route path="payments" element={<Payments />} />
                {/* ... (add all other admin routes here) */}
            </Route>
        </Route>
      </Routes>
    </Router>
  );
}
