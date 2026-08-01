import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import AdminSidebar from "@/Components/Admin/AdminSidebar";

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
  accent: "#ff6bb3",
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconBell = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const IconChevronLeft = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconLoader = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ animation: "anita-spin 0.8s linear infinite" }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconStore = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 7h20l-2 5H4L2 7Z" /><path d="M4 12v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8" /><path d="M9 21v-5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5" />
  </svg>
);
const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

// ─── Shared styles ────────────────────────────────────────────────────────────
const cardStyle = { backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius };
const cardHeaderStyle = { padding: "1.25rem 1.5rem", borderBottom: `1px solid ${tokens.border}` };
const cardTitleStyle = { fontFamily: tokens.fontDisplay, fontSize: "1.125rem", fontWeight: 500, margin: 0, color: tokens.foreground };
const cardSubtitleStyle = { margin: "0.25rem 0 0", fontSize: "0.8125rem", color: tokens.mutedForeground };
const labelStyle = { fontSize: "0.875rem", fontWeight: 500, fontFamily: tokens.fontBody, color: tokens.foreground, marginBottom: "0.5rem", display: "block" };
const inputStyle = { height: "40px", width: "100%", padding: "0 0.75rem", fontSize: "0.875rem", fontFamily: tokens.fontBody, backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, color: tokens.foreground, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s ease" };
const textareaStyle = { ...inputStyle, height: "auto", padding: "0.75rem", minHeight: "80px", resize: "vertical" };
const errorTextStyle = { fontSize: "0.75rem", color: tokens.destructive, margin: "0.375rem 0 0" };

const SaveButton = ({ processing, onClick, label = "Save Changes" }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={processing}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, fontFamily: tokens.fontBody, borderRadius: tokens.radius, border: "none", backgroundColor: "#f6aab2", color: tokens.background, cursor: processing ? "not-allowed" : "pointer", opacity: processing ? 0.7 : hovered ? 0.9 : 1, transition: "opacity 0.2s ease" }}
    >
      {processing && <IconLoader />}
      {processing ? "Saving…" : label}
    </button>
  );
};

const SavedBadge = ({ show }) => {
  if (!show) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: tokens.green, fontWeight: 500 }}>
      <IconCheck /> Saved
    </span>
  );
};

const CustomSelect = ({ value, onChange, options, placeholder, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);
  const selectRef = React.useRef(null);
  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} style={{ position: "relative", ...style }}>
      <button type="button" onClick={() => setIsOpen((prev) => !prev)}
        style={{ width: "100%", height: "40px", padding: "0 2rem 0 0.75rem", fontSize: "0.875rem", fontFamily: tokens.fontBody, backgroundColor: tokens.background, border: `1px solid ${isOpen ? tokens.foreground : tokens.border}`, borderRadius: tokens.radius, color: value ? tokens.foreground : tokens.mutedForeground, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "border-color 0.2s ease", outline: "none", whiteSpace: "nowrap", textAlign: "left" }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", flex: 1, minWidth: 0 }}>{displayText}</span>
        <span style={{ display: "flex", alignItems: "center", marginLeft: "0.5rem", flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}><IconChevronDown /></span>
      </button>
      {isOpen && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50, backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", overflow: "hidden" }}>
          {options.map((option) => {
            const isSelected = option.value === value;
            const isHovered = hoveredOption === option.value;
            return (
              <button key={option.value} type="button" onClick={() => { onChange(option.value); setIsOpen(false); }}
                onMouseEnter={() => setHoveredOption(option.value)} onMouseLeave={() => setHoveredOption(null)}
                style={{ width: "100%", padding: "0.625rem 0.75rem", fontSize: "0.875rem", fontFamily: tokens.fontBody, backgroundColor: isSelected || isHovered ? tokens.secondary : "transparent", border: "none", cursor: "pointer", textAlign: "left", color: tokens.foreground, fontWeight: isSelected ? 500 : 400, display: "block" }}>
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const currencyOptions = [
  { value: "GHS", label: "GHS — Ghanaian Cedi" },
  { value: "USD", label: "USD — US Dollar" },
  { value: "NGN", label: "NGN — Nigerian Naira" },
];

const tabs = [
  { key: "general", label: "General", icon: IconStore },
  { key: "account", label: "Admin Account", icon: IconUser },
];

// ─── Settings Index Page ────────────────────────────────────────────────────
const Index = ({ settings = {}, admin = {} }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState("/admin/settings");
  const [activeTab, setActiveTab] = useState("general");
  const [savedFlags, setSavedFlags] = useState({});

  useEffect(() => {
    injectFonts();
    const styleId = "anita-spin-keyframes";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = "@keyframes anita-spin { to { transform: rotate(360deg); } }";
      document.head.appendChild(style);
    }
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) { setSidebarCollapsed(true); setMobileSidebarOpen(false); } else { setSidebarCollapsed(false); }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigate = (url) => { setActiveUrl(url); if (isMobile) setMobileSidebarOpen(false); };

  const flashSaved = (key) => {
    setSavedFlags((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setSavedFlags((prev) => ({ ...prev, [key]: false })), 2500);
  };

  // ── General store settings ────────────────────────────────────────────────
  const generalForm = useForm({
    store_name: settings.store_name ?? "",
    support_email: settings.support_email ?? "",
    support_phone: settings.support_phone ?? "",
    store_address: settings.store_address ?? "",
    currency: settings.currency ?? "GHS",
  });

  const handleGeneralSubmit = (e) => {
    e.preventDefault();
    generalForm.patch("/admin/settings/general", {
      preserveScroll: true,
      onSuccess: () => flashSaved("general"),
    });
  };

  // ── Admin account ───────────────────────────────────────────────────────
  const accountForm = useForm({
    first_name: admin.first_name ?? "",
    last_name: admin.last_name ?? "",
    email: admin.email ?? "",
  });

  const handleAccountSubmit = (e) => {
    e.preventDefault();
    accountForm.patch("/admin/settings/account", {
      preserveScroll: true,
      onSuccess: () => flashSaved("account"),
    });
  };

  const passwordForm = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    passwordForm.put("/admin/settings/password", {
      preserveScroll: true,
      onSuccess: () => { flashSaved("password"); passwordForm.reset(); },
    });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: tokens.fontBody, backgroundColor: "rgba(245,245,245,0.6)" }}>
      {mobileSidebarOpen && isMobile && (
        <div onClick={() => setMobileSidebarOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40, backgroundColor: "rgba(0,0,0,0.5)", cursor: "pointer" }} />
      )}
      <AdminSidebar collapsed={sidebarCollapsed} isMobile={isMobile} isOpen={mobileSidebarOpen} onNavigate={handleNavigate} activeUrl={activeUrl} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header style={{ position: "sticky", top: 0, zIndex: 30, height: "64px", display: "flex", alignItems: "center", gap: "1rem", borderBottom: `1px solid ${tokens.border}`, backgroundColor: tokens.background, padding: "0 1rem" }}>
          <button
            onClick={() => { if (isMobile) { setMobileSidebarOpen(!mobileSidebarOpen); } else { setSidebarCollapsed(!sidebarCollapsed); } }}
            aria-label="Toggle sidebar"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: tokens.radius, border: "none", background: "transparent", cursor: "pointer", color: tokens.foreground, transition: "background-color 0.15s ease", flexShrink: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = tokens.secondary)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {isMobile ? <IconMenu /> : <IconChevronLeft style={{ transform: sidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }} />}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "auto" }}>
            {/* <button aria-label="Notifications" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: tokens.radius, border: "none", background: "transparent", cursor: "pointer", color: tokens.mutedForeground, transition: "background-color 0.15s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = tokens.secondary)} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
              <IconBell />
            </button> */}
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#f6aab2", color: tokens.background, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 600, fontFamily: tokens.fontBody }}>CB</div>
          </div>
        </header>

        {/* Page heading */}
        <div style={{ borderBottom: `1px solid ${tokens.border}`, backgroundColor: tokens.background, padding: "1.5rem" }}>
          <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>
            Settings
          </h1>
          <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
            Manage your store configuration and admin account.
          </p>
        </div>

        {/* Content */}
        <main style={{ flex: 1, padding: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "220px 1fr", gap: "1.5rem", alignItems: "start" }}>
            {/* Tab nav */}
            <nav style={{ display: "flex", flexDirection: isMobile ? "row" : "column", gap: "0.25rem", overflowX: isMobile ? "auto" : "visible", ...cardStyle, padding: "0.5rem" }}>
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.625rem 0.75rem", borderRadius: tokens.radius, border: "none",
                      backgroundColor: isActive ? tokens.secondary : "transparent", color: isActive ? tokens.foreground : tokens.mutedForeground,
                      fontSize: "0.8125rem", fontWeight: isActive ? 500 : 400, fontFamily: tokens.fontBody, cursor: "pointer", textAlign: "left",
                      whiteSpace: "nowrap", transition: "background-color 0.15s ease",
                    }}
                  >
                    <TabIcon /> {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Tab content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* ── General ────────────────────────────────────────────────── */}
              {activeTab === "general" && (
                <form onSubmit={handleGeneralSubmit} style={cardStyle}>
                  <div style={cardHeaderStyle}>
                    <h3 style={cardTitleStyle}>Store Information</h3>
                    <p style={cardSubtitleStyle}>Basic details shown to customers and used in emails.</p>
                  </div>
                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label htmlFor="store_name" style={labelStyle}>Store Name</label>
                      <input id="store_name" type="text" value={generalForm.data.store_name} onChange={(e) => generalForm.setData("store_name", e.target.value)}
                        style={inputStyle} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                      {generalForm.errors.store_name && <p style={errorTextStyle}>{generalForm.errors.store_name}</p>}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0.75rem" }}>
                      <div>
                        <label htmlFor="support_email" style={labelStyle}>Support Email</label>
                        <input id="support_email" type="email" value={generalForm.data.support_email} onChange={(e) => generalForm.setData("support_email", e.target.value)}
                          style={inputStyle} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                        {generalForm.errors.support_email && <p style={errorTextStyle}>{generalForm.errors.support_email}</p>}
                      </div>
                      <div>
                        <label htmlFor="support_phone" style={labelStyle}>Support Phone</label>
                        <input id="support_phone" type="text" value={generalForm.data.support_phone} onChange={(e) => generalForm.setData("support_phone", e.target.value)}
                          style={inputStyle} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="store_address" style={labelStyle}>Store Address</label>
                      <textarea id="store_address" value={generalForm.data.store_address} onChange={(e) => generalForm.setData("store_address", e.target.value)}
                        style={textareaStyle} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Currency</label>
                      <CustomSelect value={generalForm.data.currency} onChange={(val) => generalForm.setData("currency", val)} options={currencyOptions} placeholder="Select currency" style={{ maxWidth: "280px" }} />
                    </div>
                  </div>
                  <div style={{ padding: "1rem 1.5rem", borderTop: `1px solid ${tokens.border}`, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "1rem" }}>
                    <SavedBadge show={savedFlags.general} />
                    <SaveButton processing={generalForm.processing} />
                  </div>
                </form>
              )}

              {/* ── Admin Account ──────────────────────────────────────────── */}
              {activeTab === "account" && (
                <>
                  <form onSubmit={handleAccountSubmit} style={cardStyle}>
                    <div style={cardHeaderStyle}>
                      <h3 style={cardTitleStyle}>Profile</h3>
                      <p style={cardSubtitleStyle}>Your admin account details.</p>
                    </div>
                    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0.75rem" }}>
                        <div>
                          <label htmlFor="first_name" style={labelStyle}>First Name</label>
                          <input id="first_name" type="text" value={accountForm.data.first_name} onChange={(e) => accountForm.setData("first_name", e.target.value)}
                            style={inputStyle} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                        </div>
                        <div>
                          <label htmlFor="last_name" style={labelStyle}>Last Name</label>
                          <input id="last_name" type="text" value={accountForm.data.last_name} onChange={(e) => accountForm.setData("last_name", e.target.value)}
                            style={inputStyle} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="admin_email" style={labelStyle}>Email</label>
                        <input id="admin_email" type="email" value={accountForm.data.email} onChange={(e) => accountForm.setData("email", e.target.value)}
                          style={inputStyle} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                        {accountForm.errors.email && <p style={errorTextStyle}>{accountForm.errors.email}</p>}
                      </div>
                    </div>
                    <div style={{ padding: "1rem 1.5rem", borderTop: `1px solid ${tokens.border}`, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "1rem" }}>
                      <SavedBadge show={savedFlags.account} />
                      <SaveButton processing={accountForm.processing} />
                    </div>
                  </form>

                  <form onSubmit={handlePasswordSubmit} style={cardStyle}>
                    <div style={cardHeaderStyle}>
                      <h3 style={cardTitleStyle}>Change Password</h3>
                      <p style={cardSubtitleStyle}>Choose a strong password you're not using elsewhere.</p>
                    </div>
                    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div>
                        <label htmlFor="current_password" style={labelStyle}>Current Password</label>
                        <input id="current_password" type="password" value={passwordForm.data.current_password} onChange={(e) => passwordForm.setData("current_password", e.target.value)}
                          style={inputStyle} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                        {passwordForm.errors.current_password && <p style={errorTextStyle}>{passwordForm.errors.current_password}</p>}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0.75rem" }}>
                        <div>
                          <label htmlFor="new_password" style={labelStyle}>New Password</label>
                          <input id="new_password" type="password" value={passwordForm.data.password} onChange={(e) => passwordForm.setData("password", e.target.value)}
                            style={inputStyle} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                          {passwordForm.errors.password && <p style={errorTextStyle}>{passwordForm.errors.password}</p>}
                        </div>
                        <div>
                          <label htmlFor="password_confirmation" style={labelStyle}>Confirm New Password</label>
                          <input id="password_confirmation" type="password" value={passwordForm.data.password_confirmation} onChange={(e) => passwordForm.setData("password_confirmation", e.target.value)}
                            style={inputStyle} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: "1rem 1.5rem", borderTop: `1px solid ${tokens.border}`, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "1rem" }}>
                      <SavedBadge show={savedFlags.password} />
                      <SaveButton processing={passwordForm.processing} label="Update Password" />
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;