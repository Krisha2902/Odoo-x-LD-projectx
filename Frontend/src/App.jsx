import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";

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
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/explore"
          element={<Explore />}
        />

        <Route
          path="/my-trips"
          element={<MyTrips />}
        />

        <Route
          path="/ongoing-trips"
          element={<OngoingTrips />}
        />

        <Route
          path="/calendar"
          element={<Calendar />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/plan-trip"
          element={<PlanTrip />}
        />
      </Routes>
    </div>
  );
}

export default App;