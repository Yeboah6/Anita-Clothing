import React, { useState, useEffect } from "react";
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
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const mockCurrentCustomer = {
  name: "Sofia Marchetti",
  email: "sofia.m@example.com",
  phone: "+1 (555) 234-5678",
  joined: "September 2025",
  avatar: "SM",
};

const mockCustomerOrders = [
  { id: "ORD-1041", date: "2026-01-28", total: 289, status: "processing", items: [{ name: "Silk Midi Dress", size: "M", color: "Champagne", quantity: 1, price: 289, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80" }] },
  { id: "ORD-0987", date: "2025-12-14", total: 410, status: "shipped", items: [{ name: "Silk Camisole", size: "S", color: "Ivory", quantity: 1, price: 125, image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80" }, { name: "Leather Crossbody Bag", size: "One Size", color: "Tan", quantity: 1, price: 245, image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&q=80" }] },
  { id: "ORD-0921", date: "2025-11-02", total: 495, status: "delivered", items: [{ name: "Cashmere Wrap Coat", size: "M", color: "Camel", quantity: 1, price: 495, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&q=80" }] },
  { id: "ORD-0845", date: "2025-10-18", total: 165, status: "delivered", items: [{ name: "Linen Palazzo Pants", size: "S", color: "Sand", quantity: 1, price: 165, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80" }] },
];

// ─── Get active path from URL ────────────────────────────────────────────────
const getActivePath = () => {
  const path = window.location.pathname;
  if (path === "/account" || path === "/account/") return "/account";
  return path;
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconShoppingBag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const IconHeart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconLogOut = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconShoppingBagHeader = () => (
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

// // ─── Account Sidebar Nav ─────────────────────────────────────────────────────
// const accountNavItems = [
//   { to: "/account", label: "Profile", icon: IconUser, end: true },
//   { to: "/account/orders", label: "Orders", icon: IconShoppingBag },
//   { to: "/account/wishlist", label: "Wishlist", icon: IconHeart },
//   { to: "/account/addresses", label: "Addresses & Payment", icon: IconMapPin },
// ];

// const AccountSidebar = ({ activePath }) => {
//   return (
//     <aside>
//       <nav
//         style={{
//           display: "flex",
//           flexDirection: "row",
//           gap: "0.25rem",
//           overflowX: "auto",
//         }}
//         className="account-sidebar-nav"
//       >
//         {accountNavItems.map((item) => {
//           const Icon = item.icon;
//           const isActive =
//             item.end
//               ? activePath === item.to
//               : activePath.startsWith(item.to);

//           return (
//             <AccountNavLink
//               key={item.to}
//               href={item.to}
//               isActive={isActive}
//             >
//               <Icon />
//               {item.label}
//             </AccountNavLink>
//           );
//         })}
//         <AccountNavLink
//           href="/"
//           isActive={false}
//           style={{ marginTop: "1rem" }}
//         >
//           <IconLogOut />
//           Sign out
//         </AccountNavLink>
//       </nav>

//       <style>{`
//         @media (min-width: 768px) {
//           .account-sidebar-nav {
//             flex-direction: column !important;
//           }
//         }
//       `}</style>
//     </aside>
//   );
// };

const AccountNavLink = ({ href, isActive, children, style: extraStyle }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        fontSize: "0.875rem",
        fontFamily: tokens.fontBody,
        fontWeight: isActive ? 500 : 400,
        textDecoration: "none",
        color: isActive ? tokens.foreground : tokens.mutedForeground,
        backgroundColor: isActive ? tokens.background : hovered ? tokens.background : "transparent",
        borderBottom: "2px solid transparent",
        borderLeft: "2px solid transparent",
        transition: "background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease",
        whiteSpace: "nowrap",
        flexShrink: 0,
        borderBottomColor: isActive ? tokens.foreground : "transparent",
        ...extraStyle,
      }}
      className="account-nav-link"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        {children[0]}
      </span>
      {children[1]}
    </a>
  );
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

// ─── AccountProfile Page ─────────────────────────────────────────────────────
const AccountProfile = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [activePath, setActivePath] = useState("/account");
  const [saveBtnHovered, setSaveBtnHovered] = useState(false);
  const [cancelBtnHovered, setCancelBtnHovered] = useState(false);
  const [updatePwdBtnHovered, setUpdatePwdBtnHovered] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: "Sofia",
    lastName: "Marchetti",
    email: mockCurrentCustomer.email,
    phone: mockCurrentCustomer.phone,
  });

  const [passwordForm, setPasswordForm] = useState({
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

  const totalOrders = mockCustomerOrders.length;
  const totalSpent = mockCustomerOrders.reduce((sum, o) => sum + o.total, 0);

  const handleProfileChange = (field) => (e) => {
    setProfileForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePasswordChange = (field) => (e) => {
    setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log("Profile saved:", profileForm);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    console.log("Password updated");
    setPasswordForm({ current: "", new: "", confirm: "" });
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
                {mockCurrentCustomer.avatar}
              </div>
              <div>
                <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: 0 }}>
                  Welcome back,
                </p>
                <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, margin: "0.25rem 0 0", color: tokens.foreground }}>
                  {mockCurrentCustomer.name}
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
                      {totalOrders}
                    </p>
                  </div>
                  <div style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, padding: "1rem" }}>
                    <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: tokens.mutedForeground, margin: 0 }}>
                      Spent
                    </p>
                    <p style={{ marginTop: "0.5rem", fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, color: tokens.foreground }}>
                      ${totalSpent}
                    </p>
                  </div>
                  <div style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, padding: "1rem" }}>
                    <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: tokens.mutedForeground, margin: 0 }}>
                      Member since
                    </p>
                    <p style={{ marginTop: "0.5rem", fontFamily: tokens.fontDisplay, fontSize: "clamp(1.125rem, 2vw, 1.25rem)", fontWeight: 500, color: tokens.foreground }}>
                      {mockCurrentCustomer.joined}
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
                    <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: "1rem" }}>
                        <div>
                          <label htmlFor="firstName" style={labelStyle}>First Name</label>
                          <input
                            id="firstName" value={profileForm.firstName} onChange={handleProfileChange("firstName")}
                            style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = tokens.foreground)}
                            onBlur={(e) => (e.target.style.borderColor = tokens.border)}
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" style={labelStyle}>Last Name</label>
                          <input
                            id="lastName" value={profileForm.lastName} onChange={handleProfileChange("lastName")}
                            style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = tokens.foreground)}
                            onBlur={(e) => (e.target.style.borderColor = tokens.border)}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="email" style={labelStyle}>Email</label>
                        <input
                          id="email" type="email" value={profileForm.email} onChange={handleProfileChange("email")}
                          style={inputStyle}
                          onFocus={(e) => (e.target.style.borderColor = tokens.foreground)}
                          onBlur={(e) => (e.target.style.borderColor = tokens.border)}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" style={labelStyle}>Phone</label>
                        <input
                          id="phone" type="tel" value={profileForm.phone} onChange={handleProfileChange("phone")}
                          style={inputStyle}
                          onFocus={(e) => (e.target.style.borderColor = tokens.foreground)}
                          onBlur={(e) => (e.target.style.borderColor = tokens.border)}
                        />
                      </div>
                      <hr style={{ margin: "0.5rem 0", border: "none", borderTop: `1px solid ${tokens.border}` }} />
                      <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button
                          type="submit"
                          style={{
                            padding: "0.5rem 1.5rem",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            fontFamily: tokens.fontBody,
                            borderRadius: tokens.radius,
                            border: "none",
                            backgroundColor: tokens.foreground,
                            color: tokens.background,
                            cursor: "pointer",
                            opacity: saveBtnHovered ? 0.9 : 1,
                            transition: "opacity 0.2s ease",
                          }}
                          onMouseEnter={() => setSaveBtnHovered(true)}
                          onMouseLeave={() => setSaveBtnHovered(false)}
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
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
                    <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div>
                        <label htmlFor="current" style={labelStyle}>Current Password</label>
                        <input
                          id="current" type="password" value={passwordForm.current} onChange={handlePasswordChange("current")}
                          style={inputStyle}
                          onFocus={(e) => (e.target.style.borderColor = tokens.foreground)}
                          onBlur={(e) => (e.target.style.borderColor = tokens.border)}
                        />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: "1rem" }}>
                        <div>
                          <label htmlFor="new" style={labelStyle}>New Password</label>
                          <input
                            id="new" type="password" value={passwordForm.new} onChange={handlePasswordChange("new")}
                            style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = tokens.foreground)}
                            onBlur={(e) => (e.target.style.borderColor = tokens.border)}
                          />
                        </div>
                        <div>
                          <label htmlFor="confirm" style={labelStyle}>Confirm Password</label>
                          <input
                            id="confirm" type="password" value={passwordForm.confirm} onChange={handlePasswordChange("confirm")}
                            style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = tokens.foreground)}
                            onBlur={(e) => (e.target.style.borderColor = tokens.border)}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        style={{
                          padding: "0.5rem 1.5rem",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          fontFamily: tokens.fontBody,
                          borderRadius: tokens.radius,
                          border: `1px solid ${tokens.border}`,
                          backgroundColor: updatePwdBtnHovered ? tokens.secondary : "transparent",
                          color: tokens.foreground,
                          cursor: "pointer",
                          transition: "background-color 0.2s ease",
                          alignSelf: "flex-start",
                        }}
                        onMouseEnter={() => setUpdatePwdBtnHovered(true)}
                        onMouseLeave={() => setUpdatePwdBtnHovered(false)}
                      >
                        Update Password
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