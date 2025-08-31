# Session Booking System

This document describes the comprehensive session booking system implemented for enrolled programs in the CricketXpert frontend application.

## Features Implemented

### 1. **Session Booking Modal**
- **Location**: `src/components/SessionBookingModal.jsx`
- **Features**:
  - Three-step booking process: Date Selection → Time & Ground Selection → Confirmation
  - Interactive calendar with available session dates
  - Ground selection with facility information
  - Time slot availability checking
  - Real-time booking confirmation
  - Progress indicators and validation

### 2. **Session Management Modal**
- **Location**: `src/components/SessionManagementModal.jsx`
- **Features**:
  - Session rescheduling with new date/time selection
  - Session cancellation with reason requirement
  - 24-hour advance notice policy enforcement
  - Confirmation dialogs and policy notices
  - Real-time status updates

### 3. **Session Calendar View**
- **Location**: `src/components/SessionCalendar.jsx`
- **Features**:
  - Monthly calendar view of booked sessions
  - Color-coded session status indicators
  - Click-to-view session details
  - Session detail modal with full information
  - Navigation between months
  - Status legend for easy understanding

### 4. **Enhanced Profile Page**
- **Location**: `src/pages/Profile.jsx`
- **Features**:
  - New "My Sessions" tab
  - List and Calendar view toggle
  - "Book Session" buttons on enrolled programs
  - Session management (reschedule/cancel) actions
  - Real-time session status updates
  - Integration with all booking components

### 5. **API Integration**
- **Enhanced**: `src/services/apiService.js`
- **New Endpoints**:
  - `bookSession()` - Book a new session
  - `cancelBooking()` - Cancel existing booking
  - `rescheduleBooking()` - Reschedule session
  - `getUserBookedSessions()` - Get user's sessions
  - `getGroundAvailability()` - Check ground availability
  - `getGrounds()` - Get available grounds

## User Journey

### 1. **Booking a Session**
1. Navigate to Profile → My Enrollments
2. Click "Book Session" on an active enrollment
3. **Step 1**: Select date from calendar (shows available dates)
4. **Step 2**: Choose ground and available time slot
5. **Step 3**: Review and confirm booking details
6. Receive confirmation and view in "My Sessions"

### 2. **Managing Sessions**
1. Navigate to Profile → My Sessions
2. View sessions in List or Calendar view
3. For scheduled sessions:
   - Click "Reschedule" to change date/time
   - Click "Cancel" to cancel with reason
4. Policy: Changes only allowed 24+ hours in advance

### 3. **Calendar View**
1. Switch to Calendar view in "My Sessions"
2. See monthly overview of all booked sessions
3. Color-coded status indicators:
   - **Blue**: Scheduled
   - **Green**: Completed
   - **Red**: Cancelled
   - **Yellow**: Rescheduled
4. Click any session for detailed information

## Technical Implementation

### **Booking Flow**
1. User selects enrollment → Opens booking modal
2. Calendar shows available dates from program sessions
3. Ground selection with facility information
4. Time slot availability checking (mock data)
5. Booking confirmation and localStorage storage
6. Real-time UI updates

### **Data Management**
- **Demo Mode**: Uses localStorage for session persistence
- **Session Storage**: `bookedSessions_${userId}` key
- **Real-time Updates**: Immediate UI refresh after actions
- **State Management**: React hooks with proper cleanup

### **Calendar Integration**
- **Monthly View**: 6-week calendar grid
- **Session Mapping**: Maps sessions to calendar dates
- **Status Colors**: Visual status indicators
- **Interactive**: Click sessions for details

### **Responsive Design**
- **Mobile-First**: Works on all screen sizes
- **Touch-Friendly**: Large buttons and touch targets
- **Adaptive Layout**: Responsive grid systems
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Mock Data Structure

### **Ground Data**
```javascript
{
  _id: '1',
  name: 'Main Cricket Ground',
  location: 'Central Sports Complex',
  facilities: ['Floodlights', 'Pavilion', 'Practice Nets']
}
```

### **Time Slots**
```javascript
{
  slotNumber: 1,
  startTime: '06:00',
  endTime: '08:00'
}
```

### **Booked Session**
```javascript
{
  _id: 'unique-id',
  program: { title: 'Program Name' },
  scheduledDate: '2024-01-15',
  startTime: '10:00',
  endTime: '12:00',
  ground: { name: 'Ground Name' },
  status: 'scheduled',
  coach: { name: 'Coach Name' }
}
```

## Component Architecture

### **SessionBookingModal**
- **Props**: `isOpen`, `onClose`, `enrollment`, `onBookingSuccess`
- **State**: Step management, selected date/ground/slot
- **Features**: Multi-step wizard, validation, mock API calls

### **SessionManagementModal**
- **Props**: `isOpen`, `onClose`, `session`, `action`, `onSessionUpdated`
- **Actions**: 'reschedule' or 'cancel'
- **Features**: Policy enforcement, form validation

### **SessionCalendar**
- **Props**: `sessions`, `onSessionClick`
- **Features**: Monthly navigation, status colors, session mapping
- **Exports**: Main calendar + SessionDetailModal

### **Profile Integration**
- **New Tab**: "My Sessions" with list/calendar toggle
- **Actions**: Book, reschedule, cancel sessions
- **State**: Manages all session-related modals and data

## Styling and UX

### **Design System**
- **Colors**: Consistent with existing blue theme
- **Typography**: Tailwind CSS utility classes
- **Spacing**: Consistent padding and margins
- **Shadows**: Subtle elevation for modals and cards

### **User Experience**
- **Progressive Disclosure**: Step-by-step booking process
- **Clear Feedback**: Loading states, success/error messages
- **Intuitive Navigation**: Breadcrumbs and back buttons
- **Visual Hierarchy**: Clear information architecture

### **Accessibility**
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels
- **Color Contrast**: Meets WCAG guidelines
- **Focus Management**: Proper focus handling in modals

## Future Enhancements

### **Backend Integration**
1. Replace mock data with real API calls
2. Implement ground availability checking
3. Add session conflict detection
4. Real-time notifications for changes

### **Advanced Features**
1. **Recurring Sessions**: Book multiple sessions at once
2. **Waitlist**: Join waitlist for full sessions
3. **Session Notes**: Add personal notes to sessions
4. **Reminders**: Email/SMS session reminders
5. **Coach Feedback**: Post-session feedback system

### **Mobile App**
1. **Push Notifications**: Session reminders and updates
2. **Offline Support**: View sessions without internet
3. **Location Services**: Directions to grounds
4. **Quick Actions**: Swipe to reschedule/cancel

## Testing Instructions

### **Prerequisites**
1. Complete enrollment in at least one program
2. Login with customer account
3. Navigate to Profile page

### **Test Session Booking**
1. Go to "My Enrollments" tab
2. Click "Book Session" on active enrollment
3. Select future date from calendar
4. Choose ground and time slot
5. Confirm booking
6. Verify session appears in "My Sessions"

### **Test Session Management**
1. Go to "My Sessions" tab
2. Find scheduled session
3. Test "Reschedule":
   - Select new date/time
   - Confirm changes
   - Verify updated session
4. Test "Cancel":
   - Provide cancellation reason
   - Confirm cancellation
   - Verify cancelled status

### **Test Calendar View**
1. Switch to Calendar view in "My Sessions"
2. Navigate between months
3. Click on session to view details
4. Verify color coding matches status

## Configuration

### **Time Slots Configuration**
Update `SessionBookingModal.jsx` to modify available time slots:
```javascript
const mockSlots = [
  { slotNumber: 1, startTime: '06:00', endTime: '08:00' },
  // Add more slots as needed
];
```

### **Ground Configuration**
Update ground data in `SessionBookingModal.jsx`:
```javascript
const mockGrounds = [
  {
    _id: '1',
    name: 'Your Ground Name',
    location: 'Ground Location',
    facilities: ['Facility 1', 'Facility 2']
  }
];
```

### **Policy Configuration**
Update cancellation/rescheduling policy in `SessionManagementModal.jsx`:
```javascript
const hoursUntilSession = (sessionDateTime - now) / (1000 * 60 * 60);
return hoursUntilSession > 24; // Change 24 to desired hours
```

## Files Created/Modified

### **New Components**
- `src/components/SessionBookingModal.jsx`
- `src/components/SessionManagementModal.jsx`
- `src/components/SessionCalendar.jsx`

### **Modified Files**
- `src/pages/Profile.jsx` - Added session management
- `src/services/apiService.js` - Added session APIs

### **Dependencies**
- All existing dependencies (no new packages required)
- Uses Tailwind CSS for styling
- Integrates with existing toast notifications
- Compatible with existing authentication system

## Performance Considerations

### **Optimization**
- **Lazy Loading**: Components load only when needed
- **Memoization**: Prevents unnecessary re-renders
- **Local Storage**: Fast session data access
- **Efficient Rendering**: Optimized calendar generation

### **Memory Management**
- **Cleanup**: Proper useEffect cleanup
- **State Reset**: Modal state reset on close
- **Event Listeners**: Proper removal of listeners

This session booking system provides a complete, user-friendly solution for managing coaching sessions within enrolled programs, with room for future enhancements and backend integration.