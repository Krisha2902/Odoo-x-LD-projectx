import React from "react";
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Global Layout Components
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

// Pages
import HomePage from "./pages/Home.jsx";
import LoginPage from "./pages/login.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import MyTripsPage from "./pages/MyTrips.jsx";
import TripDetailsPage from "./pages/TripDetails.jsx";
import OngoingTripPage from "./pages/OngoingTrip.jsx";
import OngoingTripsPage from "./pages/OngoingTrips/OngoingTrips.jsx";
import PlanTripPage from "./pages/PlanTrip.jsx";
import TripBuilderPage from "./pages/TripBuilder.jsx";
import TimelineViewPage from "./pages/TimelineView.jsx";
import MapViewPage from "./pages/MapView.jsx";
import ConductorViewPage from "./pages/ConductorView.jsx";
import PublicSharePage from "./pages/PublicShare.jsx";
import ExplorePage from "./pages/Explore.jsx";
import CalendarPage from "./pages/Calendar/Calendar.jsx";
import ProfilePage from "./pages/Profile/Profile.jsx";

// Protected Route Wrapper for Authenticated Pages
function ProtectedRoute({ children }) {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

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
        <div className="min-h-screen bg-[#071517] text-white font-sans">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginWrapper />} />
            <Route path="/signup" element={<LoginWrapper />} />

            {/* Public Landing & Explore Pages (With Navbar & Footer) */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <HomeWrapper />
                  <Footer />
                </>
              }
            />
            <Route
              path="/home"
              element={
                <>
                  <Navbar />
                  <HomeWrapper />
                  <Footer />
                </>
              }
            />
            <Route
              path="/explore"
              element={
                <>
                  <Navbar />
                  <ExplorePage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/share/:slug"
              element={
                <>
                  <Navbar />
                  <PublicSharePage />
                  <Footer />
                </>
              }
            />

            {/* PROTECTED ROUTES (Require Login) */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <ProfilePage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-trips"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <MyTripsPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <DashboardPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ongoing-trips"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <OngoingTripsPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips/:id/ongoing"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <OngoingTripPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips/:id"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <TripDetailsPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips/:id/details"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <TripDetailsPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/plan-trip"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <PlanTripPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <CalendarPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips/:id/build"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <TripBuilderPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips/:id/timeline"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <TimelineViewPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips/:id/map"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <MapViewPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips/:id/conduct"
              element={
                <ProtectedRoute>
                  <ConductorViewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips/:id/view"
              element={
                <ProtectedRoute>
                  <ConductorViewPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <HomeWrapper />
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}
