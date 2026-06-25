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
  destructive: "#ef4444",
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const mockCurrentCustomer = {
  name: "Sofia Marchetti",
  email: "sofia.m@example.com",
  avatar: "SM",
};

const mockAddresses = [
  {
    id: "ADR-1",
    label: "Home",
    name: "Sofia Marchetti",
    street: "142 Mercer Street, Apt 5B",
    city: "New York",
    state: "NY",
    zip: "10012",
    country: "United States",
    isDefault: true,
  },
  {
    id: "ADR-2",
    label: "Office",
    name: "Sofia Marchetti",
    street: "488 Madison Avenue, Floor 12",
    city: "New York",
    state: "NY",
    zip: "10022",
    country: "United States",
    isDefault: false,
  },
];

const mockPaymentMethods = [
  { id: "PM-1", type: "visa", last4: "4242", expiry: "08/27", isDefault: true },
  { id: "PM-2", type: "mastercard", last4: "8910", expiry: "03/26", isDefault: false },
];

const cardLabel = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
};

// ─── Get active path from URL ────────────────────────────────────────────────
const getActivePath = () => {
  const path = window.location.pathname;
  return path;
};

// ─── Icons ───────────────────────────────────────────────────────────────────
// const IconShoppingBagHeader = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
//     <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
//     <line x1="3" y1="6" x2="21" y2="6" />
//     <path d="M16 10a4 4 0 0 1-8 0" />
//   </svg>
// );

// const IconMenu = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
//     <line x1="3" y1="6" x2="21" y2="6" />
//     <line x1="3" y1="12" x2="21" y2="12" />
//     <line x1="3" y1="18" x2="21" y2="18" />
//   </svg>
// );

// const IconXLarge = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
//     <line x1="18" y1="6" x2="6" y2="18" />
//     <line x1="6" y1="6" x2="18" y2="18" />
//   </svg>
// );

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconPencil = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const IconTrash2 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const IconCreditCard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
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

// ─── AccountAddresses Page ───────────────────────────────────────────────────
const AccountAddresses = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [activePath, setActivePath] = useState("/account/addresses");
  const [addAddressBtnHovered, setAddAddressBtnHovered] = useState(false);
  const [addPaymentBtnHovered, setAddPaymentBtnHovered] = useState(false);

  useEffect(() => {
    injectFonts();
    setActivePath(getActivePath());

    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigate = (url) => {
    window.history.pushState({}, "", url);
    setActivePath(url);
    window.dispatchEvent(new PopStateEvent("popstate"));
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
              <div
                style={{
                  width: "56px", height: "56px", borderRadius: "50%",
                  backgroundColor: tokens.foreground, color: tokens.background,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: tokens.fontDisplay, fontSize: "1.125rem", fontWeight: 600, flexShrink: 0,
                }}
              >
                {mockCurrentCustomer.avatar}
              </div>
              <div>
                <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: 0 }}>Welcome back,</p>
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
            <AccountSidebar
              activePath={activePath}
              onNavigate={handleNavigate}
            />

            {/* Content */}
            <section>
              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.5rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                  Addresses & Payment
                </h2>
                <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
                  Manage your saved shipping addresses and payment methods
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {/* Shipping Addresses Section */}
                <section>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                      Shipping Addresses
                    </h3>
                    <button
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 0.75rem",
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        fontFamily: tokens.fontBody,
                        borderRadius: tokens.radius,
                        border: "none",
                        backgroundColor: tokens.foreground,
                        color: tokens.background,
                        cursor: "pointer",
                        opacity: addAddressBtnHovered ? 0.9 : 1,
                        transition: "opacity 0.2s ease",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={() => setAddAddressBtnHovered(true)}
                      onMouseLeave={() => setAddAddressBtnHovered(false)}
                    >
                      <IconPlus />
                      Add Address
                    </button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
                      gap: "1rem",
                    }}
                  >
                    {mockAddresses.map((addr) => {
                      const [editHovered, setEditHovered] = useState(false);
                      const [deleteHovered, setDeleteHovered] = useState(false);

                      return (
                        <div
                          key={addr.id}
                          style={{
                            backgroundColor: tokens.background,
                            border: `1px solid ${tokens.border}`,
                            borderRadius: tokens.radius,
                            padding: "1.5rem",
                          }}
                        >
                          {/* Header row */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "0.75rem",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <p style={{ fontWeight: 500, color: tokens.foreground, margin: 0, fontSize: "0.875rem" }}>
                                {addr.label}
                              </p>
                              {addr.isDefault && (
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "0.125rem 0.5rem",
                                    borderRadius: "9999px",
                                    fontSize: "0.6875rem",
                                    fontWeight: 500,
                                    backgroundColor: tokens.secondary,
                                    color: tokens.foreground,
                                    border: `1px solid ${tokens.border}`,
                                  }}
                                >
                                  Default
                                </span>
                              )}
                            </div>
                            <div style={{ display: "flex", gap: "0.25rem" }}>
                              <button
                                aria-label="Edit address"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: tokens.radius,
                                  border: "none",
                                  background: editHovered ? tokens.secondary : "transparent",
                                  cursor: "pointer",
                                  color: tokens.foreground,
                                  transition: "background-color 0.15s ease",
                                }}
                                onMouseEnter={() => setEditHovered(true)}
                                onMouseLeave={() => setEditHovered(false)}
                              >
                                <IconPencil />
                              </button>
                              <button
                                aria-label="Delete address"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: tokens.radius,
                                  border: "none",
                                  background: deleteHovered ? "#fee2e2" : "transparent",
                                  cursor: "pointer",
                                  color: deleteHovered ? tokens.destructive : tokens.foreground,
                                  transition: "background-color 0.15s ease, color 0.15s ease",
                                }}
                                onMouseEnter={() => setDeleteHovered(true)}
                                onMouseLeave={() => setDeleteHovered(false)}
                              >
                                <IconTrash2 />
                              </button>
                            </div>
                          </div>

                          {/* Address details */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
                            <p style={{ color: tokens.foreground, margin: 0 }}>{addr.name}</p>
                            <p style={{ margin: 0 }}>{addr.street}</p>
                            <p style={{ margin: 0 }}>
                              {addr.city}, {addr.state} {addr.zip}
                            </p>
                            <p style={{ margin: 0 }}>{addr.country}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Payment Methods Section */}
                <section>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                      Payment Methods
                    </h3>
                    <button
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 0.75rem",
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        fontFamily: tokens.fontBody,
                        borderRadius: tokens.radius,
                        border: "none",
                        backgroundColor: tokens.foreground,
                        color: tokens.background,
                        cursor: "pointer",
                        opacity: addPaymentBtnHovered ? 0.9 : 1,
                        transition: "opacity 0.2s ease",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={() => setAddPaymentBtnHovered(true)}
                      onMouseLeave={() => setAddPaymentBtnHovered(false)}
                    >
                      <IconPlus />
                      Add Payment
                    </button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
                      gap: "1rem",
                    }}
                  >
                    {mockPaymentMethods.map((pm) => {
                      const [setDefaultHovered, setSetDefaultHovered] = useState(false);
                      const [removeHovered, setRemoveHovered] = useState(false);

                      return (
                        <div
                          key={pm.id}
                          style={{
                            backgroundColor: tokens.background,
                            border: `1px solid ${tokens.border}`,
                            borderRadius: tokens.radius,
                            padding: "1.5rem",
                          }}
                        >
                          {/* Card header */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "0.75rem",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <div
                                style={{
                                  width: "48px",
                                  height: "36px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: tokens.radius,
                                  backgroundColor: tokens.foreground,
                                  color: tokens.background,
                                }}
                              >
                                <IconCreditCard />
                              </div>
                              <div>
                                <p style={{ fontWeight: 500, color: tokens.foreground, margin: 0, fontSize: "0.875rem" }}>
                                  {cardLabel[pm.type]}
                                </p>
                                <p style={{ fontSize: "0.75rem", color: tokens.mutedForeground, margin: "2px 0 0" }}>
                                  Expires {pm.expiry}
                                </p>
                              </div>
                            </div>
                            {pm.isDefault && (
                              <span
                                style={{
                                  display: "inline-block",
                                  padding: "0.125rem 0.5rem",
                                  borderRadius: "9999px",
                                  fontSize: "0.6875rem",
                                  fontWeight: 500,
                                  backgroundColor: tokens.secondary,
                                  color: tokens.foreground,
                                  border: `1px solid ${tokens.border}`,
                                }}
                              >
                                Default
                              </span>
                            )}
                          </div>

                          {/* Card number */}
                          <p
                            style={{
                              fontFamily: "monospace",
                              fontSize: "0.875rem",
                              color: tokens.mutedForeground,
                              margin: "0 0 1rem",
                            }}
                          >
                            •••• •••• •••• {pm.last4}
                          </p>

                          {/* Actions */}
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            {!pm.isDefault && (
                              <button
                                style={{
                                  padding: "0.375rem 0.75rem",
                                  fontSize: "0.8125rem",
                                  fontWeight: 500,
                                  fontFamily: tokens.fontBody,
                                  borderRadius: tokens.radius,
                                  border: `1px solid ${tokens.border}`,
                                  backgroundColor: setDefaultHovered ? tokens.secondary : "transparent",
                                  color: tokens.foreground,
                                  cursor: "pointer",
                                  transition: "background-color 0.2s ease",
                                  whiteSpace: "nowrap",
                                }}
                                onMouseEnter={() => setSetDefaultHovered(true)}
                                onMouseLeave={() => setSetDefaultHovered(false)}
                              >
                                Set as default
                              </button>
                            )}
                            <button
                              style={{
                                padding: "0.375rem 0.75rem",
                                fontSize: "0.8125rem",
                                fontWeight: 500,
                                fontFamily: tokens.fontBody,
                                borderRadius: tokens.radius,
                                border: "none",
                                backgroundColor: removeHovered ? tokens.secondary : "transparent",
                                color: tokens.foreground,
                                cursor: "pointer",
                                transition: "background-color 0.2s ease",
                                whiteSpace: "nowrap",
                              }}
                              onMouseEnter={() => setRemoveHovered(true)}
                              onMouseLeave={() => setRemoveHovered(false)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountAddresses;