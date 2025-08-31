import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { sessionsAPI } from '../services/apiService';
import toast from 'react-hot-toast';

const SessionManagementModal = ({ 
  isOpen, 
  onClose, 
  session, 
  onSessionUpdated,
  action = 'reschedule' // 'reschedule' or 'cancel'
}) => {
  const [loading, setLoading] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [newSessionData, setNewSessionData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    groundId: ''
  });

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    try {
      setLoading(true);
      
      // Mock cancellation for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Session cancelled successfully');
      onSessionUpdated({ ...session, status: 'cancelled', cancelReason });
      onClose();
    } catch (error) {
      console.error('Error cancelling session:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!newSessionData.date || !newSessionData.startTime || !newSessionData.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Mock rescheduling for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedSession = {
        ...session,
        scheduledDate: newSessionData.date,
        startTime: newSessionData.startTime,
        endTime: newSessionData.endTime,
        status: 'rescheduled'
      };
      
      toast.success('Session rescheduled successfully');
      onSessionUpdated(updatedSession);
      onClose();
    } catch (error) {
      console.error('Error rescheduling session:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date, time) => {
    const sessionDate = new Date(date);
    const [hours, minutes] = time.split(':');
    sessionDate.setHours(parseInt(hours), parseInt(minutes));
    
    return sessionDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const canCancelOrReschedule = () => {
    const sessionDateTime = new Date(session.scheduledDate);
    const [hours, minutes] = session.startTime.split(':');
    sessionDateTime.setHours(parseInt(hours), parseInt(minutes));
    
    const now = new Date();
    const hoursUntilSession = (sessionDateTime - now) / (1000 * 60 * 60);
    
    return hoursUntilSession > 24; // Can cancel/reschedule if more than 24 hours away
  };

  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {action === 'cancel' ? 'Cancel Session' : 'Reschedule Session'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Current Session Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Current Session</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-gray-500" />
                <span>{formatDateTime(session.scheduledDate, session.startTime)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-gray-500" />
                <span>{session.startTime} - {session.endTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-gray-500" />
                <span>{session.ground?.name || 'Ground TBD'}</span>
              </div>
            </div>
          </div>

          {!canCancelOrReschedule() && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Policy Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Sessions can only be cancelled or rescheduled at least 24 hours in advance.
                  </p>
                </div>
              </div>
            </div>
          )}

          {action === 'cancel' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Cancellation *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Please provide a reason for cancelling this session..."
                  disabled={!canCancelOrReschedule()}
                />
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Cancellation Policy</h4>
                    <p className="text-sm text-red-700 mt-1">
                      This action cannot be undone. You may need to book a new session if you want to reschedule later.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Keep Session
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading || !canCancelOrReschedule() || !cancelReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="animate-spin" size={16} />
                      <span>Cancelling...</span>
                    </div>
                  ) : (
                    'Cancel Session'
                  )}
                </button>
              </div>
            </div>
          )}

          {action === 'reschedule' && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">New Session Details</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Date *
                </label>
                <input
                  type="date"
                  value={newSessionData.date}
                  onChange={(e) => setNewSessionData(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!canCancelOrReschedule()}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={newSessionData.startTime}
                    onChange={(e) => setNewSessionData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!canCancelOrReschedule()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time *
                  </label>
                  <input
                    type="time"
                    value={newSessionData.endTime}
                    onChange={(e) => setNewSessionData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!canCancelOrReschedule()}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Reschedule Policy</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Subject to ground availability. You'll be notified if the requested time is not available.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReschedule}
                  disabled={loading || !canCancelOrReschedule() || !newSessionData.date || !newSessionData.startTime || !newSessionData.endTime}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="animate-spin" size={16} />
                      <span>Rescheduling...</span>
                    </div>
                  ) : (
                    'Reschedule Session'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionManagementModal;
