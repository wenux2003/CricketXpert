import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md h-full">
      <div className="p-4 text-2xl font-bold text-primary">CricketExpert. Admin Panel</div>
      <nav className="mt-8">
        <Link to="/admin/add" className="block py-2 px-4 text-textSoft hover:bg-secondary hover:text-white">
          + Add Items
        </Link>
        <Link to="/admin/list" className="block py-2 px-4 text-textSoft hover:bg-secondary hover:text-white">
          List Items
        </Link>
        <Link to="/admin/orders" className="block py-2 px-4 text-textSoft hover:bg-secondary hover:text-white">
          Orders
        </Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;