import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import bgLogin from "../assets/bg-login.jpg";
import PlaneCursor from "../components/PlaneCursor";
import { useAuth } from "../context/AuthContext";
import { apiClient, setToken } from "../api/client";

export default function LoginPage({ onNavigateToHome, onAuthSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();
  const [isSignUp, setIsSignUp] = useState(location.pathname === "/signup");

  useEffect(() => {
    if (location.pathname === "/signup") {
      setIsSignUp(true);
    } else if (location.pathname === "/login") {
      setIsSignUp(false);
    }
  }, [location.pathname]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);


  // Sign Up Form State
  const [fullName, setFullName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // OTP Verification State
  const [signUpStep, setSignUpStep] = useState('DETAILS'); // 'DETAILS' | 'OTP_VERIFY'
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [devOtpBadge, setDevOtpBadge] = useState('');

  // OTP Countdown Timer
  React.useEffect(() => {
    let interval = null;
    if (signUpStep === 'OTP_VERIFY' && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    } else if (otpTimer === 0) {
      setCanResendOtp(true);
    }
    return () => clearInterval(interval);
  }, [signUpStep, otpTimer]);

  // Password Strength Calculator
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "", color: "bg-zinc-200" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 9) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, label: "Weak", color: "bg-rose-500" };
    if (score === 2 || score === 3) return { score: 65, label: "Medium", color: "bg-amber-400" };
    return { score: 100, label: "Strong", color: "bg-emerald-500" };
  };

  const passStrength = getPasswordStrength(signUpPassword);
  const passwordsMatch = confirmPassword.length > 0 && signUpPassword === confirmPassword;

  // Google OAuth User & Feedback State
  const [googleUser, setGoogleUser] = useState(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleGoogleSuccess = async (profile) => {
    setGoogleUser(profile);
    setAuthError("");
    setLoading(true);
    try {
      let data;
      const googlePassword = `google_oauth_${profile.sub || profile.id || profile.email}`;
      try {
        data = await apiClient.post('/auth/login', {
          email: profile.email,
          password: googlePassword,
        });
      } catch (err) {
        data = await apiClient.post('/auth/signup', {
          name: profile.name || profile.email.split('@')[0],
          email: profile.email,
          password: googlePassword,
        });
      }
      if (data?.token) setToken(data.token);
      if (onAuthSuccess) {
        onAuthSuccess(data.user, data.token);
      }
    } catch (err) {
      console.error("Google session auto-login error:", err);
      // Even if backend signup fails, keep profile set
    } finally {
      setLoading(false);
      setGoogleLoading(false);
    }
  };

  // Initialize Google Identity SDK on mount
  React.useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (window.google?.accounts?.id && clientId && !clientId.includes("your_google_client_id_here")) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) {
              try {
                // Decode JWT Payload
                const base64Url = response.credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                  atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
                );
                const profile = JSON.parse(jsonPayload);
                handleGoogleSuccess(profile);
              } catch (e) {
                console.error("JWT Decode error:", e);
              }
            }
          },
        });
      } catch (err) {
        console.error("GIS init error:", err);
      }
    }
  }, []);

  // Google Login Handler
  const loginWithGoogle = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!window.google) {
      setAuthError("Google Identity SDK is loading. Please refresh the page in a moment.");
      return;
    }

    if (!clientId || clientId.includes("your_google_client_id_here")) {
      setAuthError("Please add your valid Google Client ID in Frontend/.env");
      return;
    }

    setGoogleLoading(true);
    setAuthError("");

    // 1. Try OAuth2 token client popup
    if (window.google.accounts?.oauth2) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: "email profile openid",
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              console.error("Google token error:", tokenResponse);
              setAuthError(`Google Error: ${tokenResponse.error_description || tokenResponse.error}`);
              setGoogleLoading(false);
              return;
            }
            try {
              const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const profile = await res.json();
              await handleGoogleSuccess(profile);
            } catch (err) {
              console.error("Error fetching Google profile:", err);
              setAuthError("Failed to fetch user profile from Google.");
              setGoogleLoading(false);
            }
          },
          error_callback: (err) => {
            console.error("OAuth error_callback:", err);
            setAuthError(`Google Auth Error: ${err.message || "Origin mismatch or pop-up blocked"}`);
            setGoogleLoading(false);
          }
        });

        client.requestAccessToken();
        return;
      } catch (err) {
        console.error("initTokenClient error:", err);
      }
    }

    // 2. Fallback to Google ID Prompt
    if (window.google.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        setGoogleLoading(false);
        if (notification.isNotDisplayed()) {
          setAuthError(`Google Prompt not displayed: ${notification.getNotDisplayedReason()}`);
        }
      });
      return;
    }

    setGoogleLoading(false);
    setAuthError("Could not launch Google Sign-In pop-up.");
  };



  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);
    try {
      if (apiClient) {
        const data = await apiClient.post('/auth/login', { email, password });
        if (data?.token) setToken(data.token);
        if (onAuthSuccess) onAuthSuccess(data.user, data.token);
      }
      if (login) await login(email, password);
      navigate("/my-trips");
    } catch (err) {
      if (login) {
        await login(email, password);
        navigate("/my-trips");
      } else {
        setAuthError(err.message || "Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (signUpPassword !== confirmPassword) {
      setAuthError("Passwords do not match!");
      return;
    }
    setAuthError("");
    setLoading(true);
    try {
      const data = await apiClient.post('/auth/send-otp', { email: signUpEmail });
      setSignUpStep('OTP_VERIFY');
      setOtpTimer(60);
      setCanResendOtp(false);
      if (data.devOtp) {
        setDevOtpBadge(data.devOtp);
        setOtpCode(data.devOtp);
      }
    } catch (err) {
      if (signup) {
        await signup(fullName, signUpEmail, signUpPassword);
        navigate("/my-trips");
      } else {
        setAuthError(err.message || "Failed to send OTP code.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndSignUp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setAuthError("Please enter a 6-digit OTP code.");
      return;
    }
    setAuthError("");
    setLoading(true);
    try {
      const data = await apiClient.post('/auth/verify-otp-and-signup', {
        name: fullName,
        email: signUpEmail,
        password: signUpPassword,
        otp: otpCode,
      });
      if (data?.token) setToken(data.token);
      if (onAuthSuccess) onAuthSuccess(data.user, data.token);
      if (signup) await signup(fullName, signUpEmail, signUpPassword);
      navigate("/my-trips");
    } catch (err) {
      if (signup) {
        await signup(fullName, signUpEmail, signUpPassword);
        navigate("/my-trips");
      } else {
        setAuthError(err.message || "OTP verification failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-between px-8 sm:px-16 lg:px-24 overflow-hidden font-sans">
      {/* Dynamic Black Airplane Cursor */}
      <PlaneCursor />

      {/* Top Left Back to Home Button */}
      <button
        onClick={onNavigateToHome}
        className="absolute top-6 left-8 sm:left-16 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer backdrop-blur-md"
      >
        <span>&larr;</span> Back to Home
      </button>

      {/* 1. Fullscreen Background Image with Slow Breathing Zoom */}
      <img
        src={bgLogin}
        alt="Login Background"
        className="absolute inset-0 w-full h-full object-cover -z-20 animate-slow-zoom"
      />

      {/* 2. Ambient Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/60 -z-10" />

      {/* Ambient Floating Cyan/Aqua Glow Orbs for Glassmorphism */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl -z-10 animate-float-orb-1" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-teal-300/15 blur-3xl -z-10 animate-float-orb-2" />

      {/* 3. Left Side: Bold Promotional Typography with Smooth Fade-in & Animated Shimmer */}
      <div className="z-10 max-w-2xl text-white select-none hidden md:block animate-fade-in-up">
        <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black tracking-tight uppercase leading-[0.95] drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
          Explore <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-cyan-400 animate-text-shimmer drop-shadow-[0_0_30px_rgba(0,212,255,0.5)]">
            Countries
          </span> <br />
          With <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-cyan-300 to-white animate-text-shimmer">
            Us
          </span>
        </h1>
      </div>

      {/* 4. Right Side: Frosted Glass Auth Card with Sliding View Transition */}
      <div className="z-10 w-full max-w-[420px] mx-auto md:mx-0 bg-white/80 backdrop-blur-xl rounded-2xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-white/60 animate-fade-in-up-delayed overflow-hidden relative">
        {/* Brand Logo & Tagline (Shared Header) */}
        <div className="flex flex-col items-center mb-5 select-none">
          {/* Creative Monogram Icon: Twin G's in Black with Soaring Airplane */}
          <div className="relative flex items-center justify-center mb-1 animate-float-logo cursor-default">
            <div className="flex items-center justify-center font-black text-4xl tracking-tighter">
              {/* First G: Normal Black */}
              <span className="text-black hover:scale-110 transition-transform">
                G
              </span>
              {/* Second G: Inverted (180°) Black */}
              <span className="text-black inline-block rotate-180 -ml-1 hover:scale-110 transition-transform">
                G
              </span>
            </div>
            {/* Flying Airplane Icon */}
            <svg
              className="w-5 h-5 text-black absolute -top-2 -right-3.5 rotate-45 transform hover:scale-125 transition-transform"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>

          {/* Website Name Typography */}
          <div className="text-center">
            <div className="flex items-baseline justify-center tracking-tight leading-none">
              <span className="text-2xl font-black text-black">G</span>
              <span className="text-lg font-extrabold text-black mr-2">hummy</span>
              <span className="text-2xl font-black text-black inline-block rotate-180">G</span>
              <span className="text-lg font-extrabold text-black">hummi</span>
            </div>
            <p className="text-[10px] tracking-[0.3em] text-zinc-600 font-bold uppercase mt-1">
              Travels & Adventures
            </p>
          </div>
        </div>

        {/* LOGGED IN GOOGLE USER PROFILE BANNER */}
        {googleUser ? (
          <div className="flex flex-col items-center bg-cyan-50 border border-cyan-200 rounded-xl p-4 text-center my-4 animate-fade-in-up">
            <img
              src={googleUser.picture}
              alt={googleUser.name}
              className="w-14 h-14 rounded-full border-2 border-[#0096B4] shadow-md mb-2"
            />
            <h3 className="font-bold text-sm text-zinc-900">
              Welcome, {googleUser.name}!
            </h3>
            <p className="text-xs text-zinc-500 mb-3">{googleUser.email}</p>
            <button
              onClick={() => setGoogleUser(null)}
              className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : null}

        {authError ? (
          <div className="bg-red-50 text-red-700 text-xs rounded-lg p-2.5 mb-3 text-center border border-red-200">
            {authError}
          </div>
        ) : null}

        {/* SLIDING FORMS CONTAINER */}
        <div className="relative w-full min-h-[360px]">
          {/* ==================== 1. LOGIN FORM SLIDE ==================== */}
          <div
            className={`w-full transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
              isSignUp
                ? "-translate-x-full opacity-0 pointer-events-none absolute top-0 left-0"
                : "translate-x-0 opacity-100 relative"
            }`}
          >
            <h2 className="text-center text-xs font-black uppercase tracking-wider text-[#000000] mb-4">
              Start Your Journey
            </h2>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={() => loginWithGoogle()}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-zinc-700 border border-zinc-200 py-2.5 px-4 rounded-lg shadow-sm hover:bg-zinc-50 hover:border-zinc-300 hover:shadow active:scale-[0.98] transition-all text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27a7.11 7.11 0 0 1 0-4.54V6.58H1.25a11.93 11.93 0 0 0 0 10.84l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              {googleLoading ? "Connecting to Google..." : "Login with Google"}
            </button>

            {/* Separator */}
            <div className="relative flex items-center justify-center my-3.5">
              <div className="border-t border-zinc-300 w-full" />
              <span className="bg-transparent px-3 text-[11px] text-zinc-400 font-normal">
                or
              </span>
              <div className="border-t border-zinc-300 w-full" />
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/90 border border-zinc-200 rounded-lg text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0096B4]/40 focus:border-[#0096B4] transition-all shadow-sm"
              />

              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/90 border border-zinc-200 rounded-lg text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0096B4]/40 focus:border-[#0096B4] transition-all shadow-sm"
              />

              {/* Options Row */}
              <div className="flex items-center justify-between text-[11px] pt-1 pb-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-zinc-600 select-none hover:text-zinc-900 transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-zinc-300 text-[#0096B4] focus:ring-[#0096B4] cursor-pointer accent-[#0096B4]"
                  />
                  Remember me
                </label>
                <a
                  href="#forgot"
                  className="text-zinc-600 font-semibold hover:text-[#0096B4] transition-colors"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#0096B4] hover:bg-[#00819C] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg hover:shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </form>

            {/* Footer Link to Slide to Sign Up */}
            <p className="text-center text-[11px] text-zinc-500 mt-4 font-normal">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  navigate("/signup", { replace: true });
                }}
                className="text-[#0096B4] font-bold hover:underline cursor-pointer ml-1"
              >
                Create new account
              </button>
            </p>
          </div>

          {/* ==================== 2. CREATIVE SIGN UP FORM SLIDE ==================== */}
          <div
            className={`w-full transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
              isSignUp
                ? "translate-x-0 opacity-100 relative"
                : "translate-x-full opacity-0 pointer-events-none absolute top-0 left-0"
            }`}
          >
            <div className="text-center mb-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-black">
                Join Ghummy Ghummi ✈️
              </h2>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                Unlock exclusive travel destinations & deals
              </p>
            </div>

            {/* Google Sign Up Button */}
            <button
              type="button"
              onClick={() => loginWithGoogle()}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-zinc-700 border border-zinc-200 py-2.5 px-4 rounded-lg shadow-sm hover:bg-zinc-50 hover:border-zinc-300 hover:shadow active:scale-[0.98] transition-all text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27a7.11 7.11 0 0 1 0-4.54V6.58H1.25a11.93 11.93 0 0 0 0 10.84l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              {googleLoading ? "Connecting to Google..." : "Sign up with Google"}
            </button>

            {/* Separator */}
            <div className="relative flex items-center justify-center my-2.5">
              <div className="border-t border-zinc-300 w-full" />
              <span className="bg-transparent px-3 text-[10px] text-zinc-400 font-normal">
                or fill details
              </span>
              <div className="border-t border-zinc-300 w-full" />
            </div>

            {/* Creative 2-Step Sign Up Form */}
            {signUpStep === 'DETAILS' ? (
              <form onSubmit={handleSendOtp} className="space-y-2">
                {/* Full Name Input with User Icon */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-white/90 border border-zinc-200 rounded-lg text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0096B4]/40 focus:border-[#0096B4] transition-all shadow-sm"
                  />
                </div>

                {/* Email Input with Mail Icon */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-white/90 border border-zinc-200 rounded-lg text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0096B4]/40 focus:border-[#0096B4] transition-all shadow-sm"
                  />
                </div>

                {/* Password Input with Lock Icon & Show/Hide Eye Toggle */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showSignUpPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 bg-white/90 border border-zinc-200 rounded-lg text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0096B4]/40 focus:border-[#0096B4] transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    {showSignUpPassword ? (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.05 10.05 0 012.122-.063c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {signUpPassword ? (
                  <div className="pt-0.5 animate-fade-in-up">
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                      <span>Strength: <strong className="text-zinc-800">{passStrength.label}</strong></span>
                    </div>
                    <div className="w-full h-1 bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passStrength.color} transition-all duration-300`}
                        style={{ width: `${passStrength.score}%` }}
                      />
                    </div>
                  </div>
                ) : null}

                {/* Confirm Password Input with Match Indicator */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-white/90 border border-zinc-200 rounded-lg text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0096B4]/40 focus:border-[#0096B4] transition-all shadow-sm"
                  />
                  {passwordsMatch ? (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-emerald-500">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  ) : null}
                </div>

                {/* Terms Checkbox */}
                <div className="pt-1 pb-1">
                  <label className="flex items-start gap-1.5 cursor-pointer text-[10px] text-zinc-600 select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-3.5 h-3.5 mt-0.5 rounded border-zinc-300 text-[#0096B4] focus:ring-[#0096B4] cursor-pointer accent-[#0096B4]"
                    />
                    <span>
                      I agree to the <a href="#terms" className="text-[#0096B4] font-semibold hover:underline">Terms of Service</a> & <a href="#privacy" className="text-[#0096B4] font-semibold hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                </div>

                {/* Send OTP Action Button */}
                <button
                  type="submit"
                  disabled={!agreeTerms || loading}
                  className="group w-full py-2.5 mt-1 bg-gradient-to-r from-[#0096B4] to-[#00B4D8] hover:from-[#00819C] hover:to-[#0096B4] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg hover:shadow-cyan-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Get Verification Code</span>
                      <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* STEP 2: OTP VERIFICATION SLIDE */
              <form onSubmit={handleVerifyOtpAndSignUp} className="space-y-3 animate-fade-in-up">
                <div className="bg-cyan-50/80 border border-cyan-200 rounded-xl p-3 text-center">
                  <p className="text-[11px] text-zinc-600">
                    We sent a 6-digit verification code to:
                  </p>
                  <p className="font-extrabold text-xs text-[#0096B4] truncate mt-0.5">
                    {signUpEmail}
                  </p>
                  {devOtpBadge && (
                    <div className="mt-2 inline-block bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      🔑 DEV MODE OTP: {devOtpBadge}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-center text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-xl font-mono font-black tracking-[0.5em] py-2.5 bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0096B4] focus:border-[#0096B4] shadow-inner"
                  />
                </div>

                {/* Resend Timer & Action Row */}
                <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1">
                  <button
                    type="button"
                    onClick={() => setSignUpStep('DETAILS')}
                    className="text-zinc-600 font-semibold hover:text-[#0096B4] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    ← Edit Details
                  </button>

                  {canResendOtp ? (
                    <button
                      type="button"
                      onClick={(e) => handleSendOtp(e)}
                      className="text-[#0096B4] font-bold hover:underline cursor-pointer"
                    >
                      Resend Code
                    </button>
                  ) : (
                    <span>Resend in {otpTimer}s</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="w-full py-2.5 bg-gradient-to-r from-[#0096B4] to-[#00B4D8] hover:from-[#00819C] hover:to-[#0096B4] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg hover:shadow-cyan-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    "Verify & Create Account 🚀"
                  )}
                </button>
              </form>
            )}

            {/* Footer Link to Slide back to Login */}
            <p className="text-center text-[11px] text-zinc-500 mt-3 font-normal">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  navigate("/login", { replace: true });
                }}
                className="text-[#0096B4] font-bold hover:underline cursor-pointer ml-1"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* 5. Bottom Copyright Notice */}
      <footer className="absolute bottom-6 left-8 sm:left-16 lg:left-24 text-[11px] text-white/90 drop-shadow select-none">
        &copy; {new Date().getFullYear()} Ghummy Ghummi&trade;. All Rights Reserved.
      </footer>
    </main>
  );
}