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
          // Token is invalid/expired
          setToken(null);
          setUser(null);
          localStorage.removeItem("globetrotter_token");
          localStorage.removeItem("globetrotter_user");
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
      addToast(err.response?.data?.error?.message || err.message || "Login failed", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (googleProfile) => {
    setLoading(true);
    try {
      const googlePassword = `google_oauth_${googleProfile.sub || googleProfile.id || googleProfile.email}`;
      let data;
      try {
        data = await authAPI.login({ email: googleProfile.email, password: googlePassword });
      } catch {
        data = await authAPI.signup({
          name: googleProfile.name || googleProfile.email.split('@')[0],
          email: googleProfile.email,
          password: googlePassword,
        });
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("globetrotter_token", data.token);
      localStorage.setItem("globetrotter_user", JSON.stringify(data.user));
      addToast("Logged in with Google Account!", "success");
      return data;
    } catch (err) {
      addToast(err.response?.data?.error?.message || err.message || "Google login failed", "error");
      throw err;
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
      addToast(err.response?.data?.error?.message || err.message || "Signup failed", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedFields };
      localStorage.setItem("globetrotter_user", JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("globetrotter_token");
    localStorage.removeItem("globetrotter_user");
    addToast("Logged out successfully", "info");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, loginWithGoogle, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
