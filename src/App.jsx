import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { session } from './services/api';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import AiAssistantPage from './pages/AiAssistantPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/auth/AuthPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => session.get());

  const handleLogout = () => {
    session.clear();
    setCurrentUser(null);
  };

  const handleUserChange = (user) => {
    session.set(user);
    setCurrentUser(user);
  };

  return (
    <Router>
      <div className="min-h-screen w-full flex flex-col bg-[#ebf1f1] text-slate-800 selection:bg-[#008080] selection:text-white">
        <Navbar currentUser={currentUser} onLogout={handleLogout} />

        <main className="flex-1 w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctors/:id" element={<DoctorProfilePage />} />
            <Route path="/ai-assistant" element={<AiAssistantPage currentUser={currentUser} />} />
            <Route
              path="/book"
              element={<BookAppointmentPage currentUser={currentUser} onUserLogin={handleUserChange} />}
            />
            <Route
              path="/dashboard"
              element={<DashboardPage currentUser={currentUser} onLogout={handleLogout} />}
            />
            <Route
              path="/auth"
              element={<AuthPage currentUser={currentUser} onAuthSuccess={handleUserChange} />}
            />
            <Route path="/login" element={<Navigate to="/auth?mode=login" replace />} />
            <Route path="/register" element={<Navigate to="/auth?mode=register" replace />} />
            <Route path="/my-appointments" element={<Navigate to="/dashboard" replace />} />
            <Route path="/portal" element={<Navigate to="/dashboard" replace />} />
            <Route path="/patient/*" element={<Navigate to="/dashboard" replace />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
