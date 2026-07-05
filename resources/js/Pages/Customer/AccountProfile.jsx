import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import AccountSidebar from '@/Components/Customer/AccountSidebar';
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
  green: "#16a34a",
};

// ─── Get active path from URL ────────────────────────────────────────────────
const getActivePath = () => {
  const path = window.location.pathname;
  if (path === "/account" || path === "/account/") return "/account";
  return path;
};

// ─── Form Input Styles ───────────────────────────────────────────────────────
const inputStyle = {
  height: "40px",
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

const errorTextStyle = {
  fontSize: "0.75rem",
  color: tokens.destructive,
  margin: "4px 0 0",
};

const successBannerStyle = {
  padding: "0.75rem 1rem",
  borderRadius: tokens.radius,
  backgroundColor: "#f0fdf4",
  border: "1px solid #bbf7d0",
  color: "#166534",
  fontSize: "0.8125rem",
  fontWeight: 500,
};

// ─── AccountProfile Page ─────────────────────────────────────────────────────
// Expects Inertia props:
//   currentCustomer: { name, email, phone, joined, avatar }
//   profileForm:     { firstName, lastName, email, phone }
//   stats:           { totalOrders, totalSpent }
const AccountProfile = ({ currentCustomer, profileForm: initialProfile, stats }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [activePath, setActivePath] = useState("/account");
  const [saveBtnHovered, setSaveBtnHovered] = useState(false);
  const [cancelBtnHovered, setCancelBtnHovered] = useState(false);
  const [updatePwdBtnHovered, setUpdatePwdBtnHovered] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const profile = useForm({
    _method: "put",
    firstName: initialProfile.firstName ?? "",
    lastName: initialProfile.lastName ?? "",
    email: initialProfile.email ?? "",
    phone: initialProfile.phone ?? "",
  });

  const password = useForm({
    _method: "put",
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    injectFonts();
    setActivePath(getActivePath());

    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Clear success banners a few seconds after they appear
  useEffect(() => {
    if (!profileSuccess) return;
    const t = setTimeout(() => setProfileSuccess(false), 4000);
    return () => clearTimeout(t);
  }, [profileSuccess]);

  useEffect(() => {
    if (!passwordSuccess) return;
    const t = setTimeout(() => setPasswordSuccess(false), 4000);
    return () => clearTimeout(t);
  }, [passwordSuccess]);

  const handleProfileChange = (field) => (e) => {
    profile.setData(field, e.target.value);
  };

  const handlePasswordChange = (field) => (e) => {
    password.setData(field, e.target.value);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    profile.post("/account/profile", {
      preserveScroll: true,
      onSuccess: () => setProfileSuccess(true),
    });
  };

  const handleProfileCancel = () => {
    profile.reset();
    profile.clearErrors();
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (password.data.new !== password.data.confirm) {
      password.setError("confirm", "Passwords do not match.");
      return;
    }

    password.post("/account/password", {
      preserveScroll: true,
      onSuccess: () => {
        password.reset();
        setPasswordSuccess(true);
      },
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
      <Header />

      <main style={{ flex: 1, backgroundColor: "rgba(245,245,245,0.6)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1rem" }}>
          {/* Page header */}
          <div
            style={{
              display: "flex",
              flexDirection: isDesktop ? "row" : "column",
              alignItems: isDesktop ? "center" : "flex-start",
              justifyContent: "space-between",
              gap: "1rem",
              marginBottom: "2rem",
              paddingBottom: "2rem",
              borderBottom: `1px solid ${tokens.border}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {/* Avatar */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: tokens.foreground,
                  color: tokens.background,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: tokens.fontDisplay,
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {currentCustomer.avatar}
              </div>
              <div>
                <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: 0 }}>
                  Welcome back,
                </p>
                <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, margin: "0.25rem 0 0", color: tokens.foreground }}>
                  {currentCustomer.name}
                </h1>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isDesktop ? "220px 1fr" : "1fr",
              gap: isDesktop ? "3rem" : "2rem",
            }}
          >
            {/* Sidebar */}
            <AccountSidebar activePath={activePath} />

            {/* Content */}
            <section>
              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.5rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                  Profile
                </h2>
                <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
                  Manage your personal information and preferences
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Quick stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                  <div style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, padding: "1rem" }}>
                    <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: tokens.mutedForeground, margin: 0 }}>
                      Orders
                    </p>
                    <p style={{ marginTop: "0.5rem", fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, color: tokens.foreground }}>
                      {stats.totalOrders}
                    </p>
                  </div>
                  <div style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, padding: "1rem" }}>
                    <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: tokens.mutedForeground, margin: 0 }}>
                      Spent
                    </p>
                    <p style={{ marginTop: "0.5rem", fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, color: tokens.foreground }}>
                      ${stats.totalSpent.toLocaleString()}
                    </p>
                  </div>
                  <div style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, padding: "1rem" }}>
                    <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: tokens.mutedForeground, margin: 0 }}>
                      Member since
                    </p>
                    <p style={{ marginTop: "0.5rem", fontFamily: tokens.fontDisplay, fontSize: "clamp(1.125rem, 2vw, 1.25rem)", fontWeight: 500, color: tokens.foreground }}>
                      {currentCustomer.joined}
                    </p>
                  </div>
                </div>

                {/* Personal Information */}
                <div style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, overflow: "hidden" }}>
                  <div style={{ padding: "1.5rem", borderBottom: `1px solid ${tokens.border}` }}>
                    <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                      Personal Information
                    </h3>
                  </div>
                  <div style={{ padding: "1.5rem" }}>
                    {profileSuccess && (
                      <div style={{ ...successBannerStyle, marginBottom: "1rem" }}>
                        Profile updated successfully.
                      </div>
                    )}
                    <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: "1rem" }}>
                        <div>
                          <label htmlFor="firstName" style={labelStyle}>First Name</label>
                          <input
                            id="firstName"
                            value={profile.data.firstName}
                            onChange={handleProfileChange("firstName")}
                            style={{ ...inputStyle, borderColor: profile.errors.firstName ? tokens.destructive : tokens.border }}
                            onFocus={(e) => { if (!profile.errors.firstName) e.target.style.borderColor = tokens.foreground; }}
                            onBlur={(e) => (e.target.style.borderColor = profile.errors.firstName ? tokens.destructive : tokens.border)}
                          />
                          {profile.errors.firstName && <p style={errorTextStyle}>{profile.errors.firstName}</p>}
                        </div>
                        <div>
                          <label htmlFor="lastName" style={labelStyle}>Last Name</label>
                          <input
                            id="lastName"
                            value={profile.data.lastName}
                            onChange={handleProfileChange("lastName")}
                            style={{ ...inputStyle, borderColor: profile.errors.lastName ? tokens.destructive : tokens.border }}
                            onFocus={(e) => { if (!profile.errors.lastName) e.target.style.borderColor = tokens.foreground; }}
                            onBlur={(e) => (e.target.style.borderColor = profile.errors.lastName ? tokens.destructive : tokens.border)}
                          />
                          {profile.errors.lastName && <p style={errorTextStyle}>{profile.errors.lastName}</p>}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="email" style={labelStyle}>Email</label>
                        <input
                          id="email"
                          type="email"
                          value={profile.data.email}
                          onChange={handleProfileChange("email")}
                          style={{ ...inputStyle, borderColor: profile.errors.email ? tokens.destructive : tokens.border }}
                          onFocus={(e) => { if (!profile.errors.email) e.target.style.borderColor = tokens.foreground; }}
                          onBlur={(e) => (e.target.style.borderColor = profile.errors.email ? tokens.destructive : tokens.border)}
                        />
                        {profile.errors.email && <p style={errorTextStyle}>{profile.errors.email}</p>}
                      </div>
                      <div>
                        <label htmlFor="phone" style={labelStyle}>Phone</label>
                        <input
                          id="phone"
                          type="tel"
                          value={profile.data.phone}
                          onChange={handleProfileChange("phone")}
                          style={{ ...inputStyle, borderColor: profile.errors.phone ? tokens.destructive : tokens.border }}
                          onFocus={(e) => { if (!profile.errors.phone) e.target.style.borderColor = tokens.foreground; }}
                          onBlur={(e) => (e.target.style.borderColor = profile.errors.phone ? tokens.destructive : tokens.border)}
                        />
                        {profile.errors.phone && <p style={errorTextStyle}>{profile.errors.phone}</p>}
                      </div>
                      <hr style={{ margin: "0.5rem 0", border: "none", borderTop: `1px solid ${tokens.border}` }} />
                      <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button
                          type="submit"
                          disabled={profile.processing}
                          style={{
                            padding: "0.5rem 1.5rem",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            fontFamily: tokens.fontBody,
                            borderRadius: tokens.radius,
                            border: "none",
                            backgroundColor: tokens.foreground,
                            color: tokens.background,
                            cursor: profile.processing ? "not-allowed" : "pointer",
                            opacity: profile.processing ? 0.7 : saveBtnHovered ? 0.9 : 1,
                            transition: "opacity 0.2s ease",
                          }}
                          onMouseEnter={() => setSaveBtnHovered(true)}
                          onMouseLeave={() => setSaveBtnHovered(false)}
                        >
                          {profile.processing ? "Saving…" : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          onClick={handleProfileCancel}
                          style={{
                            padding: "0.5rem 1.5rem",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            fontFamily: tokens.fontBody,
                            borderRadius: tokens.radius,
                            border: `1px solid ${tokens.border}`,
                            backgroundColor: cancelBtnHovered ? tokens.secondary : "transparent",
                            color: tokens.foreground,
                            cursor: "pointer",
                            transition: "background-color 0.2s ease",
                          }}
                          onMouseEnter={() => setCancelBtnHovered(true)}
                          onMouseLeave={() => setCancelBtnHovered(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Password */}
                <div style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, overflow: "hidden" }}>
                  <div style={{ padding: "1.5rem", borderBottom: `1px solid ${tokens.border}` }}>
                    <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                      Password
                    </h3>
                  </div>
                  <div style={{ padding: "1.5rem" }}>
                    {passwordSuccess && (
                      <div style={{ ...successBannerStyle, marginBottom: "1rem" }}>
                        Password updated successfully.
                      </div>
                    )}
                    <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div>
                        <label htmlFor="current" style={labelStyle}>Current Password</label>
                        <input
                          id="current"
                          type="password"
                          value={password.data.current}
                          onChange={handlePasswordChange("current")}
                          style={{ ...inputStyle, borderColor: password.errors.current ? tokens.destructive : tokens.border }}
                          onFocus={(e) => { if (!password.errors.current) e.target.style.borderColor = tokens.foreground; }}
                          onBlur={(e) => (e.target.style.borderColor = password.errors.current ? tokens.destructive : tokens.border)}
                        />
                        {password.errors.current && <p style={errorTextStyle}>{password.errors.current}</p>}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: "1rem" }}>
                        <div>
                          <label htmlFor="new" style={labelStyle}>New Password</label>
                          <input
                            id="new"
                            type="password"
                            value={password.data.new}
                            onChange={handlePasswordChange("new")}
                            style={{ ...inputStyle, borderColor: password.errors.new ? tokens.destructive : tokens.border }}
                            onFocus={(e) => { if (!password.errors.new) e.target.style.borderColor = tokens.foreground; }}
                            onBlur={(e) => (e.target.style.borderColor = password.errors.new ? tokens.destructive : tokens.border)}
                          />
                          {password.errors.new && <p style={errorTextStyle}>{password.errors.new}</p>}
                        </div>
                        <div>
                          <label htmlFor="confirm" style={labelStyle}>Confirm Password</label>
                          <input
                            id="confirm"
                            type="password"
                            value={password.data.confirm}
                            onChange={handlePasswordChange("confirm")}
                            style={{ ...inputStyle, borderColor: password.errors.confirm ? tokens.destructive : tokens.border }}
                            onFocus={(e) => { if (!password.errors.confirm) e.target.style.borderColor = tokens.foreground; }}
                            onBlur={(e) => (e.target.style.borderColor = password.errors.confirm ? tokens.destructive : tokens.border)}
                          />
                          {password.errors.confirm && <p style={errorTextStyle}>{password.errors.confirm}</p>}
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={password.processing}
                        style={{
                          padding: "0.5rem 1.5rem",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          fontFamily: tokens.fontBody,
                          borderRadius: tokens.radius,
                          border: `1px solid ${tokens.border}`,
                          backgroundColor: updatePwdBtnHovered ? tokens.secondary : "transparent",
                          color: tokens.foreground,
                          cursor: password.processing ? "not-allowed" : "pointer",
                          opacity: password.processing ? 0.7 : 1,
                          transition: "background-color 0.2s ease",
                          alignSelf: "flex-start",
                        }}
                        onMouseEnter={() => setUpdatePwdBtnHovered(true)}
                        onMouseLeave={() => setUpdatePwdBtnHovered(false)}
                      >
                        {password.processing ? "Updating…" : "Update Password"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountProfile;