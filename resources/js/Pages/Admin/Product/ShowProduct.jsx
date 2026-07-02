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

// Palette used to render a color swatch next to each variant row.
// The DB only stores the color name (e.g. "Black"), so we resolve the hex
// value locally rather than persisting a redundant column.
const availableColors = [
  { name: "Black", hex: "#1a1a1a" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy", hex: "#000080" },
  { name: "Camel", hex: "#C19A6B" },
  { name: "Champagne", hex: "#F7E7CE" },
  { name: "Olive", hex: "#808000" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Sage", hex: "#9CAF88" },
  { name: "Blush", hex: "#DE5D83" },
];

const getColorHex = (colorName) =>
  availableColors.find((c) => c.name?.toLowerCase() === (colorName || "").toLowerCase())?.hex || null;

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

const IconPencil = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const IconArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconStar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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

const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconTag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const IconDollarSign = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconImageOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

// ─── ShowProduct Page ──────────────────────────────────────────────────────
// Expects an Inertia prop:
//   product: { id, name, sku, description, price, discount_amount, stock_quantity,
//              featured, status, created_at, category: { id, name },
//              images: [{ id, image, url }], variants: [{ id, size, color, stock_quantity }] }
const ShowProduct = ({ product }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState("/admin/products");
  const [selectedImage, setSelectedImage] = useState(0);
  const [editBtnHovered, setEditBtnHovered] = useState(false);
  const [backBtnHovered, setBackBtnHovered] = useState(false);

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

  const getStatusStyle = (status) => {
    const styles = {
      active: { backgroundColor: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" },
      draft: { backgroundColor: tokens.secondary, color: tokens.mutedForeground, border: `1px solid ${tokens.border}` },
      archived: { backgroundColor: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca" },
    };
    return styles[status] || styles.active;
  };

  // Eloquent decimal columns serialize as strings — normalize before doing math.
  const price = parseFloat(product.price) || 0;
  const discountAmount = parseFloat(product.discount_amount) || 0;
  const finalPrice = (price - discountAmount).toFixed(2);

  const images = product.images ?? [];
  const variants = product.variants ?? [];

  const formattedCreatedAt = product.created_at
    ? new Date(product.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : "—";

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
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = tokens.secondary)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <IconBell />
            </button>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: tokens.foreground, color: tokens.background, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 600, fontFamily: tokens.fontBody }}>AN</div>
          </div>
        </header>

        {/* Page heading */}
        <div style={{ borderBottom: `1px solid ${tokens.border}`, backgroundColor: tokens.background, padding: "1.5rem" }}>
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <a
                href="/admin/products"
                style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", fontWeight: 500, fontFamily: tokens.fontBody, textDecoration: "none", color: backBtnHovered ? tokens.foreground : tokens.mutedForeground, transition: "color 0.15s ease", whiteSpace: "nowrap" }}
                onMouseEnter={() => setBackBtnHovered(true)}
                onMouseLeave={() => setBackBtnHovered(false)}
              >
                <IconArrowLeft />
                Back
              </a>
              <div>
                <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                  {product.name}
                </h1>
                <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
                  SKU: {product.sku}
                </p>
              </div>
            </div>
            <a
              href={`/admin/products/${product.id}/edit`}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1.25rem",
                fontSize: "0.875rem", fontWeight: 500, fontFamily: tokens.fontBody,
                borderRadius: tokens.radius, border: `1px solid ${tokens.border}`,
                backgroundColor: editBtnHovered ? tokens.secondary : "transparent",
                color: tokens.foreground, textDecoration: "none", cursor: "pointer",
                transition: "background-color 0.2s ease", whiteSpace: "nowrap",
              }}
              onMouseEnter={() => setEditBtnHovered(true)}
              onMouseLeave={() => setEditBtnHovered(false)}
            >
              <IconPencil />
              Edit Product
            </a>
          </div>
        </div>

        {/* Content */}
        <main style={{ flex: 1, padding: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1.5rem" }}>
            {/* Left column - Images */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Main image */}
              <div style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, overflow: "hidden" }}>
                <div style={{ paddingBottom: "100%", position: "relative", backgroundColor: tokens.secondary }}>
                  {images.length > 0 ? (
                    <img
                      src={images[selectedImage]?.url}
                      alt={product.name}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: tokens.mutedForeground }}>
                      <IconImageOff />
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail gallery */}
              {images.length > 1 && (
                <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto" }}>
                  {images.map((img, index) => (
                    <button
                      key={img.id ?? index}
                      onClick={() => setSelectedImage(index)}
                      style={{
                        width: "80px", height: "80px", flexShrink: 0,
                        borderRadius: tokens.radius, overflow: "hidden",
                        border: selectedImage === index ? `2px solid ${tokens.foreground}` : `1px solid ${tokens.border}`,
                        cursor: "pointer", padding: 0, backgroundColor: tokens.secondary,
                        transition: "border-color 0.15s ease", opacity: selectedImage === index ? 1 : 0.6,
                      }}
                    >
                      <img src={img.url} alt={`${product.name} ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right column - Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Product Info Card */}
              <div style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, overflow: "hidden" }}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${tokens.border}` }}>
                  <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.125rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                    Product Information
                  </h3>
                </div>
                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {/* Price & Status */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                      <span style={{ fontFamily: tokens.fontDisplay, fontSize: "2rem", fontWeight: 500, color: tokens.foreground }}>
                        ${finalPrice}
                      </span>
                      {discountAmount > 0 && (
                        <span style={{ fontSize: "1.125rem", color: tokens.mutedForeground, textDecoration: "line-through" }}>
                          ${price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span style={{ ...getStatusStyle(product.status), display: "inline-block", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 500, textTransform: "capitalize" }}>
                      {product.status}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div style={{ padding: "0.5rem 0.75rem", borderRadius: tokens.radius, backgroundColor: "#fef3c7", border: "1px solid #fcd34d", fontSize: "0.8125rem", color: "#92400e" }}>
                      Discount: ${discountAmount.toFixed(2)} off
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, lineHeight: 1.7, margin: 0 }}>
                      {product.description}
                    </p>
                  </div>

                  {/* Info grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", paddingTop: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                      <span style={{ color: tokens.mutedForeground, marginTop: "2px" }}><IconTag /></span>
                      <div>
                        <p style={{ fontSize: "0.75rem", color: tokens.mutedForeground, margin: 0 }}>Category</p>
                        <p style={{ fontSize: "0.875rem", fontWeight: 500, color: tokens.foreground, margin: "2px 0 0" }}>{product.category?.name ?? "—"}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                      <span style={{ color: tokens.mutedForeground, marginTop: "2px" }}><IconDollarSign /></span>
                      <div>
                        <p style={{ fontSize: "0.75rem", color: tokens.mutedForeground, margin: 0 }}>SKU</p>
                        <p style={{ fontSize: "0.875rem", fontWeight: 500, color: tokens.foreground, margin: "2px 0 0" }}>{product.sku}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                      <span style={{ color: tokens.mutedForeground, marginTop: "2px" }}><IconPackage /></span>
                      <div>
                        <p style={{ fontSize: "0.75rem", color: tokens.mutedForeground, margin: 0 }}>Stock</p>
                        <p style={{ fontSize: "0.875rem", fontWeight: 500, color: tokens.foreground, margin: "2px 0 0" }}>{product.stock_quantity} units</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                      <span style={{ color: tokens.mutedForeground, marginTop: "2px" }}><IconCalendar /></span>
                      <div>
                        <p style={{ fontSize: "0.75rem", color: tokens.mutedForeground, margin: 0 }}>Created</p>
                        <p style={{ fontSize: "0.875rem", fontWeight: 500, color: tokens.foreground, margin: "2px 0 0" }}>{formattedCreatedAt}</p>
                      </div>
                    </div>
                  </div>

                  {/* Featured badge */}
                  {product.featured && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", paddingTop: "0.25rem" }}>
                      <span style={{ color: "#f59e0b" }}><IconStar /></span>
                      <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#92400e" }}>Featured Product</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Variants Card */}
              <div style={{ backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, overflow: "hidden" }}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${tokens.border}` }}>
                  <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.125rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                    Variants ({variants.length})
                  </h3>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  {variants.length > 0 ? (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${tokens.border}` }}>
                            <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Size</th>
                            <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Color</th>
                            <th style={{ textAlign: "right", padding: "0.5rem 0.75rem", fontWeight: 500, color: tokens.mutedForeground, whiteSpace: "nowrap" }}>Stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {variants.map((variant) => {
                            const colorHex = getColorHex(variant.color);
                            return (
                              <tr key={variant.id} style={{ borderBottom: `1px solid ${tokens.border}` }}>
                                <td style={{ padding: "0.5rem 0.75rem", color: tokens.foreground }}>{variant.size || "—"}</td>
                                <td style={{ padding: "0.5rem 0.75rem" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    {colorHex && (
                                      <span style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: colorHex, border: "1px solid rgba(0,0,0,0.2)", flexShrink: 0 }} />
                                    )}
                                    <span style={{ color: tokens.foreground }}>{variant.color || "—"}</span>
                                  </div>
                                </td>
                                <td style={{ padding: "0.5rem 0.75rem", textAlign: "right" }}>
                                  <span style={{
                                    display: "inline-block", padding: "0.125rem 0.5rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 500,
                                    backgroundColor: variant.stock_quantity > 10 ? "#dcfce7" : variant.stock_quantity > 0 ? "#fef3c7" : "#fee2e2",
                                    color: variant.stock_quantity > 10 ? "#166534" : variant.stock_quantity > 0 ? "#92400e" : "#991b1b",
                                  }}>
                                    {variant.stock_quantity}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ fontSize: "0.8125rem", color: tokens.mutedForeground, textAlign: "center", padding: "1rem 0", margin: 0 }}>
                      No variants for this product.
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

export default ShowProduct;