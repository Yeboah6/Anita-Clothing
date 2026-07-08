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

// ─── Password requirement check (client-side UI hints only) ─────────────────
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
  const [termsTouched, setTermsTouched] = useState(false);
  const [createBtnHovered, setCreateBtnHovered] = useState(false);
  const [googleBtnHovered, setGoogleBtnHovered] = useState(false);
  const [signInHovered, setSignInHovered] = useState(false);

  // Inertia form: handles data, submission, loading state, and server-side errors
  const { data, setData, post, processing, errors, reset } = useForm({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    agree_terms: false,
  });

  const [touched, setTouched] = useState({});
  // For errors that aren't tied to a specific field (e.g. expired session, server error)
  const [generalError, setGeneralError] = useState(null);

  useEffect(() => {
    injectFonts();

    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (field) => (e) => {
    setData(field, e.target.value);
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

  // Client-side hints (fast feedback). Server-side `errors` always take precedence on submit.
  const clientErrors = {};
  if (touched.first_name && !data.first_name.trim()) clientErrors.first_name = "First name is required";
  if (touched.last_name && !data.last_name.trim()) clientErrors.last_name = "Last name is required";
  if (touched.email && !data.email.trim()) clientErrors.email = "Email is required";
  if (touched.email && data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) clientErrors.email = "Please enter a valid email";
  if (touched.phone && !data.phone.trim()) clientErrors.phone = "Phone number is required";
  if (touched.phone && data.phone.trim() && !/^[0-9+\-\s()]+$/.test(data.phone)) clientErrors.phone = "Please enter a valid phone number";
  if (touched.password && !data.password) clientErrors.password = "Password is required";
  if (touched.password && data.password && data.password.length < 8) clientErrors.password = "Password must be at least 8 characters";
  if (touched.password_confirmation && !data.password_confirmation) clientErrors.password_confirmation = "Please confirm your password";
  if (touched.password_confirmation && data.password_confirmation && data.password !== data.password_confirmation) clientErrors.password_confirmation = "Passwords do not match";
  if (termsTouched && !data.agree_terms) clientErrors.agree_terms = "Please agree to the terms";

  // Merge: server errors win once present (they reflect the actual submit attempt)
  const fieldError = (field) => errors[field] || clientErrors[field];

  const isValid =
    data.first_name.trim() &&
    data.last_name.trim() &&
    data.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
    data.phone.trim() &&
    /^[0-9+\-\s()]+$/.test(data.phone) &&
    data.password.length >= 8 &&
    data.password === data.password_confirmation &&
    agreedToTerms;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ 
      first_name: true, 
      last_name: true, 
      email: true, 
      phone: true, 
      password: true, 
      password_confirmation: true 
    });
    setTermsTouched(true);
    setGeneralError(null);

    post("/register", {
      onSuccess: () => {
        setTouched({});
        setTermsTouched(false);
      },
      onError: (errors) => {
        if (!Object.keys(errors).length) {
          setGeneralError("Something went wrong creating your account. Please try again.");
        }
      },
      onFinish: () => {
        reset("password", "password_confirmation");
        setTouched((prev) => ({ ...prev, password: false, password_confirmation: false }));
      },
    });
  };

  const passwordStrength = getPasswordStrength(data.password);

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
              <img
              src="images/logo.png"
              alt="CuteBloom Logo"
              style={{ width: "100%", maxWidth: "90px", borderRadius: tokens.radius, objectFit: "cover" }}
            />
            </a>
            <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 500, margin: "0 0 0.5rem", color: tokens.foreground }}>
              Create your account
            </h1>
            <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: 0, lineHeight: 1.6 }}>
              Join Anita Clothing for a more personalized shopping experience
            </p>
          </div>

          {/* General error banner (non-field-specific failures) */}
          {generalError && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.75rem 1rem",
                borderRadius: tokens.radius,
                border: `1px solid ${tokens.destructive}`,
                backgroundColor: "#fef2f2",
                color: tokens.destructive,
                fontSize: "0.8125rem",
              }}
            >
              {generalError}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label htmlFor="first_name" style={labelStyle}>First Name</label>
                <input
                  id="first_name"
                  type="text"
                  value={data.first_name}
                  onChange={handleChange("first_name")}
                  onBlur={handleBlur("first_name")}
                  placeholder="First name"
                  style={{
                    ...inputStyle,
                    borderColor: fieldError("first_name") ? tokens.destructive : tokens.border,
                  }}
                  onFocus={(e) => {
                    if (!fieldError("first_name")) e.target.style.borderColor = tokens.foreground;
                  }}
                />
                {fieldError("first_name") && (
                  <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{fieldError("first_name")}</p>
                )}
              </div>
              <div>
                <label htmlFor="last_name" style={labelStyle}>Last Name</label>
                <input
                  id="last_name"
                  type="text"
                  value={data.last_name}
                  onChange={handleChange("last_name")}
                  onBlur={handleBlur("last_name")}
                  placeholder="Last name"
                  style={{
                    ...inputStyle,
                    borderColor: fieldError("last_name") ? tokens.destructive : tokens.border,
                  }}
                  onFocus={(e) => {
                    if (!fieldError("last_name")) e.target.style.borderColor = tokens.foreground;
                  }}
                />
                {fieldError("last_name") && (
                  <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{fieldError("last_name")}</p>
                )}
              </div>
            </div>

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
              />
              {fieldError("email") && (
                <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{fieldError("email")}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" style={labelStyle}>Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={data.phone}
                onChange={handleChange("phone")}
                onBlur={handleBlur("phone")}
                placeholder="+233 (123) 456-7890"
                autoComplete="tel"
                style={{
                  ...inputStyle,
                  borderColor: fieldError("phone") ? tokens.destructive : tokens.border,
                }}
                onFocus={(e) => {
                  if (!fieldError("phone")) e.target.style.borderColor = tokens.foreground;
                }}
              />
              {fieldError("phone") && (
                <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{fieldError("phone")}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  onChange={handleChange("password")}
                  onBlur={handleBlur("password")}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  style={{
                    ...inputStyle,
                    paddingRight: "2.5rem",
                    borderColor: fieldError("password") ? tokens.destructive : tokens.border,
                  }}
                  onFocus={(e) => {
                    if (!fieldError("password")) e.target.style.borderColor = tokens.foreground;
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

              {/* Password strength bar */}
              {data.password.length > 0 && (
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
                  const met = req.test(data.password);
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
              <label htmlFor="password_confirmation" style={labelStyle}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="password_confirmation"
                  type={showConfirm ? "text" : "password"}
                  value={data.password_confirmation}
                  onChange={handleChange("password_confirmation")}
                  onBlur={handleBlur("password_confirmation")}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  style={{
                    ...inputStyle,
                    paddingRight: "2.5rem",
                    borderColor: fieldError("password_confirmation") ? tokens.destructive : tokens.border,
                  }}
                  onFocus={(e) => {
                    if (!fieldError("password_confirmation")) e.target.style.borderColor = tokens.foreground;
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
              {fieldError("password_confirmation") && (
                <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{fieldError("password_confirmation")}</p>
              )}
              {data.password_confirmation && !fieldError("password_confirmation") && (
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
                  onClick={() => {
                    setData('agree_terms', !data.agree_terms);
                    setTermsTouched(true);
                  }}
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "3px",
                    border: data.agree_terms 
                      ? `1px solid ${tokens.foreground}` 
                      : fieldError("agree_terms") 
                        ? `1px solid ${tokens.destructive}` 
                        : `1px solid ${tokens.border}`,
                    backgroundColor: data.agree_terms ? tokens.foreground : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "1px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {data.agree_terms && <IconCheck />}
                </div>
                <span>
                  I agree to the{" "}
                  <a href="/terms" style={{ color: tokens.foreground, textDecoration: "underline" }}>Terms of Service</a>
                  {" "}and{" "}
                  <a href="/privacy" style={{ color: tokens.foreground, textDecoration: "underline" }}>Privacy Policy</a>
                </span>
              </label>
              {fieldError("agree_terms") && (
                <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0 28px" }}>
                  {fieldError("agree_terms")}
                </p>
              )}
            </div>

            {/* Submit */}
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
                opacity: processing ? 0.5 : createBtnHovered ? 0.9 : 1,
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={() => setCreateBtnHovered(true)}
              onMouseLeave={() => setCreateBtnHovered(false)}
            >
              {processing ? "Creating account…" : "Create Account"}
            </button>
          </form>

          {/* Sign in link */}
          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
            Already have an account?{" "}
            <a
              href="/login"
              style={{
                color: tokens.foreground,
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