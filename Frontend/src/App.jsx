import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import RepairRequestForm from "./pages/RepairRequestForm";
import CustomerDashboard from "./pages/CustomerDashboard";

// Wrapper to pass URL param
function CustomerDashboardWrapper() {
  const { customerId } = useParams();
  return <CustomerDashboard customerId={customerId} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RepairRequestForm />} />
        <Route path="/dashboard/:customerId" element={<CustomerDashboardWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;
