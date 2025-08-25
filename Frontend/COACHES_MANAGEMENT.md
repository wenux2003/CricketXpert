# Coaches Management Dashboard

## Overview
The Coaches Management Dashboard is a comprehensive interface for managing cricket coaches within the CricketXpert platform. It provides functionality to view, add, edit, and delete coach information, as well as view detailed schedules for each coach.

## Features

### 1. Dashboard Overview
- **Total Coaches**: Displays the total number of coaches in the system
- **Active Coaches**: Shows the count of currently active coaches
- **Total Players**: Displays the sum of all players assigned to coaches
- **Average Rating**: Shows the average rating across all coaches

### 2. Coach Management
- **View Coaches**: See all assigned coaches in a detailed table format
- **Add New Coach**: Add new coaches to the system with comprehensive information
- **Edit Coach**: Update existing coach information
- **Delete Coach**: Remove coaches from the system (with confirmation)

### 3. Coach Schedule Management
- **View Individual Schedules**: Click the calendar icon to view each coach's detailed weekly schedule
- **Session Information**: See session details including:
  - Day and time
  - Session type (Group/Individual)
  - Location
  - Assigned players
  - Session name/description
- **Schedule Statistics**: View schedule overview with:
  - Total sessions count
  - Weekly sessions count
  - Group vs Individual session breakdown

### 4. Search and Filter
- **Search**: Search coaches by name or specialization
- **Status Filter**: Filter coaches by Active/Inactive status

### 5. Coach Information
Each coach record includes:
- Profile image
- Name and email
- Specialization (Batting, Bowling, Fielding, Fitness, Wicket Keeping)
- Years of experience
- Number of assigned players
- Rating (out of 5 stars)
- Status (Active/Inactive)
- Phone number
- **Weekly schedule** with detailed session information

## Navigation

### Accessing the Coaches Management
1. Open the coaching dashboard
2. Click on "Coaches" in the sidebar navigation
3. You'll be taken to the coaches management page

### Navigation Between Pages
- **Dashboard**: Click "Dashboard" in sidebar to return to main dashboard
- **Coaches**: Click "Coaches" in sidebar to access coaches management

### Viewing Coach Schedules
1. In the coaches table, click the green calendar icon in the "Schedule" column
2. You'll be taken to that coach's detailed weekly schedule view
3. Click "← Back to Coaches" to return to the main coaches list

## Usage

### Adding a New Coach
1. Click the "Add New Coach" button
2. Fill in the required information:
   - Name (required)
   - Email (required)
   - Phone number
   - Specialization
   - Experience level
3. Click "Add Coach" to save

### Editing a Coach
1. Click the edit icon (pencil) next to any coach in the table
2. Modify the desired fields
3. Click "Update Coach" to save changes
4. Click "Cancel" to discard changes

### Deleting a Coach
1. Click the delete icon (trash) next to any coach in the table
2. Confirm the deletion in the popup dialog

### Viewing Coach Schedules
1. Click the calendar icon in the Schedule column for any coach
2. View the coach's weekly schedule organized by day
3. See session details including:
   - Session name and type
   - Time slots
   - Location
   - Number of players
   - Player names
4. Navigate back to the coaches list using the back button

### Searching and Filtering
1. Use the search bar to find coaches by name or specialization
2. Use the status dropdown to filter by Active/Inactive status
3. Both search and filter can be used together

## Schedule Features

### Schedule View
- **Weekly Layout**: Organized by days of the week (Monday to Sunday)
- **Color-coded Days**: Each day has a distinct color for easy identification
- **Session Details**: Complete information for each session
- **Empty Days**: Clear indication when no sessions are scheduled

### Session Information Displayed
- **Session Name**: Descriptive name of the training session
- **Time**: Start and end time of the session
- **Location**: Where the session takes place
- **Session Type**: Group Session or Individual Session
- **Players**: List of all players assigned to the session
- **Player Count**: Number of players in the session

### Schedule Statistics
- **Total Sessions**: Count of all scheduled sessions
- **This Week**: Number of weekday sessions (Monday-Friday)
- **Group Sessions**: Count of group training sessions
- **Individual Sessions**: Count of one-on-one sessions

## Technical Details

### Components
- `CoachesManagement.jsx`: Main component for the coaches management page
- `AddCoachModal.jsx`: Modal component for adding new coaches
- Integrated with existing `Sidebar.jsx` and `Topbar.jsx` components

### Routing
- Uses React Router for navigation
- Route: `/coaches` for the coaches management page
- Route: `/` for the main dashboard

### State Management
- Uses React useState hooks for local state management
- Sample data included for demonstration purposes
- Schedule data integrated with coach profiles
- Ready for integration with backend API

### Styling
- Consistent with existing dashboard design
- Dark theme with modern UI elements
- Responsive design using Tailwind CSS
- Icons from React Icons and Lucide React
- Color-coded schedule days for better visual organization

## Sample Schedule Data

The system includes realistic sample schedules for different coach types:

### Batting Coach (John Smith)
- Monday: Batting Practice (Group) + Technique Analysis (Individual)
- Wednesday: Power Hitting (Group)
- Friday: Match Simulation (Group)

### Bowling Coach (Sarah Johnson)
- Tuesday: Fast Bowling (Group)
- Thursday: Spin Bowling (Group)
- Saturday: Bowling Analysis (Individual)

### Fitness Coach (Emma Wilson)
- Monday: Morning Fitness (Group)
- Wednesday: Strength Training (Group)
- Friday: Cardio & Agility (Group)

## Future Enhancements
- Integration with backend API for persistent data
- Coach performance analytics
- Player assignment management
- Coach availability scheduling
- Advanced filtering and sorting options
- Bulk operations (bulk edit, bulk delete)
- Export functionality for coach data
- **Schedule Management Features**:
  - Add/edit/delete individual sessions
  - Drag-and-drop schedule editing
  - Calendar view integration
  - Conflict detection for scheduling
  - Automated schedule generation
  - Session attendance tracking
