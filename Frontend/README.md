# CricketXpert Frontend

A React-based frontend for the Cricket Equipment Repair System.

## Features

- **Customer Repair Request Form**: Submit new repair requests with damage details
- **Customer Dashboard**: View repair status and track progress
- **Service Manager Dashboard**: Manage and approve repair requests
- **Technician Dashboard**: Update repair progress in real-time
- **Real-time Status Updates**: Live progress tracking for all stakeholders

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Backend Setup

Make sure your backend server is running:

1. Navigate to the project root directory
2. Install backend dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend should be running on `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── api/           # API service functions
├── assets/        # Static assets
├── App.jsx        # Main app component
└── main.jsx       # App entry point
```

## Troubleshooting

If you see a blank page or connection errors:

1. **Check if backend is running**: Ensure the backend server is started on port 5000
2. **Check console errors**: Open browser dev tools to see any JavaScript errors
3. **Clear browser cache**: Hard refresh the page (Ctrl+F5)
4. **Check network tab**: Verify API calls are reaching the backend

## API Endpoints

The frontend connects to these backend endpoints:
- `http://localhost:5000/api/users` - User management
- `http://localhost:5000/api/repairs` - Repair request management
- `http://localhost:5000/api/technicians` - Technician management
- `http://localhost:5000/api/feedbacks` - Feedback management
