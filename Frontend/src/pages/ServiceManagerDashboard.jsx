import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRepairRequests, updateRepairStatus, assignTechnician, sendEstimate } from '../api/repairRequestApi';
import { getAllTechnicians } from '../api/repairRequestApi';

const Brand = {
  primary: '#072679',
  secondary: '#42ADF5',
  heading: '#000000',
  body: '#36516C',
  light: '#F1F2F7',
  accent: '#D88717',
};

const ServiceManagerDashboard = () => {
  const navigate = useNavigate();
  const [repairRequests, setRepairRequests] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [estimateData, setEstimateData] = useState({
    cost: '',
    timeEstimate: '',
    notes: ''
  });
  const [assignmentData, setAssignmentData] = useState({
    technicianId: '',
    notes: ''
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [requestsRes, techniciansRes] = await Promise.all([
        getAllRepairRequests(),
        getAllTechnicians()
      ]);
      setRepairRequests(requestsRes.data);
      setTechnicians(techniciansRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await updateRepairStatus(requestId, { status: newStatus });
      await loadData(); // Reload data
      alert(`Request ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleSendEstimate = async () => {
    try {
      await sendEstimate(selectedRequest._id, estimateData);
      setShowEstimateModal(false);
      setEstimateData({ cost: '', timeEstimate: '', notes: '' });
      await loadData();
      alert('Estimate sent successfully');
    } catch (error) {
      console.error('Error sending estimate:', error);
      alert('Failed to send estimate');
    }
  };

  const handleAssignTechnician = async () => {
    try {
      await assignTechnician(selectedRequest._id, assignmentData);
      setShowAssignmentModal(false);
      setAssignmentData({ technicianId: '', notes: '' });
      await loadData();
      alert('Technician assigned successfully');
    } catch (error) {
      console.error('Error assigning technician:', error);
      alert('Failed to assign technician');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = repairRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: Brand.light }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: Brand.secondary }}></div>
          <p className="mt-4" style={{ color: Brand.body }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: Brand.light }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: Brand.primary }}>Service Manager Dashboard</h1>
              <p className="mt-1" style={{ color: Brand.body }}>Manage repair requests and technician assignments</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/repair')}
                className="px-4 py-2 rounded-lg text-white font-semibold"
                style={{ backgroundColor: Brand.secondary }}
              >
                New Request
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 rounded-lg text-white font-semibold"
                style={{ backgroundColor: Brand.accent }}
              >
                Main Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Requests', value: repairRequests.length, color: Brand.primary },
            { label: 'Pending', value: repairRequests.filter(r => r.status === 'pending').length, color: Brand.accent },
            { label: 'In Progress', value: repairRequests.filter(r => r.status === 'in_progress').length, color: Brand.secondary },
            { label: 'Completed', value: repairRequests.filter(r => r.status === 'completed').length, color: '#10B981' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-sm" style={{ color: Brand.body }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'approved', 'in_progress', 'completed', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === status ? 'text-white' : 'text-gray-700'
                }`}
                style={{
                  backgroundColor: filter === status ? Brand.secondary : 'transparent',
                  border: filter === status ? 'none' : `1px solid ${Brand.secondary}`
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b" style={{ borderColor: Brand.light }}>
            <h2 className="text-xl font-semibold" style={{ color: Brand.primary }}>
              Repair Requests ({filteredRequests.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm" style={{ backgroundColor: Brand.light }}>
                  <th className="px-6 py-3" style={{ color: Brand.body }}>Customer</th>
                  <th className="px-6 py-3" style={{ color: Brand.body }}>Equipment</th>
                  <th className="px-6 py-3" style={{ color: Brand.body }}>Damage</th>
                  <th className="px-6 py-3" style={{ color: Brand.body }}>Status</th>
                  <th className="px-6 py-3" style={{ color: Brand.body }}>Date</th>
                  <th className="px-6 py-3" style={{ color: Brand.body }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request._id} className="border-t" style={{ borderColor: Brand.light }}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium" style={{ color: Brand.body }}>{request.customerName}</div>
                        <div className="text-sm" style={{ color: Brand.secondary }}>{request.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: Brand.body }}>
                      {request.equipmentType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </td>
                    <td className="px-6 py-4" style={{ color: Brand.body }}>
                      {request.damageType}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                        {request.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4" style={{ color: Brand.body }}>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowEstimateModal(true);
                          }}
                          className="px-3 py-1 rounded text-white text-sm"
                          style={{ backgroundColor: Brand.secondary }}
                        >
                          Estimate
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowAssignmentModal(true);
                          }}
                          className="px-3 py-1 rounded text-white text-sm"
                          style={{ backgroundColor: Brand.accent }}
                        >
                          Assign
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(request._id, 'approved')}
                          className="px-3 py-1 rounded text-white text-sm"
                          style={{ backgroundColor: '#10B981' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(request._id, 'rejected')}
                          className="px-3 py-1 rounded text-white text-sm"
                          style={{ backgroundColor: '#EF4444' }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Estimate Modal */}
      {showEstimateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4" style={{ color: Brand.primary }}>Send Cost Estimate</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>Estimated Cost ($)</label>
                <input
                  type="number"
                  value={estimateData.cost}
                  onChange={(e) => setEstimateData({...estimateData, cost: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter estimated cost"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>Time Estimate</label>
                <input
                  type="text"
                  value={estimateData.timeEstimate}
                  onChange={(e) => setEstimateData({...estimateData, timeEstimate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., 3-5 business days"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>Notes</label>
                <textarea
                  value={estimateData.notes}
                  onChange={(e) => setEstimateData({...estimateData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Additional notes for customer"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEstimateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                style={{ color: Brand.body }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendEstimate}
                className="flex-1 px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: Brand.secondary }}
              >
                Send Estimate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4" style={{ color: Brand.primary }}>Assign Technician</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>Select Technician</label>
                <select
                  value={assignmentData.technicianId}
                  onChange={(e) => setAssignmentData({...assignmentData, technicianId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Choose a technician</option>
                  {technicians.map(tech => (
                    <option key={tech._id} value={tech._id}>{tech.name} - {tech.specialization}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>Assignment Notes</label>
                <textarea
                  value={assignmentData.notes}
                  onChange={(e) => setAssignmentData({...assignmentData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Special instructions for technician"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAssignmentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                style={{ color: Brand.body }}
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTechnician}
                className="flex-1 px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: Brand.accent }}
              >
                Assign Technician
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagerDashboard;
