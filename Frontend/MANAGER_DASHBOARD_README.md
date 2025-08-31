# Manager Dashboard

## Overview
The Manager Dashboard provides comprehensive administrative control over the cricket coaching system, allowing managers to create and manage programs, assign coaches, upload materials, and handle session scheduling.

## Features

### 🎯 **Core Functionality**
- **Program CRUD Operations**: Create, read, update, and delete coaching programs
- **Coach Assignment**: Assign coaches to programs with full coach management
- **Material Upload**: Upload PDF documents, video URLs, and other learning materials
- **Session Management**: Force reschedule any session with reason tracking
- **Multi-tab Interface**: Organized tabs for Programs, Coaches, and Sessions
- **Authentication Protection**: Only authenticated managers/admins can access

### 🎨 **UI/UX Features**
- **Responsive Design**: Fully responsive across all device sizes
- **Tailwind Styling**: Modern, clean interface with consistent design system
- **Modal Dialogs**: User-friendly forms for all CRUD operations
- **Search & Filter**: Real-time search and category filtering
- **Loading States**: Comprehensive loading indicators and error handling
- **Interactive Tables**: Sortable, searchable data tables with hover effects

## Route
- **Path**: `/manager-dashboard`
- **Access**: Authenticated managers/admins only
- **Navigation**: Available in profile dropdown for managers

## How to Test

### 1. Login as Manager
1. Visit the application
2. Click "Manager" button in the navbar
3. You'll be logged in as "Manager Jones"

### 2. Access Dashboard
1. Click on your profile dropdown (top right)
2. Select "Manager Dashboard"
3. You'll be redirected to `/manager-dashboard`

### 3. Test Program Management
- **Create Program**: Click "New Program" → Fill form → Save
- **Edit Program**: Click "Edit" on any program → Modify → Save
- **Delete Program**: Click "Delete" → Confirm deletion
- **Assign Coach**: Select coach from dropdown when creating/editing
- **Filter Programs**: Use category dropdown and search bar

### 4. Test Material Upload
- **Add Materials**: Click "Materials" on any program
- **Upload Types**: Support for PDF, Video, Links, Images
- **Material Management**: Add title, URL, and description

### 5. Test Session Reschedule
- **View Sessions**: Switch to "Sessions" tab
- **Reschedule**: Click "Reschedule" → Set new date/time → Provide reason
- **Force Override**: Manager can reschedule any session regardless of coach

### 6. Test Coach Management
- **View Coaches**: Switch to "Coaches" tab
- **Coach Details**: View specializations, experience, ratings
- **Program Assignment**: See which coaches are assigned to which programs

## API Integration

The dashboard integrates with the following API endpoints:

### Programs API
- `GET /api/programs` - Fetch all programs
- `POST /api/programs` - Create new program
- `PUT /api/programs/:id` - Update program
- `DELETE /api/programs/:id` - Delete program
- `POST /api/programs/:id/materials` - Add material to program

### Users API
- `GET /api/users/role/coach` - Fetch all coaches
- `GET /api/users` - Fetch all users (admin only)

### Sessions API
- `GET /api/sessions` - Fetch all sessions
- `PUT /api/sessions/:id` - Update/reschedule session

## Component Architecture

```
ManagerDashboard.jsx
├── Header Section
│   ├── Dashboard title and description
│   └── Quick stats (programs, coaches, sessions count)
├── Tab Navigation
│   ├── Programs Tab
│   ├── Coaches Tab
│   └── Sessions Tab
├── Search & Filter Bar
│   ├── Search input (real-time)
│   ├── Category filter (programs only)
│   └── Action buttons (New Program)
├── Content Sections
│   ├── Programs List (cards with actions)
│   ├── Coaches Table (detailed information)
│   └── Sessions List (with reschedule options)
└── Modal Dialogs
    ├── Program Form Modal
    ├── Material Upload Modal
    └── Session Reschedule Modal
```

## State Management

### Main Data State
- `programs`: Array of all coaching programs
- `coaches`: Array of all coaches
- `sessions`: Array of all sessions
- `loading`: Global loading state
- `error`: Error state for failed operations

### UI State
- `activeTab`: Current active tab (programs/coaches/sessions)
- `searchTerm`: Search query string
- `filterCategory`: Selected category filter
- `showProgramModal`: Program form modal visibility
- `showMaterialModal`: Material upload modal visibility
- `showRescheduleModal`: Session reschedule modal visibility

### Form State
- `programForm`: Program creation/editing form data
- `materialForm`: Material upload form data
- `rescheduleForm`: Session reschedule form data
- `editingProgram`: Currently editing program object
- `selectedSession`: Selected session for rescheduling

## Program Management Features

### Create/Edit Program Form
- **Basic Info**: Title, description, coach assignment
- **Categories**: Beginner, Intermediate, Advanced, Professional
- **Specializations**: Batting, Bowling, Fielding, etc.
- **Duration**: Weeks and sessions per week (auto-calculates total)
- **Pricing**: Price in LKR with formatting
- **Capacity**: Maximum participants (1-20)
- **Scheduling**: Start and end dates
- **Validation**: Required field validation and error handling

### Coach Assignment
- **Dynamic Dropdown**: Populated with available coaches
- **Coach Details**: Shows coach name and specializations
- **Real-time Updates**: Immediate reflection of assignments
- **Validation**: Ensures coach is selected before saving

### Material Upload System
- **Multiple Types**: PDF documents, videos, images, links
- **URL-based**: Supports external URLs for materials
- **Metadata**: Title, description, and type classification
- **Program Association**: Materials linked to specific programs
- **Validation**: URL format validation and required fields

## Session Management Features

### Session Reschedule
- **Force Override**: Manager can reschedule any session
- **Date/Time Selection**: New date and time picker
- **Reason Tracking**: Mandatory reason for rescheduling
- **Conflict Detection**: Prevents scheduling conflicts
- **Notification**: Automatic notifications to affected parties

### Session Display
- **Comprehensive Info**: Date, time, participants, ground
- **Program Context**: Shows associated program and coach
- **Status Indicators**: Visual status indicators
- **Quick Actions**: One-click reschedule access

## Coach Management Features

### Coach Table View
- **Detailed Information**: Name, email, specializations
- **Performance Metrics**: Experience, ratings, review count
- **Program Count**: Number of assigned programs
- **Status Indicators**: Active/inactive status
- **Specialization Tags**: Visual specialization indicators

### Coach Filtering
- **Search Functionality**: Search by name, email, or specialization
- **Real-time Results**: Instant search results
- **Comprehensive Matching**: Searches across multiple fields

## Authentication & Authorization

### Access Control
1. **Route Protection**: Must be authenticated
2. **Role Validation**: Must have 'manager' or 'admin' role
3. **Data Isolation**: Managers see all data across the system
4. **Action Permissions**: Full CRUD permissions for all resources

### Error Handling
- **Authentication Errors**: Redirects to login prompt
- **Authorization Errors**: Shows access denied message
- **API Errors**: User-friendly error messages with retry options
- **Validation Errors**: Form-level validation with specific error messages

## Responsive Design

### Desktop (lg+)
- **Full Layout**: Three-column layout with sidebar
- **Modal Dialogs**: Centered modals with proper sizing
- **Table View**: Full table with all columns visible
- **Hover Effects**: Rich hover interactions

### Tablet (md)
- **Adapted Layout**: Two-column responsive layout
- **Condensed Tables**: Responsive table with priority columns
- **Touch-friendly**: Larger touch targets
- **Modal Adaptation**: Responsive modal sizing

### Mobile (sm)
- **Single Column**: Stacked layout for all content
- **Card View**: Programs displayed as cards instead of table
- **Collapsible**: Collapsible sections for better space usage
- **Mobile Modals**: Full-screen modals on small devices

## Performance Optimizations

### Data Loading
- **Parallel Requests**: Simultaneous API calls for different data types
- **Error Boundaries**: Graceful error handling without crashes
- **Loading States**: Skeleton loading for better UX
- **Caching**: Efficient state management to minimize re-renders

### Search & Filter
- **Debounced Search**: Optimized search with debouncing
- **Client-side Filtering**: Fast filtering without API calls
- **Efficient Algorithms**: Optimized filtering and sorting

## Development Notes

### Mock Data Integration
- **Development Mode**: Uses mock authentication
- **API Simulation**: Simulates API responses for development
- **Error Scenarios**: Tests various error conditions
- **Loading States**: Demonstrates loading behavior

### Styling Approach
- **Tailwind CSS**: Utility-first CSS framework
- **Consistent Design**: Unified color scheme and spacing
- **Accessibility**: ARIA labels and keyboard navigation
- **Dark Mode Ready**: Prepared for dark mode implementation

### Code Organization
- **Component Structure**: Well-organized component hierarchy
- **State Management**: Efficient React hooks usage
- **Error Handling**: Comprehensive error boundaries
- **Type Safety**: Prepared for TypeScript migration

## Future Enhancements

### Advanced Features
1. **Bulk Operations**: Select multiple items for batch operations
2. **Advanced Filtering**: Date ranges, multiple criteria
3. **Export Functionality**: Export data to CSV/PDF
4. **Analytics Dashboard**: Charts and graphs for insights
5. **Real-time Updates**: WebSocket integration for live updates

### User Experience
1. **Drag & Drop**: Drag and drop for material uploads
2. **Calendar Integration**: Full calendar view for sessions
3. **Notification Center**: In-app notification system
4. **Keyboard Shortcuts**: Power user keyboard shortcuts
5. **Undo/Redo**: Action history with undo functionality

### Technical Improvements
1. **Offline Support**: PWA with offline capabilities
2. **Performance Monitoring**: Real-time performance metrics
3. **A/B Testing**: Feature flag system for testing
4. **Internationalization**: Multi-language support
5. **Advanced Security**: Enhanced security measures

## Troubleshooting

### Common Issues
1. **Login Problems**: Ensure correct role selection
2. **API Errors**: Check network connectivity and backend status
3. **Form Validation**: Ensure all required fields are filled
4. **Modal Issues**: Check for JavaScript errors in console

### Debug Mode
- Enable browser developer tools
- Check console for error messages
- Verify network requests in Network tab
- Use React Developer Tools for state inspection

## Support & Maintenance

### Regular Updates
- Keep dependencies updated
- Monitor performance metrics
- Review user feedback
- Update documentation

### Monitoring
- Track API response times
- Monitor error rates
- Analyze user behavior
- Performance optimization






