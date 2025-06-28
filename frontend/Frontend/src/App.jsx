import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ✅ Import Components
import Home from './components/common/Home';
import Login from './components/common/Login';
import Register from './components/common/Register';
import Dashboard from './components/common/Dashboard';
import AllCourses from './components/common/AllCourses';
import UserHome from './components/common/UserHome';
import NavBar from './components/common/NavBar';
import AdminHome from './components/admin/AdminHome';
import CourseContent from './components/user/student/CourseContent';

function App() {
  return (
    <Router>
      <NavBar /> {/* ✅ NavBar will appear on all pages */}

      <Routes>
        {/* ✅ Common Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/allcourses" element={<AllCourses />} />
        <Route path="/userhome" element={<UserHome />} />

        {/* ✅ Admin Route */}
        <Route path="/admin/dashboard" element={<AdminHome />} />

        {/* ✅ Student Route */}
        <Route path="/student/coursecontent" element={<CourseContent />} />

        {/* ✅ 404 Route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;