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
      <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
        <Navbar/>
        <main className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:id" element={<ProgramDetails />} />
            <Route path="/coaches" element={<CoachProfiles />} />
            
            {/* Additional routes for future implementation */}
            <Route path="/sessions" element={
              <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
                <div className="text-center max-w-md w-full">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Sessions</h2>
                  <p className="text-gray-600 text-responsive">This page is coming soon! We're working hard to bring you an amazing sessions experience.</p>
                </div>
              </div>
            } />
            <Route path="/certificates" element={
              <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
                <div className="text-center max-w-md w-full">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Certificates</h2>
                  <p className="text-gray-600 text-responsive">This page is coming soon! We're working hard to bring you an amazing certificates experience.</p>
                </div>
              </div>
            } />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={
              <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
                <div className="text-center max-w-md w-full">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Dashboard</h2>
                  <p className="text-gray-600 text-responsive">This page is coming soon! We're working hard to bring you an amazing dashboard experience.</p>
                </div>
              </div>
            } />
            <Route path="/coach-dashboard" element={<CoachDashboard />} />
            <Route path="/manager-dashboard" element={<ManagerDashboard />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        
        {/* Toast notifications - responsive positioning */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              padding: 'clamp(0.75rem, 2vw, 1rem)',
              maxWidth: '90vw',
            },
          }}
          containerStyle={{
            top: '1rem',
            right: '1rem',
            zIndex: 9999,
          }}
        />
      </div>
    </AuthProvider>
  );
}

export default App





