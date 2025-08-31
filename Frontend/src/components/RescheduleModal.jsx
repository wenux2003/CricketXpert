import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle, 
  Loader2,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { groundsAPI, sessionsAPI } from '../services/apiService';
import toast from 'react-hot-toast';

const RescheduleModal = ({ 
  isOpen, 
  onClose, 
  session, 
  enrollment,
  onRescheduleSuccess 
}) => {
  const [step, setStep] = useState(1); // 1: Date Selection, 2: Time/Ground Selection, 3: Confirmation
  const [loading, setLoading] = useState(false);
  const [grounds, setGrounds] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availability, setAvailability] = useState([]);
  
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    groundId: '',
    groundSlot: 1
  });

  useEffect(() => {
    if (isOpen && session) {
      fetchGrounds();
      // Pre-fill with current session data
      setRescheduleData({
        date: session.scheduledDate?.split('T')[0] || '',
        startTime: session.startTime || '',
        endTime: session.endTime || '',
        groundId: session.ground?._id || session.ground || '',
        groundSlot: session.groundSlot || 1
      });
    }
  }, [isOpen, session]);

  const fetchGrounds = async () => {
    try {
      const response = await groundsAPI.getAll();
      if (response.success) {
        setGrounds(response.data.docs || response.data || []);
      }
    } catch (error) {
      console.error('Error fetching grounds:', error);
      toast.error('Failed to load grounds');
    }
  };

  const fetchGroundAvailability = async (groundId, date) => {
    try {
      setLoading(true);
      const response = await groundsAPI.getAvailability(groundId, { date });
      if (response.success) {
        setAvailability(response.data.availability || []);
      } else {
        setAvailability([]);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to load availability');
      setAvailability([]);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableDates = () => {
    const today = new Date();
    const dates = [];
    
    // Generate next 30 days
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip Sundays (assuming no sessions on Sundays)
      if (date.getDay() !== 0) {
        dates.push({
          date: date.toISOString().split('T')[0],
          display: date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          }),
          full: date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        });
      }
    }
    return dates;
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setRescheduleData(prev => ({ ...prev, date }));
    
    // Fetch availability for all grounds for this date
    if (grounds.length > 0) {
      await Promise.all(
        grounds.map(ground => fetchGroundAvailability(ground._id, date))
      );
    }
    
    setStep(2);
  };

  const handleTimeSlotSelect = (ground, slot, timeSlot) => {
    if (!timeSlot.available) return;

    setRescheduleData(prev => ({
      ...prev,
      groundId: ground._id || ground.id,
      groundSlot: slot.slot,
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime
    }));
    setStep(3);
  };

  const handleConfirmReschedule = async () => {
    try {
      setLoading(true);

      // Update the session with new time/ground details
      const updateData = {
        scheduledDate: rescheduleData.date,
        startTime: rescheduleData.startTime,
        endTime: rescheduleData.endTime,
        ground: rescheduleData.groundId,
        groundSlot: rescheduleData.groundSlot,
        status: 'rescheduled'
      };

      const response = await sessionsAPI.update(session._id, updateData);
      
      if (response.success) {
        toast.success('Session rescheduled successfully!');
        onRescheduleSuccess && onRescheduleSuccess(response.data);
        handleClose();
      } else {
        throw new Error(response.message || 'Failed to reschedule session');
      }
    } catch (error) {
      console.error('Error rescheduling session:', error);
      toast.error(error.message || 'Failed to reschedule session');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state
    setTimeout(() => {
      setStep(1);
      setSelectedDate('');
      setAvailability([]);
      setRescheduleData({
        date: '',
        startTime: '',
        endTime: '',
        groundId: '',
        groundSlot: 1
      });
    }, 300);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Reschedule Session
              </h2>
              <p className="text-gray-600">
                {session.title || `Session ${session.sessionNumber}`}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Current Session Info */}
        <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Current Session Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-blue-800">
              <Calendar size={16} />
              <span>
                {new Date(session.scheduledDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-blue-800">
              <Clock size={16} />
              <span>{session.startTime} - {session.endTime}</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-800">
              <MapPin size={16} />
              <span>Ground Slot {session.groundSlot}</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                <span className={`ml-2 text-sm ${
                  step >= stepNum ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  {stepNum === 1 && 'Select New Date'}
                  {stepNum === 2 && 'Choose New Time & Ground'}
                  {stepNum === 3 && 'Confirm Changes'}
                </span>
                {stepNum < 3 && (
                  <ArrowRight className="ml-4 text-gray-300" size={16} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Date Selection */}
        {step === 1 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Choose a New Date
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {getAvailableDates().map((dateOption) => (
                <button
                  key={dateOption.date}
                  onClick={() => handleDateSelect(dateOption.date)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-sm font-medium text-gray-900">
                    {dateOption.display}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Available
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Time and Ground Selection */}
        {step === 2 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Choose New Time & Ground
            </h3>
            
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                <Calendar className="inline mr-2" size={16} />
                New Date: {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading ground availability...</p>
              </div>
            ) : grounds.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No grounds available</p>
              </div>
            ) : (
              <div className="space-y-6">
                {grounds.map((ground, groundIndex) => {
                  const groundAvailability = availability[groundIndex] || { timeSlots: [] };
                  
                  return (
                    <div key={ground._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">
                          {ground.name || `Ground ${groundIndex + 1}`}
                        </h4>
                        <span className="text-sm text-gray-500">
                          Ground Slots: {ground.groundSlot || ground.maxSlotPerDay || 12}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {Array.from({ length: ground.groundSlot || ground.maxSlotPerDay || 12 }, (_, slotIndex) => {
                          const slot = slotIndex + 1;
                          
                          return Array.from({ length: 12 }, (_, hourIndex) => {
                            const hour = hourIndex + 8; // 8 AM to 8 PM
                            const startTime = `${hour.toString().padStart(2, '0')}:00`;
                            const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
                            
                            // Check if this slot/time is available
                            const isAvailable = !groundAvailability.timeSlots?.some(bookedSlot => 
                              bookedSlot.slot === slot && 
                              bookedSlot.startTime === startTime
                            );
                            
                            return (
                              <button
                                key={`${slot}-${hour}`}
                                onClick={() => handleTimeSlotSelect(
                                  ground, 
                                  { slot }, 
                                  { startTime, endTime, available: isAvailable }
                                )}
                                disabled={!isAvailable}
                                className={`p-3 border rounded-lg text-sm transition-colors ${
                                  isAvailable
                                    ? 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                                }`}
                                title={`Slot ${slot}: ${startTime} - ${endTime}`}
                              >
                                <div className="font-medium text-xs">
                                  Slot {slot}
                                </div>
                                <div className="font-medium">
                                  {startTime} - {endTime}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {isAvailable ? 'Available' : 'Booked'}
                                </div>
                              </button>
                            );
                          });
                        }).flat()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Reschedule
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="font-medium text-gray-900 mb-4">New Session Details</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="text-blue-600" size={20} />
                  <div>
                    <div className="text-sm text-gray-600">Date</div>
                    <div className="font-medium">
                      {new Date(rescheduleData.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="text-blue-600" size={20} />
                  <div>
                    <div className="text-sm text-gray-600">Time</div>
                    <div className="font-medium">
                      {rescheduleData.startTime} - {rescheduleData.endTime}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="text-blue-600" size={20} />
                  <div>
                    <div className="text-sm text-gray-600">Ground</div>
                    <div className="font-medium">
                      Ground Slot {rescheduleData.groundSlot}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h5 className="font-medium text-yellow-900 mb-2">Important Notice:</h5>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• This will update your existing session booking</li>
                    <li>• You will receive a confirmation email with the new details</li>
                    <li>• Please arrive 10 minutes before the new session time</li>
                    <li>• Contact your coach if you have any special requirements</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleBack}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Back
              </button>
              <button
                onClick={handleConfirmReschedule}
                disabled={loading}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  loading
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Rescheduling...</span>
                  </div>
                ) : (
                  'Confirm Reschedule'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RescheduleModal;






