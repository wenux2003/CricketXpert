import React from "react"
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CoachingPrograms from "./pages/CoachingPrograms";
import ProgramDetails from "./pages/ProgramDetails";
import EnrollmentForm from "./pages/EnrollmentForm";
import EnrollmentSuccess from "./pages/EnrollmentSuccess";
import PlayerProfile from "./pages/PlayerProfile";

function App() {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/programs" element={<CoachingPrograms />} />
        <Route path="/programs/:id" element={<ProgramDetails />} />
        <Route path="/programs/:id/enroll" element={<EnrollmentForm />} />
        <Route path="/enrollment-success/:enrollmentId" element={<EnrollmentSuccess />} />
        <Route path="/profile" element={<PlayerProfile />} />
        <Route path="/dashboard" element={<PlayerProfile />} />
        
        {/* Additional routes for future implementation */}
        <Route path="/sessions" element={<div className="p-8 text-center">Sessions page coming soon...</div>} />
        <Route path="/certificates" element={<div className="p-8 text-center">Certificates page coming soon...</div>} />
      </Routes>
    </>
  );
}

export default App





