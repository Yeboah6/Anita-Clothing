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
  green: "#16a34a",
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

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
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

// ─── Password requirement check ──────────────────────────────────────────────
const passwordRequirements = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "One number", test: (v) => /[0-9]/.test(v) },
  { label: "One special character", test: (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v) },
];

// ─── Register Page ───────────────────────────────────────────────────────────
const Register = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [createBtnHovered, setCreateBtnHovered] = useState(false);
  const [googleBtnHovered, setGoogleBtnHovered] = useState(false);
  const [signInHovered, setSignInHovered] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    injectFonts();

    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (!touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getPasswordStrength = (pwd) => {
    const passed = passwordRequirements.filter((r) => r.test(pwd)).length;
    if (pwd.length === 0) return { width: 0, color: tokens.border };
    if (passed <= 2) return { width: 25, color: tokens.destructive };
    if (passed === 3) return { width: 66, color: "#f59e0b" };
    return { width: 100, color: tokens.green };
  };

  const errors = {};
  if (touched.firstName && !form.firstName.trim()) errors.firstName = "First name is required";
  if (touched.lastName && !form.lastName.trim()) errors.lastName = "Last name is required";
  if (touched.email && !form.email.trim()) errors.email = "Email is required";
  if (touched.email && form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Please enter a valid email";
  if (touched.password && !form.password) errors.password = "Password is required";
  if (touched.password && form.password.length < 8) errors.password = "Password must be at least 8 characters";
  if (touched.confirmPassword && !form.confirmPassword) errors.confirmPassword = "Please confirm your password";
  if (touched.confirmPassword && form.password !== form.confirmPassword) errors.confirmPassword = "Passwords do not match";

  const isValid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.password.length >= 8 &&
    form.password === form.confirmPassword &&
    agreedToTerms;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTouched({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true });

    if (isValid) {
      console.log("Register:", form);
      // Handle registration
    }
  };

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
      <Header />

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1rem", backgroundColor: "rgba(245,245,245,0.3)" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "480px",
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
              Create your account
            </h1>
            <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: 0, lineHeight: 1.6 }}>
              Join Anita Clothing for a more personalized shopping experience
            </p>
          </div>

          {/* Google Sign Up */}
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label htmlFor="firstName" style={labelStyle}>First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  placeholder="First name"
                  style={{
                    ...inputStyle,
                    borderColor: errors.firstName ? tokens.destructive : tokens.border,
                  }}
                  onFocus={(e) => {
                    if (!errors.firstName) e.target.style.borderColor = tokens.foreground;
                  }}
                  onBlur={(e) => {
                    if (!errors.firstName) e.target.style.borderColor = tokens.border;
                  }}
                />
                {errors.firstName && (
                  <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" style={labelStyle}>Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  placeholder="Last name"
                  style={{
                    ...inputStyle,
                    borderColor: errors.lastName ? tokens.destructive : tokens.border,
                  }}
                  onFocus={(e) => {
                    if (!errors.lastName) e.target.style.borderColor = tokens.foreground;
                  }}
                  onBlur={(e) => {
                    if (!errors.lastName) e.target.style.borderColor = tokens.border;
                  }}
                />
                {errors.lastName && (
                  <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{errors.lastName}</p>
                )}
              </div>
            </div>

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
              <label htmlFor="password" style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange("password")}
                  onBlur={handleBlur("password")}
                  placeholder="Create a password"
                  autoComplete="new-password"
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

              {/* Password strength bar */}
              {form.password.length > 0 && (
                <div style={{ marginTop: "0.5rem" }}>
                  <div
                    style={{
                      height: "4px",
                      borderRadius: "2px",
                      backgroundColor: tokens.border,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${passwordStrength.width}%`,
                        backgroundColor: passwordStrength.color,
                        transition: "width 0.3s ease, background-color 0.3s ease",
                        borderRadius: "2px",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Password requirements */}
              <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {passwordRequirements.map((req, i) => {
                  const met = req.test(form.password);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem" }}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          border: met ? `1px solid ${tokens.green}` : `1px solid ${tokens.border}`,
                          backgroundColor: met ? tokens.green : "transparent",
                          color: "#ffffff",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {met && <IconCheck />}
                      </span>
                      <span style={{ color: met ? tokens.green : tokens.mutedForeground, transition: "color 0.2s ease" }}>
                        {req.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  style={{
                    ...inputStyle,
                    paddingRight: "2.5rem",
                    borderColor: errors.confirmPassword ? tokens.destructive : tokens.border,
                  }}
                  onFocus={(e) => {
                    if (!errors.confirmPassword) e.target.style.borderColor = tokens.foreground;
                  }}
                  onBlur={(e) => {
                    if (!errors.confirmPassword) e.target.style.borderColor = tokens.border;
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
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
                  {showConfirm ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{errors.confirmPassword}</p>
              )}
              {form.confirmPassword && !errors.confirmPassword && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem", fontSize: "0.75rem" }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "14px", height: "14px", borderRadius: "50%", border: `1px solid ${tokens.green}`, backgroundColor: tokens.green, color: "#ffffff" }}>
                    <IconCheck />
                  </span>
                  <span style={{ color: tokens.green }}>Passwords match</span>
                </div>
              )}
            </div>

            {/* Terms checkbox */}
            <div style={{ marginTop: "0.25rem" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.625rem",
                  cursor: "pointer",
                  fontSize: "0.8125rem",
                  color: tokens.mutedForeground,
                  lineHeight: 1.5,
                }}
              >
                <div
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "3px",
                    border: agreedToTerms ? `1px solid ${tokens.foreground}` : `1px solid ${tokens.border}`,
                    backgroundColor: agreedToTerms ? tokens.foreground : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "1px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {agreedToTerms && (
                    <IconCheck />
                  )}
                </div>
                <span>
                  I agree to the{" "}
                  <a href="/terms" style={{ color: tokens.foreground, textDecoration: "underline" }}>Terms of Service</a>
                  {" "}and{" "}
                  <a href="/privacy" style={{ color: tokens.foreground, textDecoration: "underline" }}>Privacy Policy</a>
                </span>
              </label>
              {submitted && !agreedToTerms && (
                <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0 28px" }}>
                  Please agree to the terms
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitted && !isValid}
              style={{
                width: "100%",
                height: "48px",
                marginTop: "0.5rem",
                fontSize: "0.9375rem",
                fontWeight: 500,
                fontFamily: tokens.fontBody,
                borderRadius: tokens.radius,
                border: "none",
                backgroundColor: tokens.foreground,
                color: tokens.background,
                cursor: submitted && !isValid ? "not-allowed" : "pointer",
                opacity: submitted && !isValid ? 0.5 : createBtnHovered ? 0.9 : 1,
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={() => setCreateBtnHovered(true)}
              onMouseLeave={() => setCreateBtnHovered(false)}
            >
              Create Account
            </button>
          </form>

          {/* Sign in link */}
          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
            Already have an account?{" "}
            <a
              href="/sign-in"
              style={{
                color: signInHovered ? tokens.foreground : tokens.foreground,
                fontWeight: 500,
                textDecoration: "underline",
                textUnderlineOffset: "2px",
                opacity: signInHovered ? 0.8 : 1,
                transition: "opacity 0.15s ease",
              }}
              onMouseEnter={() => setSignInHovered(true)}
              onMouseLeave={() => setSignInHovered(false)}
            >
              Sign in
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;