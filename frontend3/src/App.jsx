import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import OrderSummary from './pages/OrderSummary';

function App() {
  const userId = localStorage.getItem('userId'); // Check authentication
  const isAuthenticated = !!userId;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/home" />}
        />
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/cart"
          element={isAuthenticated ? <Cart /> : <Navigate to="/login" />}
        />
        <Route
          path="/orders"
          element={isAuthenticated ? <OrderSummary /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;