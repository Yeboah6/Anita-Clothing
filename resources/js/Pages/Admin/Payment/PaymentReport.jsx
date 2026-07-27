// Target path: resources/js/Pages/Admin/PaymentReport.jsx

import React, { useState, useEffect, useRef } from "react";
import { router, Link } from "@inertiajs/react";
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
  amber: "#d99a2b",
  amberSoft: "#faf0dd",
  greenSoft: "#e7f6ed",
  redSoft: "#fbe6e2",
  purple: "#7a5cc4",
  purpleSoft: "#eee7fb",
  pink: "#ff6bb3",
  pinkSoft: "#ffe3f0",
};

const STATUS_STYLES = {
  completed: { bg: tokens.greenSoft, fg: tokens.green },
  pending: { bg: tokens.amberSoft, fg: tokens.amber },
  failed: { bg: tokens.redSoft, fg: tokens.destructive },
  refunded: { bg: tokens.purpleSoft, fg: tokens.purple },
};

function currency(n) {
  const value = Number(n || 0);
  return "₵" + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Icons (reused from AdminProducts) ───────────────────────────────────────
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

const IconChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconDownload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconDollarSign = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconReceipt = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 2h16v20l-3-2-2 2-2-2-2 2-2-2-2 2-3-2Z" />
    <line x1="8" y1="7" x2="16" y2="7" />
    <line x1="8" y1="11" x2="16" y2="11" />
    <line x1="8" y1="15" x2="12" y2="15" />
  </svg>
);

const IconRotateCcw = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

const IconAlertCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ─── MetricCard (identical pattern to AdminProducts) ─────────────────────────
const MetricCard = ({ icon, label, value, color }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        backgroundColor: tokens.background,
        border: `1px solid ${tokens.border}`,
        borderRadius: tokens.radius,
        padding: "1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          borderRadius: tokens.radius,
          backgroundColor: tokens.secondary,
          color: color,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 500, color: tokens.mutedForeground, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {label}
        </div>
        <div style={{ fontSize: "1.5rem", fontWeight: 600, color: tokens.foreground, lineHeight: 1.2 }}>
          {value}
        </div>
      </div>
    </div>
  );
};

// ─── StatusBadge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || { bg: tokens.secondary, fg: tokens.mutedForeground };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.125rem 0.625rem",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 500,
        textTransform: "capitalize",
        backgroundColor: style.bg,
        color: style.fg,
      }}
    >
      {status}
    </span>
  );
};

// ─── RevenueChart ─────────────────────────────────────────────────────────────
const RevenueChart = ({ data }) => {
  const width = 720;
  const height = 220;
  const padding = 36;

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: tokens.mutedForeground,
          fontFamily: tokens.fontBody,
          fontSize: "0.875rem",
        }}
      >
        No revenue in this range yet.
      </div>
    );
  }

  const totals = data.map((d) => Number(d.total));
  const maxVal = Math.max(...totals, 1);
  const stepX = (width - padding * 2) / Math.max(data.length - 1, 1);

  const points = data.map((d, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (Number(d.total) / maxVal) * (height - padding * 2);
    return [x, y];
  });

  const linePath = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1][0]},${height - padding} L${points[0][0]},${
    height - padding
  } Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tokens.pink} stopOpacity="0.25" />
          <stop offset="100%" stopColor={tokens.pink} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke={tokens.border} strokeWidth="1" />
      <path d={areaPath} fill="url(#revenueFill)" />
      <path d={linePath} fill="none" stroke={tokens.pink} strokeWidth="2.5" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill={tokens.pink} />
      ))}
      {data.map((d, i) => {
        if (data.length > 10 && i % Math.ceil(data.length / 8) !== 0) return null;
        const x = padding + i * stepX;
        return (
          <text key={d.date} x={x} y={height - padding + 18} fontSize="10" fill={tokens.mutedForeground} fontFamily={tokens.fontBody} textAnchor="middle">
            {d.date.slice(5)}
          </text>
        );
      })}
    </svg>
  );
};

// ─── MethodBreakdown ──────────────────────────────────────────────────────────
const MethodBreakdown = ({ data }) => {
  const maxTotal = Math.max(...(data || []).map((d) => Number(d.total)), 1);

  if (!data || data.length === 0) {
    return (
      <div style={{ color: tokens.mutedForeground, fontFamily: tokens.fontBody, fontSize: "0.875rem" }}>
        No transactions in this range.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
      {data.map((row) => (
        <div key={row.method}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: tokens.fontBody,
              fontSize: "0.8125rem",
              color: tokens.foreground,
              marginBottom: "0.25rem",
              textTransform: "capitalize",
            }}
          >
            <span>{row.method}</span>
            <span style={{ color: tokens.mutedForeground }}>
              {row.count} · {currency(row.total)}
            </span>
          </div>
          <div style={{ background: tokens.secondary, borderRadius: "9999px", height: "8px", overflow: "hidden" }}>
            <div
              style={{
                width: `${(Number(row.total) / maxTotal) * 100}%`,
                background: tokens.pink,
                height: "100%",
                borderRadius: "9999px",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Dropdown (styled like AdminProducts' search input, not the old CustomSelect) ─
const Dropdown = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={ref} style={{ position: "relative", fontFamily: tokens.fontBody }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          height: "36px",
          padding: "0 0.75rem",
          borderRadius: tokens.radius,
          border: `1px solid ${open ? tokens.foreground : tokens.border}`,
          background: tokens.background,
          fontSize: "0.8125rem",
          color: tokens.foreground,
          cursor: "pointer",
          transition: "border-color 0.2s ease",
        }}
      >
        <span style={{ color: tokens.mutedForeground }}>{label}:</span>
        <span style={{ fontWeight: 500, textTransform: "capitalize" }}>{current?.label}</span>
        <IconChevronDown />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            background: tokens.background,
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            overflow: "hidden",
            zIndex: 20,
            minWidth: "160px",
          }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              onMouseEnter={() => setHoveredOption(opt.value)}
              onMouseLeave={() => setHoveredOption(null)}
              style={{
                padding: "0.5rem 0.75rem",
                fontSize: "0.8125rem",
                cursor: "pointer",
                textTransform: "capitalize",
                backgroundColor:
                  opt.value === value ? tokens.secondary : hoveredOption === opt.value ? tokens.secondary : "transparent",
                color: tokens.foreground,
                transition: "background-color 0.1s ease",
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── PaymentReport Page ───────────────────────────────────────────────────────
export default function PaymentReport({ transactions, summary, revenueOverTime, methodBreakdown, statusBreakdown, filters }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState("/admin/payments");
  const [searchFocused, setSearchFocused] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

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

  const applyFilters = (next) => {
    const merged = { ...localFilters, ...next };
    setLocalFilters(merged);
    router.get(route("admin.payments.index"), merged, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  const exportUrl = route("admin.payments.export", localFilters);

  const methodOptions = [
    { value: "all", label: "All methods" },
    ...(methodBreakdown || []).map((m) => ({ value: m.channel, label: m.channel })),
  ];

  const statusOptions = [
    { value: "all", label: "All statuses" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
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
              <IconChevronLeft style={{ transform: sidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }} />
            )}
          </button>

          <div style={{ position: "relative", flex: 1, maxWidth: "320px", display: isMobile ? "none" : "block" }}>
            <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: tokens.mutedForeground, display: "flex" }}>
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="Search transactions..."
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
        <div
          style={{
            borderBottom: `1px solid ${tokens.border}`,
            backgroundColor: tokens.background,
            padding: "1.5rem",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div>
            <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>
              Payments
            </h1>
            <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
              Track revenue, transactions, and payment health across your store
            </p>
          </div>
          <a
            href={exportUrl}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              fontFamily: tokens.fontBody,
              borderRadius: tokens.radius,
              border: "none",
              backgroundColor: tokens.pink,
              color: "#ffffff",
              cursor: "pointer",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            <IconDownload />
            Export CSV
          </a>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, padding: "1.5rem" }}>
          {/* Metric cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <MetricCard icon={<IconDollarSign />} label="Total Revenue" value={currency(summary.total_revenue)} color={tokens.pink} />
            <MetricCard icon={<IconReceipt />} label="Transactions" value={summary.total_transactions} color={tokens.foreground} />
            <MetricCard icon={<IconDollarSign />} label="Avg. Transaction" value={currency(summary.avg_transaction)} color={tokens.foreground} />
            <MetricCard icon={<IconRotateCcw />} label="Refunded" value={currency(summary.refunded_amount)} color={tokens.destructive} />
            <MetricCard
              icon={<IconAlertCircle />}
              label="Failed"
              value={summary.failed_count}
              color={summary.failed_count > 0 ? tokens.destructive : tokens.mutedForeground}
            />
          </div>

          {/* Filters */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              alignItems: "center",
              backgroundColor: tokens.background,
              border: `1px solid ${tokens.border}`,
              borderRadius: tokens.radius,
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.8125rem", color: tokens.mutedForeground }}>From</label>
              <input
                type="date"
                value={localFilters.date_from}
                onChange={(e) => applyFilters({ date_from: e.target.value })}
                style={{
                  height: "36px",
                  padding: "0 0.625rem",
                  borderRadius: tokens.radius,
                  border: `1px solid ${tokens.border}`,
                  fontSize: "0.8125rem",
                  fontFamily: tokens.fontBody,
                  color: tokens.foreground,
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.8125rem", color: tokens.mutedForeground }}>To</label>
              <input
                type="date"
                value={localFilters.date_to}
                onChange={(e) => applyFilters({ date_to: e.target.value })}
                style={{
                  height: "36px",
                  padding: "0 0.625rem",
                  borderRadius: tokens.radius,
                  border: `1px solid ${tokens.border}`,
                  fontSize: "0.8125rem",
                  fontFamily: tokens.fontBody,
                  color: tokens.foreground,
                }}
              />
            </div>
            <Dropdown label="Status" value={localFilters.status} options={statusOptions} onChange={(value) => applyFilters({ status: value })} />
            <Dropdown label="Channel" value={localFilters.channel} options={methodOptions} onChange={(value) => applyFilters({ channel: value })} />
          </div>

          {/* Chart + breakdown */}
          <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <div
              style={{
                flex: "2 1 420px",
                backgroundColor: tokens.background,
                border: `1px solid ${tokens.border}`,
                borderRadius: tokens.radius,
                padding: "1.5rem",
              }}
            >
              <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: "0 0 1rem", color: tokens.foreground }}>
                Revenue Over Time
              </h3>
              <RevenueChart data={revenueOverTime} />
            </div>
            <div
              style={{
                flex: "1 1 260px",
                backgroundColor: tokens.background,
                border: `1px solid ${tokens.border}`,
                borderRadius: tokens.radius,
                padding: "1.5rem",
              }}
            >
              <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: "0 0 1rem", color: tokens.foreground }}>
                By Payment Method
              </h3>
              <MethodBreakdown data={methodBreakdown} />
            </div>
          </div>

          {/* Transactions table */}
          <div style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, overflow: "hidden" }}>
            <div style={{ padding: "1.5rem", borderBottom: `1px solid ${tokens.border}` }}>
              <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                Transactions
              </h3>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${tokens.border}` }}>
                    {["Transaction", "Customer", "Amount", "Channel", "Status", "Date"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "0.75rem 1.5rem",
                          fontWeight: 500,
                          color: tokens.mutedForeground,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.data.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "3rem 1.5rem", textAlign: "center", color: tokens.mutedForeground }}>
                        No transactions match these filters.
                      </td>
                    </tr>
                  ) : (
                    transactions.data.map((tx) => (
                      <tr key={tx.id} style={{ borderBottom: `1px solid ${tokens.border}` }}>
                        <td style={{ padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.foreground }}>{tx.reference}</td>
                        <td style={{ padding: "0.75rem 1.5rem", color: tokens.foreground }}>
                          {tx.user ? `${tx.user.name}` : "Guest"}
                        </td>
                        <td style={{ padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.foreground }}>{currency(tx.amount)}</td>
                        <td style={{ padding: "0.75rem 1.5rem", color: tokens.mutedForeground, textTransform: "capitalize" }}>{tx.channel}</td>
                        <td style={{ padding: "0.75rem 1.5rem" }}>
                          <StatusBadge status={tx.status} />
                        </td>
                        <td style={{ padding: "0.75rem 1.5rem", color: tokens.mutedForeground }}>
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {transactions.links && transactions.links.length > 3 && (
              <div style={{ display: "flex", gap: "0.375rem", padding: "1rem 1.5rem", flexWrap: "wrap", borderTop: `1px solid ${tokens.border}` }}>
                {transactions.links.map((link, i) => (
                  <Link
                    key={i}
                    href={link.url || "#"}
                    preserveScroll
                    preserveState
                    style={{
                      padding: "0.375rem 0.75rem",
                      borderRadius: tokens.radius,
                      fontSize: "0.8125rem",
                      textDecoration: "none",
                      backgroundColor: link.active ? tokens.foreground : "transparent",
                      color: link.active ? tokens.background : link.url ? tokens.foreground : tokens.mutedForeground,
                      border: `1px solid ${link.active ? tokens.foreground : tokens.border}`,
                      pointerEvents: link.url ? "auto" : "none",
                      opacity: link.url ? 1 : 0.5,
                    }}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}