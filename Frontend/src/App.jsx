import React from "react"
import { Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Programs from "./pages/Programs";
import ProgramDetails from "./pages/ProgramDetails";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import CoachProfiles from "./pages/CoachProfiles";
import CoachDashboard from "./pages/CoachDashboard";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:id" element={<ProgramDetails />} />
          <Route path="/coaches" element={<CoachProfiles />} />
          
          {/* Additional routes for future implementation */}
          <Route path="/sessions" element={<div className="p-8 text-center">Sessions page coming soon...</div>} />
          <Route path="/certificates" element={<div className="p-8 text-center">Certificates page coming soon...</div>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<div className="p-8 text-center">Dashboard page coming soon...</div>} />
          <Route path="/coach-dashboard" element={<CoachDashboard />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        
        {/* Toast notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </AuthProvider>
  );
}

export default App





