import React, { useState, useEffect } from "react";
import AdminSidebar from "@/Components/Admin/AdminSidebar";
import { usePage, useForm, Link, router } from "@inertiajs/react";

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

// ─── Design tokens (matches AdminCustomers.jsx) ─────────────────────────────
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

const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── Field wrapper ───────────────────────────────────────────────────────────
const Field = ({ label, error, children, hint }) => (
  <div style={{ marginBottom: "1.25rem" }}>
    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: tokens.foreground, marginBottom: "0.375rem" }}>
      {label}
    </label>
    {children}
    {hint && !error && (
      <p style={{ margin: "0.375rem 0 0", fontSize: "0.75rem", color: tokens.mutedForeground }}>{hint}</p>
    )}
    {error && (
      <p style={{ margin: "0.375rem 0 0", fontSize: "0.75rem", color: tokens.red }}>{error}</p>
    )}
  </div>
);

const inputStyle = (hasError, focused) => ({
  width: "100%",
  height: "40px",
  padding: "0 0.75rem",
  fontSize: "0.875rem",
  fontFamily: tokens.fontBody,
  border: `1px solid ${hasError ? tokens.red : focused ? tokens.foreground : tokens.border}`,
  borderRadius: tokens.radius,
  backgroundColor: tokens.background,
  color: tokens.foreground,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s ease",
});

// ─── AdminEditCustomer Page ──────────────────────────────────────────────────
const AdminEditCustomer = () => {
  const { customer, flash = {} } = usePage().props;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeUrl] = useState("/admin/customers");
  const [focusedField, setFocusedField] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data, setData, put, processing, errors, isDirty, recentlySuccessful } = useForm({
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    status: customer?.status || "active",
    role: customer?.role || "customer",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/admin/customers/${customer.id}`, {
      preserveScroll: true,
    });
  };

  const handleSuspend = () => {
    router.delete(`/admin/customers/${customer.id}`, {
      onSuccess: () => router.visit("/admin/customers"),
    });
  };

  const avatarColor = { bg: "#fce4ec", text: "#c62828" };

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
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.875rem",
              color: tokens.mutedForeground,
              textDecoration: "none",
            }}
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

        {/* Page heading */}
        <div style={{ borderBottom: `1px solid ${tokens.border}`, backgroundColor: tokens.background, padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: avatarColor.bg,
                color: avatarColor.text,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.875rem",
                fontWeight: 600,
                fontFamily: tokens.fontBody,
                flexShrink: 0,
              }}
            >
              {getInitials(customer?.name)}
            </div>
            <div>
              <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                Edit Customer
              </h1>
              <p style={{ marginTop: "0.125rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
                {customer?.name} · {customer?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, padding: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: "1.5rem", alignItems: "start" }}>
            {/* Form card */}
            <form
              onSubmit={handleSubmit}
              style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, padding: "1.5rem" }}
            >
              <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: "0 0 1.25rem", color: tokens.foreground }}>
                Customer Details
              </h2>

              <Field label="Full name" error={errors.name}>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle(errors.name, focusedField === "name")}
                  placeholder="Jane Doe"
                />
              </Field>

              <Field label="Email address" error={errors.email}>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle(errors.email, focusedField === "email")}
                  placeholder="jane@example.com"
                />
              </Field>

              <Field label="Phone number" error={errors.phone} hint="Optional">
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => setData("phone", e.target.value)}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle(errors.phone, focusedField === "phone")}
                  placeholder="+233 20 000 0000"
                />
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <Field label="Account status" error={errors.status}>
                  <select
                    value={data.status}
                    onChange={(e) => setData("status", e.target.value)}
                    onFocus={() => setFocusedField("status")}
                    onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle(errors.status, focusedField === "status"), cursor: "pointer" }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </Field>

                <Field label="Role" error={errors.role}>
                  <select
                    value={data.role}
                    onChange={(e) => setData("role", e.target.value)}
                    onFocus={() => setFocusedField("role")}
                    onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle(errors.role, focusedField === "role"), cursor: "pointer" }}
                  >
                    <option value="customer">Customer</option>
                  </select>
                </Field>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: `1px solid ${tokens.border}` }}>
                <button
                  type="submit"
                  disabled={processing || !isDirty}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    height: "40px",
                    padding: "0 1.25rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    fontFamily: tokens.fontBody,
                    color: tokens.background,
                    backgroundColor: !isDirty ? tokens.mutedForeground : tokens.foreground,
                    border: "none",
                    borderRadius: tokens.radius,
                    cursor: processing || !isDirty ? "default" : "pointer",
                    opacity: processing ? 0.7 : 1,
                    transition: "background-color 0.15s ease, opacity 0.15s ease",
                  }}
                >
                  {processing ? "Saving..." : "Save Changes"}
                </button>

                <Link
                  href="/admin/customers"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: "40px",
                    padding: "0 1.25rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    fontFamily: tokens.fontBody,
                    color: tokens.foreground,
                    backgroundColor: "transparent",
                    border: `1px solid ${tokens.border}`,
                    borderRadius: tokens.radius,
                    textDecoration: "none",
                  }}
                >
                  Cancel
                </Link>

                {recentlySuccessful && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: tokens.green, marginLeft: "0.25rem" }}>
                    <IconCheck /> Saved
                  </span>
                )}
              </div>
            </form>

            {/* Side panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, padding: "1.5rem" }}>
                <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.0625rem", fontWeight: 500, margin: "0 0 1rem", color: tokens.foreground }}>
                  Account Summary
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8125rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: tokens.mutedForeground }}>Customer ID</span>
                    <span style={{ color: tokens.foreground, fontWeight: 500 }}>CUS-{customer?.id}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: tokens.mutedForeground }}>Joined</span>
                    <span style={{ color: tokens.foreground, fontWeight: 500 }}>{customer?.joined || "—"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: tokens.mutedForeground }}>Total orders</span>
                    <span style={{ color: tokens.foreground, fontWeight: 500 }}>{customer?.orders_count ?? 0}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: tokens.mutedForeground }}>Total spent</span>
                    <span style={{ color: tokens.foreground, fontWeight: 500 }}>
                      ₵{Number(customer?.total_spent || 0).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: tokens.mutedForeground }}>Last order</span>
                    <span style={{ color: tokens.foreground, fontWeight: 500 }}>{customer?.last_order_at || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Danger zone */}
              <div style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, padding: "1.5rem" }}>
                <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.0625rem", fontWeight: 500, margin: "0 0 0.5rem", color: tokens.foreground }}>
                  {data.status === "suspended" ? "Account Suspended" : "Suspend Account"}
                </h3>
                <p style={{ fontSize: "0.8125rem", color: tokens.mutedForeground, margin: "0 0 1rem" }}>
                  {data.status === "suspended"
                    ? "This customer is currently suspended and cannot log in. Their orders, addresses, and order history remain intact."
                    : "Suspending blocks this customer from logging in. Their orders, addresses, and order history are kept intact — nothing is deleted."}
                </p>

                {data.status === "suspended" ? null : !showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      height: "36px",
                      padding: "0 1rem",
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
                    <IconTrash /> Suspend Customer
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={handleSuspend}
                      style={{
                        height: "36px",
                        padding: "0 1rem",
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        fontFamily: tokens.fontBody,
                        color: tokens.background,
                        backgroundColor: tokens.red,
                        border: "none",
                        borderRadius: tokens.radius,
                        cursor: "pointer",
                      }}
                    >
                      Confirm Suspension
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      style={{
                        height: "36px",
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminEditCustomer;