import React, { useEffect, useState } from 'react';
import LoginPage from './pages/login.jsx';
import DashboardPage from './pages/dashboard.jsx';
import { apiClient, getToken, removeToken } from './api/client';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await apiClient.get('/auth/me');
        setUser(res.user);
      } catch (err) {
        console.warn('Session expired or token invalid:', err.message);
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0096B4] to-cyan-400 flex items-center justify-center font-black text-2xl animate-bounce shadow-lg shadow-cyan-500/30 mb-4">
          G
        </div>
        <p className="text-xs font-bold tracking-widest text-cyan-400 uppercase animate-pulse">
          Connecting to GlobeTrotter...
        </p>
      </div>
    );
  }

  return user ? (
    <DashboardPage user={user} onLogout={handleLogout} />
  ) : (
    <LoginPage onAuthSuccess={handleAuthSuccess} />
  );
}

export default App;
