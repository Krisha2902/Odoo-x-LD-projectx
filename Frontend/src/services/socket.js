import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

class SocketService {
  socket = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        autoConnect: false,
        auth: {
          token: localStorage.getItem("globetrotter_token"),
        },
      });
    }
    if (!this.socket.connected) {
      this.socket.connect();
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinTripRoom(tripId, user) {
    const socket = this.connect();
    socket.emit("join_trip", { tripId, user });
  }

  leaveTripRoom(tripId) {
    if (this.socket) {
      this.socket.emit("leave_trip", { tripId });
    }
  }

  onPresenceUpdate(callback) {
    if (this.socket) {
      this.socket.on("presence_update", callback);
    }
  }

  onItineraryUpdated(callback) {
    if (this.socket) {
      this.socket.on("itinerary_updated", callback);
    }
  }

  onVoteUpdated(callback) {
    if (this.socket) {
      this.socket.on("vote_updated", callback);
    }
  }

  removeListeners() {
    if (this.socket) {
      this.socket.off("presence_update");
      this.socket.off("itinerary_updated");
      this.socket.off("vote_updated");
    }
  }
}

export const socketService = new SocketService();
export default socketService;
