import React, { useState, useEffect } from "react";
import Header from '@/Components/Layout/Header';
import Footer from '@/Components/Layout/Footer';

// ─── Fonts ───────────────────────────────────────────────────────────────────
const injectFonts = () => {
  const id = "anita-fonts";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
  }
};

// ─── Design tokens ───────────────────────────────────────────────────────────
const tokens = {
  fontDisplay: "'Cormorant Garamond', serif",
  fontBody: "'Inter', sans-serif",
  foreground: "#141414",
  background: "#ffffff",
  mutedForeground: "#737373",
  secondary: "#f5f5f5",
  border: "#e6e6e6",
  radius: "4px",
  destructive: "#ef4444",
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconShoppingBag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconEye = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IconAlertCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

// ─── Input Styles ────────────────────────────────────────────────────────────
const inputStyle = {
  height: "44px",
  width: "100%",
  padding: "0 0.75rem",
  fontSize: "0.875rem",
  fontFamily: tokens.fontBody,
  backgroundColor: tokens.background,
  border: `1px solid ${tokens.border}`,
  borderRadius: tokens.radius,
  color: tokens.foreground,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s ease",
};

const labelStyle = {
  fontSize: "0.875rem",
  fontWeight: 500,
  fontFamily: tokens.fontBody,
  color: tokens.foreground,
  marginBottom: "0.5rem",
  display: "block",
};

// ─── Login Page ──────────────────────────────────────────────────────────────
const Login = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [signInBtnHovered, setSignInBtnHovered] = useState(false);
  const [googleBtnHovered, setGoogleBtnHovered] = useState(false);
  const [registerHovered, setRegisterHovered] = useState(false);
  const [forgotHovered, setForgotHovered] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    injectFonts();

    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setLoginError("");
    if (!touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const errors = {};
  if (touched.email && !form.email.trim()) errors.email = "Email is required";
  if (touched.email && form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Please enter a valid email";
  if (touched.password && !form.password) errors.password = "Password is required";

  const isValid = form.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && form.password;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTouched({ email: true, password: true });

    if (isValid) {
      // Simulate login
      if (form.email === "demo@anita.com" && form.password === "password123") {
        console.log("Login successful:", form);
        setLoginError("");
        // Redirect would go here
      } else {
        setLoginError("Invalid email or password. Please try again.");
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
      <Header />

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1rem", backgroundColor: "rgba(245,245,245,0.3)" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "440px",
            backgroundColor: tokens.background,
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius,
            padding: isDesktop ? "3rem" : "2rem",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <a href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>
              <span style={{ fontFamily: tokens.fontDisplay, fontSize: "1.5rem", fontWeight: 600, letterSpacing: "0.08em", color: tokens.foreground }}>
                ANITA
              </span>
            </a>
            <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 500, margin: "0 0 0.5rem", color: tokens.foreground }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: 0, lineHeight: 1.6 }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Error alert */}
          {loginError && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.625rem",
                padding: "0.75rem 1rem",
                marginBottom: "1.5rem",
                borderRadius: tokens.radius,
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: tokens.destructive,
                fontSize: "0.8125rem",
                lineHeight: 1.5,
              }}
            >
              <span style={{ display: "flex", marginTop: "1px", flexShrink: 0 }}>
                <IconAlertCircle />
              </span>
              <span>{loginError}</span>
            </div>
          )}

          {/* Google Sign In */}
          <button
            style={{
              width: "100%",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              fontFamily: tokens.fontBody,
              borderRadius: tokens.radius,
              border: `1px solid ${tokens.border}`,
              backgroundColor: googleBtnHovered ? tokens.secondary : tokens.background,
              color: tokens.foreground,
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              marginBottom: "1.5rem",
            }}
            onMouseEnter={() => setGoogleBtnHovered(true)}
            onMouseLeave={() => setGoogleBtnHovered(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: tokens.border }} />
            <span style={{ fontSize: "0.75rem", color: tokens.mutedForeground, textTransform: "uppercase", letterSpacing: "0.05em" }}>or</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: tokens.border }} />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Email */}
            <div>
              <label htmlFor="email" style={labelStyle}>Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                placeholder="your@email.com"
                autoComplete="email"
                style={{
                  ...inputStyle,
                  borderColor: errors.email ? tokens.destructive : tokens.border,
                }}
                onFocus={(e) => {
                  if (!errors.email) e.target.style.borderColor = tokens.foreground;
                }}
                onBlur={(e) => {
                  if (!errors.email) e.target.style.borderColor = tokens.border;
                }}
              />
              {errors.email && (
                <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <label htmlFor="password" style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                <a
                  href="/forgot-password"
                  style={{
                    fontSize: "0.8125rem",
                    color: forgotHovered ? tokens.foreground : tokens.mutedForeground,
                    textDecoration: "none",
                    fontFamily: tokens.fontBody,
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={() => setForgotHovered(true)}
                  onMouseLeave={() => setForgotHovered(false)}
                >
                  Forgot password?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange("password")}
                  onBlur={handleBlur("password")}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  style={{
                    ...inputStyle,
                    paddingRight: "2.5rem",
                    borderColor: errors.password ? tokens.destructive : tokens.border,
                  }}
                  onFocus={(e) => {
                    if (!errors.password) e.target.style.borderColor = tokens.foreground;
                  }}
                  onBlur={(e) => {
                    if (!errors.password) e.target.style.borderColor = tokens.border;
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: "0.5rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: tokens.mutedForeground,
                    padding: "0.25rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              {errors.password && (
                <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{errors.password}</p>
              )}
            </div>

            {/* Remember me */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.8125rem",
                  color: tokens.mutedForeground,
                }}
              >
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "3px",
                    border: rememberMe ? `1px solid ${tokens.foreground}` : `1px solid ${tokens.border}`,
                    backgroundColor: rememberMe ? tokens.foreground : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {rememberMe && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                width: "100%",
                height: "48px",
                marginTop: "0.25rem",
                fontSize: "0.9375rem",
                fontWeight: 500,
                fontFamily: tokens.fontBody,
                borderRadius: tokens.radius,
                border: "none",
                backgroundColor: tokens.foreground,
                color: tokens.background,
                cursor: "pointer",
                opacity: signInBtnHovered ? 0.9 : 1,
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={() => setSignInBtnHovered(true)}
              onMouseLeave={() => setSignInBtnHovered(false)}
            >
              Sign In
            </button>
          </form>

          {/* Demo credentials hint */}
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem",
              borderRadius: tokens.radius,
              backgroundColor: tokens.secondary,
              fontSize: "0.75rem",
              color: tokens.mutedForeground,
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: tokens.foreground }}>Demo:</strong> demo@anita.com / password123
          </div>

          {/* Register link */}
          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
            Don't have an account?{" "}
            <a
              href="/register"
              style={{
                color: tokens.foreground,
                fontWeight: 500,
                textDecoration: "underline",
                textUnderlineOffset: "2px",
                opacity: registerHovered ? 0.8 : 1,
                transition: "opacity 0.15s ease",
              }}
              onMouseEnter={() => setRegisterHovered(true)}
              onMouseLeave={() => setRegisterHovered(false)}
            >
              Create one
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;