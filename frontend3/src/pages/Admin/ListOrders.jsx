import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Filter, Eye, Edit, CheckCircle, XCircle, Clock, Package, Trash2 } from 'lucide-react';

const ListOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({
    address: '',
    amount: '',
    status: '',
    items: []
  });

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = selectedStatus ? `http://localhost:5000/api/orders/status/${selectedStatus}` : 'http://localhost:5000/api/orders/';
      const res = await axios.get(url);
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, { status });
      fetchOrders();
      alert('Order status updated successfully!');
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleDeleteOrder = async (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    
    try {
      setDeleting(true);
      await axios.delete(`http://localhost:5000/api/orders/${orderToDelete._id}`);
      
      // Remove the order from the local state
      setOrders(prevOrders => prevOrders.filter(order => order._id !== orderToDelete._id));
      
      setShowDeleteModal(false);
      setOrderToDelete(null);
      alert('Order deleted successfully!');
    } catch (err) {
      alert('Error deleting order: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (order) => {
    console.log('Opening edit modal for order:', order);
    setEditingOrder(order);
    const formData = {
      address: order.address || '',
      amount: order.amount || '',
      status: order.status || '',
      items: order.items ? [...order.items] : []
    };
    console.log('Setting edit form data:', formData);
    setEditForm(formData);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!editForm.address.trim()) {
      alert('Address is required');
      return;
    }
    if (!editForm.amount || editForm.amount <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    // Validate items
    if (editForm.items.length > 0) {
      for (let i = 0; i < editForm.items.length; i++) {
        const item = editForm.items[i];
        if (!item.productId || !item.productId.trim()) {
          alert(`Product ID is required for item ${i + 1}`);
          return;
        }
        if (!item.quantity || item.quantity < 1) {
          alert(`Quantity must be at least 1 for item ${i + 1}`);
          return;
        }
        if (!item.priceAtOrder || item.priceAtOrder < 0) {
          alert(`Price must be 0 or greater for item ${i + 1}`);
          return;
        }
      }
    }

    try {
      console.log('Submitting order update:', editForm);
      await axios.put(`http://localhost:5000/api/orders/${editingOrder._id}/details`, editForm);
      setEditingOrder(null);
      setEditForm({
        address: '',
        amount: '',
        status: '',
        items: []
      });
      fetchOrders();
      alert('Order updated successfully!');
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Error updating order: ' + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const closeEditModal = () => {
    setEditingOrder(null);
    setEditForm({
      address: '',
      amount: '',
      status: '',
      items: []
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...editForm.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditForm(prev => ({ ...prev, items: newItems }));
    console.log(`Item ${index} updated:`, { field, value, newItems });
    
    // Auto-calculate total amount when quantity or price changes
    if (field === 'quantity' || field === 'priceAtOrder') {
      setTimeout(() => {
        const total = newItems.reduce((sum, item) => {
          return sum + (item.quantity * item.priceAtOrder);
        }, 0);
        setEditForm(prev => ({ ...prev, amount: total }));
      }, 100);
    }
  };

  const removeItem = (index) => {
    const newItems = editForm.items.filter((_, i) => i !== index);
    setEditForm(prev => ({ ...prev, items: newItems }));
    console.log(`Item ${index} removed, new items:`, newItems);
  };

  const addItem = () => {
    const newItem = {
      productId: '',
      quantity: 1,
      priceAtOrder: 0
    };
    setEditForm(prev => ({ ...prev, items: [...prev.items, newItem] }));
    console.log('Item added:', newItem);
  };

  const calculateTotalAmount = () => {
    const total = editForm.items.reduce((sum, item) => {
      return sum + (item.quantity * item.priceAtOrder);
    }, 0);
    return total;
  };

  const updateAmountFromItems = () => {
    const total = calculateTotalAmount();
    setEditForm(prev => ({ ...prev, amount: total }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'created':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'cart_pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'created':
        return <Package className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'cart_pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.address?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const viewOrderDetails = async (order) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/${order._id}`);
      setSelectedOrder(response.data);
      setShowOrderDetails(true);
    } catch (err) {
      console.error('Error fetching order details:', err);
    }
  };

  return (
    <div className="bg-[#F1F2F7] min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-3xl font-bold text-[#072679] mb-4">Order Management</h2>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer ID, or Address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)} 
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="cart_pending">Cart Pending</option>
                <option value="created">Created</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'created').length}</div>
              <div className="text-sm text-blue-600">Created</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'processing').length}</div>
              <div className="text-sm text-yellow-600">Processing</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'completed').length}</div>
              <div className="text-sm text-green-600">Completed</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{orders.filter(o => o.status === 'cancelled').length}</div>
              <div className="text-sm text-red-600">Cancelled</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{orders.filter(o => o.status === 'cart_pending').length}</div>
              <div className="text-sm text-gray-600">Cart Pending</div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#42ADF5] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order._id.slice(-8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.customerId?.slice(-8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items?.length || 0} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#072679]">
                        LKR {order.amount?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.date || order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="text-[#42ADF5] hover:text-[#2C8ED1] p-1"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(order)}
                            className="text-green-600 hover:text-green-700 p-1"
                            title="Edit Order"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-[#42ADF5]"
                          >
                            <option value="cart_pending">Cart Pending</option>
                            <option value="created">Created</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => handleDeleteOrder(order)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No orders found matching your criteria.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#072679]">Order Details</h3>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Order Information</h4>
                  <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                  <p><strong>Customer ID:</strong> {selectedOrder.customerId}</p>
                  <p><strong>Date:</strong> {new Date(selectedOrder.date || selectedOrder.createdAt).toLocaleString()}</p>
                  <p><strong>Status:</strong> 
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      <span className="ml-1">{selectedOrder.status}</span>
                    </span>
                  </p>
                  <p><strong>Address:</strong> {selectedOrder.address}</p>
                  <p><strong>Total Amount:</strong> LKR {selectedOrder.amount?.toFixed(2) || '0.00'}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700">Order Items</h4>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm border-b pb-2">
                          <span>Product ID: {item.productId}</span>
                          <span>Qty: {item.quantity}</span>
                          <span>LKR {(item.priceAtOrder * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No items in this order.</p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700">Update Status</h4>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => {
                      handleUpdateStatus(selectedOrder._id, e.target.value);
                      setSelectedOrder({...selectedOrder, status: e.target.value});
                    }}
                    className="mt-2 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent"
                  >
                    <option value="cart_pending">Cart Pending</option>
                    <option value="created">Created</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Order</h3>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-6">
              {/* Basic Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    id="edit-address"
                    name="address"
                    value={editForm.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                                 <div>
                   <label htmlFor="edit-amount" className="block text-sm font-medium text-gray-700">Amount (LKR)</label>
                   <div className="flex gap-2">
                     <input
                       type="number"
                       id="edit-amount"
                       name="amount"
                       value={editForm.amount}
                       onChange={handleInputChange}
                       step="0.01"
                       min="0"
                       className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                     />
                     <button
                       type="button"
                       onClick={updateAmountFromItems}
                       className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                       title="Calculate total from items"
                     >
                       Calculate
                     </button>
                   </div>
                 </div>
                <div>
                  <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    id="edit-status"
                    name="status"
                    value={editForm.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="cart_pending">Cart Pending</option>
                    <option value="created">Created</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Order Items</h4>
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    + Add Item
                  </button>
                </div>
                
                {editForm.items.length === 0 ? (
                  <p className="text-gray-500 text-sm">No items in this order.</p>
                ) : (
                  <div className="space-y-3">
                    {editForm.items.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Product ID</label>
                            <input
                              type="text"
                              value={item.productId}
                              onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                              placeholder="Product ID"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                              min="1"
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Price (LKR)</label>
                            <input
                              type="number"
                              value={item.priceAtOrder}
                              onChange={(e) => handleItemChange(index, 'priceAtOrder', parseFloat(e.target.value) || 0)}
                              step="0.01"
                              min="0"
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            />
                          </div>
                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#42ADF5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={deleting}
                >
                  {deleting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    'Update Order'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && orderToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Delete Order</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-700">
                <strong>Order ID:</strong> {orderToDelete._id.slice(-8)}...
              </p>
              <p className="text-sm text-gray-700">
                <strong>Customer:</strong> {orderToDelete.customerId?.slice(-8)}...
              </p>
              <p className="text-sm text-gray-700">
                <strong>Amount:</strong> LKR {orderToDelete.amount?.toFixed(2) || '0.00'}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Status:</strong> 
                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(orderToDelete.status)}`}>
                  {getStatusIcon(orderToDelete.status)}
                  <span className="ml-1">{orderToDelete.status}</span>
                </span>
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setOrderToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#42ADF5]"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                disabled={deleting}
              >
                {deleting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </div>
                ) : (
                  'Delete Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOrders;
