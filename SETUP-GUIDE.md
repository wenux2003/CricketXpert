# CricketXpert Setup Guide

## Quick Start (Windows)

### Option 1: Using the Batch File (Easiest)
1. Double-click `start-servers.bat` in the project root
2. Wait for both servers to start
3. Open your browser and go to: `http://localhost:5173`

### Option 2: Using PowerShell Script
1. Right-click `start-servers.ps1` and select "Run with PowerShell"
2. Wait for both servers to start
3. Open your browser and go to: `http://localhost:5173`

### Option 3: Manual Setup

#### Step 1: Start Backend Server
Open a new PowerShell window and run:
```powershell
npm start
```
Wait until you see: `🚀 Server running on port 5000`

#### Step 2: Start Frontend Server
Open another PowerShell window and run:
```powershell
cd Frontend
npm run dev
```
Wait until you see: `Local: http://localhost:5173/`

#### Step 3: Open Application
Open your browser and go to: `http://localhost:5173`

## What You Should See

✅ **If everything is working correctly:**
- A beautiful CricketXpert interface with navigation
- Repair Request Form as the main page
- Links to Service Manager and Technician dashboards

❌ **If you see a blank page:**
1. Check that both servers are running
2. Check browser console for errors (F12)
3. Try refreshing the page (Ctrl+F5)

## Troubleshooting

### Backend Issues
- Make sure MongoDB is running
- Check if port 5000 is available
- Look for error messages in the backend terminal

### Frontend Issues
- Make sure you're accessing `http://localhost:5173` (not 5000)
- Check browser console for JavaScript errors
- Try clearing browser cache

### Database Issues
- Make sure your `.env` file has correct MongoDB connection string
- Check if MongoDB service is running

## Application Features

🏏 **Cricket Equipment Repair System**
- Customer repair request submission
- Service Manager dashboard
- Technician dashboard
- Real-time status tracking
- Email notifications
- PDF report generation

## URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Service Manager**: http://localhost:5173/manager
- **Technician**: http://localhost:5173/technician
