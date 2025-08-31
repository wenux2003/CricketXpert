import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Delivery from './pages/Delivery';
import Payment from './pages/Payment';
import OrderSummary from './pages/OrderSummary';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AddProduct from './pages/Admin/AddProduct';
import ListProducts from './pages/Admin/ListProducts';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/orders" element={<OrderSummary />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="add" element={<AddProduct />} />
          <Route path="list" element={<ListProducts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;