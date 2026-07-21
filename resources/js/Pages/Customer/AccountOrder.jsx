import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
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

// ─── Status config ───────────────────────────────────────────────────────────
const statusConfig = {
  pending: {
    label: "Pending",
    style: { backgroundColor: tokens.secondary, color: tokens.mutedForeground, border: `1px solid ${tokens.border}` },
  },
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
  cancelled: {
    label: "Cancelled",
    style: { backgroundColor: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca" },
  },
};

// ─── Get active path from URL ────────────────────────────────────────────────
const getActivePath = () => {
  const path = window.location.pathname;
  if (path === "/account/orders" || path === "/account/orders/") return "/account/orders";
  return path;
};

// ─── Icons ───────────────────────────────────────────────────────────────────
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

const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconXCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

// ─── Status icon map ─────────────────────────────────────────────────────────
const statusIcons = {
  pending: IconClock,
  processing: IconPackage,
  shipped: IconTruck,
  delivered: IconCheckCircle2,
  cancelled: IconXCircle,
};

// ─── OrderCard ────────────────────────────────────────────────────────────────
// Extracted so each order's hover state lives in its own component instance —
// hooks can't safely live inside .map() on the parent, since the number of
// hook calls would change whenever the order list changes.
const OrderCard = ({ order, isDesktop }) => {
  const [trackBtnHovered, setTrackBtnHovered] = useState(false);
  const [buyAgainBtnHovered, setBuyAgainBtnHovered] = useState(false);
  const [reviewBtnHovered, setReviewBtnHovered] = useState(false);

  const config = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = statusIcons[order.status] || IconClock;

  return (
    <div
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
            <p style={{ fontWeight: 500, color: tokens.foreground, margin: "2px 0 0" }}>${Number(order.total).toFixed(2)}</p>
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
                {item.image ? (
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
                ) : (
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: tokens.mutedForeground,
                    fontSize: "0.625rem",
                  }}>
                    No image
                  </div>
                )}
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontWeight: 500, color: tokens.foreground, margin: 0, fontSize: "0.875rem" }}>
                  {item.name}
                </p>
                <p style={{ fontSize: "0.8125rem", color: tokens.mutedForeground, margin: "4px 0 0" }}>
                  {[item.color, item.size].filter(Boolean).join(" / ")}{item.color || item.size ? " / " : ""}Qty {item.quantity}
                </p>
              </div>
            </div>
            <p style={{ fontWeight: 500, color: tokens.foreground, margin: 0, fontSize: "0.875rem", alignSelf: "center" }}>
              ${Number(item.price).toFixed(2)}
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
};

// ─── AccountOrders Page ──────────────────────────────────────────────────────
const AccountOrders = ({ orders = [] }) => {
  const { props } = usePage();
  const user = props?.auth?.user ?? null;

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

  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ") || user.name || "there"
    : "there";

  const avatarInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
                {avatarInitials || "?"}
              </div>
              <div>
                <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: 0 }}>Welcome back,</p>
                <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, margin: "0.25rem 0 0", color: tokens.foreground }}>
                  {displayName}
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

              {orders.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "3rem 1.5rem",
                    backgroundColor: tokens.background,
                    border: `1px solid ${tokens.border}`,
                    borderRadius: tokens.radius,
                    color: tokens.mutedForeground,
                    fontSize: "0.875rem",
                  }}
                >
                  You haven't placed any orders yet.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {orders.map((order) => (
                    <OrderCard key={order.id} order={order} isDesktop={isDesktop} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountOrders;