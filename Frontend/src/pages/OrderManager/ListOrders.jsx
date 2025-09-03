import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Eye, Edit, Trash2, XCircle, Package, Clock, CheckCircle } from 'lucide-react';

// Reusable Modal Component
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default function ListOrders() {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const url = selectedStatus ? `http://localhost:5000/api/orders/status/${selectedStatus}` : 'http://localhost:5000/api/orders/';
            const { data } = await axios.get(url);
            setOrders(data);
        } catch (err) { console.error('Error fetching orders:', err); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        const handler = setTimeout(() => fetchOrders(), 300);
        return () => clearTimeout(handler);
    }, [searchQuery, selectedStatus]);
    
    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${id}`, { status });
            fetchOrders();
        } catch (err) { alert('Error updating status.'); }
    };
    
    // ... other handlers for edit, delete etc.

    const getStatusPill = (status) => {
        const statuses = {
            created: { icon: <Package size={14} />, color: 'bg-blue-100 text-blue-800' },
            processing: { icon: <Clock size={14} />, color: 'bg-yellow-100 text-yellow-800' },
            completed: { icon: <CheckCircle size={14} />, color: 'bg-green-100 text-green-800' },
            cancelled: { icon: <XCircle size={14} />, color: 'bg-red-100 text-red-800' },
            default: { icon: <Package size={14} />, color: 'bg-gray-100 text-gray-800' }
        };
        const { icon, color } = statuses[status] || statuses.default;
        return <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{icon} {status}</span>;
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-[#072679] mb-4">Order Management</h1>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder="Search by Order ID, Customer..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div>
                    <div className="flex items-center gap-2"><Filter className="text-gray-400" size={20} /><select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="border rounded-lg px-4 py-2"><option value="">All Statuses</option><option value="created">Created</option><option value="processing">Processing</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {loading ? <div className="p-8 text-center">Loading orders...</div> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead><tr className="bg-gray-50 border-b"><th className="p-4">Order ID</th><th className="p-4">Customer</th><th className="p-4">Amount</th><th className="p-4">Status</th><th className="p-4">Date</th><th className="p-4">Actions</th></tr></thead>
                           <tbody>
                               {orders.map(order => (
                                   <tr key={order._id} className="border-b hover:bg-gray-50">
                                       <td className="p-4 font-mono text-xs text-gray-600">...{order._id.slice(-8)}</td>
                                       <td className="p-4 text-sm font-medium text-gray-800">{order.customerId?.slice(-8) || 'N/A'}...</td>
                                       <td className="p-4 font-semibold text-[#072679]">LKR {order.amount?.toFixed(2)}</td>
                                       <td className="p-4">{getStatusPill(order.status)}</td>
                                       <td className="p-4 text-sm text-gray-500">{new Date(order.date || order.createdAt).toLocaleDateString()}</td>
                                       <td className="p-4"><div className="flex gap-2"><button onClick={() => setSelectedOrder(order)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><Eye size={16}/></button><button className="p-2 text-green-600 hover:bg-green-100 rounded-full"><Edit size={16}/></button><button className="p-2 text-red-600 hover:bg-red-100 rounded-full"><Trash2 size={16}/></button></div></td>
                                   </tr>
                               ))}
                           </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
                {selectedOrder && (
                    <div>
                        <h2 className="text-2xl font-bold text-[#072679] mb-4">Order Details</h2>
                        <div className="space-y-2">
                            <p><strong>ID:</strong> {selectedOrder._id}</p>
                            <p><strong>Customer:</strong> {selectedOrder.customerId}</p>
                            <p><strong>Amount:</strong> LKR {selectedOrder.amount?.toFixed(2)}</p>
                            <p><strong>Status:</strong> {getStatusPill(selectedOrder.status)}</p>
                            <p><strong>Address:</strong> {selectedOrder.address}</p>
                            <h3 className="font-bold mt-4">Items:</h3>
                            <ul>{selectedOrder.items.map((item, i) => <li key={i}>{item.quantity} x (Product ID: {item.productId}) @ LKR {item.priceAtOrder.toFixed(2)}</li>)}</ul>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
