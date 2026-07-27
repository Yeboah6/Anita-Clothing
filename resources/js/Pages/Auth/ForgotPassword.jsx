import React, { useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
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
const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
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

// ─── Forgot Password Page ────────────────────────────────────────────────────
const ForgotPassword = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [sendBtnHovered, setSendBtnHovered] = useState(false);
  const [backHovered, setBackHovered] = useState(false);
  const [resendBtnHovered, setResendBtnHovered] = useState(false);
  const [tryAnotherBtnHovered, setTryAnotherBtnHovered] = useState(false);

  // Tracks whether we've shown the success screen for the current submission.
  // Needed because Inertia's `wasSuccessful` stays true across re-renders
  // (e.g. after a resend), so we drive the view off local state instead,
  // set only inside onSuccess.
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const { data, setData, post, processing, errors, clearErrors } = useForm({
    email: "",
  });

  const { status } = usePage().props;

  useEffect(() => {
    injectFonts();

    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    post("/forgot-password", {
      preserveScroll: true,
      onSuccess: () => {
        setSubmittedEmail(data.email);
        setIsSubmitted(true);
      },
    });
  };

  const handleResend = () => {
    post("/forgot-password", {
      preserveScroll: true,
      data: { email: submittedEmail },
    });
  };

  const handleTryAnother = () => {
    setIsSubmitted(false);
    setSubmittedEmail("");
    setData("email", "");
    clearErrors();
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
              Check your email
            </h1>
            <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: 0, lineHeight: 1.6 }}>
              We've sent a password reset link to <strong style={{ color: tokens.foreground }}>{submittedEmail}</strong>.
              Please check your inbox and follow the instructions.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "2rem" }}>
              <button
                onClick={handleResend}
                disabled={processing}
                style={{
                  width: "100%",
                  height: "44px",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  fontFamily: tokens.fontBody,
                  borderRadius: tokens.radius,
                  border: "none",
                  backgroundColor: tokens.foreground,
                  color: tokens.background,
                  cursor: processing ? "not-allowed" : "pointer",
                  opacity: processing ? 0.7 : resendBtnHovered ? 0.9 : 1,
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={() => setResendBtnHovered(true)}
                onMouseLeave={() => setResendBtnHovered(false)}
              >
                {processing ? "Sending..." : "Resend email"}
              </button>
              <button
                onClick={handleTryAnother}
                style={{
                  width: "100%",
                  height: "44px",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  fontFamily: tokens.fontBody,
                  borderRadius: tokens.radius,
                  border: `1px solid ${tokens.border}`,
                  backgroundColor: tryAnotherBtnHovered ? tokens.secondary : "transparent",
                  color: tokens.foreground,
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={() => setTryAnotherBtnHovered(true)}
                onMouseLeave={() => setTryAnotherBtnHovered(false)}
              >
                Try another email
              </button>
            </div>

            <p style={{ marginTop: "1.5rem", fontSize: "0.8125rem", color: tokens.mutedForeground }}>
              Didn't receive the email? Check your spam folder or{" "}
              <a href="/contact" style={{ color: tokens.foreground, textDecoration: "underline" }}>contact support</a>.
            </p>
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
              <IconMail />
            </div>
            <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.75rem)", fontWeight: 500, margin: "0 0 0.5rem", color: tokens.foreground }}>
              Forgot your password?
            </h1>
            <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: 0, lineHeight: 1.6 }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Flash status from the server (e.g. rate-limit throttle message) */}
          {status && (
            <p style={{ fontSize: "0.8125rem", color: tokens.foreground, backgroundColor: tokens.secondary, padding: "0.75rem 1rem", borderRadius: tokens.radius, marginBottom: "1rem", lineHeight: 1.5 }}>
              {status}
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
                onChange={(e) => setData("email", e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
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
                opacity: processing ? 0.7 : sendBtnHovered ? 0.9 : 1,
                transition: "opacity 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
              onMouseEnter={() => setSendBtnHovered(true)}
              onMouseLeave={() => setSendBtnHovered(false)}
            >
              {processing ? (
                <>
                  <IconLoader />
                  Sending...
                </>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>

          {/* Help text */}
          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.8125rem", color: tokens.mutedForeground, lineHeight: 1.6 }}>
            Remember your password?{" "}
            <a href="/login" style={{ color: tokens.foreground, fontWeight: 500, textDecoration: "underline", textUnderlineOffset: "2px" }}>
              Sign in
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;