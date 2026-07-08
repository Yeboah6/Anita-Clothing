import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
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

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23bbbbbb' stroke-width='1.5'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";

const LOW_STOCK_THRESHOLD = 20;

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

const IconTrash2 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const IconPackage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconTag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2z" />
    <path d="M7 7h.01" />
  </svg>
);

const IconStar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconAlertCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ─── Product Row (its own component so each row can hold its own hover state) ─
const ProductRow = ({ product, onDelete }) => {
  const [viewHovered, setViewHovered] = useState(false);
  const [editHovered, setEditHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);

  const thumbnail = product.images?.[0] || PLACEHOLDER_IMAGE;
  const isLowStock = product.stock_quantity < LOW_STOCK_THRESHOLD;

  const statusBadge = () => {
    if (product.status === "archived") {
      return { label: "Archived", bg: "transparent", color: tokens.mutedForeground };
    }
    if (product.status === "draft") {
      return { label: "Draft", bg: tokens.secondary, color: tokens.mutedForeground };
    }
    return { label: "Active", bg: "transparent", color: tokens.foreground };
  };
  const badge = statusBadge();

  return (
    <tr style={{ borderBottom: `1px solid ${tokens.border}` }}>
      <td style={{ padding: "0.75rem 1.5rem" }}>
        <div style={{ width: "48px", height: "48px", overflow: "hidden", backgroundColor: tokens.secondary, borderRadius: tokens.radius, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img
            src={thumbnail}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </td>
      <td style={{ padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.foreground }}>
        {product.name}
        {product.featured && (
          <span style={{ marginLeft: "0.5rem", fontSize: "0.7rem", color: tokens.mutedForeground, fontWeight: 400 }}>
            ★ Featured
          </span>
        )}
      </td>
      <td style={{ padding: "0.75rem 1.5rem", color: tokens.mutedForeground }}>
        {product.category}
      </td>
      <td style={{ padding: "0.75rem 1.5rem", color: tokens.foreground }}>
        ${Number(product.price).toFixed(2)}
        {product.discount_amount > 0 && (
          <span style={{ marginLeft: "0.375rem", fontSize: "0.75rem", color: tokens.mutedForeground, textDecoration: "line-through" }}>
            ${(Number(product.price) + Number(product.discount_amount)).toFixed(2)}
          </span>
        )}
      </td>
      <td style={{ padding: "0.75rem 1.5rem" }}>
        <span
          style={{
            display: "inline-block",
            padding: "0.125rem 0.625rem",
            borderRadius: "9999px",
            fontSize: "0.75rem",
            fontWeight: 500,
            backgroundColor: badge.bg,
            color: badge.color,
            border: `1px solid ${tokens.border}`,
          }}
        >
          {badge.label}
        </span>
        {product.is_new_arrival && (
          <span
            style={{
              display: "inline-block",
              marginLeft: "0.375rem",
              padding: "0.125rem 0.625rem",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: 500,
              backgroundColor: tokens.secondary,
              color: tokens.foreground,
              border: `1px solid ${tokens.border}`,
            }}
          >
            New
          </span>
        )}
      </td>
      <td style={{ padding: "0.75rem 1.5rem", color: isLowStock ? tokens.destructive : tokens.mutedForeground, fontWeight: isLowStock ? 600 : 400 }}>
        {product.stock_quantity}
      </td>
      <td style={{ padding: "0.75rem 1.5rem", textAlign: "right" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.25rem" }}>
          <a
            href={`/admin/products/${product.id}`}
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
            href={`/admin/products/${product.id}/edit`}
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
            aria-label="Delete"
            onClick={() => onDelete(product)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: tokens.radius,
              border: "none",
              background: deleteHovered ? "#fee2e2" : "transparent",
              cursor: "pointer",
              color: deleteHovered ? tokens.destructive : tokens.foreground,
              transition: "background-color 0.15s ease, color 0.15s ease",
            }}
            onMouseEnter={() => setDeleteHovered(true)}
            onMouseLeave={() => setDeleteHovered(false)}
          >
            <IconTrash2 />
          </button>
        </div>
      </td>
    </tr>
  );
};

// ─── AdminProducts Page ──────────────────────────────────────────────────────
const AdminProducts = ({ products = [], categories = [] }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState("/admin/products");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [addBtnHovered, setAddBtnHovered] = useState(false);
  const [addCatBtnHovered, setAddCatBtnHovered] = useState(false);

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

  const handleDelete = (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    router.delete(`/admin/products/${product.id}`, { preserveScroll: true });
  };

  // Filter products by search query (name or category)
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── Metrics (derived from real data) ───────────────────────────────────
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const newArrivals = products.filter((p) => p.is_new_arrival).length;
  const lowStock = products.filter((p) => p.stock_quantity < LOW_STOCK_THRESHOLD).length;

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
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: "1rem" }}>
            <div>
              <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                Products
              </h1>
              <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
                Manage your product catalog — {totalProducts} item{totalProducts === 1 ? "" : "s"}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a
                href="/admin/categories/add"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  fontFamily: tokens.fontBody,
                  borderRadius: tokens.radius,
                  border: `1px solid ${tokens.border}`,
                  backgroundColor: addCatBtnHovered ? tokens.secondary : "transparent",
                  color: tokens.foreground,
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                }}
                onMouseEnter={() => setAddCatBtnHovered(true)}
                onMouseLeave={() => setAddCatBtnHovered(false)}
              >
                <IconPlus />
                Add Category
              </a>
              <a
                href="/admin/products/add"
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
                  backgroundColor: tokens.foreground,
                  color: tokens.background,
                  cursor: "pointer",
                  opacity: addBtnHovered ? 0.9 : 1,
                  transition: "opacity 0.2s ease",
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                }}
                onMouseEnter={() => setAddBtnHovered(true)}
                onMouseLeave={() => setAddBtnHovered(false)}
              >
                <IconPlus />
                Add Product
              </a>
            </div>
          </div>

          {/* Search bar for mobile */}
          {isMobile && (
            <div style={{ position: "relative", width: "100%" }}>
              <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: tokens.mutedForeground, display: "flex" }}>
                <IconSearch />
              </span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  height: "40px",
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
          )}
        </div>

        {/* Page content */}
        <main style={{ flex: 1, padding: "1.5rem" }}>
          {/* ─── Metric Cards ────────────────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <MetricCard icon={<IconPackage />} label="Total Products" value={totalProducts} color={tokens.foreground} />
            <MetricCard icon={<IconTag />} label="Categories" value={totalCategories} color={tokens.foreground} />
            <MetricCard icon={<IconStar />} label="New Arrivals" value={newArrivals} color={tokens.green} />
            <MetricCard
              icon={<IconAlertCircle />}
              label="Low Stock"
              value={lowStock}
              color={lowStock > 0 ? tokens.destructive : tokens.mutedForeground}
            />
          </div>

          {/* Products table card */}
          <div style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, overflow: "hidden" }}>
            <div style={{ padding: "1.5rem", borderBottom: isMobile ? `1px solid ${tokens.border}` : "none" }}>
              {/* Desktop search in card */}
              {!isMobile && (
                <div style={{ position: "relative", maxWidth: "320px", marginBottom: "1rem" }}>
                  <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: tokens.mutedForeground, display: "flex" }}>
                    <IconSearch />
                  </span>
                  <input
                    type="text"
                    placeholder="Search products..."
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
              )}
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${tokens.border}` }}>
                    <th style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap", width: "64px" }}>Image</th>
                    <th style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Name</th>
                    <th style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Category</th>
                    <th style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Price</th>
                    <th style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Status</th>
                    <th style={{ textAlign: "left", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Stock</th>
                    <th style={{ textAlign: "right", padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: "3rem 1.5rem", textAlign: "center", color: tokens.mutedForeground }}>
                        {products.length === 0
                          ? "No products yet — click \"Add Product\" to create your first one."
                          : `No products found matching "${searchQuery}"`}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <ProductRow key={product.id} product={product} onDelete={handleDelete} />
                    ))
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

// ─── Metric Card Component ──────────────────────────────────────────────────
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

export default AdminProducts;