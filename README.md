# 🏏 CricketXpert - Cricket Equipment Repair System

A complete web application for managing cricket equipment repairs with customer, service manager, and technician dashboards.

## 🚀 **Quick Start**

### **Option 1: One-Click Start (Recommended)**
Double-click `start-project.bat` in the project root folder.

### **Option 2: Manual Start**
1. **Start Backend Server:**
   ```bash
   npm start
   ```
2. **Start Frontend Server (in new terminal):**
   ```bash
   cd Frontend
   npm run dev
   ```

## 🌐 **Access the Application**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📋 **Features**

### **Customer Features:**
- ✅ Submit repair requests with damage details
- ✅ View repair status and track progress
- ✅ Receive email notifications
- ✅ Download repair reports

### **Service Manager Features:**
- ✅ View all repair requests
- ✅ Approve/reject requests
- ✅ Send cost and time estimates
- ✅ Assign technicians to repairs
- ✅ Monitor repair progress
- ✅ Generate reports

### **Technician Features:**
- ✅ View assigned repair tasks
- ✅ Update repair progress in real-time
- ✅ Mark repairs as complete
- ✅ Add repair notes and comments

## 🏗️ **System Architecture**

```
Frontend (React + Vite)
├── Customer Dashboard
├── Service Manager Dashboard
├── Technician Dashboard
└── Repair Request Form

Backend (Node.js + Express)
├── User Management
├── Repair Request API
├── Email Notifications
├── PDF Report Generation
└── MongoDB Database
```

## 📁 **Project Structure**

```
CricketXpert/
├── Frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Main page components
│   │   ├── api/           # API service functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # App entry point
│   ├── package.json
│   └── index.html
├── routes/                # Backend API routes
├── controllers/           # Backend business logic
├── models/               # Database models
├── config/               # Configuration files
├── server.js             # Backend server
└── package.json
```

## 🔧 **Technology Stack**

### **Frontend:**
- React 19.1.1
- React Router DOM 7.8.2
- Vite 7.1.3
- Tailwind CSS 3.3.3
- Axios 1.11.0

### **Backend:**
- Node.js
- Express 5.1.0
- MongoDB 8.17.1
- Mongoose 8.17.1
- Nodemailer 7.0.5
- PDFKit 0.17.1

## 📱 **User Interfaces**

### **1. Repair Request Form (Homepage)**
- Customer username verification
- Damage type selection
- Description input
- Form validation

### **2. Customer Dashboard**
- View all repair requests
- Track repair progress
- Download repair reports
- Submit feedback

### **3. Service Manager Dashboard**
- Manage all repair requests
- Approve/reject requests
- Send estimates to customers
- Assign technicians
- Monitor system status

### **4. Technician Dashboard**
- View assigned repairs
- Update repair progress
- Mark repairs complete
- Add repair notes

## 🔄 **Workflow**

1. **Customer submits repair request** → Form validation → Database storage
2. **Service Manager reviews request** → Approve/Reject → Email notification
3. **If approved** → Send cost estimate → Customer approval
4. **Assign technician** → Technician notification → Start repair
5. **Technician updates progress** → Real-time status updates
6. **Repair completion** → Generate report → Customer notification

## 📧 **Email Notifications**

- Request approval/rejection
- Cost estimates
- Repair progress updates
- Completion notifications
- Report delivery

## 📄 **PDF Reports**

- Customer details
- Repair information
- Cost breakdown
- Technician details
- Completion date

## 🛠️ **Installation**

### **Prerequisites:**
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### **Setup:**
1. Clone the repository
2. Install backend dependencies: `npm install`
3. Install frontend dependencies: `cd Frontend && npm install`
4. Configure environment variables
5. Start the application

## 🔍 **Troubleshooting**

### **Common Issues:**

**Frontend not loading:**
- Check if frontend server is running on port 5173
- Verify no console errors (F12)
- Try refreshing the page

**Backend connection issues:**
- Ensure backend server is running on port 5000
- Check MongoDB connection
- Verify environment variables

**Database issues:**
- Check MongoDB service is running
- Verify connection string in .env file
- Check database permissions

## 📞 **Support**

If you encounter any issues:
1. Check the browser console for errors
2. Verify both servers are running
3. Check the terminal output for error messages
4. Ensure all dependencies are installed

## 🎯 **Next Steps**

Once the application is running:
1. Test the repair request form
2. Navigate between different dashboards
3. Test the complete workflow
4. Customize features as needed

---

**🏏 CricketXpert - Professional Cricket Equipment Repair Management System**

