import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import RepairRequestForm from "./pages/RepairRequestForm";
import CustomerDashboard from "./pages/CustomerDashboard";
import ServiceManagerDashboard from "./pages/ServiceManagerDashboard"; // Optional: if you have this

// Wrapper to pass URL param to CustomerDashboard
function CustomerDashboardWrapper() {
  const { customerId } = useParams();
  return <CustomerDashboard customerId={customerId} />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Customer routes */}
        <Route path="/" element={<RepairRequestForm />} />
        <Route path="/customer/:customerId" element={<CustomerDashboardWrapper />} />
        <Route path="/customer/:customerId/new-request" element={<RepairRequestForm />} />

        {/* Service Manager route */}
        <Route path="/manager" element={<ServiceManagerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
