import React, { useState, useEffect } from "react";
import AccountSidebar from '@/Components/Customer/AccountSidebar';
import Header from '@/Components/Layout/Header';
import Footer from '@/Components/Layout/Footer';

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
  destructive: "#ef4444",
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const mockCurrentCustomer = {
  name: "Sofia Marchetti",
  email: "sofia.m@example.com",
  avatar: "SM",
};

const products = [
  { id: "1", name: "Silk Midi Dress", price: 289, images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80"], category: "dresses" },
  { id: "2", name: "Cashmere Wrap Coat", price: 495, images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&q=80"], category: "outerwear" },
  { id: "3", name: "Linen Palazzo Pants", price: 165, images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80"], category: "bottoms" },
  { id: "4", name: "Silk Camisole", price: 125, images: ["https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80"], category: "tops" },
  { id: "5", name: "Leather Crossbody Bag", price: 245, images: ["https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&q=80"], category: "accessories" },
  { id: "6", name: "Tailored Wool Blazer", price: 345, images: ["https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&q=80"], category: "outerwear" },
  { id: "7", name: "Pleated Maxi Skirt", price: 195, images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80"], category: "bottoms" },
  { id: "8", name: "Oversized Cotton Shirt", price: 145, images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80"], category: "tops" },
];

const mockWishlist = ["2", "4", "5", "7"];

// ─── Get active path from URL ────────────────────────────────────────────────
const getActivePath = () => {
  const path = window.location.pathname;
  return path;
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconShoppingBagHeader = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconHeart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconXLarge = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Wishlist Product Card ───────────────────────────────────────────────────
const WishlistCard = ({ product, onRemove }) => {
  const [hovered, setHovered] = useState(false);
  const [removeBtnHovered, setRemoveBtnHovered] = useState(false);
  const [addBtnHovered, setAddBtnHovered] = useState(false);

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Remove button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onRemove) onRemove(product.id);
        }}
        aria-label="Remove from wishlist"
        style={{
          position: "absolute",
          right: "0.5rem",
          top: "0.5rem",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: removeBtnHovered ? tokens.background : "rgba(255,255,255,0.9)",
          color: tokens.foreground,
          cursor: "pointer",
          opacity: hovered || removeBtnHovered ? 1 : 0,
          transition: "opacity 0.2s ease, background-color 0.15s ease",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
        onMouseEnter={() => setRemoveBtnHovered(true)}
        onMouseLeave={() => setRemoveBtnHovered(false)}
      >
        <IconX />
      </button>

      {/* Product link */}
      <a
        href={`/product/${product.id}`}
        style={{ display: "block", textDecoration: "none", color: "inherit" }}
      >
        {/* Image */}
        <div
          style={{
            overflow: "hidden",
            backgroundColor: tokens.secondary,
            position: "relative",
            paddingBottom: "133.33%",
            borderRadius: tokens.radius,
          }}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            style={{
              position: "absolute",
              inset: 0,
              height: "100%",
              width: "100%",
              objectFit: "cover",
              transition: "transform 500ms ease",
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        </div>

        {/* Info */}
        <div style={{ marginTop: "0.75rem" }}>
          <h3 style={{
            fontFamily: tokens.fontDisplay,
            fontSize: "1.125rem",
            fontWeight: 500,
            margin: "0 0 0.25rem",
            color: tokens.foreground,
          }}>
            {product.name}
          </h3>
          <p style={{
            fontSize: "0.875rem",
            color: tokens.mutedForeground,
            margin: 0,
            fontFamily: tokens.fontBody,
          }}>
            ${product.price}
          </p>
        </div>
      </a>

      {/* Add to Bag button */}
      <button
        style={{
          width: "100%",
          marginTop: "0.75rem",
          padding: "0.5rem 1rem",
          fontSize: "0.8125rem",
          fontWeight: 500,
          fontFamily: tokens.fontBody,
          borderRadius: tokens.radius,
          border: `1px solid ${tokens.border}`,
          backgroundColor: addBtnHovered ? tokens.secondary : "transparent",
          color: tokens.foreground,
          cursor: "pointer",
          transition: "background-color 0.2s ease",
        }}
        onMouseEnter={() => setAddBtnHovered(true)}
        onMouseLeave={() => setAddBtnHovered(false)}
      >
        Add to Bag
      </button>
    </div>
  );
};

// ─── AccountWishlist Page ────────────────────────────────────────────────────
const AccountWishlist = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [activePath, setActivePath] = useState("/account/wishlist");
  const [wishlistIds, setWishlistIds] = useState(mockWishlist);
  const [browseBtnHovered, setBrowseBtnHovered] = useState(false);

  useEffect(() => {
    injectFonts();
    setActivePath(getActivePath());

    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleRemove = (productId) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  const handleNavigate = (url) => {
    // SPA-style navigation
    window.history.pushState({}, "", url);
    setActivePath(url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const getGridColumns = () => {
    if (isDesktop) return "1fr 1fr 1fr";
    return "1fr 1fr";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
      <Header />

      <main style={{ flex: 1, backgroundColor: "rgba(245,245,245,0.6)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1rem" }}>
          {/* Page header */}
          <div
            style={{
              display: "flex",
              flexDirection: isDesktop ? "row" : "column",
              alignItems: isDesktop ? "center" : "flex-start",
              justifyContent: "space-between",
              gap: "1rem",
              marginBottom: "2rem",
              paddingBottom: "2rem",
              borderBottom: `1px solid ${tokens.border}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "56px", height: "56px", borderRadius: "50%",
                  backgroundColor: tokens.foreground, color: tokens.background,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: tokens.fontDisplay, fontSize: "1.125rem", fontWeight: 600, flexShrink: 0,
                }}
              >
                {mockCurrentCustomer.avatar}
              </div>
              <div>
                <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: 0 }}>Welcome back,</p>
                <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, margin: "0.25rem 0 0", color: tokens.foreground }}>
                  {mockCurrentCustomer.name}
                </h1>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isDesktop ? "220px 1fr" : "1fr",
              gap: isDesktop ? "3rem" : "2rem",
            }}
          >
            {/* Sidebar */}
            <AccountSidebar
              activePath={activePath}
              onNavigate={handleNavigate}
            />

            {/* Content */}
            <section>
              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.5rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                  Wishlist
                </h2>
                <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
                  {wishlistProducts.length > 0
                    ? `${wishlistProducts.length} pieces saved for later`
                    : "Pieces you've saved for later"}
                </p>
              </div>

              {wishlistProducts.length === 0 ? (
                /* Empty state */
                <div
                  style={{
                    backgroundColor: tokens.background,
                    border: `1px solid ${tokens.border}`,
                    borderRadius: tokens.radius,
                    padding: "4rem 1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <div style={{ color: tokens.mutedForeground, marginBottom: "1rem" }}>
                    <IconHeart />
                  </div>
                  <p style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, color: tokens.foreground, margin: 0 }}>
                    Your wishlist is empty
                  </p>
                  <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: tokens.mutedForeground, lineHeight: 1.6 }}>
                    Save your favorite pieces to find them easily later.
                  </p>
                  <a
                    href="/collections"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "1.5rem",
                      padding: "0.625rem 1.5rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      fontFamily: tokens.fontBody,
                      textDecoration: "none",
                      borderRadius: tokens.radius,
                      border: "none",
                      backgroundColor: tokens.foreground,
                      color: tokens.background,
                      cursor: "pointer",
                      opacity: browseBtnHovered ? 0.9 : 1,
                      transition: "opacity 0.2s ease",
                    }}
                    onMouseEnter={() => setBrowseBtnHovered(true)}
                    onMouseLeave={() => setBrowseBtnHovered(false)}
                  >
                    Start Browsing
                  </a>
                </div>
              ) : (
                /* Products grid */
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: getGridColumns(),
                    gap: isDesktop ? "1.5rem" : "1rem",
                  }}
                >
                  {wishlistProducts.map((product) => (
                    <WishlistCard
                      key={product.id}
                      product={product}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountWishlist;