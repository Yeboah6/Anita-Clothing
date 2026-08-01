import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import Header from '@/Components/Layout/Header';
import Footer from '@/Components/Layout/Footer';
import { useCart } from "@/Context/CartContext";
import { getColorHexes } from "@/Constants/colors";

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

// const getColorHex = (colorName) =>
//   availableColors.find((c) => c.name?.toLowerCase() === (colorName || "").toLowerCase())?.hex || "#cccccc";

// ─── Icons ───────────────────────────────────────────────────────────────────
const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconMinus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconHeart = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="#f6aab2"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
  </svg>
);

// ─── Quantity Selector Component ─────────────────────────────────────────────
const QuantitySelector = ({ quantity, onIncrease, onDecrease, min = 1, max = 99 }) => {
  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: "0", 
      border: `1px solid ${tokens.border}`,
      borderRadius: tokens.radius,
      overflow: "hidden",
      width: "fit-content"
    }}>
      <button
        onClick={onDecrease}
        disabled={quantity <= min}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          border: "none",
          backgroundColor: "transparent",
          color: quantity <= min ? tokens.border : tokens.foreground,
          cursor: quantity <= min ? "not-allowed" : "pointer",
          transition: "all 0.15s ease",
          opacity: quantity <= min ? 0.5 : 1,
        }}
        aria-label="Decrease quantity"
      >
        <IconMinus />
      </button>
      
      <div style={{
        width: "48px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.9375rem",
        fontWeight: 500,
        fontFamily: tokens.fontBody,
        color: tokens.foreground,
        borderLeft: `1px solid ${tokens.border}`,
        borderRight: `1px solid ${tokens.border}`,
        userSelect: "none",
      }}>
        {quantity}
      </div>
      
      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          border: "none",
          backgroundColor: "transparent",
          color: quantity >= max ? tokens.border : tokens.foreground,
          cursor: quantity >= max ? "not-allowed" : "pointer",
          transition: "all 0.15s ease",
          opacity: quantity >= max ? 0.5 : 1,
        }}
        aria-label="Increase quantity"
      >
        <IconPlus />
      </button>
    </div>
  );
};

// ─── ProductCard (for related products) ──────────────────────────────────────
const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const image = product.images?.[0];
  return (
    <a href={`/product/${product.slug ?? product.id}`} style={{ display: "block", textDecoration: "none", color: "inherit" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ overflow: "hidden", backgroundColor: tokens.secondary, position: "relative", paddingBottom: "133.33%" }}>
        {image ? (
          <img src={image} alt={product.name} loading="lazy"
            style={{ position: "absolute", inset: 0, height: "100%", width: "100%", objectFit: "cover", transition: "transform 500ms ease", transform: hovered ? "scale(1.05)" : "scale(1)" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: tokens.mutedForeground, fontSize: "0.75rem" }}>No image</div>
        )}
      </div>
      <div style={{ marginTop: "1rem" }}>
        <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.125rem", fontWeight: 500, margin: "0 0 4px", color: hovered ? tokens.mutedForeground : tokens.foreground, transition: "color 0.2s ease" }}>{product.name}</h3>
        <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: 0, fontFamily: tokens.fontBody }}>₵{product.price}</p>
      </div>
    </a>
  );
};

// ─── Toast Component ─────────────────────────────────────────────────────────
const Toast = ({ message, visible, type = "success", actionLabel, onAction }) => {
  if (!visible) return null;
  return (
    <div style={{
      position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)", zIndex: 100,
      backgroundColor: type === "error" ? "#ef4444" : tokens.foreground,
      color: tokens.background, padding: "0.75rem 1.5rem",
      borderRadius: tokens.radius, fontFamily: tokens.fontBody, fontSize: "0.875rem",
      fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", animation: "slideUp 0.3s ease",
      display: "flex", alignItems: "center", gap: "1rem",
    }}>
      <span>{message}</span>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            background: "none", border: "none", padding: 0,
            color: tokens.background, textDecoration: "underline",
            fontWeight: 600, fontSize: "0.875rem", cursor: "pointer",
            fontFamily: tokens.fontBody, whiteSpace: "nowrap",
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// ─── ProductDetail Page ──────────────────────────────────────────────────────
const ProductDetail = ({ product }) => {
  const { addItem } = useCart();

  const { props } = usePage();
  const user = props?.auth?.user ?? null;
  
  const isAuthenticated = !!user;
  const admin = user?.role === 'admin';
  const customer = user?.role === 'customer';

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [toastVisible, setToastVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [breadcrumbHover, setBreadcrumbHover] = useState({ home: false, collections: false, category: false });
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [isWishlisted, setIsWishlisted] = useState(!!product?.isWishlisted);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  const isOutOfStock = (product.stock_quantity ?? 0) <= 0;

  const [toastAction, setToastAction] = useState(null);

  const showToast = (msg, type = "success", action = null) => {
    setToastMessage(msg);
    setToastType(type);
    setToastAction(action);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 4000);
  };

  useEffect(() => {
    injectFonts();
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
  }, [product?.id]);

  useEffect(() => {
    setIsWishlisted(!!product?.isWishlisted);
  }, [product?.id, product?.isWishlisted]);

  const handleQuantityIncrease = () => {
    setQuantity(prev => Math.min(prev + 1, 99));
  };

  const handleQuantityDecrease = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  if (!product) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.875rem", color: tokens.foreground }}>Product not found</h1>
            <a href="/collections" style={{ marginTop: "1rem", color: tokens.mutedForeground, textDecoration: "none", fontSize: "0.875rem" }}
              onMouseEnter={(e) => e.target.style.color = tokens.foreground}
              onMouseLeave={(e) => e.target.style.color = tokens.mutedForeground}>
              Back to Collections
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { category, relatedProducts = [], images = [], sizes = [], colors = [] } = product;

  const handleAddToBag = async () => {
    if (isOutOfStock) {
      showToast(`${product.name} is out of stock`, "error", {
        label: "Add to Wishlist",
        onClick: handleToggleWishlist,
      });
      return;
    }

    const canAddNow = (!needsSize || selectedSize) && (!needsColor || selectedColor);
    if (!canAddNow || isAddingToCart) return;

    if (!isAuthenticated) {
      showToast("Please log in to add items to your bag", "error");
      setTimeout(() => {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }, 1200);
      return;
    }

    setIsAddingToCart(true);

    try {
      await axios.post("/cart", {
        product_id: product.id,
        size: selectedSize || null,
        color: selectedColor || null,
        quantity: quantity,
      });

      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        size: selectedSize || null,
        color: selectedColor || null,
        quantity: quantity,
        image: images?.[0] || null,
      });

      showToast(`${quantity > 1 ? `${quantity}× ` : ''}${product.name} added to bag`);
      setQuantity(1);
    } catch (error) {
      const data = error.response?.data;
      if (error.response?.status === 422 && data?.out_of_stock) {
        showToast(data.message || `${product.name} is out of stock`, "error", {
          label: "Add to Wishlist",
          onClick: handleToggleWishlist,
        });
      } else if (error.response?.status === 422 && data?.message) {
        // partial stock case, e.g. "Only 2 left in stock."
        showToast(data.message, "error");
      } else {
        console.error("Error adding to cart:", error);
        showToast("Failed to add item to cart. Please try again.", "error");
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (isTogglingWishlist) return;

    if (!isAuthenticated) {
      showToast("Please log in to save items to your wishlist", "error");
      setTimeout(() => {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }, 1200);
      return;
    }

    const nextState = !isWishlisted;
    setIsTogglingWishlist(true);
    // Optimistic update — flip immediately, roll back on failure.
    setIsWishlisted(nextState);

    try {
      if (nextState) {
        await axios.post("/wishlist", { product_id: product.id });
        showToast(`${product.name} added to wishlist`);
      } else {
        await axios.delete(`/wishlist/${product.id}`);
        showToast(`${product.name} removed from wishlist`);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      setIsWishlisted(!nextState);
      showToast("Failed to update wishlist. Please try again.", "error");
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const needsSize = sizes.length > 0;
  const needsColor = colors.length > 0;
  const canAdd = (!needsSize || selectedSize) && (!needsColor || selectedColor);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
      <Header />
      <Toast
        message={toastMessage}
        visible={toastVisible}
        type={toastType}
        actionLabel={toastAction?.label}
        onAction={toastAction?.onClick}
      />
      <main style={{ flex: 1 }}>
        {/* Breadcrumb */}
        <section style={{ borderBottom: `1px solid ${tokens.border}` }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem" }}>
            <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: tokens.mutedForeground, flexWrap: "wrap" }}>
              <a href="/" style={{ textDecoration: "none", color: breadcrumbHover.home ? tokens.foreground : tokens.mutedForeground, transition: "color 0.15s ease" }}
                onMouseEnter={() => setBreadcrumbHover(prev => ({ ...prev, home: true }))}
                onMouseLeave={() => setBreadcrumbHover(prev => ({ ...prev, home: false }))}>Home</a>
              <ChevronRight />
              <a href="/collections" style={{ textDecoration: "none", color: breadcrumbHover.collections ? tokens.foreground : tokens.mutedForeground, transition: "color 0.15s ease" }}
                onMouseEnter={() => setBreadcrumbHover(prev => ({ ...prev, collections: true }))}
                onMouseLeave={() => setBreadcrumbHover(prev => ({ ...prev, collections: false }))}>Collections</a>
              <ChevronRight />
              {category && (
                <>
                  <a href={`/category/${category.slug}`} style={{ textDecoration: "none", color: breadcrumbHover.category ? tokens.foreground : tokens.mutedForeground, transition: "color 0.15s ease" }}
                    onMouseEnter={() => setBreadcrumbHover(prev => ({ ...prev, category: true }))}
                    onMouseLeave={() => setBreadcrumbHover(prev => ({ ...prev, category: false }))}>{category.name}</a>
                  <ChevronRight />
                </>
              )}
              <span style={{ color: tokens.foreground }}>{product.name}</span>
            </nav>
          </div>
        </section>

        {/* Product Details */}
        <section style={{ padding: isDesktop ? "3rem 0" : "2rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: isDesktop ? "3rem" : "2rem", alignItems: "start" }}>
              {/* Images */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ overflow: "hidden", backgroundColor: tokens.secondary, borderRadius: tokens.radius }}>
                  <div style={{ paddingBottom: "133.33%", position: "relative" }}>
                    {images.length > 0 ? (
                      <img src={images[selectedImage]} alt={product.name}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: tokens.mutedForeground }}>
                        No image
                      </div>
                    )}
                  </div>
                </div>
                {images.length > 1 && (
                  <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto" }}>
                    {images.map((image, index) => (
                      <button key={index} onClick={() => setSelectedImage(index)}
                        style={{
                          width: "80px", flexShrink: 0, border: selectedImage === index ? `2px solid ${tokens.foreground}` : "2px solid transparent",
                          borderRadius: tokens.radius, overflow: "hidden", backgroundColor: tokens.secondary, cursor: "pointer",
                          transition: "border-color 0.15s ease", padding: 0,
                        }}>
                        <div style={{ paddingBottom: "133.33%", position: "relative" }}>
                          <img src={image} alt={`${product.name} view ${index + 1}`}
                            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {product.isNewArrival && (
                  <span style={{ display: "inline-block", width: "fit-content", padding: "0.125rem 0.625rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 500, backgroundColor: tokens.secondary, color: tokens.foreground, border: `1px solid ${tokens.border}` }}>
                    New Arrival
                  </span>
                )}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                  <div>
                    <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.875rem, 4vw, 2.5rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                      {product.name}
                    </h1>
                    <p style={{ marginTop: "0.5rem", fontSize: "1.25rem", color: tokens.foreground }}>
                      ₵{product.price}
                    </p>
                  </div>

                  {/* Wishlist toggle */}
                  <button
                    onClick={handleToggleWishlist}
                    disabled={isTogglingWishlist}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    aria-pressed={isWishlisted}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "44px",
                      height: "44px",
                      flexShrink: 0,
                      borderRadius: "50%",
                      border: `1px solid ${isWishlisted ? tokens.foreground : tokens.border}`,
                      backgroundColor: tokens.background,
                      color: isWishlisted ? tokens.destructive : tokens.foreground,
                      cursor: isTogglingWishlist ? "default" : "pointer",
                      opacity: isTogglingWishlist ? 0.6 : 1,
                      transition: "border-color 0.15s ease, color 0.15s ease, transform 0.15s ease",
                      transform: isWishlisted ? "scale(1.03)" : "scale(1)",
                    }}
                  >
                    <IconHeart filled={isWishlisted} />
                  </button>
                </div>
                <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, lineHeight: 1.7, margin: 0 }}>
                  {product.description}
                </p>

                {/* Colors */}
                {colors.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 500, color: tokens.foreground, margin: 0 }}>
                      Color: <span style={{ fontWeight: 400, color: tokens.mutedForeground }}>{selectedColor || "Select a color"}</span>
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {colors.map((colorName) => {
                        const hexes = getColorHexes(colorName);
                        const isTwoTone = hexes.length > 1;
                                            
                        return (
                          <button
                            key={colorName}
                            onClick={() => setSelectedColor(colorName)}
                            style={{
                              width: "32px", height: "32px", borderRadius: "50%", border: "2px solid transparent",
                              background: isTwoTone
                                ? `linear-gradient(90deg, ${hexes[0]} 50%, ${hexes[1]} 50%)`
                                : hexes[0],
                              cursor: "pointer",
                              outline: selectedColor === colorName ? `2px solid ${tokens.foreground}` : "none",
                              outlineOffset: "2px",
                              transition: "outline 0.15s ease, border-color 0.15s ease",
                              borderColor: selectedColor === colorName ? tokens.background : "transparent",
                            }}
                            title={colorName} aria-label={colorName} />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {sizes.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 500, color: tokens.foreground, margin: 0 }}>
                      Size: <span style={{ fontWeight: 400, color: tokens.mutedForeground }}>{selectedSize || "Select a size"}</span>
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {sizes.map((size) => (
                        <button key={size} onClick={() => setSelectedSize(size)}
                          style={{
                            minWidth: "2.5rem", height: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center",
                            border: `1px solid ${selectedSize === size ? tokens.foreground : tokens.border}`,
                            backgroundColor: selectedSize === size ? tokens.foreground : "transparent",
                            color: selectedSize === size ? tokens.background : tokens.foreground,
                            fontSize: "0.875rem", fontWeight: 500, fontFamily: tokens.fontBody,
                            cursor: "pointer", borderRadius: tokens.radius,
                            transition: "all 0.15s ease",
                            padding: "0 0.5rem",
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <p>Stock Left: {product.stock_quantity}</p>

                {/* Quantity Selector */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: 500, color: tokens.foreground, margin: 0 }}>
                    Quantity
                  </p>
                  <QuantitySelector
                    quantity={quantity}
                    onIncrease={handleQuantityIncrease}
                    onDecrease={handleQuantityDecrease}
                    min={1}
                    max={99}
                  />
                </div>

                {/* Add to Bag */}
                <button
                  onClick={handleAddToBag}
                  disabled={(isAuthenticated && !canAdd && !isOutOfStock) || isAddingToCart}
                  style={{
                    width: "100%", height: "48px", fontSize: "0.9375rem", fontWeight: 500,
                    fontFamily: tokens.fontBody, borderRadius: tokens.radius, border: "none",
                    backgroundColor: "#f6aab2", color: tokens.background,
                    cursor: ((isAuthenticated && !canAdd && !isOutOfStock) || isAddingToCart) ? "not-allowed" : "pointer",
                    opacity: ((isAuthenticated && !canAdd && !isOutOfStock) || isAddingToCart) ? 0.5 : 1,
                    transition: "opacity 0.2s ease",
                    position: "relative",
                  }}
                >
                  {isAddingToCart ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                      <span style={{
                        width: "16px", height: "16px", border: "2px solid transparent",
                        borderTop: `2px solid ${tokens.background}`, borderRadius: "50%",
                        animation: "spin 0.6s linear infinite", display: "inline-block"
                      }} />
                      Adding...
                    </span>
                  ) : isOutOfStock ? (
                    "Out of Stock — Add to Wishlist"
                  ) : !isAuthenticated ? (
                    "Log In to Add to Bag"
                  ) : !canAdd ? (
                    "Select Options"
                  ) : (
                    `Add to Bag${quantity > 1 ? ` — ${quantity} items` : ''}`
                  )}
                </button>

                {/* Add to Wishlist (secondary, full-width) */}
                <button
                  onClick={handleToggleWishlist}
                  disabled={isTogglingWishlist}
                  style={{
                    width: "100%",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                    fontFamily: tokens.fontBody,
                    borderRadius: tokens.radius,
                    border: `1px solid #f6aab2`,
                    backgroundColor: "transparent",
                    color: tokens.foreground,
                    cursor: isTogglingWishlist ? "default" : "pointer",
                    opacity: isTogglingWishlist ? 0.6 : 1,
                    transition: "opacity 0.2s ease, background-color 0.15s ease",
                  }}
                >
                  <IconHeart filled={isWishlisted} />
                  {isTogglingWishlist
                    ? "Updating..."
                    : isWishlisted
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"}
                </button>

                {!canAdd && !isAddingToCart && isAuthenticated && (
                  <p style={{ textAlign: "center", fontSize: "0.8125rem", color: tokens.mutedForeground, margin: 0 }}>
                    Please select {needsSize && !selectedSize ? "a size" : ""}{needsSize && !selectedSize && needsColor && !selectedColor ? " and " : ""}{needsColor && !selectedColor ? "a color" : ""} to add to bag
                  </p>
                )}
                {!isAuthenticated && !isAddingToCart && (
                  <p style={{ textAlign: "center", fontSize: "0.8125rem", color: tokens.mutedForeground, margin: 0 }}>
                    <a href={`/login?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "")}`} style={{ color: tokens.foreground, textDecoration: "underline" }}>
                      Log in
                    </a>{" "}to purchase this item
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section style={{ borderTop: `1px solid ${tokens.border}`, padding: isDesktop ? "4rem 0" : "3rem 0" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
              <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, margin: "0 0 2rem", color: tokens.foreground }}>
                You May Also Like
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "repeat(4, 1fr)" : "repeat(2, 1fr)", gap: isDesktop ? "1.5rem" : "1rem" }}>
                {relatedProducts.map((related) => (
                  <ProductCard key={related.id} product={related} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <style>{`
        @keyframes slideUp { 
          from { opacity: 0; transform: translateX(-50%) translateY(10px); } 
          to { opacity: 1; transform: translateX(-50%) translateY(0); } 
        }
        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;