import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
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

// ─── Mock Data (payment methods only — no backend table for these yet) ───────
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
const getActivePath = () => window.location.pathname;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("");
};

// ─── Icons ───────────────────────────────────────────────────────────────────
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

const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ─── Single address card (isolated so hover state doesn't re-render siblings) ─
const AddressCard = ({ addr, onDelete, deletingId }) => {
  const [editHovered, setEditHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);
  const isDeleting = deletingId === addr.id;

  return (
    <div
      style={{
        backgroundColor: tokens.background,
        border: `1px solid ${tokens.border}`,
        borderRadius: tokens.radius,
        padding: "1.5rem",
        opacity: isDeleting ? 0.5 : 1,
        transition: "opacity 0.2s ease",
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
            {addr.label || "Address"}
          </p>
          {addr.is_default && (
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
          <a
            href={`/account/addresses/${addr.id}/edit`}
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
              textDecoration: "none",
            }}
            onMouseEnter={() => setEditHovered(true)}
            onMouseLeave={() => setEditHovered(false)}
          >
            <IconPencil />
          </a>
          <button
            type="button"
            aria-label="Delete address"
            disabled={isDeleting}
            onClick={() => onDelete(addr)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: tokens.radius,
              border: "none",
              background: deleteHovered ? "#fee2e2" : "transparent",
              cursor: isDeleting ? "default" : "pointer",
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
        <p style={{ color: tokens.foreground, margin: 0 }}>
          {[addr.first_name, addr.last_name].filter(Boolean).join(" ")}
        </p>
        <p style={{ margin: 0 }}>
          {addr.address}{addr.apartment ? `, ${addr.apartment}` : ""}
        </p>
        <p style={{ margin: 0 }}>
          {addr.city}, {addr.state} {addr.zip}
        </p>
        <p style={{ margin: 0 }}>{addr.country}</p>
        {addr.phone && <p style={{ margin: "0.25rem 0 0" }}>{addr.phone}</p>}
      </div>
    </div>
  );
};

// ─── AccountAddresses Page ───────────────────────────────────────────────────
const AccountAddresses = ({ addresses = [], user }) => {
  const { auth } = usePage().props;
  const currentUser = user ?? auth?.user ?? null;

  const [isDesktop, setIsDesktop] = useState(false);
  const [activePath, setActivePath] = useState("/account/addresses");
  const [addAddressBtnHovered, setAddAddressBtnHovered] = useState(false);
  const [addPaymentBtnHovered, setAddPaymentBtnHovered] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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

  const handleDeleteAddress = (addr) => {
    const label = addr.label || "this address";
    if (!window.confirm(`Remove ${label}? This can't be undone.`)) return;

    setDeletingId(addr.id);
    router.delete(`/account/addresses/${addr.id}`, {
      preserveScroll: true,
      onFinish: () => setDeletingId(null),
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
              <div
                style={{
                  width: "56px", height: "56px", borderRadius: "50%",
                  backgroundColor: tokens.foreground, color: tokens.background,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: tokens.fontDisplay, fontSize: "1.125rem", fontWeight: 600, flexShrink: 0,
                }}
              >
                {getInitials(currentUser?.name)}
              </div>
              <div>
                <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: 0 }}>Welcome back,</p>
                <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, margin: "0.25rem 0 0", color: tokens.foreground }}>
                  {currentUser?.name || ""}
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
                  Addresses
                </h2>
                <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
                  Manage your saved delivery addresses
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {/* Delivery Addresses Section */}
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
                      Delivery Addresses
                    </h3>
                    <a
                      href="/account/addresses/add"
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
                        backgroundColor: "#f6aab2",
                        color: tokens.background,
                        cursor: "pointer",
                        opacity: addAddressBtnHovered ? 0.9 : 1,
                        transition: "opacity 0.2s ease",
                        whiteSpace: "nowrap",
                        textDecoration: "none",
                      }}
                      onMouseEnter={() => setAddAddressBtnHovered(true)}
                      onMouseLeave={() => setAddAddressBtnHovered(false)}
                    >
                      <IconPlus />
                      Add Address
                    </a>
                  </div>

                  {addresses.length === 0 ? (
                    <div
                      style={{
                        backgroundColor: tokens.background,
                        border: `1px dashed ${tokens.border}`,
                        borderRadius: tokens.radius,
                        padding: "3rem 1.5rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: "0.75rem",
                        color: tokens.mutedForeground,
                      }}
                    >
                      <div style={{ color: tokens.mutedForeground }}>
                        <IconMapPin />
                      </div>
                      <p style={{ margin: 0, fontSize: "0.875rem", color: tokens.foreground, fontWeight: 500 }}>
                        No saved addresses yet
                      </p>
                      <p style={{ margin: 0, fontSize: "0.8125rem", maxWidth: "320px" }}>
                        Add a delivery address to speed through checkout next time.
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
                        gap: "1rem",
                      }}
                    >
                      {addresses.map((addr) => (
                        <AddressCard
                          key={addr.id}
                          addr={addr}
                          onDelete={handleDeleteAddress}
                          deletingId={deletingId}
                        />
                      ))}
                    </div>
                  )}
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