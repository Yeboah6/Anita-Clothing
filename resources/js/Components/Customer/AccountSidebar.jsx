// ─── AccountSidebar.jsx ──────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import { Link, useForm } from "@inertiajs/react";

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
const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconShoppingBag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const IconHeart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconLogOut = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ─── Navigation items ────────────────────────────────────────────────────────
const accountNavItems = [
  { to: "/account/profile", label: "Profile", icon: IconUser, end: true },
  { to: "/account/orders", label: "Orders", icon: IconShoppingBag },
  { to: "/account/wishlist", label: "Wishlist", icon: IconHeart },
  { to: "/account/addresses", label: "Addresses", icon: IconMapPin },
];

// ─── NavLink Component ───────────────────────────────────────────────────────
const AccountNavLink = ({ href, isActive, icon: Icon, label, isMobile }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      preserveScroll
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: isMobile ? "0.625rem 0.875rem" : "0.75rem 1rem",
        fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)",
        fontFamily: tokens.fontBody,
        fontWeight: isActive ? 500 : 400,
        textDecoration: "none",
        color: isActive ? tokens.foreground : tokens.mutedForeground,
        backgroundColor: isActive ? tokens.secondary : hovered ? tokens.secondary : "transparent",
        borderBottom: isMobile ? "2px solid transparent" : "none",
        borderLeft: isMobile ? "none" : "2px solid transparent",
        borderBottomColor: isMobile && isActive ? tokens.foreground : "transparent",
        borderLeftColor: !isMobile && isActive ? "#f6aab2" : "transparent",
        borderRadius: tokens.radius,
        transition: "background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
      className="account-sidebar-link"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-current={isActive ? "page" : undefined}
    >
      <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <Icon />
      </span>
      {!isMobile && <span className="account-sidebar-label">{label}</span>}
    </Link>
  );
};

// ─── LogoutButton Component ──────────────────────────────────────────────────
const LogoutButton = ({ isMobile }) => {
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
        width: isMobile ? "auto" : "100%",
        padding: isMobile ? "0.625rem 0.875rem" : "0.75rem 1rem",
        fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)",
        fontFamily: tokens.fontBody,
        fontWeight: 400,
        textDecoration: "none",
        color: hovered ? tokens.destructive : tokens.mutedForeground,
        backgroundColor: hovered ? tokens.secondary : "transparent",
        border: "none",
        borderLeft: isMobile ? "none" : "2px solid transparent",
        borderRadius: tokens.radius,
        cursor: processing ? "not-allowed" : "pointer",
        whiteSpace: "nowrap",
        flexShrink: 0,
        opacity: processing ? 0.5 : 1,
        transition: "background-color 0.15s ease, color 0.15s ease",
        marginTop: isMobile ? "0" : "1rem",
      }}
      className="account-sidebar-link account-sidebar-signout"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <IconLogOut />
      </span>
      {!isMobile && (
        <span className="account-sidebar-label">
          {processing ? "Signing out…" : "Sign out"}
        </span>
      )}
    </button>
  );
};

// ─── MobileDropdown Component ────────────────────────────────────────────────
const MobileDropdown = ({ activePath, showSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeItem = accountNavItems.find(item => {
    if (item.end) {
      return activePath === item.to || activePath === item.to + "/";
    }
    return activePath.startsWith(item.to);
  });

  const currentLabel = activeItem ? activeItem.label : "Account";

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "0.75rem 1rem",
          backgroundColor: tokens.background,
          border: `1px solid ${tokens.border}`,
          borderRadius: tokens.radius,
          fontSize: "0.875rem",
          fontFamily: tokens.fontBody,
          color: tokens.foreground,
          cursor: "pointer",
          transition: "border-color 0.15s ease",
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          {activeItem && <activeItem.icon />}
          <span style={{ fontWeight: 500 }}>{currentLabel}</span>
        </span>
        <span style={{ 
          display: "flex", 
          alignItems: "center",
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
        }}>
          <IconChevronDown />
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "0.25rem",
            backgroundColor: tokens.background,
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          {accountNavItems.map((item) => {
            const isActive = item.end 
              ? activePath === item.to || activePath === item.to + "/"
              : activePath.startsWith(item.to);
            
            return (
              <Link
                key={item.to}
                href={item.to}
                preserveScroll
                onClick={() => setIsOpen(false)}
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
                  backgroundColor: isActive ? tokens.secondary : "transparent",
                  borderLeft: isActive ? `3px solid ${tokens.foreground}` : "3px solid transparent",
                  transition: "background-color 0.15s ease",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <item.icon />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
          
          {showSignOut && (
            <>
              <div style={{ height: "1px", backgroundColor: tokens.border, margin: "0.25rem 0" }} />
              <LogoutButton isMobile={false} />
            </>
          )}
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
          }}
        />
      )}
    </div>
  );
};

// ─── AccountSidebar Component ────────────────────────────────────────────────
const AccountSidebar = ({
  activePath = "/account",
  showSignOut = true,
  className = "",
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const checkIsActive = (item) => {
    if (item.end) {
      return activePath === item.to || activePath === item.to + "/";
    }
    return activePath.startsWith(item.to);
  };

  // Render dropdown on mobile
  if (isMobile) {
    return (
      <aside className={className}>
        <MobileDropdown activePath={activePath} showSignOut={showSignOut} />
      </aside>
    );
  }

  // Render tablet view (compact horizontal with labels)
  if (isTablet) {
    return (
      <aside className={className}>
        <nav
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "0.25rem",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            padding: "0.25rem 0",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="account-sidebar-nav"
        >
          {accountNavItems.map((item) => (
            <AccountNavLink
              key={item.to}
              href={item.to}
              isActive={checkIsActive(item)}
              icon={item.icon}
              label={item.label}
              isMobile={false}
            />
          ))}
          {showSignOut && <LogoutButton isMobile={false} />}
        </nav>
        <style>{`
          .account-sidebar-nav::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </aside>
    );
  }

  // Render desktop view (vertical sidebar)
  return (
    <aside className={className}>
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          padding: "0",
        }}
        className="account-sidebar-nav"
      >
        {accountNavItems.map((item) => (
          <AccountNavLink
            key={item.to}
            href={item.to}
            isActive={checkIsActive(item)}
            icon={item.icon}
            label={item.label}
            isMobile={false}
          />
        ))}
        {showSignOut && <LogoutButton isMobile={false} />}
      </nav>
      <style>{`
        .account-sidebar-link {
          border-left: 2px solid transparent;
          border-bottom: none;
        }
        .account-sidebar-link[aria-current="page"] {
          border-left-color: ${tokens.foreground};
        }
        .account-sidebar-signout {
          margin-top: 1.5rem;
        }
      `}</style>
    </aside>
  );
};

export default AccountSidebar;