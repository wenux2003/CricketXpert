import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTechnicianTasks, updateTaskProgress, completeTask } from '../api/repairRequestApi';

const Brand = {
  primary: '#072679',
  secondary: '#42ADF5',
  heading: '#000000',
  body: '#36516C',
  light: '#F1F2F7',
  accent: '#D88717',
};

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressData, setProgressData] = useState({
    progress: '',
    notes: '',
    estimatedCompletion: ''
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      // For demo purposes, we'll use a mock technician ID
      const technicianId = 'demo-technician-id';
      const response = await getTechnicianTasks(technicianId);
      setAssignedTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      // Mock data for demonstration
      setAssignedTasks([
        {
          _id: '1',
          customerName: 'John Smith',
          equipmentType: 'cricket_bat',
          damageType: 'Handle Damage',
          damageDescription: 'Bat handle is loose and needs re-gripping',
          status: 'in_progress',
          progress: 60,
          assignedDate: '2024-01-15',
          estimatedCompletion: '2024-01-20',
          notes: 'Handle repair in progress, new grip ordered'
        },
        {
          _id: '2',
          customerName: 'Sarah Johnson',
          equipmentType: 'cricket_gloves',
          damageType: 'Palm Wear',
          damageDescription: 'Palm area is worn out and needs replacement',
          status: 'pending',
          progress: 0,
          assignedDate: '2024-01-16',
          estimatedCompletion: '2024-01-22',
          notes: 'Awaiting palm material delivery'
        },
        {
          _id: '3',
          customerName: 'Mike Wilson',
          equipmentType: 'cricket_pads',
          damageType: 'Knee Roll Damage',
          damageDescription: 'Knee roll padding is damaged and needs replacement',
          status: 'completed',
          progress: 100,
          assignedDate: '2024-01-10',
          estimatedCompletion: '2024-01-15',
          notes: 'Repair completed successfully'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async () => {
    try {
      await updateTaskProgress(selectedTask._id, progressData);
      setShowProgressModal(false);
      setProgressData({ progress: '', notes: '', estimatedCompletion: '' });
      await loadTasks();
      alert('Progress updated successfully');
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update progress');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await completeTask(taskId);
      await loadTasks();
      alert('Task completed successfully');
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Failed to complete task');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#10B981';
    if (progress >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const filteredTasks = assignedTasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
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
              <h1 className="text-3xl font-bold" style={{ color: Brand.primary }}>Technician Dashboard</h1>
              <p className="mt-1" style={{ color: Brand.body }}>Manage assigned repair tasks and update progress</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 rounded-lg text-white font-semibold"
                style={{ backgroundColor: Brand.secondary }}
              >
                Main Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Tasks', value: assignedTasks.length, color: Brand.primary },
            { label: 'Pending', value: assignedTasks.filter(t => t.status === 'pending').length, color: Brand.accent },
            { label: 'In Progress', value: assignedTasks.filter(t => t.status === 'in_progress').length, color: Brand.secondary },
            { label: 'Completed', value: assignedTasks.filter(t => t.status === 'completed').length, color: '#10B981' }
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
            {['all', 'pending', 'in_progress', 'completed'].map(status => (
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

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTasks.map((task) => (
            <div key={task._id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: Brand.primary }}>
                    {task.customerName}
                  </h3>
                  <p className="text-sm" style={{ color: Brand.body }}>
                    {task.equipmentType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} - {task.damageType}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                  {task.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm" style={{ color: Brand.body }}>
                  <strong>Description:</strong> {task.damageDescription}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium" style={{ color: Brand.body }}>Progress</span>
                  <span className="text-sm font-bold" style={{ color: getProgressColor(task.progress) }}>
                    {task.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${task.progress}%`,
                      backgroundColor: getProgressColor(task.progress)
                    }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="font-medium" style={{ color: Brand.body }}>Assigned:</span>
                  <p style={{ color: Brand.secondary }}>{new Date(task.assignedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-medium" style={{ color: Brand.body }}>Est. Completion:</span>
                  <p style={{ color: Brand.secondary }}>{new Date(task.estimatedCompletion).toLocaleDateString()}</p>
                </div>
              </div>

              {task.notes && (
                <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: Brand.light }}>
                  <p className="text-sm" style={{ color: Brand.body }}>
                    <strong>Notes:</strong> {task.notes}
                  </p>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setProgressData({
                      progress: task.progress.toString(),
                      notes: task.notes || '',
                      estimatedCompletion: task.estimatedCompletion
                    });
                    setShowProgressModal(true);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg text-white text-sm font-medium"
                  style={{ backgroundColor: Brand.secondary }}
                >
                  Update Progress
                </button>
                {task.status === 'in_progress' && (
                  <button
                    onClick={() => handleCompleteTask(task._id)}
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: '#10B981' }}
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔧</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: Brand.primary }}>No Tasks Found</h3>
            <p style={{ color: Brand.body }}>You don't have any tasks in the selected category.</p>
          </div>
        )}
      </div>

      {/* Progress Update Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4" style={{ color: Brand.primary }}>
              Update Task Progress
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>
                  Progress Percentage
                </label>
              <input
                  type="number"
                min="0"
                max="100"
                  value={progressData.progress}
                  onChange={(e) => setProgressData({...progressData, progress: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter progress (0-100)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>
                  Estimated Completion Date
                </label>
                <input
                  type="date"
                  value={progressData.estimatedCompletion}
                  onChange={(e) => setProgressData({...progressData, estimatedCompletion: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>
                  Work Notes
                </label>
                <textarea
                  value={progressData.notes}
                  onChange={(e) => setProgressData({...progressData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Update on work progress, issues encountered, etc."
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowProgressModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                style={{ color: Brand.body }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProgress}
                className="flex-1 px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: Brand.secondary }}
              >
                Update Progress
              </button>
            </div>
          </div>
          </div>
      )}
    </div>
  );
};

export default TechnicianDashboard;
