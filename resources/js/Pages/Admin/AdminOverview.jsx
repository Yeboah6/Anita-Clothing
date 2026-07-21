// ─── AdminOverview.jsx ───────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/Components/Admin/AdminSidebar";

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
  destructive: "#ef4444",
};

// ─── Data ────────────────────────────────────────────────────────────────────
const salesData = [
  { month: "Jan", revenue: 8200 },
  { month: "Feb", revenue: 9100 },
  { month: "Mar", revenue: 8500 },
  { month: "Apr", revenue: 9800 },
  { month: "May", revenue: 10200 },
  { month: "Jun", revenue: 11500 },
  { month: "Jul", revenue: 10800 },
  { month: "Aug", revenue: 12300 },
  { month: "Sep", revenue: 11800 },
  { month: "Oct", revenue: 13200 },
  { month: "Nov", revenue: 14100 },
  { month: "Dec", revenue: 15200 },
];


const stats = [
  { label: "Total Revenue", value: "$108,000", change: "+12.4%", trend: "up" },
  { label: "Orders", value: "1,284", change: "+8.2%", trend: "up" },
  { label: "Customers", value: "742", change: "+3.1%", trend: "up" },
  { label: "Products", value: "124", change: "-2", trend: "down" },
];

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconDollarSign = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconShoppingBag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconPackage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m16.5 9.4-9-5.19" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconArrowUpRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const IconArrowDownRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="7" y1="7" x2="17" y2="17" />
    <polyline points="17 7 17 17 7 17" />
  </svg>
);

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

// ─── Simple Area Chart ───────────────────────────────────────────────────────
const SimpleAreaChart = ({ data }) => {
  const width = 600;
  const height = 280;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const minRevenue = Math.min(...data.map((d) => d.revenue));
  const yRange = maxRevenue - minRevenue || 1;

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartWidth,
    y: padding.top + chartHeight - ((d.revenue - minRevenue) / yRange) * chartHeight,
    ...d,
  }));

  const areaPath = `
    M ${points[0].x} ${padding.top + chartHeight}
    ${points.map((p) => `L ${p.x} ${p.y}`).join(" ")}
    L ${points[points.length - 1].x} ${padding.top + chartHeight}
    Z
  `;

  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  const yTicks = 5;
  const xTickInterval = Math.ceil(data.length / 6);
  const [tooltip, setTooltip] = useState(null);

  return (
    <div style={{ position: "relative", width: "100%", overflowX: "auto" }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", minWidth: "500px", height: "auto" }}>
        {Array.from({ length: yTicks }).map((_, i) => {
          const y = padding.top + (chartHeight / (yTicks - 1)) * i;
          const value = Math.round(maxRevenue - ((maxRevenue - minRevenue) / (yTicks - 1)) * i);
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke={tokens.border} strokeDasharray="3 3" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill={tokens.mutedForeground} fontFamily={tokens.fontBody}>
                ${(value / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}
        <path d={areaPath} fill="rgba(20,20,20,0.08)" />
        <path d={linePath} fill="none" stroke={tokens.foreground} strokeWidth="2" />
        {data.map((d, i) => {
          if (i % xTickInterval === 0 || i === data.length - 1) {
            return (
              <text key={i} x={padding.left + (i / (data.length - 1)) * chartWidth} y={height - 6} textAnchor="middle" fontSize="11" fill={tokens.mutedForeground} fontFamily={tokens.fontBody}>
                {d.month}
              </text>
            );
          }
          return null;
        })}
        {points.map((p, i) => (
          <rect
            key={i}
            x={p.x - (chartWidth / data.length / 2)}
            y={padding.top}
            width={chartWidth / data.length}
            height={chartHeight}
            fill="transparent"
            onMouseEnter={() => setTooltip({ x: p.x, y: p.y, month: p.month, revenue: p.revenue })}
            onMouseLeave={() => setTooltip(null)}
            style={{ cursor: "pointer" }}
          />
        ))}
        {tooltip && (
          <g>
            <line x1={tooltip.x} y1={padding.top} x2={tooltip.x} y2={padding.top + chartHeight} stroke={tokens.foreground} strokeWidth="1" strokeDasharray="4 4" />
            <circle cx={tooltip.x} cy={tooltip.y} r="4" fill={tokens.foreground} />
            <rect x={tooltip.x > width / 2 ? tooltip.x - 90 : tooltip.x + 10} y={tooltip.y - 35} width="80" height="30" rx="4" fill={tokens.background} stroke={tokens.border} />
            <text x={tooltip.x > width / 2 ? tooltip.x - 50 : tooltip.x + 50} y={tooltip.y - 16} textAnchor="middle" fontSize="11" fill={tokens.foreground} fontWeight="500" fontFamily={tokens.fontBody}>
              ${tooltip.revenue.toLocaleString()}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

// ─── Status badge style helper ───────────────────────────────────────────────
const getStatusStyle = (status) => {
  const styles = {
    pending: { backgroundColor: tokens.border, color: tokens.mutedForeground, border: `1px solid ${tokens.border}` },
    processing: { backgroundColor: tokens.secondary, color: tokens.foreground, border: `1px solid ${tokens.border}` },
    shipped: { backgroundColor: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd" },
    delivered: { backgroundColor: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" },
    cancelled: { backgroundColor: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca" },
  };
  return styles[status] || styles.pending;
};

// ─── AdminOverview Component ─────────────────────────────────────────────────
const AdminOverview = ({ stats, salesData, topProducts, recentOrders }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState("/admin");
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
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  };

  const sidebarWidth = sidebarCollapsed ? 64 : 240;

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
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: isMobile ? 0 : 0,
          transition: "margin-left 0.3s ease",
          minWidth: 0,
        }}
      >
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
          {/* Sidebar toggle button */}
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

          {/* Search */}
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

          {/* Right controls */}
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
            Overview
          </h1>
          <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
            Welcome back. Here's what's happening with your store today.
          </p>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, padding: "1.5rem" }}>
          {/* Stats cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            {stats.map((stat) => {
              const TrendIcon = stat.trend === "up" ? IconArrowUpRight : IconArrowDownRight;
              const trendColor = stat.trend === "up" ? tokens.green : tokens.destructive;
              const iconMap = {
                "Total Revenue": IconDollarSign,
                "Orders": IconShoppingBag,
                "Customers": IconUsers,
                "Products": IconPackage,
              };
              const StatIcon = iconMap[stat.label];

              return (
                <div
                  key={stat.label}
                  style={{
                    backgroundColor: tokens.background,
                    border: `1px solid ${tokens.border}`,
                    borderRadius: tokens.radius,
                    padding: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.875rem", color: tokens.mutedForeground }}>{stat.label}</span>
                    <StatIcon />
                  </div>
                  <p style={{ fontFamily: tokens.fontDisplay, fontSize: "1.875rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                    {stat.value}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.5rem" }}>
                    <TrendIcon style={{ color: trendColor }} />
                    <span style={{ fontSize: "0.75rem", color: trendColor, fontWeight: 500 }}>{stat.change}</span>
                    <span style={{ fontSize: "0.75rem", color: tokens.mutedForeground }}>vs last month</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart + Top Products */}
          <div className="admin-chart-row" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, padding: "1.5rem" }}>
              <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: "0 0 1rem", color: tokens.foreground }}>
                Revenue
              </h3>
              <SimpleAreaChart data={salesData} />
            </div>
            <div style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, padding: "1.5rem" }}>
              <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: "0 0 1rem", color: tokens.foreground }}>
                Top Products
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {topProducts.map((product, idx) => (
                  <div key={product.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: tokens.secondary, borderRadius: tokens.radius, fontSize: "0.875rem", fontWeight: 500, color: tokens.foreground }}>
                        {idx + 1}
                      </div>
                      <div>
                        <p style={{ fontSize: "0.875rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>{product.name}</p>
                        <p style={{ fontSize: "0.75rem", color: tokens.mutedForeground, margin: "2px 0 0" }}>{product.sold} sold</p>
                      </div>
                    </div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 500, color: tokens.foreground, margin: 0 }}>
                      ${product.revenue.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, overflow: "hidden" }}>
            <div style={{ padding: "1.5rem", borderBottom: `1px solid ${tokens.border}` }}>
              <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                Recent Orders
              </h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${tokens.border}` }}>
                    <th style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Order</th>
                    <th style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Customer</th>
                    <th style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Date</th>
                    <th style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Status</th>
                    <th style={{ textAlign: "right", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const statusStyle = getStatusStyle(order.status);
                    return (
                      <tr key={order.id} style={{ borderBottom: `1px solid ${tokens.border}` }}>
                        <td style={{ padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.foreground }}>{order.id}</td>
                        <td style={{ padding: "0.75rem 1.5rem", color: tokens.foreground }}>{order.customer}</td>
                        <td style={{ padding: "0.75rem 1.5rem", color: tokens.mutedForeground }}>{order.date}</td>
                        <td style={{ padding: "0.75rem 1.5rem" }}>
                          <span style={{ display: "inline-block", padding: "0.125rem 0.625rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 500, textTransform: "capitalize", ...statusStyle }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: "0.75rem 1.5rem", textAlign: "right", fontWeight: 500, color: tokens.foreground }}>
                          ${order.total}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Responsive chart layout */}
      <style>{`
        @media (min-width: 1024px) {
          .admin-chart-row {
            grid-template-columns: 2fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminOverview;