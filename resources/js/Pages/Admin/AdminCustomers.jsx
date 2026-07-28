import React, { useState, useEffect } from "react";
import AdminSidebar from "@/Components/Admin/AdminSidebar";
import { usePage } from "@inertiajs/react";

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
  orange: "#f59e0b",
};

const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
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

const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
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

const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconPencil = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
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

// ─── Status badge style helper ───────────────────────────────────────────────
const getStatusStyle = (status) => {
  if (status === "active") {
    return {
      backgroundColor: "#dcfce7",
      color: "#166534",
      border: "1px solid #bbf7d0",
    };
  }
  return {
    backgroundColor: "transparent",
    color: tokens.mutedForeground,
    border: `1px solid ${tokens.border}`,
  };
};

// ─── AdminCustomers Page ─────────────────────────────────────────────────────
const AdminCustomers = () => {

  const { customers: rawCustomers = [], stats = {} } = usePage().props;
  const [viewHovered, setViewHovered] = useState(false);
  const [editHovered, setEditHovered] = useState(false);

  const Customers = rawCustomers.map(customer => ({
    id: `CUS-${customer.id}`,
    name: customer.name,
    email: customer.email,
    joined: customer.joined,
    orders: customer.orders_count,
    spent: customer.total_spent,
    status: customer.status,
    phone: customer.phone,
    lastOrder: customer.last_order_at,
  }));

  const customerStats = {
    totalCustomers: stats.total_customers || Customers.length,
    activeCustomers: stats.active_customers || Customers.filter(c => c.status === "active").length,
    totalRevenue: stats.total_revenue || Customers.reduce((sum, c) => sum + c.spent, 0),
    averageOrderValue: stats.average_order_value || 0,
  };

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState("/admin/customers");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

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

  const handleNavigate = (url) => {
    setActiveUrl(url);
    if (isMobile) setMobileSidebarOpen(false);
  };

  // Filter customers by search query
  const filteredCustomers = Customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = Customers.filter((c) => c.status === "active").length;

  // Generate consistent avatar colors based on name
  const getAvatarColor = (name) => {
    const colors = [
      { bg: "#fce4ec", text: "#c62828" },
      { bg: "#f3e5f5", text: "#6a1b9a" },
      { bg: "#e8eaf6", text: "#283593" },
      { bg: "#e3f2fd", text: "#1565c0" },
      { bg: "#e0f7fa", text: "#00695c" },
      { bg: "#e8f5e9", text: "#2e7d32" },
      { bg: "#fff3e0", text: "#e65100" },
      { bg: "#fce4ec", text: "#880e4f" },
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const handleEmailCustomer = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: tokens.fontBody, backgroundColor: "rgba(245,245,245,0.6)" }}>
      {/* Mobile overlay */}
      {mobileSidebarOpen && isMobile && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            backgroundColor: "rgba(0,0,0,0.5)",
            cursor: "pointer",
          }}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        isMobile={isMobile}
        isOpen={mobileSidebarOpen}
        onNavigate={handleNavigate}
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
            {isMobile ? (
              <IconMenu />
            ) : (
              <IconChevronLeft
                style={{
                  transform: sidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              />
            )}
          </button>

          <div style={{ position: "relative", flex: 1, maxWidth: "320px", display: isMobile ? "none" : "block" }}>
            <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: tokens.mutedForeground, display: "flex" }}>
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="Search..."
              style={{
                width: "100%",
                height: "36px",
                padding: "0 0.75rem 0 2.25rem",
                fontSize: "0.875rem",
                fontFamily: tokens.fontBody,
                border: `1px solid ${searchFocused ? tokens.foreground : tokens.border}`,
                borderRadius: tokens.radius,
                backgroundColor: tokens.background,
                color: tokens.foreground,
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease",
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>

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
          <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>
            Customers
          </h1>
          <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
            {customerStats.totalCustomers} customers — {customerStats.activeCustomers} active
          </p>

          {/* Quick stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
            <div style={{ padding: "1rem", backgroundColor: tokens.secondary, borderRadius: tokens.radius }}>
              <p style={{ fontSize: "0.75rem", color: tokens.mutedForeground, margin: "0 0 0.25rem" }}>Total Revenue</p>
              <p style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>
                ₵{customerStats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div style={{ padding: "1rem", backgroundColor: tokens.secondary, borderRadius: tokens.radius }}>
              <p style={{ fontSize: "0.75rem", color: tokens.mutedForeground, margin: "0 0 0.25rem" }}>Average Order Value</p>
              <p style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>
                ₵{customerStats.averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, padding: "1.5rem" }}>
          <div style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, overflow: "hidden" }}>
            <div style={{ padding: "1.5rem" }}>
              {/* Search input */}
              <div style={{ position: "relative", maxWidth: "320px", marginBottom: "1.5rem" }}>
                <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: tokens.mutedForeground, display: "flex" }}>
                  <IconSearch />
                </span>
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    height: "36px",
                    padding: "0 0.75rem 0 2.25rem",
                    fontSize: "0.875rem",
                    fontFamily: tokens.fontBody,
                    border: `1px solid ${searchFocused ? tokens.foreground : tokens.border}`,
                    borderRadius: tokens.radius,
                    backgroundColor: tokens.background,
                    color: tokens.foreground,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
            </div>

            {/* Customers table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${tokens.border}` }}>
                    <th style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Customer</th>
                    <th style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Joined</th>
                    <th style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Orders</th>
                    <th style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Total Spent</th>
                    <th style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Status</th>
                    <th style={{ textAlign: "right", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "3rem 1.5rem", textAlign: "center", color: tokens.mutedForeground }}>
                        {searchQuery ? (
                          <>No customers found matching "{searchQuery}"</>
                        ) : (
                          <>No customers yet</>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => {
                      const [mailHovered, setMailHovered] = useState(false);
                      const avatarColor = getAvatarColor(customer.name);

                      return (
                        <tr key={customer.id} style={{ borderBottom: `1px solid ${tokens.border}` }}>
                          <td style={{ padding: "0.75rem 1.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  backgroundColor: avatarColor.bg,
                                  color: avatarColor.text,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                  fontFamily: tokens.fontBody,
                                  flexShrink: 0,
                                }}
                              >
                                {getInitials(customer.name)}
                              </div>
                              <div>
                                <p style={{ fontSize: "0.875rem", fontWeight: 500, color: tokens.foreground, margin: 0 }}>
                                  {customer.name}
                                </p>
                                <p style={{ fontSize: "0.75rem", color: tokens.mutedForeground, margin: "2px 0 0" }}>
                                  {customer.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "0.75rem 1.5rem", color: tokens.mutedForeground }}>
                            {customer.joined}
                          </td>
                          <td style={{ padding: "0.75rem 1.5rem", color: tokens.foreground }}>
                            {customer.orders}
                          </td>
                          <td style={{ padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.foreground }}>
                            ₵{customer.spent.toLocaleString()}
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
                                ...getStatusStyle(customer.status),
                              }}
                            >
                              {customer.status}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem 1.5rem", textAlign: "right" }}>
                            <a
                              href={`/admin/customers/${customer.id}`}
                              aria-label="View"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "36px",
                                height: "36px",
                                borderRadius: tokens.radius,
                                border: "none",
                                background: viewHovered ? tokens.secondary : "transparent",
                                cursor: "pointer",
                                color: tokens.foreground,
                                transition: "background-color 0.15s ease",
                                textDecoration: "none",
                              }}
                              onMouseEnter={() => setViewHovered(true)}
                              onMouseLeave={() => setViewHovered(false)}
                            >
                              <IconEye />
                            </a>
                            <a
                              href={`/admin/customers/${customer.id}/edit`}
                              aria-label="Edit"
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
                              onClick={() => handleEmailCustomer(customer.email)}
                              aria-label={`Email ${customer.name}`}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "36px",
                                height: "36px",
                                borderRadius: tokens.radius,
                                border: "none",
                                background: mailHovered ? tokens.secondary : "transparent",
                                cursor: "pointer",
                                color: tokens.foreground,
                                transition: "background-color 0.15s ease",
                              }}
                              onMouseEnter={() => setMailHovered(true)}
                              onMouseLeave={() => setMailHovered(false)}
                            >
                              <IconMail />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminCustomers;