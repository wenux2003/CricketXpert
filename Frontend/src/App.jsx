import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RepairRequestForm from "./pages/RepairRequestForm";
import CustomerDashboard from "./pages/CustomerDashboard";

// Wrapper component is optional, can directly use useParams in CustomerDashboard
function App() {
  return (
    <Router>
      <Routes>
        {/* Route for repair request form */}
        <Route path="/" element={<RepairRequestForm />} />

        {/* Route for customer dashboard */}
        <Route path="/dashboard/:customerId" element={<CustomerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
