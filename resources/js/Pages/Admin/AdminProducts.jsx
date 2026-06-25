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
const categories = [
  { id: "1", name: "Dresses", slug: "dresses", description: "Elegant dresses for every occasion", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80", productCount: 24 },
  { id: "2", name: "Tops", slug: "tops", description: "Sophisticated tops and blouses", image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80", productCount: 32 },
  { id: "3", name: "Bottoms", slug: "bottoms", description: "Refined pants, skirts, and shorts", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80", productCount: 18 },
  { id: "4", name: "Outerwear", slug: "outerwear", description: "Timeless coats and jackets", image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80", productCount: 12 },
  { id: "5", name: "Accessories", slug: "accessories", description: "Finishing touches for your look", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80", productCount: 28 },
];

const products = [
  { id: "1", name: "Silk Midi Dress", price: 289, images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80"], category: "dresses", isNewArrival: true },
  { id: "2", name: "Cashmere Wrap Coat", price: 495, images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200&q=80"], category: "outerwear", isNewArrival: true },
  { id: "3", name: "Linen Palazzo Pants", price: 165, images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&q=80"], category: "bottoms", isNewArrival: true },
  { id: "4", name: "Silk Camisole", price: 125, images: ["https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=200&q=80"], category: "tops", isNewArrival: true },
  { id: "5", name: "Leather Crossbody Bag", price: 245, images: ["https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=200&q=80"], category: "accessories", isNewArrival: true },
  { id: "6", name: "Tailored Wool Blazer", price: 345, images: ["https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=200&q=80"], category: "outerwear", isNewArrival: false },
  { id: "7", name: "Pleated Maxi Skirt", price: 195, images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&q=80"], category: "bottoms", isNewArrival: true },
  { id: "8", name: "Oversized Cotton Shirt", price: 145, images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&q=80"], category: "tops", isNewArrival: false },
];

const getCategoryName = (slug) => categories.find((c) => c.slug === slug)?.name || slug;

// Seed for consistent random stock
const getStock = (id) => {
  const stocks = { "1": 34, "2": 18, "3": 45, "4": 52, "5": 28, "6": 12, "7": 38, "8": 41 };
  return stocks[id] || Math.floor(Math.random() * 50) + 5;
};

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

const IconTrash2 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

// ─── AdminProducts Page ──────────────────────────────────────────────────────
const AdminProducts = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState("/admin/products");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [addBtnHovered, setAddBtnHovered] = useState(false);

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

  // Filter products by search query
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getCategoryName(p.category).toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                Manage your product catalog — {products.length} items
              </p>
            </div>
            <button
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
              }}
              onMouseEnter={() => setAddBtnHovered(true)}
              onMouseLeave={() => setAddBtnHovered(false)}
            >
              <IconPlus />
              Add Product
            </button>
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
                        No products found matching "{searchQuery}"
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => {
                      const [editHovered, setEditHovered] = useState(false);
                      const [deleteHovered, setDeleteHovered] = useState(false);

                      return (
                        <tr key={product.id} style={{ borderBottom: `1px solid ${tokens.border}` }}>
                          <td style={{ padding: "0.75rem 1.5rem" }}>
                            <div style={{ width: "48px", height: "48px", overflow: "hidden", backgroundColor: tokens.secondary, borderRadius: tokens.radius }}>
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            </div>
                          </td>
                          <td style={{ padding: "0.75rem 1.5rem", fontWeight: 500, color: tokens.foreground }}>
                            {product.name}
                          </td>
                          <td style={{ padding: "0.75rem 1.5rem", color: tokens.mutedForeground }}>
                            {getCategoryName(product.category)}
                          </td>
                          <td style={{ padding: "0.75rem 1.5rem", color: tokens.foreground }}>
                            ${product.price}
                          </td>
                          <td style={{ padding: "0.75rem 1.5rem" }}>
                            {product.isNewArrival ? (
                              <span
                                style={{
                                  display: "inline-block",
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
                            ) : (
                              <span
                                style={{
                                  display: "inline-block",
                                  padding: "0.125rem 0.625rem",
                                  borderRadius: "9999px",
                                  fontSize: "0.75rem",
                                  fontWeight: 500,
                                  backgroundColor: "transparent",
                                  color: tokens.mutedForeground,
                                  border: `1px solid ${tokens.border}`,
                                }}
                              >
                                Active
                              </span>
                            )}
                          </td>
                          <td style={{ padding: "0.75rem 1.5rem", color: tokens.mutedForeground }}>
                            {getStock(product.id)}
                          </td>
                          <td style={{ padding: "0.75rem 1.5rem", textAlign: "right" }}>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.25rem" }}>
                              <button
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
                                }}
                                onMouseEnter={() => setEditHovered(true)}
                                onMouseLeave={() => setEditHovered(false)}
                              >
                                <IconPencil />
                              </button>
                              <button
                                aria-label="Delete"
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

export default AdminProducts;