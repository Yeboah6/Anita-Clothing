import React, { useState, useEffect } from "react";
import AdminSidebar from "@/Components/Admin/AdminSidebar";
import { usePage, router } from "@inertiajs/react";

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
  accent: "#ff6bb3",
};

const statusStyles = {
  pending: { backgroundColor: "#fef9c3", color: "#854d0e", border: "1px solid #fde68a" },
  approved: { backgroundColor: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" },
  rejected: { backgroundColor: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca" },
};

// ─── Icons ───────────────────────────────────────────────────────────────────
// const IconBell = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
//     <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
//     <path d="M13.73 21a2 2 0 0 1-3.46 0" />
//   </svg>
// );

const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconStar = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? tokens.accent : "none"} stroke={filled ? tokens.accent : tokens.mutedForeground} strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const StarDisplay = ({ rating }) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <IconStar key={n} filled={n <= rating} />
    ))}
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    style={{
      display: "inline-block",
      padding: "0.125rem 0.625rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: 500,
      textTransform: "capitalize",
      ...statusStyles[status],
    }}
  >
    {status}
  </span>
);

const FilterTab = ({ label, count, active, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "0.5rem 1rem",
        fontSize: "0.875rem",
        fontFamily: tokens.fontBody,
        fontWeight: active ? 600 : 500,
        border: "none",
        borderBottom: active ? `2px solid ${tokens.foreground}` : "2px solid transparent",
        backgroundColor: "transparent",
        color: active ? tokens.foreground : tokens.mutedForeground,
        cursor: "pointer",
        transition: "color 0.15s ease",
        display: "flex",
        alignItems: "center",
        gap: "0.375rem",
      }}
    >
      {label}
      <span
        style={{
          fontSize: "0.75rem",
          padding: "0.0625rem 0.4rem",
          borderRadius: "9999px",
          backgroundColor: active ? tokens.foreground : tokens.border,
          color: active ? tokens.background : tokens.mutedForeground,
        }}
      >
        {count}
      </span>
    </button>
  );
};

// ─── ReviewRow (own component — avoids useState-in-.map()) ──────────────────
const ReviewRow = ({ review }) => {
  const [approveHovered, setApproveHovered] = useState(false);
  const [rejectHovered, setRejectHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const updateStatus = (status) => {
    router.patch(`/admin/reviews/${review.id}/status`, { status }, { preserveScroll: true });
  };

  const handleDelete = () => {
    if (confirm("Delete this review permanently?")) {
      router.delete(`/admin/reviews/${review.id}`, { preserveScroll: true });
    }
  };

  const isLong = review.review.length > 160;
  const displayText = expanded || !isLong ? review.review : review.review.slice(0, 160) + "…";

  return (
    <tr style={{ borderBottom: `1px solid ${tokens.border}` }}>
      <td style={{ padding: "0.75rem 1.5rem", verticalAlign: "top" }}>
        <p style={{ margin: 0, fontWeight: 500, color: tokens.foreground, fontSize: "0.875rem" }}>{review.customer_name}</p>
        <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: tokens.mutedForeground }}>Order {review.order_number}</p>
      </td>
      <td style={{ padding: "0.75rem 1.5rem", verticalAlign: "top" }}>
        <p style={{ margin: 0, fontSize: "0.875rem", color: tokens.foreground }}>{review.product_name}</p>
      </td>
      <td style={{ padding: "0.75rem 1.5rem", verticalAlign: "top" }}>
        <StarDisplay rating={review.rating} />
      </td>
      <td style={{ padding: "0.75rem 1.5rem", verticalAlign: "top", maxWidth: "360px" }}>
        <p style={{ margin: 0, fontSize: "0.875rem", color: tokens.foreground, lineHeight: 1.5 }}>{displayText}</p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ background: "none", border: "none", padding: 0, marginTop: "0.25rem", fontSize: "0.75rem", color: tokens.mutedForeground, cursor: "pointer", textDecoration: "underline" }}
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </td>
      <td style={{ padding: "0.75rem 1.5rem", verticalAlign: "top", whiteSpace: "nowrap" }}>
        <p style={{ margin: 0, fontSize: "0.8125rem", color: tokens.mutedForeground }}>{review.created_at}</p>
      </td>
      <td style={{ padding: "0.75rem 1.5rem", verticalAlign: "top" }}>
        <StatusBadge status={review.status} />
      </td>
      <td style={{ padding: "0.75rem 1.5rem", verticalAlign: "top" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {review.status !== "approved" && (
            <button
              onClick={() => updateStatus("approved")}
              onMouseEnter={() => setApproveHovered(true)}
              onMouseLeave={() => setApproveHovered(false)}
              style={{
                padding: "0.375rem 0.75rem",
                fontSize: "0.75rem",
                fontWeight: 500,
                fontFamily: tokens.fontBody,
                borderRadius: tokens.radius,
                border: "1px solid #bbf7d0",
                backgroundColor: approveHovered ? "#dcfce7" : "transparent",
                color: "#166534",
                cursor: "pointer",
                transition: "background-color 0.15s ease",
              }}
            >
              Approve
            </button>
          )}
          {review.status !== "rejected" && (
            <button
              onClick={() => updateStatus("rejected")}
              onMouseEnter={() => setRejectHovered(true)}
              onMouseLeave={() => setRejectHovered(false)}
              style={{
                padding: "0.375rem 0.75rem",
                fontSize: "0.75rem",
                fontWeight: 500,
                fontFamily: tokens.fontBody,
                borderRadius: tokens.radius,
                border: "1px solid #fecaca",
                backgroundColor: rejectHovered ? "#fee2e2" : "transparent",
                color: "#991b1b",
                cursor: "pointer",
                transition: "background-color 0.15s ease",
              }}
            >
              Reject
            </button>
          )}
          <button
            onClick={handleDelete}
            onMouseEnter={() => setDeleteHovered(true)}
            onMouseLeave={() => setDeleteHovered(false)}
            style={{
              padding: "0.375rem 0.75rem",
              fontSize: "0.75rem",
              fontWeight: 500,
              fontFamily: tokens.fontBody,
              borderRadius: tokens.radius,
              border: `1px solid ${tokens.border}`,
              backgroundColor: deleteHovered ? tokens.border : "transparent",
              color: tokens.mutedForeground,
              cursor: "pointer",
              transition: "background-color 0.15s ease",
            }}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

// ─── AdminReviewsIndex Page ──────────────────────────────────────────────────
const AdminReviewsIndex = () => {
  const { reviews = [], meta = {}, filters = {}, counts = {} } = usePage().props;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState("/admin/reviews");
  const [searchFocused, setSearchFocused] = useState(false);

  const activeStatus = filters.status || "all";

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

  const setStatus = (status) => {
    router.get("/admin/reviews", { status }, { preserveState: true, replace: true });
  };

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
            {isMobile ? <IconMenu /> : (
              <IconChevronLeft
                style={{ transform: sidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
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
            {/* <button
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
            </button> */}
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#f6aab2",
                color: tokens.background,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 600,
                fontFamily: tokens.fontBody,
              }}
            >
              CB
            </div>
          </div>
        </header>

        {/* Page heading */}
        <div style={{ borderBottom: `1px solid ${tokens.border}`, backgroundColor: tokens.background, padding: "1.5rem" }}>
          <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>
            Reviews
          </h1>
          <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
            Approve, reject, or remove customer reviews before they appear on product pages
          </p>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, padding: "1.5rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", borderBottom: `1px solid ${tokens.border}`, marginBottom: "1.5rem" }}>
            <FilterTab label="All" count={counts.all || 0} active={activeStatus === "all"} onClick={() => setStatus("all")} />
            <FilterTab label="Pending" count={counts.pending || 0} active={activeStatus === "pending"} onClick={() => setStatus("pending")} />
            <FilterTab label="Approved" count={counts.approved || 0} active={activeStatus === "approved"} onClick={() => setStatus("approved")} />
            <FilterTab label="Rejected" count={counts.rejected || 0} active={activeStatus === "rejected"} onClick={() => setStatus("rejected")} />
          </div>

          <div style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, overflow: "hidden" }}>
            {reviews.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: tokens.mutedForeground, fontSize: "0.875rem" }}>
                No reviews in this filter.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: tokens.secondary, borderBottom: `1px solid ${tokens.border}` }}>
                      {["Customer", "Product", "Rating", "Review", "Date", "Status", "Actions"].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: "left",
                            padding: "0.75rem 1.5rem",
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: tokens.mutedForeground,
                            fontWeight: 600,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review) => (
                      <ReviewRow key={review.id} review={review} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {meta.last_page > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => router.get("/admin/reviews", { status: activeStatus, page }, { preserveState: true })}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: tokens.radius,
                    border: `1px solid ${tokens.border}`,
                    backgroundColor: page === meta.current_page ? tokens.foreground : tokens.background,
                    color: page === meta.current_page ? tokens.background : tokens.foreground,
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminReviewsIndex;