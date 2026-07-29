import React, { useState, useEffect } from "react";
import AdminSidebar from "@/Components/Admin/AdminSidebar";
import { usePage, Link, router } from "@inertiajs/react";

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

// ─── Design tokens (matches AdminCustomers.jsx / EditCustomer.jsx) ──────────
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
  orange: "#f59e0b",
  red: "#dc2626",
  blue: "#1565c0",
};

const getInitials = (name) =>
  (name || "")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconBell = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconBan = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);

const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconPackage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16.5 9.4 7.55 4.24" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" y1="22" x2="12" y2="12" />
  </svg>
);

const IconHeart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconEye = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// ─── Status badge helpers ─────────────────────────────────────────────────
const getStatusStyle = (status) => {
  if (status === "active") {
    return { backgroundColor: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" };
  }
  if (status === "suspended") {
    return { backgroundColor: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca" };
  }
  return { backgroundColor: "transparent", color: tokens.mutedForeground, border: `1px solid ${tokens.border}` };
};

const getOrderStatusStyle = (status) => {
  const map = {
    delivered: { backgroundColor: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" },
    completed: { backgroundColor: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" },
    shipped: { backgroundColor: "#e0f2fe", color: "#075985", border: "1px solid #bae6fd" },
    processing: { backgroundColor: "#fef9c3", color: "#854d0e", border: "1px solid #fef08a" },
    pending: { backgroundColor: "#fef9c3", color: "#854d0e", border: "1px solid #fef08a" },
    cancelled: { backgroundColor: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca" },
    refunded: { backgroundColor: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca" },
  };
  return map[status] || { backgroundColor: "transparent", color: tokens.mutedForeground, border: `1px solid ${tokens.border}` };
};

// ─── Small stat card ─────────────────────────────────────────────────────
const StatCard = ({ label, value, icon }) => (
  <div style={{ padding: "1rem", backgroundColor: tokens.secondary, borderRadius: tokens.radius }}>
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
      {icon && <span style={{ color: tokens.mutedForeground, display: "flex" }}>{icon}</span>}
      <p style={{ fontSize: "0.75rem", color: tokens.mutedForeground, margin: 0 }}>{label}</p>
    </div>
    <p style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0, color: tokens.foreground }}>{value}</p>
  </div>
);

// ─── AdminShowCustomer Page ──────────────────────────────────────────────
const AdminShowCustomer = () => {
  const { customer = {}, orders = [], addresses = [], wishlist = [] } = usePage().props;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeUrl] = useState("/admin/customers");
  const [activeTab, setActiveTab] = useState("orders");
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const [suspending, setSuspending] = useState(false);

  useEffect(() => {
    injectFonts();

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
        setMobileSidebarOpen(false);
      } else {
        setSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleEmailCustomer = () => {
    if (customer?.email) window.location.href = `mailto:${customer.email}`;
  };

  const handleSuspend = () => {
    setSuspending(true);
    router.delete(`/admin/customers/${customer.id}`, {
      preserveScroll: true,
      onFinish: () => {
        setSuspending(false);
        setShowSuspendConfirm(false);
      },
    });
  };

  const handleReactivate = () => {
    setSuspending(true);
    router.put(
      `/admin/customers/${customer.id}`,
      { name: customer.name, email: customer.email, phone: customer.phone, status: "active", role: customer.role },
      { preserveScroll: true, onFinish: () => setSuspending(false) }
    );
  };

  const avatarColor = { bg: "#fce4ec", text: "#c62828" };

  const tabs = [
    { key: "orders", label: `Orders (${orders.length})` },
    { key: "addresses", label: `Addresses (${addresses.length})` },
    { key: "wishlist", label: `Wishlist (${wishlist.length})` },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: tokens.fontBody, backgroundColor: "rgba(245,245,245,0.6)" }}>
      {/* Mobile overlay */}
      {mobileSidebarOpen && isMobile && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 40, backgroundColor: "rgba(0,0,0,0.5)", cursor: "pointer" }}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        isMobile={isMobile}
        isOpen={mobileSidebarOpen}
        onNavigate={() => isMobile && setMobileSidebarOpen(false)}
        activeUrl={activeUrl}
      />

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            height: "64px",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            borderBottom: `1px solid ${tokens.border}`,
            backgroundColor: tokens.background,
            padding: "0 1rem",
          }}
        >
          <button
            onClick={() => {
              if (isMobile) {
                setMobileSidebarOpen(!mobileSidebarOpen);
              } else {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
            aria-label={isMobile ? (mobileSidebarOpen ? "Close menu" : "Open menu") : (sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: tokens.radius,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: tokens.foreground,
              transition: "background-color 0.15s ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = tokens.secondary)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {isMobile ? <IconMenu /> : (
              <IconChevronLeft style={{ transform: sidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }} />
            )}
          </button>

          <Link
            href="/admin/customers"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: tokens.mutedForeground, textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = tokens.foreground)}
            onMouseLeave={(e) => (e.currentTarget.style.color = tokens.mutedForeground)}
          >
            <IconArrowLeft />
            Back to Customers
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "auto" }}>
            <button
              aria-label="Notifications"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: tokens.radius,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: tokens.mutedForeground,
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = tokens.secondary)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <IconBell />
            </button>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: tokens.foreground,
                color: tokens.background,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 600,
                fontFamily: tokens.fontBody,
              }}
            >
              AN
            </div>
          </div>
        </header>

        {/* Profile header */}
        <div style={{ borderBottom: `1px solid ${tokens.border}`, backgroundColor: tokens.background, padding: "1.5rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: avatarColor.bg,
                  color: avatarColor.text,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  fontFamily: tokens.fontBody,
                  flexShrink: 0,
                }}
              >
                {getInitials(customer.name)}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
                  <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                    {customer.name}
                  </h1>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.125rem 0.625rem",
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      textTransform: "capitalize",
                      ...getStatusStyle(customer.status),
                    }}
                  >
                    {customer.status}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem", marginTop: "0.375rem" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: tokens.mutedForeground }}>
                    <IconMail /> {customer.email}
                  </span>
                  {customer.phone && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: tokens.mutedForeground }}>
                      <IconPhone /> {customer.phone}
                    </span>
                  )}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: tokens.mutedForeground }}>
                    <IconCalendar /> Joined {customer.joined}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.625rem" }}>
              <button
                onClick={handleEmailCustomer}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  height: "38px",
                  padding: "0 1rem",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  fontFamily: tokens.fontBody,
                  color: tokens.foreground,
                  backgroundColor: "transparent",
                  border: `1px solid ${tokens.border}`,
                  borderRadius: tokens.radius,
                  cursor: "pointer",
                }}
              >
                <IconMail /> Email
              </button>
              <Link
                href={`/admin/customers/${customer.id}/edit`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  height: "38px",
                  padding: "0 1.125rem",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  fontFamily: tokens.fontBody,
                  color: tokens.background,
                  backgroundColor: tokens.foreground,
                  border: "none",
                  borderRadius: tokens.radius,
                  textDecoration: "none",
                }}
              >
                <IconEdit /> Edit Customer
              </Link>

              {customer.status === "suspended" ? (
                <button
                  onClick={handleReactivate}
                  disabled={suspending}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    height: "38px",
                    padding: "0 1.125rem",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    fontFamily: tokens.fontBody,
                    color: tokens.green,
                    backgroundColor: "transparent",
                    border: `1px solid ${tokens.green}`,
                    borderRadius: tokens.radius,
                    cursor: suspending ? "default" : "pointer",
                    opacity: suspending ? 0.7 : 1,
                  }}
                >
                  {suspending ? "Reactivating..." : "Reactivate"}
                </button>
              ) : !showSuspendConfirm ? (
                <button
                  onClick={() => setShowSuspendConfirm(true)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    height: "38px",
                    padding: "0 1.125rem",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    fontFamily: tokens.fontBody,
                    color: tokens.red,
                    backgroundColor: "transparent",
                    border: `1px solid ${tokens.red}`,
                    borderRadius: tokens.radius,
                    cursor: "pointer",
                  }}
                >
                  <IconBan /> Suspend
                </button>
              ) : (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={handleSuspend}
                    disabled={suspending}
                    style={{
                      height: "38px",
                      padding: "0 1rem",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      fontFamily: tokens.fontBody,
                      color: tokens.background,
                      backgroundColor: tokens.red,
                      border: "none",
                      borderRadius: tokens.radius,
                      cursor: suspending ? "default" : "pointer",
                      opacity: suspending ? 0.7 : 1,
                    }}
                  >
                    {suspending ? "Suspending..." : "Confirm"}
                  </button>
                  <button
                    onClick={() => setShowSuspendConfirm(false)}
                    style={{
                      height: "38px",
                      padding: "0 1rem",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      fontFamily: tokens.fontBody,
                      color: tokens.foreground,
                      backgroundColor: "transparent",
                      border: `1px solid ${tokens.border}`,
                      borderRadius: tokens.radius,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
            <StatCard label="Total Orders" value={customer.orders_count ?? orders.length} icon={<IconPackage />} />
            <StatCard
              label="Total Spent"
              value={`₵${Number(customer.total_spent || 0).toLocaleString()}`}
            />
            <StatCard
              label="Avg. Order Value"
              value={`₵${Number(
                (customer.total_spent || 0) / Math.max(customer.orders_count || orders.length || 1, 1)
              ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />
            <StatCard label="Last Order" value={customer.last_order_at || "—"} icon={<IconCalendar />} />
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, padding: "1.5rem" }}>
          <div style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, overflow: "hidden" }}>
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: `1px solid ${tokens.border}`, padding: "0 1.5rem" }}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: "0.875rem 0.25rem",
                    marginRight: "1.5rem",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    fontFamily: tokens.fontBody,
                    color: activeTab === tab.key ? tokens.foreground : tokens.mutedForeground,
                    background: "transparent",
                    border: "none",
                    borderBottom: `2px solid ${activeTab === tab.key ? tokens.foreground : "transparent"}`,
                    cursor: "pointer",
                    transition: "color 0.15s ease, border-color 0.15s ease",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Orders tab */}
            {activeTab === "orders" && (
              <div style={{ overflowX: "auto" }}>
                {orders.length === 0 ? (
                  <div style={{ padding: "3rem 1.5rem", textAlign: "center", color: tokens.mutedForeground }}>
                    No orders yet
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${tokens.border}` }}>
                        <th style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Order</th>
                        <th style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Date</th>
                        <th style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Items</th>
                        <th style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Total</th>
                        <th style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Status</th>
                        <th style={{ textAlign: "right", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.order_number} style={{ borderBottom: `1px solid ${tokens.border}` }}>
                          <td style={{ padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.foreground }}>
                            #{order.order_number || order.id}
                          </td>
                          <td style={{ padding: "0.75rem 1.5rem", color: tokens.mutedForeground }}>{order.date}</td>
                          <td style={{ padding: "0.75rem 1.5rem", color: tokens.foreground }}>{order.items_count}</td>
                          <td style={{ padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.foreground }}>
                            ₵{Number(order.total || 0).toLocaleString()}
                          </td>
                          <td style={{ padding: "0.75rem 1.5rem" }}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "0.125rem 0.625rem",
                                borderRadius: "9999px",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                textTransform: "capitalize",
                                ...getOrderStatusStyle(order.order_status),
                              }}
                            >
                              {order.order_status}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem 1.5rem", textAlign: "right" }}>
                            <Link
                              href={`/admin/orders/${order.order_number}`}
                              style={{ fontSize: "0.8125rem", fontWeight: 500, color: tokens.blue, textDecoration: "none" }}
                            >
                              <IconEye />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Addresses tab */}
            {activeTab === "addresses" && (
              <div style={{ padding: "1.5rem" }}>
                {addresses.length === 0 ? (
                  <div style={{ padding: "1.5rem 0", textAlign: "center", color: tokens.mutedForeground }}>
                    No saved addresses
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        style={{ border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, padding: "1rem" }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                          <IconMapPin />
                          <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: tokens.foreground }}>
                            {address.label || "Address"}
                          </span>
                          {address.is_default && (
                            <span
                              style={{
                                fontSize: "0.6875rem",
                                fontWeight: 500,
                                color: tokens.foreground,
                                backgroundColor: tokens.secondary,
                                padding: "0.0625rem 0.5rem",
                                borderRadius: "9999px",
                              }}
                            >
                              Default
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: "0.8125rem", color: tokens.mutedForeground, margin: 0, lineHeight: 1.5 }}>
                          {[address.address, address.city, address.state, address.country,address.apartment].filter(Boolean).join(", ")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist tab */}
            {activeTab === "wishlist" && (
              <div style={{ padding: "1.5rem" }}>
                {wishlist.length === 0 ? (
                  <div style={{ padding: "1.5rem 0", textAlign: "center", color: tokens.mutedForeground }}>
                    No wishlist items
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        style={{ display: "flex", alignItems: "center", gap: "0.75rem", border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, padding: "0.75rem" }}
                      >
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            style={{ width: "44px", height: "44px", borderRadius: tokens.radius, objectFit: "cover", flexShrink: 0 }}
                          />
                        ) : (
                          <div style={{ width: "44px", height: "44px", borderRadius: tokens.radius, backgroundColor: tokens.secondary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: tokens.mutedForeground }}>
                            <IconHeart />
                          </div>
                        )}
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: "0.8125rem", fontWeight: 500, color: tokens.foreground, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {item.name}
                          </p>
                          <p style={{ fontSize: "0.75rem", color: tokens.mutedForeground, margin: "2px 0 0" }}>
                            ₵{Number(item.price || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminShowCustomer;