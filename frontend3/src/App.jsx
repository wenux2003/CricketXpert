import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AddProduct from './pages/Admin/AddProduct';
import ListProducts from './pages/Admin/ListProducts';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="add" element={<AddProduct />} />
          <Route path="list" element={<ListProducts />} />
          {/* Add orders route later if needed */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;