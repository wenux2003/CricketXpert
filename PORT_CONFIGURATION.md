# Port Configuration Guide

This document explains the port configuration for the CricketXpert application.

## Default Port Configuration

- **Backend Server**: Port 3001
- **Frontend Development Server**: Port 3000

## Environment Variables

### Backend (.env file in root directory)
```env
PORT=3001
HOST=localhost
NODE_ENV=development
```

### Frontend (.env file in Frontend directory)
```env
VITE_PORT=3000
VITE_HOST=localhost
VITE_API_URL=http://localhost:3001
```

## Running the Application

### Option 1: Run Both Frontend and Backend Together
```bash
# Install dependencies first
npm install
cd Frontend && npm install && cd ..

# Run both servers simultaneously
npm run dev:full
```

### Option 2: Run Separately

#### Backend Only
```bash
npm run dev:backend
# or
npm run dev
```

#### Frontend Only
```bash
npm run dev:frontend
```

### Option 3: Production Mode
```bash
# Build frontend
npm run build:frontend

# Start backend
npm start
```

## Port Customization

### Change Backend Port
Set the `PORT` environment variable:
```bash
PORT=8000 npm run dev:backend
```

### Change Frontend Port
Set the `VITE_PORT` environment variable:
```bash
VITE_PORT=4000 npm run dev:frontend
```

### Change API URL (if backend runs on different port)
Set the `VITE_API_URL` environment variable:
```bash
VITE_API_URL=http://localhost:8000 npm run dev:frontend
```

## Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **API Test Endpoint**: http://localhost:3001/api/test

## Troubleshooting

### Port Already in Use
If you get "port already in use" errors:

1. **Find the process using the port:**
   ```bash
   # Windows
   netstat -ano | findstr :3001
   
   # Kill the process (replace PID with actual process ID)
   taskkill /PID <PID> /F
   ```

2. **Or use different ports:**
   ```bash
   PORT=3002 npm run dev:backend
   VITE_PORT=3001 VITE_API_URL=http://localhost:3002 npm run dev:frontend
   ```

### CORS Issues
If you encounter CORS issues, ensure:
- Backend is running on the correct port
- Frontend proxy configuration matches backend port
- Both servers are running on localhost

## Development Workflow

1. Start both servers: `npm run dev:full`
2. Open browser to http://localhost:3000
3. Backend API available at http://localhost:3001/api
4. Make changes to code - both servers will auto-reload
5. Check console logs for any errors

## Production Deployment

For production deployment:
1. Set `NODE_ENV=production`
2. Build frontend: `npm run build:frontend`
3. Serve static files from backend
4. Use environment variables for production ports
