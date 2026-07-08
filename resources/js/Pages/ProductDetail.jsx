import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { CartProvider, useCart } from "@/Context/CartContext";
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
  green: "#16a34a",
};

// Same palette used on the admin product forms — DB stores color names only,
// hex values are resolved client-side for the swatch UI.
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
  availableColors.find((c) => c.name?.toLowerCase() === (colorName || "").toLowerCase())?.hex || "#cccccc";

// ─── Icons ───────────────────────────────────────────────────────────────────
const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

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
        <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: 0, fontFamily: tokens.fontBody }}>${product.price}</p>
      </div>
    </a>
  );
};

// ─── Toast Component ─────────────────────────────────────────────────────────
const Toast = ({ message, visible }) => {
  if (!visible) return null;
  return (
    <div style={{
      position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)", zIndex: 100,
      backgroundColor: tokens.foreground, color: tokens.background, padding: "0.75rem 1.5rem",
      borderRadius: tokens.radius, fontFamily: tokens.fontBody, fontSize: "0.875rem",
      fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", animation: "slideUp 0.3s ease",
    }}>
      {message}
    </div>
  );
};

// ─── ProductDetail Page ──────────────────────────────────────────────────────
const ProductDetail = ({ product }) => {
  const { addItem } = useCart();
  const { auth } = usePage().props;
  const isAuthenticated = !!auth?.user;
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [breadcrumbHover, setBreadcrumbHover] = useState({ home: false, collections: false, category: false });

  useEffect(() => {
    injectFonts();
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
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

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
      <Header />
      <Toast message={toastMessage} visible={toastVisible} />
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
                <div>
                  <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.875rem, 4vw, 2.5rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                    {product.name}
                  </h1>
                  <p style={{ marginTop: "0.5rem", fontSize: "1.25rem", color: tokens.foreground }}>
                    ${product.price}
                  </p>
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
                      {colors.map((colorName) => (
                        <button key={colorName} onClick={() => setSelectedColor(colorName)}
                          style={{
                            width: "32px", height: "32px", borderRadius: "50%", border: "2px solid transparent",
                            backgroundColor: getColorHex(colorName), cursor: "pointer",
                            outline: selectedColor === colorName ? `2px solid ${tokens.foreground}` : "none",
                            outlineOffset: "2px",
                            transition: "outline 0.15s ease, border-color 0.15s ease",
                            borderColor: selectedColor === colorName ? tokens.background : "transparent",
                          }}
                          title={colorName} aria-label={colorName} />
                      ))}
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

                {/* Add to Bag */}
                {(() => {
                  const needsSize = sizes.length > 0;
                  const needsColor = colors.length > 0;
                  const canAdd = (!needsSize || selectedSize) && (!needsColor || selectedColor);

                  return (
                    <>
                      <button
                        onClick={() => {
                          if (canAdd) {
                            addItem({
                              productId: product.id,
                              name: product.name,
                              price: product.price,
                              image: images[0] ?? null,
                              size: selectedSize,
                              color: selectedColor,
                              quantity: 1,
                            });
                          
                            if (isAuthenticated) {
                              axios.post(route("cart.store"), {
                                product_id: product.id,
                                size: selectedSize,
                                color: selectedColor,
                                quantity: 1,
                              }).catch((error) => {
                                console.error("Failed to sync cart to server:", error);
                              });
                            }
                          
                            showToast(`${product.name} added to bag`);
                          }
                        }}
                        disabled={!canAdd}
                        style={{
                          width: "100%", height: "48px", fontSize: "0.9375rem", fontWeight: 500,
                          fontFamily: tokens.fontBody, borderRadius: tokens.radius, border: "none",
                          backgroundColor: tokens.foreground, color: tokens.background,
                          cursor: !canAdd ? "not-allowed" : "pointer",
                          opacity: !canAdd ? 0.5 : 1,
                          transition: "opacity 0.2s ease",
                          marginTop: "0.5rem",
                        }}
                      >
                        {!canAdd ? "Select Options" : "Add to Bag"}
                      </button>
                      {!canAdd && (
                        <p style={{ textAlign: "center", fontSize: "0.8125rem", color: tokens.mutedForeground, margin: 0 }}>
                          Please select {needsSize && !selectedSize ? "a size" : ""}{needsSize && !selectedSize && needsColor && !selectedColor ? " and " : ""}{needsColor && !selectedColor ? "a color" : ""} to add to bag
                        </p>
                      )}
                    </>
                  );
                })()}
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
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
};

// ─── Export wrapped in CartProvider ──────────────────────────────────────────
const ProductDetailWithCart = ({ product }) => (
  <CartProvider>
    <ProductDetail product={product} />
  </CartProvider>
);

export default ProductDetailWithCart;