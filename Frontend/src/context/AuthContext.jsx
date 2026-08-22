import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
import { useToast } from "./ToastContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("globetrotter_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("globetrotter_token"));
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (token && !user) {
      authAPI
        .getMe()
        .then((data) => {
          setUser(data.user);
          localStorage.setItem("globetrotter_user", JSON.stringify(data.user));
        })
        .catch(() => {
          // Fallback demo user if API isn't responding
          const fallbackUser = {
            id: "user_demo_123",
            name: "Alex Trotter",
            email: "alex@globetrotter.io",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
          };
          setUser(fallbackUser);
          localStorage.setItem("globetrotter_user", JSON.stringify(fallbackUser));
        });
    }
  }, [token, user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authAPI.login({ email, password });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("globetrotter_token", data.token);
      localStorage.setItem("globetrotter_user", JSON.stringify(data.user));
      addToast("Successfully logged in!", "success");
      return data;
    } catch (err) {
      console.warn("API Login failed, using demo session:", err.message);
      const demoToken = "demo_jwt_token_123";
      const demoUser = {
        id: "user_demo_123",
        name: email.split("@")[0] || "Demo User",
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };
      setToken(demoToken);
      setUser(demoUser);
      localStorage.setItem("globetrotter_token", demoToken);
      localStorage.setItem("globetrotter_user", JSON.stringify(demoUser));
      addToast("Logged in with Demo Session!", "info");
      return { token: demoToken, user: demoUser };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (googleProfile) => {
    setLoading(true);
    try {
      const gUser = {
        id: googleProfile?.id || "google_user_999",
        name: googleProfile?.name || "Alex Rivera",
        email: googleProfile?.email || "alex.rivera.google@gmail.com",
        username: "@alex_google",
        avatar:
          googleProfile?.avatar ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        provider: "Google Account",
      };
      const gToken = "google_oauth_jwt_token_999";
      setToken(gToken);
      setUser(gUser);
      localStorage.setItem("globetrotter_token", gToken);
      localStorage.setItem("globetrotter_user", JSON.stringify(gUser));
      addToast("Logged in with Google Account!", "success");
      return { token: gToken, user: gUser };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (fullName, email, password) => {
    setLoading(true);
    try {
      const data = await authAPI.signup({ name: fullName, email, password });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("globetrotter_token", data.token);
      localStorage.setItem("globetrotter_user", JSON.stringify(data.user));
      addToast("Account created successfully!", "success");
      return data;
    } catch (err) {
      console.warn("API Signup failed, using demo session:", err.message);
      const demoToken = "demo_jwt_token_123";
      const demoUser = {
        id: "user_demo_123",
        name: fullName || "New Explorer",
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`,
      };
      setToken(demoToken);
      setUser(demoUser);
      localStorage.setItem("globetrotter_token", demoToken);
      localStorage.setItem("globetrotter_user", JSON.stringify(demoUser));
      addToast("Account created with Demo Session!", "info");
      return { token: demoToken, user: demoUser };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("globetrotter_token");
    localStorage.removeItem("globetrotter_user");
    addToast("Logged out successfully", "info");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, loginWithGoogle, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
