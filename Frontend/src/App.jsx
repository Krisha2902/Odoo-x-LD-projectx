import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";

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

function HomeWrapper() {
  const navigate = useNavigate();
  return <HomePage onNavigateToAuth={() => navigate("/login")} />;
}

function LoginWrapper() {
  const navigate = useNavigate();
  return <LoginPage onNavigateToHome={() => navigate("/home")} />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <div className="min-h-screen bg-[#071517] text-white font-sans">
          <Routes>
            {/* Initial Site Entry: Login & Signup Pages */}
            <Route path="/" element={<LoginWrapper />} />
            <Route path="/login" element={<LoginWrapper />} />
            <Route path="/signup" element={<LoginWrapper />} />

            {/* Home Page */}
            <Route
              path="/home"
              element={
                <>
                  <Navbar />
                  <HomeWrapper />
                </>
              }
            />

            {/* Explore Page */}
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

            {/* My Trips */}
            <Route
              path="/my-trips"
              element={
                <>
                  <Navbar />
                  <MyTripsPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/trips"
              element={
                <>
                  <Navbar />
                  <DashboardPage />
                  <Footer />
                </>
              }
            />

            {/* Ongoing Trips */}
            <Route
              path="/ongoing-trips"
              element={
                <>
                  <Navbar />
                  <OngoingTripsPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/trips/:id/ongoing"
              element={
                <>
                  <Navbar />
                  <OngoingTripPage />
                  <Footer />
                </>
              }
            />

            {/* Trip Details */}
            <Route
              path="/trips/:id"
              element={
                <>
                  <Navbar />
                  <TripDetailsPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/trips/:id/details"
              element={
                <>
                  <Navbar />
                  <TripDetailsPage />
                  <Footer />
                </>
              }
            />

            {/* Plan Trip */}
            <Route
              path="/plan-trip"
              element={
                <>
                  <Navbar />
                  <PlanTripPage />
                  <Footer />
                </>
              }
            />

            {/* Calendar */}
            <Route
              path="/calendar"
              element={
                <>
                  <Navbar />
                  <CalendarPage />
                  <Footer />
                </>
              }
            />

            {/* Profile */}
            <Route
              path="/profile"
              element={
                <>
                  <Navbar />
                  <ProfilePage />
                  <Footer />
                </>
              }
            />

            {/* Trip Builder, Timeline, Map, Conductor & Share */}
            <Route
              path="/trips/:id/build"
              element={
                <>
                  <Navbar />
                  <TripBuilderPage />
                </>
              }
            />
            <Route
              path="/trips/:id/timeline"
              element={
                <>
                  <Navbar />
                  <TimelineViewPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/trips/:id/map"
              element={
                <>
                  <Navbar />
                  <MapViewPage />
                  <Footer />
                </>
              }
            />
            <Route path="/trips/:id/conduct" element={<ConductorViewPage />} />
            <Route path="/trips/:id/view" element={<ConductorViewPage />} />
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

            <Route path="*" element={<LoginWrapper />} />
          </Routes>
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}
