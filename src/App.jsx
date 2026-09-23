import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MirandaPatternBackground from './components/MirandaPatternBackground';
import HomePage from './pages/HomePage';
import GuestInvitationPage from './pages/GuestInvitationPage';
import LabInvitationPage from './pages/LabInvitationPage';
import AdminPage from './pages/AdminPage';
import QuizPage from './pages/QuizPage';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen relative bg-[#0d0d11]">
        {/* Pattern Background with mini elements 1..6 */}
        <MirandaPatternBackground />

        <div className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<Navigate to="/invitation" replace />} />
            <Route path="/invitation" element={<LabInvitationPage />} />
            <Route path="/invitation/:code" element={<LabInvitationPage />} />
            <Route path="/invitacion" element={<Navigate to="/invitation" replace />} />
            <Route path="/invitacion-lab" element={<Navigate to="/invitation" replace />} />
            <Route path="/invitado/:code" element={<GuestInvitationPage />} />
            <Route path="/dinamicas/quiz" element={<QuizPage />} />
            <Route path="/quiz" element={<Navigate to="/dinamicas/quiz" replace />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/invitation" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
