import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./components/Dashboard";
import CoachesManagement from "./components/CoachesManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/coaches" element={<CoachesManagement />} />
      </Routes>
    </Router>
  );
}

export default App;





