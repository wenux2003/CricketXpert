import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { sessionsAPI } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const SessionBookingModal = ({ 
  isOpen, 
  onClose, 
  enrollment, 
  onBookingSuccess 
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Date Selection, 2: Time & Ground Selection, 3: Confirmation
  const [loading, setLoading] = useState(false);
  const [availableSessions, setAvailableSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [grounds, setGrounds] = useState([]);
  const [selectedGround, setSelectedGround] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    if (isOpen && enrollment) {
      // Reset to current month when modal opens
      const now = new Date();
      setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
      fetchAvailableSessions();
      fetchGrounds();
    }
  }, [isOpen, enrollment]);

  const fetchAvailableSessions = async () => {
    try {
      setLoading(true);
      
      // Create mock available sessions for the next 60 days
      const mockSessions = [];
      const today = new Date();
      
      for (let i = 1; i <= 60; i++) {
        const sessionDate = new Date(today);
        sessionDate.setDate(today.getDate() + i);
        
        // Skip weekends for some variety
        if (sessionDate.getDay() === 0 || sessionDate.getDay() === 6) continue;
        
        // Create 1-2 sessions per day
        const sessionsPerDay = Math.floor(Math.random() * 2) + 1;
        
        for (let j = 0; j < sessionsPerDay; j++) {
          mockSessions.push({
            _id: `session_${i}_${j}`,
            program: enrollment.program,
            scheduledDate: sessionDate.toISOString(),
            title: `${enrollment.program.title} - Session ${j + 1}`,
            maxParticipants: 10,
            currentParticipants: Math.floor(Math.random() * 5),
            canBook: true,
            status: 'scheduled'
          });
        }
      }
      

      
      setAvailableSessions(mockSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load available sessions');
    } finally {
      setLoading(false);
    }
  };

  const fetchGrounds = async () => {
    try {
      // Mock grounds data for demo
      const mockGrounds = [
        {
          _id: '1',
          name: 'Main Cricket Ground',
          location: 'Central Sports Complex',
          facilities: ['Floodlights', 'Pavilion', 'Practice Nets']
        },
        {
          _id: '2', 
          name: 'Practice Ground A',
          location: 'North Wing',
          facilities: ['Practice Nets', 'Bowling Machine']
        },
        {
          _id: '3',
          name: 'Practice Ground B', 
          location: 'South Wing',
          facilities: ['Turf Wicket', 'Seating Area']
        }
      ];
      setGrounds(mockGrounds);
    } catch (error) {
      console.error('Error fetching grounds:', error);
    }
  };

  const fetchGroundAvailability = async (groundId, date) => {
    try {
      setLoading(true);
      
      // Mock available slots for demo
      const mockSlots = [
        { slotNumber: 1, startTime: '06:00', endTime: '08:00' },
        { slotNumber: 2, startTime: '08:00', endTime: '10:00' },
        { slotNumber: 3, startTime: '10:00', endTime: '12:00' },
        { slotNumber: 4, startTime: '14:00', endTime: '16:00' },
        { slotNumber: 5, startTime: '16:00', endTime: '18:00' },
        { slotNumber: 6, startTime: '18:00', endTime: '20:00' }
      ];
      
      // Simulate some slots being unavailable
      const availableSlots = mockSlots.filter(slot => Math.random() > 0.3);
      setAvailableSlots(availableSlots);
    } catch (error) {
      console.error('Error fetching ground availability:', error);
      toast.error('Failed to load ground availability');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setStep(2);
  };

  const handleGroundSelect = (ground) => {
    setSelectedGround(ground);
    if (selectedDate) {
      fetchGroundAvailability(ground._id, selectedDate);
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep(3);
  };

  const handleBookSession = async () => {
    try {
      setLoading(true);
      
      const bookingData = {
        userId: user.id,
        enrollmentId: enrollment._id,
        sessionDate: selectedDate.toISOString().split('T')[0],
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        groundId: selectedGround._id,
        groundSlot: selectedSlot.slotNumber
      };

      // Mock session booking for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockBookedSession = {
        _id: Date.now().toString(),
        program: enrollment.program,
        scheduledDate: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        ground: selectedGround,
        status: 'scheduled',
        coach: { name: 'Professional Coach' }
      };
      
      toast.success('Session booked successfully!');
      onBookingSuccess(mockBookedSession);
      onClose();
      resetModal();
    } catch (error) {
      console.error('Error booking session:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedSession(null);
    setSelectedGround(null);
    setSelectedSlot(null);
    setAvailableSlots([]);
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isPast = date < today;
      const hasAvailableSessions = availableSessions.some(session => {
        const sessionDate = new Date(session.scheduledDate);
        return sessionDate.toDateString() === date.toDateString() && session.canBook;
      });
      
      days.push({
        date,
        isCurrentMonth,
        isPast,
        hasAvailableSessions,
        isSelectable: isCurrentMonth && !isPast && hasAvailableSessions
      });
    }
    
    return days;
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Book Session - {enrollment?.program?.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mb-6">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                {step > 1 ? <CheckCircle size={16} /> : '1'}
              </div>
              <span className="text-sm font-medium">Select Date</span>
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                {step > 2 ? <CheckCircle size={16} /> : '2'}
              </div>
              <span className="text-sm font-medium">Select Time & Ground</span>
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                <CheckCircle size={16} />
              </div>
              <span className="text-sm font-medium">Confirm</span>
            </div>
          </div>

          {/* Step 1: Date Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Select a Date</h4>
              
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <ChevronLeft size={20} />
                </button>
                <h5 className="text-lg font-semibold">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h5>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                {generateCalendarDays().map((day, index) => (
                  <button
                    key={index}
                    onClick={() => day.isSelectable && handleDateSelect(day.date)}
                    disabled={!day.isSelectable}
                    className={`p-2 text-sm rounded-md transition-colors ${
                      day.isSelectable
                        ? 'hover:bg-blue-100 text-blue-600 font-medium'
                        : day.isCurrentMonth
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-300 cursor-not-allowed'
                    } ${day.hasAvailableSessions && day.isCurrentMonth ? 'bg-blue-50' : ''}`}
                  >
                    {day.date.getDate()}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-3 h-3 bg-blue-50 rounded border border-blue-200"></div>
                <span>Available sessions</span>
              </div>
            </div>
          )}

          {/* Step 2: Time & Ground Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Selected Date: {formatDate(selectedDate)}
                </h4>
                <button
                  onClick={() => setStep(1)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Change Date
                </button>
              </div>

              {/* Ground Selection */}
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Select Ground</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {grounds.map(ground => (
                    <button
                      key={ground._id}
                      onClick={() => handleGroundSelect(ground)}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        selectedGround?._id === ground._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin size={16} className="text-gray-500" />
                        <span className="font-medium">{ground.name}</span>
                      </div>
                      <p className="text-sm text-gray-600">{ground.location}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {ground.facilities?.join(', ')}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Time Slots */}
              {selectedGround && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Available Time Slots</h5>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="animate-spin text-blue-600" size={24} />
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle size={24} className="mx-auto mb-2" />
                      <p>No available slots for this date</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableSlots.map(slot => (
                        <button
                          key={slot.slotNumber}
                          onClick={() => handleSlotSelect(slot)}
                          className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                          <div className="text-center">
                            <Clock size={16} className="mx-auto mb-1 text-gray-500" />
                            <div className="font-medium text-sm">
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Slot {slot.slotNumber}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900">Confirm Booking</h4>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span className="font-medium">Date:</span>
                  <span>{formatDate(selectedDate)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-gray-500" />
                  <span className="font-medium">Time:</span>
                  <span>{formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-gray-500" />
                  <span className="font-medium">Ground:</span>
                  <span>{selectedGround.name} (Slot {selectedSlot.slotNumber})</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users size={16} className="text-gray-500" />
                  <span className="font-medium">Program:</span>
                  <span>{enrollment.program.title}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  onClick={handleBookSession}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="animate-spin" size={16} />
                      <span>Booking...</span>
                    </div>
                  ) : (
                    'Confirm Booking'
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

export default SessionBookingModal;
