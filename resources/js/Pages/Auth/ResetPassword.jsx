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
  green: "#16a34a",
  destructive: "#ef4444",
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconCheckCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={tokens.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconLoader = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const IconEye = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// ─── Input Styles ────────────────────────────────────────────────────────────
const inputStyle = {
  height: "44px",
  width: "100%",
  padding: "0 2.75rem 0 0.75rem",
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

const readOnlyInputStyle = {
  height: "44px",
  width: "100%",
  padding: "0 0.75rem",
  fontSize: "0.875rem",
  fontFamily: tokens.fontBody,
  backgroundColor: tokens.secondary,
  border: `1px solid ${tokens.border}`,
  borderRadius: tokens.radius,
  color: tokens.mutedForeground,
  outline: "none",
  boxSizing: "border-box",
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
const passwordChecks = (password) => ([
  { label: "At least 8 characters", passed: password.length >= 8 },
  { label: "One uppercase letter", passed: /[A-Z]/.test(password) },
  { label: "One number", passed: /[0-9]/.test(password) },
]);

// ─── Reset Password Page ─────────────────────────────────────────────────────
const ResetPassword = ({ token, email }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [resetBtnHovered, setResetBtnHovered] = useState(false);
  const [backHovered, setBackHovered] = useState(false);
  const [goToLoginHovered, setGoToLoginHovered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    token: token || "",
    email: email || "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    injectFonts();

    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const checks = passwordChecks(data.password);
  const allChecksPassed = checks.every((c) => c.passed);
  const passwordsMatch = data.password && data.password_confirmation && data.password === data.password_confirmation;

  const handleSubmit = (e) => {
    e.preventDefault();

    post("/reset-password", {
      preserveScroll: true,
      onSuccess: () => setIsSubmitted(true),
    });
  };

  // Success state
  if (isSubmitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1rem", backgroundColor: "rgba(245,245,245,0.3)" }}>
          <div style={{ width: "100%", maxWidth: "440px", backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, padding: isDesktop ? "3rem" : "2rem", textAlign: "center" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <IconCheckCircle />
            </div>
            <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.75rem)", fontWeight: 500, margin: "0 0 0.75rem", color: tokens.foreground }}>
              Password reset
            </h1>
            <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: 0, lineHeight: 1.6 }}>
              Your password has been updated successfully. You can now sign in with your new password.
            </p>

            <a
              href="/login"
              style={{
                display: "block",
                width: "100%",
                height: "44px",
                lineHeight: "44px",
                marginTop: "2rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                fontFamily: tokens.fontBody,
                borderRadius: tokens.radius,
                textDecoration: "none",
                textAlign: "center",
                backgroundColor: tokens.foreground,
                color: tokens.background,
                opacity: goToLoginHovered ? 0.9 : 1,
                transition: "opacity 0.2s ease",
                boxSizing: "border-box",
              }}
              onMouseEnter={() => setGoToLoginHovered(true)}
              onMouseLeave={() => setGoToLoginHovered(false)}
            >
              Sign in
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Form state
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
      <Header />
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1rem", backgroundColor: "rgba(245,245,245,0.3)" }}>
        <div style={{ width: "100%", maxWidth: "440px", backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, padding: isDesktop ? "3rem" : "2rem" }}>
          {/* Back link */}
          <a
            href="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.8125rem",
              fontWeight: 500,
              fontFamily: tokens.fontBody,
              textDecoration: "none",
              color: backHovered ? tokens.foreground : tokens.mutedForeground,
              marginBottom: "1.5rem",
              transition: "color 0.15s ease",
            }}
            onMouseEnter={() => setBackHovered(true)}
            onMouseLeave={() => setBackHovered(false)}
          >
            <IconArrowLeft />
            Back to sign in
          </a>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ marginBottom: "1.5rem", color: tokens.mutedForeground }}>
              <IconLock />
            </div>
            <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.75rem)", fontWeight: 500, margin: "0 0 0.5rem", color: tokens.foreground }}>
              Reset your password
            </h1>
            <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: 0, lineHeight: 1.6 }}>
              Choose a new password for your account below.
            </p>
          </div>

          {/* General token/email errors (e.g. expired or invalid link) */}
          {errors.email && (
            <p style={{ fontSize: "0.8125rem", color: tokens.destructive, backgroundColor: "#fef2f2", padding: "0.75rem 1rem", borderRadius: tokens.radius, marginBottom: "1rem", lineHeight: 1.5 }}>
              {errors.email}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label htmlFor="email" style={labelStyle}>Email</label>
              <input
                id="email"
                type="email"
                value={data.email}
                readOnly
                style={readOnlyInputStyle}
              />
            </div>

            <div>
              <label htmlFor="password" style={labelStyle}>New password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  autoFocus
                  style={{
                    ...inputStyle,
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
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    color: tokens.mutedForeground,
                    display: "flex",
                  }}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              {errors.password && (
                <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{errors.password}</p>
              )}

              {/* Password requirement checklist */}
              {data.password && (
                <ul style={{ listStyle: "none", padding: 0, margin: "0.5rem 0 0", display: "flex", flexDirection: "column", gap: "2px" }}>
                  {checks.map((check) => (
                    <li
                      key={check.label}
                      style={{
                        fontSize: "0.75rem",
                        color: check.passed ? tokens.green : tokens.mutedForeground,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <span>{check.passed ? "✓" : "○"}</span>
                      {check.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label htmlFor="password_confirmation" style={labelStyle}>Confirm new password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  value={data.password_confirmation}
                  onChange={(e) => setData("password_confirmation", e.target.value)}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  style={{
                    ...inputStyle,
                    borderColor: errors.password_confirmation
                      ? tokens.destructive
                      : data.password_confirmation && !passwordsMatch
                        ? tokens.destructive
                        : tokens.border,
                  }}
                  onFocus={(e) => {
                    if (!errors.password_confirmation) e.target.style.borderColor = tokens.foreground;
                  }}
                  onBlur={(e) => {
                    if (!errors.password_confirmation) e.target.style.borderColor = tokens.border;
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    color: tokens.mutedForeground,
                    display: "flex",
                  }}
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              {errors.password_confirmation ? (
                <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{errors.password_confirmation}</p>
              ) : data.password_confirmation && !passwordsMatch ? (
                <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>Passwords do not match</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={processing}
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
                cursor: processing ? "not-allowed" : "pointer",
                opacity: processing ? 0.7 : resetBtnHovered ? 0.9 : 1,
                transition: "opacity 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
              onMouseEnter={() => setResetBtnHovered(true)}
              onMouseLeave={() => setResetBtnHovered(false)}
            >
              {processing ? (
                <>
                  <IconLoader />
                  Resetting...
                </>
              ) : (
                "Reset password"
              )}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;