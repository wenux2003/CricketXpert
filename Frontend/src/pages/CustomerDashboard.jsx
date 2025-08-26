import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomerRequests, submitFeedback, downloadRepairReport, updateRepairRequest, deleteRepairRequest } from '../api/repairRequestApi';
import Brand from '../brand';

// Using shared Brand from ../brand

const DAMAGE_TYPES = [
  'Bat Handle Damage',
  'Bat Surface Crack',
  'Ball Stitch Damage',
  'Gloves Tear',
  'Pads Crack',
  'Helmet Damage',
  'Other'
];

const CustomerDashboard = ({ customerId }) => {
  const navigate = useNavigate();
  const [repairRequests, setRepairRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ damageType: '', description: '' });
  const [query, setQuery] = useState('');
  const [allRequests, setAllRequests] = useState([]);
  const [feedbackData, setFeedbackData] = useState({
    rating: 5,
    comment: '',
    category: 'general'
  });

  useEffect(() => {
    loadCustomerRequests();
  }, [customerId]);

  const loadCustomerRequests = async () => {
      try {
        const res = await getCustomerRequests(customerId);
      const list = Array.isArray(res?.data) ? res.data : [];
      setAllRequests(list);
      setRepairRequests(list);
    } catch (error) {
      console.error('Error loading customer requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (request) => {
    setSelectedRequest(request);
    setEditData({ damageType: request.damageType || '', description: request.description || request.damageDescription || '' });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateRepairRequest(selectedRequest._id, {
        damageType: editData.damageType,
        description: editData.description
      });
      setShowEditModal(false);
      await loadCustomerRequests();
      alert('Request updated');
    } catch (e) {
      alert('Failed to update request');
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Delete this repair request?')) return;
    try {
      await deleteRepairRequest(id);
      await loadCustomerRequests();
      alert('Request deleted');
    } catch (e) {
      alert('Failed to delete request');
    }
  };

  const handleDownload = async (requestId) => {
    try {
      const res = await downloadRepairReport(requestId);
      const url = window.URL.createObjectURL(new Blob([res] && res.data ? [res.data] : []));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `repair_report_${requestId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      } catch (e) {
      alert('Failed to download report');
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      await submitFeedback(selectedRequest._id, feedbackData);
      setShowFeedbackModal(false);
      setFeedbackData({ rating: 5, comment: '', category: 'general' });
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback');
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

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#10B981';
    if (progress >= 50) return '#F59E0B';
    return '#EF4444';
  };

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
        {/* Header with actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: Brand.primary }}>Customer Dashboard</h1>
              <p className="mt-1" style={{ color: Brand.body }}>
                Track your repair requests and stay updated on progress
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/repair')} className="px-4 py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: Brand.secondary }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = Brand.primaryHover; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = Brand.secondary; }}>New Repair</button>
              <button onClick={() => navigate('/')} className="px-4 py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: Brand.accent }}>Main Dashboard</button>
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

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border"
              style={{ borderColor: Brand.secondary, color: Brand.body }}
              placeholder="Search by equipment, damage type, status, or description..."
            />
            <button
              className="px-4 py-2 rounded-lg text-white font-semibold"
              style={{ backgroundColor: Brand.secondary }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = Brand.primaryHover; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = Brand.secondary; }}
              onClick={() => setQuery('')}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Repair Requests */}
        <div className="space-y-6">
          {(query ? allRequests.filter(r => {
            const q = query.toLowerCase();
            const fields = [r.equipmentType, r.damageType, r.status, r.description || r.damageDescription, r.assignedTechnician?.username || r.assignedTechnician?.name || ''].map(x => String(x || '').toLowerCase());
            return fields.some(f => f.includes(q));
          }) : allRequests).map((request) => (
            <div key={request._id} className="bg-white rounded-xl shadow-md p-6">
              {/* Request Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold" style={{ color: Brand.primary }}>
                    {request.equipmentType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} - {request.damageType}
                  </h3>
                  <p className="text-sm" style={{ color: Brand.body }}>
                    Request ID: {request._id} • Submitted: {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(request.status)}`}>
                  {request.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: Brand.primary }}>Request Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium" style={{ color: Brand.body }}>Equipment:</span> {request.equipmentType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    <p><span className="font-medium" style={{ color: Brand.body }}>Damage Type:</span> {request.damageType}</p>
                    <p><span className="font-medium" style={{ color: Brand.body }}>Description:</span> {request.description || request.damageDescription}</p>
                    {request.assignedTechnician && (
                      <p><span className="font-medium" style={{ color: Brand.body }}>Technician:</span> {request.assignedTechnician.username || request.assignedTechnician.name || String(request.assignedTechnician)}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3" style={{ color: Brand.primary }}>Cost & Timeline</h4>
                  <div className="space-y-2 text-sm">
                    {request.costEstimate || request.cost ? (
                      <p><span className="font-medium" style={{ color: Brand.body }}>Estimated Cost:</span> ${request.costEstimate ?? request.cost}</p>
                    ) : (
                      <p><span className="font-medium" style={{ color: Brand.body }}>Estimated Cost:</span> <span style={{ color: Brand.accent }}>Pending</span></p>
                    )}
                    {request.timeEstimate ? (
                      <p><span className="font-medium" style={{ color: Brand.body }}>Time Estimate:</span> {request.timeEstimate}</p>
                    ) : (
                      <p><span className="font-medium" style={{ color: Brand.body }}>Time Estimate:</span> <span style={{ color: Brand.accent }}>Pending</span></p>
                    )}
                    {request.estimatedCompletion && (
                      <p><span className="font-medium" style={{ color: Brand.body }}>Expected Completion:</span> {new Date(request.estimatedCompletion).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {request.status === 'in_progress' && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium" style={{ color: Brand.body }}>Repair Progress</span>
                    <span className="font-bold" style={{ color: getProgressColor(request.progress) }}>
                      {request.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${request.progress}%`,
                        backgroundColor: getProgressColor(request.progress)
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Milestones */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3" style={{ color: Brand.primary }}>Repair Timeline</h4>
                <div className="space-y-3">
                  {(request.milestones || []).map((milestone, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {milestone.completed ? (
                          <span className="text-white text-xs">✓</span>
                        ) : (
                          <span className="text-gray-500 text-xs">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${milestone.completed ? 'font-medium' : ''}`} style={{ color: milestone.completed ? Brand.primary : Brand.body }}>
                          {milestone.stage}
                        </p>
                        {milestone.date && (
                          <p className="text-xs" style={{ color: Brand.secondary }}>
                            {new Date(milestone.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
        </div>

              {/* Notes */}
              {request.notes && (
                <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: Brand.light }}>
                  <h4 className="font-semibold mb-2" style={{ color: Brand.primary }}>Latest Update</h4>
                  <p className="text-sm" style={{ color: Brand.body }}>{request.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {request.status === 'completed' && (
                          <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowFeedbackModal(true);
                    }}
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: Brand.accent }}
                  >
                    Submit Feedback
                          </button>
                )}
                          <button
                  onClick={() => handleDownload(request._id)}
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                  style={{ backgroundColor: Brand.secondary }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = Brand.primaryHover; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = Brand.secondary; }}
                          >
                  Download Report
                          </button>
                <button
                  onClick={() => handleOpenEdit(request)}
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                  style={{ backgroundColor: Brand.primary }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteRequest(request._id)}
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                  style={{ backgroundColor: Brand.accent }}
                >
                  Delete
                </button>
                        </div>
                    </div>
                  ))}
                </div>

        {repairRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: Brand.primary }}>No Repair Requests</h3>
            <p className="mb-4" style={{ color: Brand.body }}>You haven't submitted any repair requests yet.</p>
                <button
              onClick={() => navigate('/repair')}
              className="px-6 py-3 rounded-lg text-white font-semibold"
              style={{ backgroundColor: Brand.secondary }}
            >
              Submit Your First Request
                </button>
              </div>
            )}
      </div>

      {/* Edit Request Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4" style={{ color: Brand.primary }}>Edit Repair Request</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>Damage Type</label>
                <select
                  value={editData.damageType}
                  onChange={(e) => setEditData({ ...editData, damageType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select damage type</option>
                  {DAMAGE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="4"
                  placeholder="Describe the damage"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                style={{ color: Brand.body }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: Brand.secondary }}
              >
                Save Changes
              </button>
            </div>
          </div>
          </div>
        )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4" style={{ color: Brand.primary }}>
              Submit Feedback
              </h3>
            <div className="space-y-4">
                  <div>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedbackData({...feedbackData, rating: star})}
                      className={`text-2xl ${feedbackData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                  </div>
                <div>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>
                  Feedback Category
                  </label>
                  <select
                  value={feedbackData.category}
                  onChange={(e) => setFeedbackData({...feedbackData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="general">General Feedback</option>
                  <option value="quality">Repair Quality</option>
                  <option value="service">Customer Service</option>
                  <option value="timing">Timing</option>
                  <option value="communication">Communication</option>
                  </select>
                </div>
                <div>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>
                  Comments
                  </label>
                  <textarea
                  value={feedbackData.comment}
                  onChange={(e) => setFeedbackData({...feedbackData, comment: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="4"
                  placeholder="Share your experience with the repair service..."
                  />
                </div>
            </div>
            <div className="flex space-x-3 mt-6">
                  <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                style={{ color: Brand.body }}
                  >
                    Cancel
                  </button>
              <button
                onClick={handleSubmitFeedback}
                className="flex-1 px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: Brand.accent }}
              >
                Submit Feedback
              </button>
              </div>
            </div>
        </div>
        )}
    </div>
  );
};

export default CustomerDashboard;
