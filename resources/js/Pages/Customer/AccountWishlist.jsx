import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
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

// ─── Get active path from URL ────────────────────────────────────────────────
const getActivePath = () => window.location.pathname;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("");
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconHeart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// ─── Toast Component ─────────────────────────────────────────────────────────
const Toast = ({ message, visible, type = "success" }) => {
  if (!visible) return null;
  return (
    <div style={{
      position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)", zIndex: 100,
      backgroundColor: type === "error" ? tokens.destructive : tokens.foreground,
      color: tokens.background, padding: "0.75rem 1.5rem",
      borderRadius: tokens.radius, fontFamily: tokens.fontBody, fontSize: "0.875rem",
      fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    }}>
      {message}
    </div>
  );
};

// ─── Wishlist Product Card ───────────────────────────────────────────────────
const WishlistCard = ({ item, onRemove, onAddToBag, removingId, addingId }) => {
  const [hovered, setHovered] = useState(false);
  const [removeBtnHovered, setRemoveBtnHovered] = useState(false);
  const [addBtnHovered, setAddBtnHovered] = useState(false);

  const product = item.product;
  const isRemoving = removingId === item.id;
  const isAdding = addingId === product.id;

  const rawImage = product.images?.[0] ?? product.image ?? null;
  const image = typeof rawImage === "string" ? rawImage : rawImage?.url ?? null;

  if (!product) return null;

  return (
    <div
      style={{ position: "relative", opacity: isRemoving ? 0.4 : 1, transition: "opacity 0.2s ease" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Remove button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(item);
        }}
        disabled={isRemoving}
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
          cursor: isRemoving ? "default" : "pointer",
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
        href={`/product/${product.slug ?? product.id}`}
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
          {image ? (
            <img
              src={image}
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
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: tokens.mutedForeground, fontSize: "0.75rem" }}>
              No image
            </div>
          )}
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
            ₵{product.price}
          </p>
        </div>
      </a>

      {/* Add to Bag button */}
      {/* <button
        onClick={() => onAddToBag(product)}
        disabled={isAdding}
        style={{
          width: "100%",
          marginTop: "0.75rem",
          padding: "0.5rem 1rem",
          fontSize: "0.8125rem",
          fontWeight: 500,
          fontFamily: tokens.fontBody,
          borderRadius: tokens.radius,
          border: `1px solid #f6aab2`,
          backgroundColor: addBtnHovered ? "#f6aab2" : "transparent",
          color: addBtnHovered ? "#fff" : tokens.foreground,
          cursor: isAdding ? "default" : "pointer",
          opacity: isAdding ? 0.6 : 1,
          transition: "background-color 0.2s ease, opacity 0.2s ease",
        }}
        onMouseEnter={() => setAddBtnHovered(true)}
        onMouseLeave={() => setAddBtnHovered(false)}
      >
        {isAdding ? "Adding..." : "Add to Bag"}
      </button> */}
    </div>
  );
};

// ─── AccountWishlist Page ────────────────────────────────────────────────────
const AccountWishlist = ({ wishlistItems = [], user }) => {
  const { auth } = usePage().props;
  const currentUser = user ?? auth?.user ?? null;

  const [isDesktop, setIsDesktop] = useState(false);
  const [activePath, setActivePath] = useState("/account/wishlist");
  const [browseBtnHovered, setBrowseBtnHovered] = useState(false);
  const [items, setItems] = useState(wishlistItems);
  const [removingId, setRemovingId] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success", visible: false });

  useEffect(() => {
    injectFonts();
    setActivePath(getActivePath());

    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keep local list in sync if the server prop changes (e.g. after an Inertia reload)
  useEffect(() => {
    setItems(wishlistItems);
  }, [wishlistItems]);

  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  };

  const handleNavigate = (url) => {
    window.history.pushState({}, "", url);
    setActivePath(url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleRemove = async (item) => {
    setRemovingId(item.id);
    // Optimistic: pull it from the list, restore on failure
    const previous = items;
    setItems((prev) => prev.filter((i) => i.id !== item.id));

    try {
      await axios.delete(`/wishlist/${item.product.id}`);
    } catch (error) {
      console.error("Error removing wishlist item:", error);
      setItems(previous);
      showToast("Failed to remove item. Please try again.", "error");
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToBag = async (product) => {
    setAddingId(product.id);
    try {
      await axios.post("/cart", {
        product_id: product.id,
        size: null,
        color: null,
        quantity: 1,
      });
      showToast(`${product.name} added to bag`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast("Failed to add item to bag. Please try again.", "error");
    } finally {
      setAddingId(null);
    }
  };

  const getGridColumns = () => (isDesktop ? "1fr 1fr 1fr" : "1fr 1fr");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
      <Header />
      <Toast message={toast.message} visible={toast.visible} type={toast.type} />

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
                  backgroundColor: "#f6aab2", color: tokens.background,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: tokens.fontDisplay, fontSize: "1.125rem", fontWeight: 600, flexShrink: 0,
                }}
              >
                {getInitials(currentUser?.name)}
              </div>
              <div>
                <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: 0 }}>Welcome back,</p>
                <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, margin: "0.25rem 0 0", color: tokens.foreground }}>
                  {currentUser?.name || ""}
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
                  {items.length > 0
                    ? `${items.length} piece${items.length === 1 ? "" : "s"} saved for later`
                    : "Pieces you've saved for later"}
                </p>
              </div>

              {items.length === 0 ? (
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
                  {items.map((item) => (
                    <WishlistCard
                      key={item.id}
                      item={item}
                      onRemove={handleRemove}
                      onAddToBag={handleAddToBag}
                      removingId={removingId}
                      addingId={addingId}
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