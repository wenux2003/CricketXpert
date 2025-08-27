import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import RepairRequestForm from './pages/RepairRequestForm';
import CustomerDashboard from './pages/CustomerDashboard';
import ServiceManagerDashboard from './pages/ServiceManagerDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import Dashboard from './pages/Dashboard';
import Navigation from './components/Navigation';
import NewTechnicianForm from './pages/NewTechnicianForm';

// Wrapper to pass URL param
function CustomerDashboardWrapper() {
  const { customerId } = useParams();
  return <CustomerDashboard customerId={customerId} />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/repair" element={<RepairRequestForm />} />
          <Route path="/dashboard/:customerId" element={<CustomerDashboardWrapper />} />
          <Route path="/manager" element={<ServiceManagerDashboard />} />
          <Route path="/technician" element={<TechnicianDashboard />} />
          <Route path="/new-technician" element={<NewTechnicianForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
