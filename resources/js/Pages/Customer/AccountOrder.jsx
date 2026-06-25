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
  green: "#16a34a",
  blue: "#2563eb",
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const mockCurrentCustomer = {
  name: "Sofia Marchetti",
  email: "sofia.m@example.com",
  avatar: "SM",
};

const mockCustomerOrders = [
  {
    id: "ORD-1041",
    date: "2026-01-28",
    total: 289,
    status: "processing",
    items: [
      { name: "Silk Midi Dress", size: "M", color: "Champagne", quantity: 1, price: 289, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80" },
    ],
  },
  {
    id: "ORD-0987",
    date: "2025-12-14",
    total: 410,
    status: "shipped",
    tracking: "1Z999AA10123456784",
    items: [
      { name: "Silk Camisole", size: "S", color: "Ivory", quantity: 1, price: 125, image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=200&q=80" },
      { name: "Leather Crossbody Bag", size: "One Size", color: "Tan", quantity: 1, price: 245, image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=200&q=80" },
    ],
  },
  {
    id: "ORD-0921",
    date: "2025-11-02",
    total: 495,
    status: "delivered",
    items: [
      { name: "Cashmere Wrap Coat", size: "M", color: "Camel", quantity: 1, price: 495, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200&q=80" },
    ],
  },
  {
    id: "ORD-0845",
    date: "2025-10-18",
    total: 165,
    status: "delivered",
    items: [
      { name: "Linen Palazzo Pants", size: "S", color: "Sand", quantity: 1, price: 165, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&q=80" },
    ],
  },
];

// ─── Status config ───────────────────────────────────────────────────────────
const statusConfig = {
  processing: {
    label: "Processing",
    style: { backgroundColor: tokens.secondary, color: tokens.foreground, border: `1px solid ${tokens.border}` },
  },
  shipped: {
    label: "Shipped",
    style: { backgroundColor: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd" },
  },
  delivered: {
    label: "Delivered",
    style: { backgroundColor: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" },
  },
};

// ─── Get active path from URL ────────────────────────────────────────────────
const getActivePath = () => {
  const path = window.location.pathname;
  if (path === "/account/orders" || path === "/account/orders/") return "/account/orders";
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

const IconPackage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m16.5 9.4-9-5.19" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconTruck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 3h15v13H1z" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const IconCheckCircle2 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
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

// ─── Status icon map ─────────────────────────────────────────────────────────
const statusIcons = {
  processing: IconPackage,
  shipped: IconTruck,
  delivered: IconCheckCircle2,
};

// ─── AccountOrders Page ──────────────────────────────────────────────────────
const AccountOrders = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [activePath, setActivePath] = useState("/account/orders");

  useEffect(() => {
    injectFonts();
    setActivePath(getActivePath());

    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            <AccountSidebar activePath={activePath} />

            {/* Content */}
            <section>
              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.5rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                  Order History
                </h2>
                <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
                  Track and review your previous orders
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {mockCustomerOrders.map((order) => {
                  const config = statusConfig[order.status];
                  const StatusIcon = statusIcons[order.status];
                  const [trackBtnHovered, setTrackBtnHovered] = useState(false);
                  const [buyAgainBtnHovered, setBuyAgainBtnHovered] = useState(false);
                  const [reviewBtnHovered, setReviewBtnHovered] = useState(false);

                  return (
                    <div
                      key={order.id}
                      style={{
                        backgroundColor: tokens.background,
                        border: `1px solid ${tokens.border}`,
                        borderRadius: tokens.radius,
                        overflow: "hidden",
                      }}
                    >
                      {/* Order header */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: isDesktop ? "row" : "column",
                          alignItems: isDesktop ? "center" : "flex-start",
                          justifyContent: "space-between",
                          gap: "0.75rem",
                          padding: "1.5rem",
                          borderBottom: `1px solid ${tokens.border}`,
                          backgroundColor: tokens.secondary,
                        }}
                      >
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.5rem" }}>
                          <div>
                            <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: tokens.mutedForeground, margin: 0 }}>
                              Order
                            </p>
                            <p style={{ fontWeight: 500, color: tokens.foreground, margin: "2px 0 0" }}>{order.id}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: tokens.mutedForeground, margin: 0 }}>
                              Date
                            </p>
                            <p style={{ fontWeight: 500, color: tokens.foreground, margin: "2px 0 0" }}>{order.date}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: tokens.mutedForeground, margin: 0 }}>
                              Total
                            </p>
                            <p style={{ fontWeight: 500, color: tokens.foreground, margin: "2px 0 0" }}>${order.total}</p>
                          </div>
                        </div>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.375rem",
                            padding: "0.125rem 0.625rem",
                            borderRadius: "9999px",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            ...config.style,
                          }}
                        >
                          <StatusIcon />
                          {config.label}
                        </span>
                      </div>

                      {/* Items */}
                      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: "flex", gap: "1rem" }}>
                            <div
                              style={{
                                width: isDesktop ? "80px" : "64px",
                                flexShrink: 0,
                                overflow: "hidden",
                                backgroundColor: tokens.secondary,
                                borderRadius: tokens.radius,
                              }}
                            >
                              <div style={{ paddingBottom: "133.33%", position: "relative" }}>
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  style={{
                                    position: "absolute",
                                    inset: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                            </div>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                              <div>
                                <p style={{ fontWeight: 500, color: tokens.foreground, margin: 0, fontSize: "0.875rem" }}>
                                  {item.name}
                                </p>
                                <p style={{ fontSize: "0.8125rem", color: tokens.mutedForeground, margin: "4px 0 0" }}>
                                  {item.color} / {item.size} / Qty {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p style={{ fontWeight: 500, color: tokens.foreground, margin: 0, fontSize: "0.875rem", alignSelf: "center" }}>
                              ${item.price}
                            </p>
                          </div>
                        ))}

                        {/* Tracking */}
                        {order.tracking && (
                          <>
                            <hr style={{ margin: 0, border: "none", borderTop: `1px solid ${tokens.border}` }} />
                            <div
                              style={{
                                display: "flex",
                                flexDirection: isDesktop ? "row" : "column",
                                alignItems: isDesktop ? "center" : "flex-start",
                                justifyContent: "space-between",
                                gap: "0.5rem",
                              }}
                            >
                              <p style={{ fontSize: "0.875rem", margin: 0, color: tokens.foreground }}>
                                <span style={{ color: tokens.mutedForeground }}>Tracking: </span>
                                <span style={{ fontFamily: "monospace", fontSize: "0.8125rem" }}>{order.tracking}</span>
                              </p>
                              <button
                                style={{
                                  padding: "0.375rem 0.75rem",
                                  fontSize: "0.8125rem",
                                  fontWeight: 500,
                                  fontFamily: tokens.fontBody,
                                  borderRadius: tokens.radius,
                                  border: `1px solid ${tokens.border}`,
                                  backgroundColor: trackBtnHovered ? tokens.secondary : "transparent",
                                  color: tokens.foreground,
                                  cursor: "pointer",
                                  transition: "background-color 0.2s ease",
                                  whiteSpace: "nowrap",
                                }}
                                onMouseEnter={() => setTrackBtnHovered(true)}
                                onMouseLeave={() => setTrackBtnHovered(false)}
                              >
                                Track Package
                              </button>
                            </div>
                          </>
                        )}

                        {/* Delivered actions */}
                        {order.status === "delivered" && (
                          <>
                            <hr style={{ margin: 0, border: "none", borderTop: `1px solid ${tokens.border}` }} />
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <button
                                style={{
                                  padding: "0.375rem 0.75rem",
                                  fontSize: "0.8125rem",
                                  fontWeight: 500,
                                  fontFamily: tokens.fontBody,
                                  borderRadius: tokens.radius,
                                  border: `1px solid ${tokens.border}`,
                                  backgroundColor: buyAgainBtnHovered ? tokens.secondary : "transparent",
                                  color: tokens.foreground,
                                  cursor: "pointer",
                                  transition: "background-color 0.2s ease",
                                }}
                                onMouseEnter={() => setBuyAgainBtnHovered(true)}
                                onMouseLeave={() => setBuyAgainBtnHovered(false)}
                              >
                                Buy Again
                              </button>
                              <button
                                style={{
                                  padding: "0.375rem 0.75rem",
                                  fontSize: "0.8125rem",
                                  fontWeight: 500,
                                  fontFamily: tokens.fontBody,
                                  borderRadius: tokens.radius,
                                  border: "none",
                                  backgroundColor: reviewBtnHovered ? tokens.secondary : "transparent",
                                  color: tokens.foreground,
                                  cursor: "pointer",
                                  transition: "background-color 0.2s ease",
                                }}
                                onMouseEnter={() => setReviewBtnHovered(true)}
                                onMouseLeave={() => setReviewBtnHovered(false)}
                              >
                                Leave Review
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountOrders;