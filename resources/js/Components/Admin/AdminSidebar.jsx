// ─── AdminSidebar.jsx ────────────────────────────────────────────────────────
import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

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
  sidebarBg: "#fafafa",
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconLayoutDashboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const IconBox = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m16.5 9.4-9-5.19" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconShoppingBag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconLogOut = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconCedi = () => (
  <span
    style={{
      fontSize: "16px",
      fontWeight: "bold",
      lineHeight: 1,
      color: "#f6aab2",
    }}
  >
    ₵
  </span>
);

const IconStar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// ─── Navigation items ────────────────────────────────────────────────────────
const navItems = [
  { title: "Overview", url: "/admin", icon: IconLayoutDashboard },
  { title: "Products", url: "/admin/products", icon: IconBox },
  { title: "Orders", url: "/admin/orders", icon: IconShoppingBag },
  {title: "Payments", url: "/admin/payments", icon: IconCedi},
  { title: "Customers", url: "/admin/customers", icon: IconUsers },
  { title: "Reviews", url: "/admin/reviews", icon: IconStar },
  { title: "Settings", url: "/admin/settings", icon: IconStar },
];

// ─── NavLink Component ───────────────────────────────────────────────────────
const NavLink = ({ item, isActive, collapsed, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  const handleClick = (e) => {
    if (onClick) {
      onClick(item.url);
    }
  };

  return (
    <a
      href={item.url}
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.625rem 0.75rem",
        borderRadius: tokens.radius,
        textDecoration: "none",
        fontSize: "0.875rem",
        fontWeight: 500,
        fontFamily: tokens.fontBody,
        color: isActive ? tokens.foreground : tokens.mutedForeground,
        backgroundColor: isActive ? tokens.border : hovered ? tokens.secondary : "transparent",
        transition: "background-color 0.15s ease, color 0.15s ease",
        whiteSpace: "nowrap",
        marginBottom: "0.125rem",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-current={isActive ? "page" : undefined}
    >
      <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <Icon />
      </span>
      {!collapsed && <span>{item.title}</span>}
    </a>
  );
};

// ─── LogoutButton Component ──────────────────────────────────────────────────
const LogoutButton = () => {
  const { post, processing } = useForm();
  const [hovered, setHovered] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    post('/logout');
  };

  return (
    <button
      onClick={handleLogout}
      disabled={processing}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        width: "100%",
        padding: "0.75rem 1rem",
        fontSize: "0.875rem",
        fontFamily: tokens.fontBody,
        fontWeight: 400,
        textDecoration: "none",
        color: hovered ? tokens.destructive : tokens.mutedForeground,
        backgroundColor: hovered ? tokens.secondary : "transparent",
        border: "none",
        borderLeft: "2px solid transparent",
        borderRadius: tokens.radius,
        cursor: processing ? "not-allowed" : "pointer",
        whiteSpace: "nowrap",
        flexShrink: 0,
        opacity: processing ? 0.5 : 1,
        transition: "background-color 0.15s ease, color 0.15s ease",
        marginTop: "1rem",
      }}
      className="account-sidebar-link account-sidebar-signout"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <IconLogOut />
      </span>
      <span className="account-sidebar-label">
        {processing ? "Signing out…" : "Sign out"}
      </span>
    </button>
  );
};

// ─── AdminSidebar Component ──────────────────────────────────────────────────
const AdminSidebar = ({
  collapsed = false,
  isMobile = false,
  isOpen = true,
  showSignOut = true,
  onNavigate,
  activeUrl = "/admin",
}) => {
  const sidebarWidth = collapsed ? 64 : 240;

  const sidebarStyle = isMobile
    ? {
        position: "fixed",
        top: 0,
        left: isOpen ? 0 : -sidebarWidth,
        bottom: 0,
        zIndex: 50,
        width: sidebarWidth,
        backgroundColor: tokens.sidebarBg,
        borderRight: `1px solid ${tokens.border}`,
        display: "flex",
        flexDirection: "column",
        transition: "left 0.3s ease, width 0.3s ease",
        overflow: "hidden",
      }
    : {
        width: sidebarWidth,
        minWidth: sidebarWidth,
        backgroundColor: tokens.sidebarBg,
        borderRight: `1px solid ${tokens.border}`,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease, min-width 0.3s ease",
        overflow: "hidden",
        height: "100vh",
        position: "sticky",
        top: 0,
      };

  const handleNavigate = (url) => {
    if (onNavigate) {
      onNavigate(url);
    }
  };

  return (
    <aside style={sidebarStyle}>
      {/* Sidebar Header */}
      <div
        style={{
          padding: "1.25rem 1rem",
          borderBottom: `1px solid ${tokens.border}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <a
          href="/admin"
          onClick={(e) => {
            if (onNavigate) {
              e.preventDefault();
              onNavigate("/admin");
            }
          }}
          style={{
            textDecoration: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            color: tokens.foreground,
          }}
        >
        <img
          src="/images/logo.png"
          alt="CuteBloom Logo"
          style={{
            width: "80px",
            height: "80px",
            objectFit: "contain",
          }}
        />
      </a>
      </div>

      {/* Sidebar Navigation */}
      <nav style={{ flex: 1, padding: "0.75rem" }}>
        {/* Section label */}
        {!collapsed && (
          <p
            style={{
              fontSize: "0.6875rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: tokens.mutedForeground,
              padding: "0.5rem 0.75rem",
              margin: "0 0 0.25rem",
              fontFamily: tokens.fontBody,
              fontWeight: 500,
            }}
          >
            Manage
          </p>
        )}

        {/* Navigation links */}
        {navItems.map((item) => {
          const isActive =
            activeUrl === item.url ||
            (item.url !== "/admin" && activeUrl.startsWith(item.url));

          return (
            <NavLink
              key={item.title}
              item={item}
              isActive={isActive}
              collapsed={collapsed}
              onClick={handleNavigate}
            />
          );
        })}
        {showSignOut && <LogoutButton />} 
      </nav>

      {/* Sidebar Footer */}
      <div style={{ padding: "0.75rem", borderTop: `1px solid ${tokens.border}` }}>
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.625rem 0.75rem",
            borderRadius: tokens.radius,
            textDecoration: "none",
            fontSize: "0.875rem",
            fontFamily: tokens.fontBody,
            color: tokens.mutedForeground,
            whiteSpace: "nowrap",
            transition: "background-color 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = tokens.secondary)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <IconArrowLeft />
          </span>
          {!collapsed && <span>Back to store</span>}
        </a>
      </div>
    </aside>
  );
};

export default AdminSidebar;