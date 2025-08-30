import React from "react"
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Program from "./pages/Program";
import ProgramDetails from "./pages/ProgramDetails";
import Enrollment from "./pages/Enrollment";
import Groundbooking from "./pages/Groundbooking";
import Favourite from "./pages/Favourite";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
    <Navbar/>
    <Routes>
    <Route path ='/' element={<Home/>}/>
    <Route path ='/program' element={<Program/>}/>
    <Route path ='/program/:id' element={<ProgramDetails/>}/>
    <Route path ='/program/:id/:date' element={<Groundbooking/>}/>
    <Route path ='/enrollment' element={<Enrollment/>}/>
    <Route path ='/favourite' element={<Favourite/>}/>
    <Route path ='/profile' element={<Profile/>}/>
    </Routes>

    </>
  );
}

export default App





