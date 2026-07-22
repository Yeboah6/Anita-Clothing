import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
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
  amber: "#d97706",
  blue: "#2563eb",
};

// ─── Status config ────────────────────────────────────────────────────────────
const orderStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const statusColors = {
  pending: { bg: "#fef3c7", fg: "#92400e" },
  processing: { bg: "#dbeafe", fg: "#1e40af" },
  shipped: { bg: "#e0e7ff", fg: "#3730a3" },
  delivered: { bg: "#dcfce7", fg: "#166534" },
  cancelled: { bg: "#fee2e2", fg: "#991b1b" },
  paid: { bg: "#dcfce7", fg: "#166534" },
  unpaid: { bg: "#fee2e2", fg: "#991b1b" },
  refunded: { bg: "#f3f4f6", fg: "#374151" },
};

const StatusBadge = ({ value, fallbackLabel }) => {
  const colors = statusColors[value] || { bg: tokens.secondary, fg: tokens.mutedForeground };
  const label = fallbackLabel || (value ? value.charAt(0).toUpperCase() + value.slice(1) : "—");
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.25rem 0.625rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: 500,
        fontFamily: tokens.fontBody,
        backgroundColor: colors.bg,
        color: colors.fg,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconBell = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const IconChevronLeft = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconLoader = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ animation: "anita-spin 0.8s linear infinite" }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
const IconPackage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
  </svg>
);
const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconReceipt = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16l3-2 3 2 3-2 3 2V4a2 2 0 0 0-2-2z" /><path d="M14 2v6h6" /><line x1="8" y1="11" x2="16" y2="11" /><line x1="8" y1="15" x2="16" y2="15" />
  </svg>
);
const IconCopy = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

// ─── Custom Select (status changer) ───────────────────────────────────────────
const CustomSelect = ({ value, onChange, options, placeholder, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);
  const selectRef = React.useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} style={{ position: "relative", ...style }}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: "100%",
          height: "40px",
          padding: "0 2rem 0 0.75rem",
          fontSize: "0.875rem",
          fontFamily: tokens.fontBody,
          backgroundColor: tokens.background,
          border: `1px solid ${isOpen ? tokens.foreground : tokens.border}`,
          borderRadius: tokens.radius,
          color: value ? tokens.foreground : tokens.mutedForeground,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "border-color 0.2s ease",
          outline: "none",
          whiteSpace: "nowrap",
          textAlign: "left",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", flex: 1, minWidth: 0 }}>{displayText}</span>
        <span style={{ display: "flex", alignItems: "center", marginLeft: "0.5rem", flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
          <IconChevronDown />
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 50,
            backgroundColor: tokens.background,
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            const isHovered = hoveredOption === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => { onChange(option.value); setIsOpen(false); }}
                onMouseEnter={() => setHoveredOption(option.value)}
                onMouseLeave={() => setHoveredOption(null)}
                style={{
                  width: "100%",
                  padding: "0.625rem 0.75rem",
                  fontSize: "0.875rem",
                  fontFamily: tokens.fontBody,
                  backgroundColor: isSelected || isHovered ? tokens.secondary : "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  color: tokens.foreground,
                  fontWeight: isSelected ? 500 : 400,
                  transition: "background-color 0.1s ease",
                  outline: "none",
                  display: "block",
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Shared card styles ────────────────────────────────────────────────────────
const cardStyle = { backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius };
const cardHeaderStyle = { padding: "1.25rem 1.5rem", borderBottom: `1px solid ${tokens.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" };
const cardTitleStyle = { display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: tokens.fontDisplay, fontSize: "1.125rem", fontWeight: 500, margin: 0, color: tokens.foreground };
const money = (n) => `$${(Number(n) || 0).toFixed(2)}`;
const formatDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date)) return d;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) +
    " · " + date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
};

// ─── OrderDetails Page ─────────────────────────────────────────────────────────
// Expects Inertia props:
//   order: {
//     id, order_number, status, payment_status, payment_method,
//     created_at, subtotal, discount_amount, shipping_fee, total,
//     customer: { name, email, phone },
//     shipping_address: { line1, line2, city, region, postal_code, country },
//     billing_address: { line1, line2, city, region, postal_code, country }, // optional
//     items: [{ id, product_name, image, size, color, quantity, price, line_total }],
//     notes, // optional
//     timeline: [{ status, label, timestamp }], // optional order history
//   }
const OrderDetails = ({ order }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState("/admin/orders");
  const [backBtnHovered, setBackBtnHovered] = useState(false);
  const [saveBtnHovered, setSaveBtnHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data, setData, patch, processing } = useForm({
    status: order.status ?? "pending",
  });

  useEffect(() => {
    injectFonts();
    const styleId = "anita-spin-keyframes";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = "@keyframes anita-spin { to { transform: rotate(360deg); } }";
      document.head.appendChild(style);
    }
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) { setSidebarCollapsed(true); setMobileSidebarOpen(false); } else { setSidebarCollapsed(false); }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigate = (url) => { setActiveUrl(url); if (isMobile) setMobileSidebarOpen(false); };

  const hasStatusChanged = data.status !== order.status;

  const handleUpdateStatus = () => {
    if (!hasStatusChanged) return;
    patch(`/admin/orders/${order.id}/status`, { preserveScroll: true });
  };

  const handleCopyOrderNumber = () => {
    const text = order.order_number || String(order.id);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  const items = order.items ?? [];
  const address = order.shipping_address;
  const customer = order.customer ?? {};

  const computedSubtotal = order.subtotal != null
    ? order.subtotal
    : items.reduce((sum, it) => sum + (Number(it.price) * Number(it.quantity)), 0);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: tokens.fontBody, backgroundColor: "rgba(245,245,245,0.6)" }}>
      {mobileSidebarOpen && isMobile && (
        <div onClick={() => setMobileSidebarOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40, backgroundColor: "rgba(0,0,0,0.5)", cursor: "pointer" }} />
      )}
      <AdminSidebar collapsed={sidebarCollapsed} isMobile={isMobile} isOpen={mobileSidebarOpen} onNavigate={handleNavigate} activeUrl={activeUrl} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header style={{ position: "sticky", top: 0, zIndex: 30, height: "64px", display: "flex", alignItems: "center", gap: "1rem", borderBottom: `1px solid ${tokens.border}`, backgroundColor: tokens.background, padding: "0 1rem" }}>
          <button
            onClick={() => { if (isMobile) { setMobileSidebarOpen(!mobileSidebarOpen); } else { setSidebarCollapsed(!sidebarCollapsed); } }}
            aria-label="Toggle sidebar"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: tokens.radius, border: "none", background: "transparent", cursor: "pointer", color: tokens.foreground, transition: "background-color 0.15s ease", flexShrink: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = tokens.secondary)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {isMobile ? <IconMenu /> : <IconChevronLeft style={{ transform: sidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }} />}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "auto" }}>
            <button aria-label="Notifications" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: tokens.radius, border: "none", background: "transparent", cursor: "pointer", color: tokens.mutedForeground, transition: "background-color 0.15s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = tokens.secondary)} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
              <IconBell />
            </button>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: tokens.foreground, color: tokens.background, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 600, fontFamily: tokens.fontBody }}>AN</div>
          </div>
        </header>

        {/* Page heading */}
        <div style={{ borderBottom: `1px solid ${tokens.border}`, backgroundColor: tokens.background, padding: "1.5rem" }}>
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <a href="/admin/orders" style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", fontWeight: 500, fontFamily: tokens.fontBody, textDecoration: "none", color: backBtnHovered ? tokens.foreground : tokens.mutedForeground, transition: "color 0.15s ease", whiteSpace: "nowrap" }}
                onMouseEnter={() => setBackBtnHovered(true)} onMouseLeave={() => setBackBtnHovered(false)}>
                <IconArrowLeft /> Back
              </a>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
                  <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                    Order {order.order_number || `#${order.id}`}
                  </h1>
                  <StatusBadge value={order.status} />
                  {order.payment_status && <StatusBadge value={order.payment_status} />}
                </div>
                <p style={{ marginTop: "0.25rem", fontSize: "0.8125rem", color: tokens.mutedForeground, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  Placed {formatDate(order.created_at)}
                  <button type="button" onClick={handleCopyOrderNumber}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", background: "none", border: "none", padding: 0, color: tokens.mutedForeground, cursor: "pointer", fontSize: "0.75rem", fontFamily: tokens.fontBody }}>
                    <IconCopy /> {copied ? "Copied" : "Copy ID"}
                  </button>
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <CustomSelect value={data.status} onChange={(val) => setData("status", val)} options={orderStatusOptions} placeholder="Select status" style={{ minWidth: "160px" }} />
              <button
                onClick={handleUpdateStatus}
                disabled={processing || !hasStatusChanged}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, fontFamily: tokens.fontBody, borderRadius: tokens.radius, border: "none", backgroundColor: tokens.foreground, color: tokens.background, cursor: !hasStatusChanged || processing ? "not-allowed" : "pointer", opacity: processing ? 0.7 : !hasStatusChanged ? 0.4 : saveBtnHovered ? 0.9 : 1, transition: "opacity 0.2s ease", whiteSpace: "nowrap" }}
                onMouseEnter={() => setSaveBtnHovered(true)} onMouseLeave={() => setSaveBtnHovered(false)}
              >
                {processing && <IconLoader />}
                {processing ? "Updating…" : "Update Status"}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main style={{ flex: 1, padding: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: "1.5rem", alignItems: "start" }}>
            {/* Left column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Items */}
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <h3 style={cardTitleStyle}><IconPackage /> Items ({items.length})</h3>
                </div>
                <div>
                  {items.length === 0 && (
                    <p style={{ padding: "1.5rem", fontSize: "0.875rem", color: tokens.mutedForeground, margin: 0 }}>No items found for this order.</p>
                  )}
                  {items.map((item, index) => (
                    <div key={item.id ?? index} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.5rem", borderBottom: index < items.length - 1 ? `1px solid ${tokens.border}` : "none" }}>
                      <div style={{ width: "56px", height: "72px", flexShrink: 0, borderRadius: tokens.radius, overflow: "hidden", backgroundColor: tokens.secondary }}>
                        {item.image ? (
                          <img src={item.image} alt={item.product_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: tokens.mutedForeground }}>
                            <IconPackage />
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 500, color: tokens.foreground, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.product_name}</p>
                        <p style={{ margin: "0.25rem 0 0", fontSize: "0.8125rem", color: tokens.mutedForeground }}>
                          {[item.size, item.color].filter(Boolean).join(" / ") || "—"} · Qty {item.quantity}
                        </p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 500, color: tokens.foreground }}>
                          {money(item.line_total != null ? item.line_total : Number(item.price) * Number(item.quantity))}
                        </p>
                        <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: tokens.mutedForeground }}>{money(item.price)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order timeline (optional) */}
              {Array.isArray(order.timeline) && order.timeline.length > 0 && (
                <div style={cardStyle}>
                  <div style={cardHeaderStyle}>
                    <h3 style={cardTitleStyle}>Order Timeline</h3>
                  </div>
                  <div style={{ padding: "1.5rem" }}>
                    {order.timeline.map((event, index) => (
                      <div key={index} style={{ display: "flex", gap: "0.875rem", position: "relative" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: tokens.foreground, flexShrink: 0, marginTop: "4px" }} />
                          {index < order.timeline.length - 1 && <div style={{ width: "1px", flex: 1, backgroundColor: tokens.border, minHeight: "28px" }} />}
                        </div>
                        <div style={{ paddingBottom: index < order.timeline.length - 1 ? "1rem" : 0 }}>
                          <p style={{ margin: 0, fontSize: "0.8125rem", fontWeight: 500, color: tokens.foreground }}>{event.label || event.status}</p>
                          <p style={{ margin: "0.125rem 0 0", fontSize: "0.75rem", color: tokens.mutedForeground }}>{formatDate(event.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {order.notes && (
                <div style={cardStyle}>
                  <div style={cardHeaderStyle}>
                    <h3 style={cardTitleStyle}>Notes</h3>
                  </div>
                  <div style={{ padding: "1.5rem" }}>
                    <p style={{ margin: 0, fontSize: "0.875rem", color: tokens.foreground, lineHeight: 1.6 }}>{order.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Customer */}
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <h3 style={cardTitleStyle}><IconUser /> Customer</h3>
                </div>
                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 500, color: tokens.foreground }}>{customer.name || "Guest"}</p>
                  <p style={{ margin: 0, fontSize: "0.8125rem", color: tokens.mutedForeground }}>{customer.email || "—"}</p>
                  <p style={{ margin: 0, fontSize: "0.8125rem", color: tokens.mutedForeground }}>{customer.phone || "—"}</p>
                </div>
              </div>

              {/* Shipping address */}
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <h3 style={cardTitleStyle}><IconMapPin /> Shipping Address</h3>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  {address ? (
                    <p style={{ margin: 0, fontSize: "0.8125rem", color: tokens.foreground, lineHeight: 1.7 }}>
                      {address.line1}<br />
                      {address.line2 && <>{address.line2}<br /></>}
                      {[address.city, address.region, address.postal_code].filter(Boolean).join(", ")}<br />
                      {address.country}
                    </p>
                  ) : (
                    <p style={{ margin: 0, fontSize: "0.8125rem", color: tokens.mutedForeground }}>No shipping address on file.</p>
                  )}
                </div>
              </div>

              {/* Order summary */}
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <h3 style={cardTitleStyle}><IconReceipt /> Order Summary</h3>
                </div>
                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                    <span style={{ color: tokens.mutedForeground }}>Subtotal</span>
                    <span style={{ color: tokens.foreground }}>{money(computedSubtotal)}</span>
                  </div>
                  {Number(order.discount_amount) > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                      <span style={{ color: tokens.mutedForeground }}>Discount</span>
                      <span style={{ color: tokens.destructive }}>-{money(order.discount_amount)}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                    <span style={{ color: tokens.mutedForeground }}>Shipping</span>
                    <span style={{ color: tokens.foreground }}>{order.shipping_fee ? money(order.shipping_fee) : "Free"}</span>
                  </div>
                  <div style={{ height: "1px", backgroundColor: tokens.border, margin: "0.375rem 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9375rem", fontWeight: 600 }}>
                    <span style={{ color: tokens.foreground }}>Total</span>
                    <span style={{ color: tokens.foreground }}>{money(order.total)}</span>
                  </div>
                  {order.payment_method && (
                    <p style={{ margin: "0.5rem 0 0", fontSize: "0.75rem", color: tokens.mutedForeground }}>
                      Paid via {order.payment_method}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderDetails;