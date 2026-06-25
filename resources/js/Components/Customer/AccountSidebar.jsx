// ─── AccountSidebar.jsx ──────────────────────────────────────────────────────
import React, { useState } from "react";

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

// ─── Navigation items ────────────────────────────────────────────────────────
const accountNavItems = [
  { to: "/account/profile", label: "Profile", icon: IconUser, end: true },
  { to: "/account/orders", label: "Orders", icon: IconShoppingBag },
  { to: "/account/wishlist", label: "Wishlist", icon: IconHeart },
  { to: "/account/addresses", label: "Addresses & Payment", icon: IconMapPin },
];

// ─── NavLink Component ───────────────────────────────────────────────────────
const AccountNavLink = ({ href, isActive, icon: Icon, label, onClick }) => {
  const [hovered, setHovered] = useState(false);

  const handleClick = (e) => {
    if (onClick) {
      // e.preventDefault();
      onClick(href);
    }
    // If no onClick, browser navigates naturally via href
  };

  return (
    <a
      href={href}
      onClick={handleClick}
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
        borderBottomColor: isActive ? tokens.foreground : "transparent",
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
      {label}
    </a>
  );
};

// ─── AccountSidebar Component ────────────────────────────────────────────────
const AccountSidebar = ({
  activePath = "/account",
  onNavigate,
  showSignOut = true,
  signOutHref = "/",
  className = "",
}) => {
  const checkIsActive = (item) => {
    if (item.end) {
      return activePath === item.to || activePath === item.to + "/";
    }
    return activePath.startsWith(item.to);
  };

  return (
    <aside className={className}>
      <nav
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "0.25rem",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
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
            onClick={onNavigate}
          />
        ))}

        {showSignOut && (
          <a
            href={signOutHref}
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate(signOutHref);
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
              fontFamily: tokens.fontBody,
              textDecoration: "none",
              color: tokens.mutedForeground,
              whiteSpace: "nowrap",
              flexShrink: 0,
              borderBottom: "2px solid transparent",
              borderLeft: "2px solid transparent",
              transition: "color 0.15s ease",
              marginTop: 0,
            }}
            className="account-sidebar-link account-sidebar-signout"
            onMouseEnter={(e) => (e.currentTarget.style.color = tokens.foreground)}
            onMouseLeave={(e) => (e.currentTarget.style.color = tokens.mutedForeground)}
          >
            <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <IconLogOut />
            </span>
            Sign out
          </a>
        )}
      </nav>

      {/* Responsive styles */}
      <style>{`
        /* Mobile: horizontal scroll */
        .account-sidebar-nav {
          display: flex;
          flex-direction: row;
          gap: 0.25rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .account-sidebar-nav::-webkit-scrollbar {
          display: none;
        }
        .account-sidebar-link {
          border-bottom: 2px solid transparent;
          border-left: 2px solid transparent;
        }
        
        /* Desktop: vertical sidebar */
        @media (min-width: 768px) {
          .account-sidebar-nav {
            flex-direction: column !important;
            overflow-x: visible;
          }
          .account-sidebar-link {
            border-bottom: none !important;
            border-left: 2px solid transparent;
          }
          /* Move active indicator from bottom to left */
          .account-sidebar-link[style*="border-bottom-color: rgb(20, 20, 20)"] {
            border-bottom-color: transparent !important;
            border-left-color: rgb(20, 20, 20) !important;
          }
          /* Add margin-top to sign out on desktop */
          .account-sidebar-signout {
            margin-top: 1rem !important;
          }
        }
      `}</style>
    </aside>
  );
};

export default AccountSidebar;