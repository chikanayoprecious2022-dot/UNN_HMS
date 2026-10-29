import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { db } from './services/db';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import AiAssistantPage from './pages/AiAssistantPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import AuthPage from './pages/auth/AuthPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState(db.getCurrentUser());

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#ebf1f1] text-slate-800 selection:bg-[#008080] selection:text-white">
        {/* Simple Brand Navbar */}
        <Navbar currentUser={currentUser} />

        {/* Core Pages */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctors/:id" element={<DoctorProfilePage />} />
            <Route path="/ai-assistant" element={<AiAssistantPage currentUser={currentUser} />} />
            <Route path="/book" element={<BookAppointmentPage currentUser={currentUser} />} />
            <Route path="/my-appointments" element={<MyAppointmentsPage currentUser={currentUser} />} />
            <Route path="/auth" element={<AuthPage onAuthSuccess={(user) => setCurrentUser(user)} />} />

            {/* Aliases */}
            <Route path="/portal" element={<Navigate to="/my-appointments" replace />} />
            <Route path="/patient/*" element={<Navigate to="/my-appointments" replace />} />
            <Route path="/admin/*" element={<Navigate to="/my-appointments" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}
