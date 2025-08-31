import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User
} from 'lucide-react';

const SessionCalendar = ({ sessions = [], onSessionClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, sessions]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
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
      const isToday = date.toDateString() === today.toDateString();
      
      // Find sessions for this date
      const daysSessions = sessions.filter(session => {
        const sessionDate = new Date(session.scheduledDate);
        return sessionDate.toDateString() === date.toDateString();
      });
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        sessions: daysSessions,
        hasSession: daysSessions.length > 0
      });
    }
    
    setCalendarDays(days);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getSessionStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'rescheduled': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`min-h-[80px] p-1 border border-gray-100 rounded-md ${
                day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              } ${day.isToday ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className={`text-sm font-medium mb-1 ${
                day.isCurrentMonth 
                  ? day.isToday 
                    ? 'text-blue-600' 
                    : 'text-gray-900'
                  : 'text-gray-400'
              }`}>
                {day.date.getDate()}
              </div>
              
              {/* Sessions for this day */}
              <div className="space-y-1">
                {day.sessions.slice(0, 2).map((session, sessionIndex) => (
                  <button
                    key={sessionIndex}
                    onClick={() => onSessionClick && onSessionClick(session)}
                    className={`w-full text-left p-1 rounded text-xs text-white hover:opacity-80 transition-opacity ${getSessionStatusColor(session.status)}`}
                    title={`${session.program?.title || 'Session'} - ${formatTime(session.startTime)}`}
                  >
                    <div className="truncate font-medium">
                      {formatTime(session.startTime)}
                    </div>
                    <div className="truncate opacity-90">
                      {session.program?.title || 'Session'}
                    </div>
                  </button>
                ))}
                
                {/* Show more indicator */}
                {day.sessions.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{day.sessions.length - 2} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 pb-4">
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Scheduled</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Cancelled</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Rescheduled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Session Detail Modal for calendar clicks
export const SessionDetailModal = ({ isOpen, onClose, session }) => {
  if (!isOpen || !session) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Session Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">{session.program?.title || 'Session'}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                {session.status?.charAt(0).toUpperCase() + session.status?.slice(1)}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <CalendarIcon size={16} className="text-gray-500" />
                <span>{formatDate(session.scheduledDate)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-gray-500" />
                <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-gray-500" />
                <span>{session.ground?.name || 'Ground TBD'}</span>
              </div>
              {session.coach && (
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-500" />
                  <span>Coach: {session.coach.name}</span>
                </div>
              )}
            </div>

            {session.notes && (
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">{session.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCalendar;


