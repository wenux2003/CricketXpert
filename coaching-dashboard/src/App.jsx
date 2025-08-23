import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Dashboard from "./components/Dashboard";
import CoachesManagement from "./components/CoachesManagement";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/coaches" element={<CoachesManagement />} />
        </Routes>
      </div>
    </Router>
  );
};


export default App;





