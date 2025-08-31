import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import RepairRequestForm from './pages/RepairRequestForm';
import MyRequestsPage from './pages/MyRequestsPage';
import CustomerDashboard from './pages/CustomerDashboard';
import ServiceManagerDashboard from './pages/ServiceManagerDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import NewTechnicianForm from './pages/NewTechnicianForm';

// Wrapper to pass URL param
function CustomerDashboardWrapper() {
  const { customerId } = useParams();
  return <CustomerDashboard customerId={customerId} />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/repair" element={<RepairRequestForm />} />
            <Route path="/my-requests" element={<MyRequestsPage />} />
            <Route path="/coaching" element={<Dashboard />} />
            <Route path="/ground-booking" element={<Dashboard />} />
            <Route path="/dashboard/:customerId" element={<CustomerDashboardWrapper />} />
            <Route path="/manager" element={<ServiceManagerDashboard />} />
            <Route path="/technician" element={<TechnicianDashboard />} />
            <Route path="/new-technician" element={<NewTechnicianForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
