import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-white shadow-md h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="text-2xl font-bold text-[#072679]">CricketExpert</div>
        <div className="text-sm text-gray-600 mt-1">Admin Panel</div>
      </div>
      
      <nav className="mt-6">
        <Link 
          to="/admin/add" 
          className={`block py-3 px-6 text-sm font-medium transition-colors ${
            isActive('/admin/add') 
              ? 'bg-[#42ADF5] text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          ➕ Add Products
        </Link>
        <Link 
          to="/admin/list" 
          className={`block py-3 px-6 text-sm font-medium transition-colors ${
            isActive('/admin/list') 
              ? 'bg-[#42ADF5] text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          📋 List Products
        </Link>
        <Link 
          to="/admin/orders" 
          className={`block py-3 px-6 text-sm font-medium transition-colors ${
            isActive('/admin/orders') 
              ? 'bg-[#42ADF5] text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          📦 Manage Orders
        </Link>
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <Link 
          to="/" 
          className="block py-2 px-4 text-sm text-gray-600 hover:text-[#42ADF5] transition-colors"
        >
          ← Back to Store
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;