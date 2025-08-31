# Coach Dashboard

## Overview
The Coach Dashboard provides a comprehensive interface for coaches to manage their programs, view upcoming sessions, and provide feedback to enrolled students.

## Features

### 🎯 Core Functionality
- **Assigned Programs Display**: View all programs assigned to the coach
- **Upcoming Sessions**: See next 3 upcoming sessions for each program
- **Student Management**: View enrolled students with progress tracking
- **Feedback System**: Submit ratings (1-5 stars) and comments for students
- **Authentication Protection**: Only authenticated coaches can access

### 🎨 UI/UX Features
- **Responsive Design**: Works on desktop and mobile devices
- **Tailwind Styling**: Clean, modern interface with cards and lists
- **Expandable Program Cards**: Click to expand/collapse program details
- **Interactive Elements**: Hover effects, loading states, and animations
- **Modal Feedback Form**: User-friendly feedback submission

## Route
- **Path**: `/coach-dashboard`
- **Access**: Authenticated coaches only
- **Navigation**: Available in profile dropdown for coaches

## How to Test

### 1. Login as Coach
1. Visit the application
2. Click "Login as Coach" button in the navbar
3. You'll be logged in as "Coach Smith"

### 2. Access Dashboard
1. Click on your profile dropdown (top right)
2. Select "Coach Dashboard"
3. You'll be redirected to `/coach-dashboard`

### 3. Test Features
- **View Programs**: See assigned programs (mock data will be displayed)
- **Expand Programs**: Click the chevron to expand program details
- **View Sessions**: See upcoming sessions for each program
- **View Students**: See enrolled students with progress bars
- **Submit Feedback**: Click "Feedback" button to open modal and submit ratings/comments

## API Integration

The dashboard integrates with the following API endpoints:

### Programs API
- `GET /api/programs/coach/:coachId` - Fetch coach's programs

### Sessions API
- `GET /api/sessions/program/:programId` - Fetch sessions for a program
- `GET /api/sessions/coach/:coachId` - Fetch coach's sessions

### Enrollments API
- `GET /api/enrollments?program=:programId&status=active` - Fetch program enrollments
- `POST /api/enrollments/:id/feedback` - Submit feedback for a student

## Component Structure

```
CoachDashboard.jsx
├── Header Section
│   ├── Welcome message
│   └── Quick stats (programs count, students count)
├── Programs List
│   ├── Program Card (for each program)
│   │   ├── Program Info
│   │   ├── Stats (students, sessions, duration)
│   │   └── Expandable Content
│   │       ├── Upcoming Sessions List
│   │       └── Enrolled Students List
│   │           └── Feedback Button (per student)
└── Feedback Modal
    ├── Star Rating (1-5)
    ├── Comment Textarea
    └── Submit Button
```

## State Management

### Main State
- `programs`: Array of coach's programs
- `sessions`: Array of all sessions
- `enrollments`: Array of all enrollments
- `loading`: Loading state for API calls
- `error`: Error state for failed API calls

### UI State
- `expandedPrograms`: Object tracking which programs are expanded
- `feedbackModal`: Modal state and selected enrollment
- `feedbackForm`: Form data (rating, comment)
- `submittingFeedback`: Loading state for feedback submission

## Authentication & Authorization

### Protection Levels
1. **Route Level**: Must be authenticated
2. **Role Level**: Must have 'coach' role
3. **Data Level**: Only see own programs and students

### Error Handling
- **Not Authenticated**: Redirects to login prompt
- **Wrong Role**: Shows access denied message
- **API Errors**: Shows error message with retry option
- **No Data**: Shows empty state with helpful message

## Responsive Design

### Desktop (md+)
- Full layout with sidebar stats
- Expanded program cards
- Modal dialogs

### Mobile (sm)
- Stacked layout
- Collapsible sections
- Touch-friendly buttons
- Responsive modal

## Development Notes

### Mock Data
- Uses mock authentication for development
- API calls will show loading states
- Error handling demonstrates various scenarios

### Styling
- Uses Tailwind CSS utility classes
- Consistent color scheme (blue primary, gray neutrals)
- Hover and focus states for accessibility
- Loading spinners and transitions

### Performance
- Lazy loading of program details
- Efficient state updates
- Minimal re-renders with proper key props

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live session updates
2. **Bulk Actions**: Select multiple students for batch feedback
3. **Analytics**: Charts and graphs for program performance
4. **Calendar Integration**: Full calendar view of sessions
5. **File Uploads**: Attach files to feedback
6. **Push Notifications**: Real-time alerts for important events






