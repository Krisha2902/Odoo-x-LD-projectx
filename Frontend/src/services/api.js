import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach JWT Token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("globetrotter_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API Endpoints
export const authAPI = {
  login: async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  },
  signup: async (userData) => {
    const res = await api.post("/auth/signup", userData);
    return res.data;
  },
  sendOtp: async (email) => {
    const res = await api.post("/auth/send-otp", { email });
    return res.data;
  },
  verifyOtpAndSignUp: async (payload) => {
    const res = await api.post("/auth/verify-otp-and-signup", payload);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },
};

// Trips API Endpoints
export const tripsAPI = {
  getAll: async () => {
    const res = await api.get("/trips");
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/trips/${id}`);
    return res.data;
  },
  create: async (tripData) => {
    const res = await api.post("/trips", tripData);
    return res.data;
  },
  update: async (id, patch) => {
    const res = await api.patch(`/trips/${id}`, patch);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/trips/${id}`);
    return res.data;
  },
  generateAI: async (id, promptData) => {
    const res = await api.post(`/trips/${id}/generate`, promptData);
    return res.data;
  },
  fork: async (id) => {
    const res = await api.post(`/trips/${id}/fork`);
    return res.data;
  },
  getBudget: async (id) => {
    const res = await api.get(`/trips/${id}/budget`);
    return res.data;
  },
};

// AI Itinerary API Endpoints
export const aiAPI = {
  generateItinerary: async (params) => {
    const res = await api.post("/ai/generate-itinerary", params);
    return res.data;
  },
};

// Cities & Catalog API Endpoints
export const catalogAPI = {
  getDestinations: async () => {
    const res = await api.get("/catalog/destinations");
    return res.data;
  },
};

export const citiesAPI = {
  search: async (query) => {
    const res = await api.get("/catalog/destinations", { params: { search: query } });
    return res.data;
  },
};

// Stops API Endpoints
export const stopsAPI = {
  add: async (tripId, stopData) => {
    const res = await api.post(`/trips/${tripId}/stops`, stopData);
    return res.data;
  },
  reorder: async (tripId, orderedStopIds) => {
    const res = await api.put(`/trips/${tripId}/stops/reorder`, { orderedStopIds });
    return res.data;
  },
  delete: async (stopId) => {
    const res = await api.delete(`/stops/${stopId}`);
    return res.data;
  },
};

// Itinerary Items API Endpoints
export const itemsAPI = {
  add: async (stopId, itemData) => {
    const res = await api.post(`/stops/${stopId}/items`, itemData);
    return res.data;
  },
  update: async (itemId, patch) => {
    const res = await api.patch(`/items/${itemId}`, patch);
    return res.data;
  },
  delete: async (itemId) => {
    const res = await api.delete(`/items/${itemId}`);
    return res.data;
  },
  vote: async (itemId, voteType) => {
    const res = await api.post(`/items/${itemId}/vote`, { vote: voteType });
    return res.data;
  },
};

// Public Share & Community Feed API Endpoints
export const exploreAPI = {
  getPublicTrips: async () => {
    const res = await api.get("/explore");
    return res.data;
  },
};

export const shareAPI = {
  getBySlug: async (slug) => {
    const res = await api.get(`/public/share/${slug}`);
    return res.data;
  },
};

export const userAPI = {
  updateProfile: async (formData) => {
    try {
      const res = await api.patch("/auth/me", formData);
      return res.data;
    } catch {
      return { success: true, user: formData };
    }
  },
  getSavedPlaces: async () => {
    try {
      const res = await api.get("/user/saved-places");
      return res.data;
    } catch {
      return { places: [] };
    }
  },
};

export default api;
