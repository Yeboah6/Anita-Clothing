import React, { useState, useEffect } from "react";

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
  mutedForeground: "#737373",
  secondary: "#f5f5f5",
  border: "#e6e6e6",
  radius: "4px",
};

const getNewArrivals = () => products.filter((p) => p.isNewArrival);

// ─── ProductCard ─────────────────────────────────────────────────────────────
const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const image = product.images?.[0];

  return (
    <a
      href={`/product/${product.slug ?? product.id}`}
      style={{ display: "block", textDecoration: "none", color: "inherit" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 3:4 aspect ratio image container */}
      <div
        style={{
          overflow: "hidden",
          backgroundColor: tokens.secondary,
          position: "relative",
          paddingBottom: "125%", // 4/3 * 100
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
      <div style={{ marginTop: "1rem" }}>
        <h3
          style={{
            fontFamily: tokens.fontDisplay,
            fontSize: "1.125rem",
            fontWeight: 500,
            margin: "0 0 4px",
            color: hovered ? tokens.mutedForeground : tokens.foreground,
            transition: "color 0.2s ease",
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontSize: "0.875rem",
            color: tokens.mutedForeground,
            margin: 0,
            fontFamily: tokens.fontBody,
          }}
        >
          ₵{product.price}
        </p>
      </div>
    </a>
  );
};

// ─── NewArrivals ─────────────────────────────────────────────────────────────
const NewArrivals = ({ products = [] }) => {
  const [btnHovered, setBtnHovered] = useState(false);

  useEffect(() => { injectFonts(); }, []);

  if (products.length === 0) return null;

  return (
    <section
      style={{
        padding: "4rem 0",
        fontFamily: tokens.fontBody,
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "3.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: tokens.fontDisplay,
              fontSize: "clamp(1.875rem, 4vw, 3rem)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              margin: 0,
              color: tokens.foreground,
            }}
          >
            New Arrivals
          </h2>
          <p
            style={{
              marginTop: "1rem",
              maxWidth: "28rem",
              color: tokens.mutedForeground,
              fontSize: "1rem",
              lineHeight: 1.6,
            }}
          >
            New In For The Girlies ✨
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: "3.5rem", textAlign: "center" }}>
          <a
            href="/new-arrivals"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              fontWeight: 500,
              fontFamily: tokens.fontBody,
              textDecoration: "none",
              borderRadius: tokens.radius,
              border: `1px solid ${tokens.border}`,
              backgroundColor: btnHovered ? tokens.secondary : "transparent",
              color: tokens.foreground,
              transition: "background-color 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
          >
            View All New Arrivals
          </a>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;