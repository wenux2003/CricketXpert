import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const location = useLocation();

  // Show welcome page only when on the main admin route
  const showWelcome = location.pathname === '/admin';

  return (
    <div className="flex h-screen bg-[#F1F2F7]">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        {showWelcome ? (
          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl font-bold text-[#072679] mb-8">Admin Dashboard</h1>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-gray-900">24</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <ShoppingCart className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">156</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Users className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Customers</p>
                      <p className="text-2xl font-bold text-gray-900">89</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">LKR 45.2K</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-[#072679] mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <a 
                      href="/admin/add" 
                      className="block p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      ➕ Add New Product
                    </a>
                    <a 
                      href="/admin/orders" 
                      className="block p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      📦 Manage Orders
                    </a>
                    <a 
                      href="/admin/list" 
                      className="block p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
                    >
                      📋 View All Products
                    </a>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-[#072679] mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span>New order #1234 received</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span>Product "Cricket Bat" updated</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                      <span>Order #1230 marked as completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;