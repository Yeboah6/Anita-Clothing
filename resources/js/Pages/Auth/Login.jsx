import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
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

  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  const [touched, setTouched] = useState({});
  // const [submitted, setSubmitted] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    injectFonts();
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setData(field, value);
    if (!touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const clientErrors = {};
  if (touched.email && !data.email.trim()) clientErrors.email = "Email is required";
  if (touched.email && data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    clientErrors.email = "Please enter a valid email";
  if (touched.password && !data.password) clientErrors.password = "Password is required";

  // Merge server errors with client hints
  const fieldError = (field) => errors[field] || clientErrors[field];

  const isValid = data.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) && data.password;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    post("/login", {
      onFinish: () => {
        reset("password");
        setTouched((prev) => ({ ...prev, password: false }));
      },
    });
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
          {errors.email && errors.email !== clientErrors.email && (
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
              <span>{errors.email}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Email */}
            <div>
              <label htmlFor="email" style={labelStyle}>Email</label>
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                placeholder="your@email.com"
                autoComplete="email"
                style={{
                  ...inputStyle,
                  borderColor: fieldError("email") ? tokens.destructive : tokens.border,
                }}
                onFocus={(e) => {
                  if (!fieldError("email")) e.target.style.borderColor = tokens.foreground;
                }}
                onBlur={(e) => {
                  if (!fieldError("email")) e.target.style.borderColor = tokens.border;
                }}
              />
              {fieldError("email") && (
                <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{fieldError("email")}</p>
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
                  value={data.password}
                  onChange={handleChange("password")}
                  onBlur={handleBlur("password")}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  style={{
                    ...inputStyle,
                    paddingRight: "2.5rem",
                    borderColor: fieldError("password") ? tokens.destructive : tokens.border,
                  }}
                  onFocus={(e) => {
                    if (!fieldError("password")) e.target.style.borderColor = tokens.foreground;
                  }}
                  onBlur={(e) => {
                    if (!fieldError("password")) e.target.style.borderColor = tokens.border;
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
              {fieldError("password") && (
                <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{fieldError("password")}</p>
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
                  onClick={() => setData('remember', !data.remember)}
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "3px",
                    border: data.remember ? `1px solid ${tokens.foreground}` : `1px solid ${tokens.border}`,
                    backgroundColor: data.remember ? tokens.foreground : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {data.remember && (
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
              disabled={processing}
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
                cursor: processing ? "not-allowed" : "pointer",
                opacity: processing ? 0.5 : signInBtnHovered ? 0.9 : 1,
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={() => setSignInBtnHovered(true)}
              onMouseLeave={() => setSignInBtnHovered(false)}
            >
              {processing ? "Signing in…" : "Sign In"}
            </button>
          </form>

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