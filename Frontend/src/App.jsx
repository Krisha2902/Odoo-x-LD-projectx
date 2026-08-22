import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/login.jsx";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import Explore from "./pages/Explore/Explore";
import MyTrips from "./pages/MyTrips/MyTrips";
import OngoingTrips from "./pages/OngoingTrips/OngoingTrips";
import Calendar from "./pages/Calendar/Calendar";
import Profile from "./pages/Profile/Profile";
import PlanTrip from "./pages/PlanTrip/PlanTrip";

function App() {
  return (
    <div className="min-h-screen bg-[#071517]">
      <Routes>

        {/* =================================================
            LOGIN
            No navbar on login page
        ================================================= */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />      
            </>
          }
        />

        {/* =================================================
            EXPLORE
        ================================================= */}

        <Route
          path="/explore"
          element={
            <>
              <Navbar />
              <Explore />
              <Footer />  
            </>
          }
        />

        {/* =================================================
            MY TRIPS
        ================================================= */}

        <Route
          path="/my-trips"
          element={
            <>
              <Navbar />
              <MyTrips />
              <Footer />
            </>
          }
        />

        {/* =================================================
            ONGOING TRIPS
        ================================================= */}

        <Route
          path="/ongoing-trips"
          element={
            <>
              <Navbar />
              <OngoingTrips />
              <Footer />
            </>   
          }
        />

        {/* =================================================
            CALENDAR
        ================================================= */}

        <Route
          path="/calendar"
          element={
            <>
              <Navbar />
              <Calendar />
              <Footer />
            </>
          }
        />

        {/* =================================================
            PROFILE
        ================================================= */}

        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <Profile />
              <Footer />
            </>
          }
        />

        {/* =================================================
            PLAN TRIP
        ================================================= */}

        <Route
          path="/plan-trip"
          element={
            <>
              <Navbar />
              <PlanTrip />
              <Footer />
            </>
          }
        />

      </Routes>
    </div>
  );
}

export default App;