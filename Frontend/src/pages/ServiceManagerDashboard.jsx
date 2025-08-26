import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRepairRequests, updateRepairStatus, assignTechnician, sendEstimate } from '../api/repairRequestApi';
import { getAllTechnicians } from '../api/repairRequestApi';
import Brand from '../brand';

// Using shared Brand from ../brand

const ServiceManagerDashboard = () => {
  const navigate = useNavigate();
  const [repairRequests, setRepairRequests] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const [approvalData, setApprovalData] = useState({
    cost: '',
    timeEstimate: ''
  });
  const [approvalErrors, setApprovalErrors] = useState({
    cost: '',
    timeEstimate: ''
  });
  const [rejectionData, setRejectionData] = useState({
    reason: ''
  });
  const [assignmentData, setAssignmentData] = useState({
    technicianId: '',
    notes: ''
  });
  const [filter, setFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('all');

  useEffect(() => {
    console.log('ServiceManagerDashboard mounted, loading data...');
    loadData();
  }, []);

  // Reload data when filters change
  useEffect(() => {
    if (repairRequests.length > 0) {
      console.log('Filters changed - filter:', filter, 'searchFilter:', searchFilter);
    }
  }, [filter, searchFilter]);

  const loadData = async () => {
    try {
      console.log('Loading data...');
      
      // Load repair requests
      const requestsRes = await getAllRepairRequests();
      console.log('Requests response:', requestsRes.data);
      console.log('Number of requests:', requestsRes.data.length);
      setRepairRequests(requestsRes.data);
      
      // Load technicians
      try {
        const techniciansRes = await getAllTechnicians();
        console.log('Technicians response:', techniciansRes.data);
        // Filter to only show available technicians
        const availableTechnicians = techniciansRes.data.filter(tech => tech.available === true);
        console.log('Available technicians:', availableTechnicians);
        setTechnicians(availableTechnicians);
      } catch (techError) {
        console.error('Error loading technicians:', techError);
        setTechnicians([]);
      }
    } catch (error) {
      console.error('Error loading repair requests:', error);
      setRepairRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus, costEstimate = '', timeEstimate = '', rejectionReason = '') => {
    try {
      // Convert status to proper case for backend enum
      let statusValue = newStatus;
      if (newStatus.toLowerCase() === 'approved') {
        statusValue = 'Approved';
      } else if (newStatus.toLowerCase() === 'rejected') {
        statusValue = 'Rejected';
      }
      
      const updateData = { status: statusValue };
      
      if (statusValue === 'Approved') {
        updateData.costEstimate = costEstimate;
        updateData.timeEstimate = timeEstimate;
      } else if (statusValue === 'Rejected') {
        updateData.rejectionReason = rejectionReason;
      }
      
      console.log('Sending update data:', updateData);
      console.log('Request ID:', requestId);
      
      const response = await updateRepairStatus(requestId, updateData);
      console.log('Update response:', response.data);
      
      await loadData(); // Reload data
      alert(`Request ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating status:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to update status: ${error.response?.data?.error || error.message}`);
    }
  };



  const validateApprovalData = () => {
    const errors = {};
    
    // Validate cost - only numbers allowed
    if (!approvalData.cost) {
      errors.cost = 'Cost estimate is required';
    } else if (!/^\d+$/.test(approvalData.cost)) {
      errors.cost = 'Cost must be a number only';
    } else if (parseInt(approvalData.cost) <= 0) {
      errors.cost = 'Cost must be greater than 0';
    }
    
    // Validate time estimate - only numbers 1-30 allowed
    if (!approvalData.timeEstimate) {
      errors.timeEstimate = 'Time estimate is required';
    } else if (!/^\d+$/.test(approvalData.timeEstimate)) {
      errors.timeEstimate = 'Time must be a number only';
    } else {
      const days = parseInt(approvalData.timeEstimate);
      if (days < 1 || days > 30) {
        errors.timeEstimate = 'Time must be between 1 and 30 days';
      }
    }
    
    setApprovalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAssignTechnician = async () => {
    try {
      if (!assignmentData.technicianId) {
        alert('Please select a technician');
        return;
      }

      console.log('Assigning technician:', assignmentData.technicianId, 'to request:', selectedRequest._id);
      const response = await assignTechnician(selectedRequest._id, assignmentData);
      console.log('Assignment response:', response.data);
      
      setShowAssignmentModal(false);
      setAssignmentData({ technicianId: '', notes: '' });
      await loadData();
      alert('Technician assigned successfully');
    } catch (error) {
      console.error('Error assigning technician:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to assign technician: ${error.response?.data?.error || error.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-blue-100 text-blue-800';
      case 'Customer Approved': return 'bg-green-100 text-green-800';
      case 'Customer Rejected': return 'bg-orange-100 text-orange-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'In Repair': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter requests
  const filteredRequests = repairRequests.filter(request => {
    // Apply status filter (case-sensitive to match backend enum)
    if (filter !== 'all' && request.status !== filter) {
      return false;
    }
    
    // Apply equipment filter
    if (searchFilter !== 'all' && request.equipmentType !== searchFilter) {
      return false;
    }
    
    return true;
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
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
          {[
            { label: 'Total Requests', value: repairRequests.length, color: Brand.primary },
            { label: 'Pending', value: repairRequests.filter(r => r.status === 'Pending').length, color: Brand.accent },
            { label: 'Waiting for Customer', value: repairRequests.filter(r => r.status === 'Approved').length, color: Brand.secondary },
            { label: 'Customer Approved', value: repairRequests.filter(r => r.status === 'Customer Approved').length, color: '#10B981' },
            { label: 'Customer Rejected', value: repairRequests.filter(r => r.status === 'Customer Rejected').length, color: '#EF4444' },
            { label: 'Rejected', value: repairRequests.filter(r => r.status === 'Rejected').length, color: '#DC2626' },
            { label: 'In Repair', value: repairRequests.filter(r => r.status === 'In Repair').length, color: '#3B82F6' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-sm" style={{ color: Brand.body }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Filter */}
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: Brand.primary }}>Status Filter</h3>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                style={{ borderColor: Brand.secondary, color: Brand.body }}
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved (Waiting for Customer)</option>
                <option value="Customer Approved">Customer Approved</option>
                <option value="Customer Rejected">Customer Rejected</option>
                <option value="In Repair">In Repair</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Equipment Type Filter */}
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: Brand.primary }}>Equipment Type</h3>
              <select 
                value={searchFilter} 
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                style={{ borderColor: Brand.secondary, color: Brand.body }}
              >
                <option value="all">All Equipment Types</option>
                <option value="cricket_bat">Cricket Bat</option>
                <option value="cricket_ball">Cricket Ball</option>
                <option value="cricket_gloves">Cricket Gloves</option>
                <option value="cricket_pads">Cricket Pads</option>
                <option value="cricket_helmet">Cricket Helmet</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: Brand.light }}>
            <button
              onClick={() => {
                setFilter('all');
                setSearchFilter('all');
                loadData();
              }}
              className="px-4 py-2 rounded-lg text-white font-medium text-sm"
              style={{ backgroundColor: Brand.accent }}
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b" style={{ borderColor: Brand.light }}>
            <h2 className="text-xl font-semibold" style={{ color: Brand.primary }}>
              Repair Requests ({filteredRequests.length})
            </h2>
            <p className="text-sm" style={{ color: Brand.body }}>
              Debug: Total requests loaded: {repairRequests.length} | 
              Status filter: {filter} | 
              Equipment filter: {searchFilter}
            </p>
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
                        <div className="font-medium" style={{ color: Brand.body }}>{request.customerId?.username || 'Unknown'}</div>
                        <div className="text-sm" style={{ color: Brand.secondary }}>{request.customerId?.email || 'No email'}</div>
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
                        {/* Assign button - only for Customer Approved requests */}
                        {request.status === 'Customer Approved' && (
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowAssignmentModal(true);
                            }}
                            className="px-3 py-1 rounded text-white text-sm"
                            style={{ backgroundColor: Brand.accent }}
                          >
                            Assign Technician
                          </button>
                        )}
                        
                        {/* Approve button - only for Pending requests */}
                        {request.status === 'Pending' && (
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowApprovalModal(true);
                            }}
                            className="px-3 py-1 rounded text-white text-sm"
                            style={{ backgroundColor: '#10B981' }}
                          >
                            Approve
                          </button>
                        )}
                        
                        {/* Reject button - only for Pending requests */}
                        {request.status === 'Pending' && (
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowRejectionModal(true);
                            }}
                            className="px-3 py-1 rounded text-white text-sm"
                            style={{ backgroundColor: '#EF4444' }}
                          >
                            Reject
                          </button>
                        )}
                        
                        {/* Status indicators for other states */}
                        {request.status === 'Approved' && (
                          <span className="px-3 py-1 rounded text-sm bg-blue-100 text-blue-800">
                            Waiting for Customer
                          </span>
                        )}
                        
                        {request.status === 'Customer Approved' && (
                          <span className="px-3 py-1 rounded text-sm bg-green-100 text-green-800">
                            Ready to Assign
                          </span>
                        )}
                        
                        {request.status === 'Customer Rejected' && (
                          <span className="px-3 py-1 rounded text-sm bg-orange-100 text-orange-800">
                            Customer Rejected
                          </span>
                        )}
                        
                        {request.status === 'Rejected' && (
                          <span className="px-3 py-1 rounded text-sm bg-red-100 text-red-800">
                            Rejected
                          </span>
                        )}
                        
                        {/* In Repair status - show assigned technician */}
                        {request.status === 'In Repair' && request.assignedTechnician && (
                          <div className="text-sm">
                            <span className="px-3 py-1 rounded text-sm bg-blue-100 text-blue-800 mb-1 block">
                              In Repair
                            </span>
                            <span className="text-xs text-gray-600">
                              Technician Assigned
                            </span>
                          </div>
                        )}
                        
                        {/* In Repair status - no technician assigned (fallback) */}
                        {request.status === 'In Repair' && !request.assignedTechnician && (
                          <span className="px-3 py-1 rounded text-sm bg-blue-100 text-blue-800">
                            In Repair
                          </span>
                        )}
                        
                        {/* Halfway Completed status - show assigned technician */}
                        {request.status === 'Halfway Completed' && request.assignedTechnician && (
                          <div className="text-sm">
                            <span className="px-3 py-1 rounded text-sm bg-yellow-100 text-yellow-800 mb-1 block">
                              Halfway Completed
                            </span>
                            <span className="text-xs text-gray-600">
                              Technician Assigned
                            </span>
                          </div>
                        )}
                        
                        {/* Halfway Completed status - no technician assigned (fallback) */}
                        {request.status === 'Halfway Completed' && !request.assignedTechnician && (
                          <span className="px-3 py-1 rounded text-sm bg-yellow-100 text-yellow-800">
                            Halfway Completed
                          </span>
                        )}
                        
                        {/* Completed status - show assigned technician */}
                        {request.status === 'Completed' && request.assignedTechnician && (
                          <div className="text-sm">
                            <span className="px-3 py-1 rounded text-sm bg-green-100 text-green-800 mb-1 block">
                              Completed
                            </span>
                            <span className="text-xs text-gray-600">
                              Technician Assigned
                            </span>
                          </div>
                        )}
                        
                        {/* Completed status - no technician assigned (fallback) */}
                        {request.status === 'Completed' && !request.assignedTechnician && (
                          <span className="px-3 py-1 rounded text-sm bg-green-100 text-green-800">
                            Completed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>



      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4" style={{ color: Brand.primary }}>Assign Technician</h3>
            
            {/* Request Details */}
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: Brand.light }}>
              <h4 className="font-semibold mb-2" style={{ color: Brand.primary }}>Request Details</h4>
              <p className="text-sm" style={{ color: Brand.body }}>
                <strong>Equipment:</strong> {selectedRequest?.equipmentType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
              <p className="text-sm" style={{ color: Brand.body }}>
                <strong>Damage:</strong> {selectedRequest?.damageType}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>Select Technician</label>
                <select
                  value={assignmentData.technicianId}
                  onChange={(e) => setAssignmentData({...assignmentData, technicianId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Choose a qualified technician</option>
                  {technicians.map(tech => {
                    const hasRelevantSkill = tech.skills?.some(skill => 
                      skill.toLowerCase().includes(selectedRequest?.equipmentType?.replace('_', ' ').toLowerCase()) ||
                      skill.toLowerCase().includes('general') ||
                      skill.toLowerCase().includes('all')
                    );
                    
                    return (
                      <option 
                        key={tech._id} 
                        value={tech._id}
                        className={hasRelevantSkill ? 'font-medium' : 'text-gray-500'}
                      >
                        {tech.technicianId?.username || tech.name} 
                        {tech.skills?.length > 0 && ` - ${tech.skills.join(', ')}`}
                        {!hasRelevantSkill && ' (Not specialized)'}
                      </option>
                    );
                  })}
                </select>
                <p className="text-xs mt-1" style={{ color: Brand.secondary }}>
                  Only available technicians are shown. Skills matching the equipment type are highlighted.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>Assignment Notes</label>
                <textarea
                  value={assignmentData.notes}
                  onChange={(e) => setAssignmentData({...assignmentData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Special instructions or priority notes for the technician..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAssignmentModal(false);
                  setAssignmentData({ technicianId: '', notes: '' });
                }}
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

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4" style={{ color: Brand.primary }}>Approve Request & Send Estimate</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>Estimated Cost ($)</label>
                <input
                  type="text"
                  value={approvalData.cost}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                    setApprovalData({...approvalData, cost: value});
                    if (approvalErrors.cost) {
                      setApprovalErrors({...approvalErrors, cost: ''});
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    approvalErrors.cost ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter estimated cost (numbers only)"
                  required
                />
                {approvalErrors.cost && (
                  <p className="text-red-500 text-sm mt-1">{approvalErrors.cost}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>Time Estimate (Days)</label>
                <input
                  type="text"
                  value={approvalData.timeEstimate}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                    setApprovalData({...approvalData, timeEstimate: value});
                    if (approvalErrors.timeEstimate) {
                      setApprovalErrors({...approvalErrors, timeEstimate: ''});
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    approvalErrors.timeEstimate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter days (1-30)"
                  required
                />
                {approvalErrors.timeEstimate && (
                  <p className="text-red-500 text-sm mt-1">{approvalErrors.timeEstimate}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">Enter number of days between 1 and 30</p>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovalData({ cost: '', timeEstimate: '' });
                  setApprovalErrors({ cost: '', timeEstimate: '' });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                style={{ color: Brand.body }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (validateApprovalData()) {
                    await handleStatusUpdate(
                      selectedRequest._id, 
                      'approved', 
                      approvalData.cost, 
                      approvalData.timeEstimate
                    );
                    setShowApprovalModal(false);
                    setApprovalData({ cost: '', timeEstimate: '' });
                    setApprovalErrors({ cost: '', timeEstimate: '' });
                  }
                }}
                className="flex-1 px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: '#10B981' }}
              >
                Approve & Send Estimate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4" style={{ color: Brand.primary }}>Reject Request</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>Rejection Reason</label>
                <textarea
                  value={rejectionData.reason}
                  onChange={(e) => setRejectionData({...rejectionData, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Please provide a reason for rejection..."
                  required
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                style={{ color: Brand.body }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleStatusUpdate(
                    selectedRequest._id, 
                    'rejected', 
                    '', 
                    '', 
                    rejectionData.reason
                  );
                  setShowRejectionModal(false);
                  setRejectionData({ reason: '' });
                }}
                className="flex-1 px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: '#EF4444' }}
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagerDashboard;
