import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomerRequests, submitFeedback, downloadRepairReport } from '../api/repairRequestApi';

const Brand = {
  primary: '#072679',
  secondary: '#42ADF5',
  heading: '#000000',
  body: '#36516C',
  light: '#F1F2F7',
  accent: '#D88717',
};

const CustomerDashboard = ({ customerId }) => {
  const navigate = useNavigate();
  const [repairRequests, setRepairRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ rating: 5, comment: '', category: 'general' });

  // Fetch customer requests
  useEffect(() => {
    const loadCustomerRequests = async () => {
      try {
        const res = await getCustomerRequests(customerId);
        setRepairRequests(res.data.requests || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load repair requests.');
      } finally {
        setLoading(false);
      }
    };
    loadCustomerRequests();
  }, [customerId]);

  const handleSubmitFeedback = async () => {
    try {
      await submitFeedback(selectedRequest._id, feedbackData);
      setShowFeedbackModal(false);
      setFeedbackData({ rating: 5, comment: '', category: 'general' });
      alert('Feedback submitted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to submit feedback.');
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: Brand.light }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: Brand.secondary }}></div>
        <p className="mt-4" style={{ color: Brand.body }}>Loading...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: Brand.light }}>
      <p style={{ color: Brand.primary }}>{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: Brand.light }}>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: Brand.primary }}>Customer Dashboard</h1>
              <p className="mt-1" style={{ color: Brand.body }}>Track your repair requests and progress</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/repair')}
                className="px-4 py-2 rounded-lg text-white font-semibold"
                style={{ backgroundColor: Brand.secondary }}
              >
                New Repair Request
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
            { label: 'Completed', value: repairRequests.filter(r => r.status === 'completed').length, color: '#10B981' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6">
              <div className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-sm" style={{ color: Brand.body }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Repair Requests */}
        <div className="space-y-6">
          {repairRequests.length === 0 ? (
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
          ) : repairRequests.map(request => (
            <div key={request._id} className="bg-white rounded-xl shadow-md p-6">

              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold" style={{ color: Brand.primary }}>
                    {request.equipmentType?.replace('_', ' ')} - {request.damageType}
                  </h3>
                  <p className="text-sm" style={{ color: Brand.body }}>
                    Request ID: {request._id} • Submitted: {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(request.status)}`}>
                  {request.status?.replace('_', ' ')}
                </span>
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
                      style={{ width: `${request.progress}%`, backgroundColor: getProgressColor(request.progress) }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                {request.status === 'completed' && (
                  <button
                    onClick={() => { setSelectedRequest(request); setShowFeedbackModal(true); }}
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: Brand.accent }}
                  >
                    Submit Feedback
                  </button>
                )}
                <button
                  onClick={() => downloadRepairReport(request._id)}
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                  style={{ backgroundColor: Brand.secondary }}
                >
                  Download Report
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4" style={{ color: Brand.primary }}>Submit Feedback</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                      className={`text-2xl ${feedbackData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    >★</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>Category</label>
                <select
                  value={feedbackData.category}
                  onChange={e => setFeedbackData({ ...feedbackData, category: e.target.value })}
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
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>Comments</label>
                <textarea
                  value={feedbackData.comment}
                  onChange={e => setFeedbackData({ ...feedbackData, comment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="4"
                  placeholder="Share your experience..."
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
