import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";

// Pages
import HomePage from "./pages/Home.jsx";
import LoginPage from "./pages/login.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import TripBuilderPage from "./pages/TripBuilder.jsx";
import TimelineViewPage from "./pages/TimelineView.jsx";
import MapViewPage from "./pages/MapView.jsx";
import ConductorViewPage from "./pages/ConductorView.jsx";
import PublicSharePage from "./pages/PublicShare.jsx";
import ExplorePage from "./pages/Explore.jsx";

function HomeWrapper() {
  const navigate = useNavigate();
  return <HomePage onNavigateToAuth={() => navigate("/login")} />;
}

function LoginWrapper() {
  const navigate = useNavigate();
  return <LoginPage onNavigateToHome={() => navigate("/")} />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomeWrapper />} />
            <Route path="/login" element={<LoginWrapper />} />
            <Route path="/signup" element={<LoginWrapper />} />
            <Route path="/trips" element={<DashboardPage />} />
            <Route path="/trips/:id/build" element={<TripBuilderPage />} />
            <Route path="/trips/:id/timeline" element={<TimelineViewPage />} />
            <Route path="/trips/:id/map" element={<MapViewPage />} />
            <Route path="/trips/:id/conduct" element={<ConductorViewPage />} />
            <Route path="/trips/:id/view" element={<ConductorViewPage />} />
            <Route path="/share/:slug" element={<PublicSharePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="*" element={<HomeWrapper />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}
