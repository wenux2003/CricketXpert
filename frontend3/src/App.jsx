import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Delivery from './pages/Delivery';
import Payment from './pages/Payment';
import OrderSummary from './pages/OrderSummary';
import MyOrders from './pages/MyOrders';
import OrderTracking from './pages/OrderTracking';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AddProduct from './pages/Admin/AddProduct';
import ListProducts from './pages/Admin/ListProducts';
import ListOrders from './pages/Admin/ListOrders';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/orders" element={<OrderSummary />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/track-order" element={<OrderTracking />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<div className="text-center p-8">Welcome to Admin Dashboard</div>} />
          <Route path="add" element={<AddProduct />} />
          <Route path="list" element={<ListProducts />} />
          <Route path="orders" element={<ListOrders />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;