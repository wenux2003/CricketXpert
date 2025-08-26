import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-bgLight">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;