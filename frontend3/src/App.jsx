import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import TestTailwind from './TestTailwind';

const App = () => {
  return (
    <Router>
      <nav className="bg-gray-800 p-4 text-white">
        <Link to="/" className="mr-4">Home</Link>
        <Link to="/test-tailwind">Test Tailwind</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test-tailwind" element={<TestTailwind />} />
      </Routes>
    </Router>
  );
};

export default App;