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

// ─── Data ────────────────────────────────────────────────────────────────────
// const products = [
//   {
//     id: "1",
//     name: "Silk Midi Dress",
//     price: 289,
//     images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80"],
//     category: "dresses",
//     isNewArrival: true,
//   },
//   {
//     id: "2",
//     name: "Cashmere Wrap Coat",
//     price: 495,
//     images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80"],
//     category: "outerwear",
//     isNewArrival: true,
//   },
//   {
//     id: "3",
//     name: "Linen Palazzo Pants",
//     price: 165,
//     images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80"],
//     category: "bottoms",
//     isNewArrival: true,
//   },
//   {
//     id: "4",
//     name: "Silk Camisole",
//     price: 125,
//     images: ["https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80"],
//     category: "tops",
//     isNewArrival: true,
//   },
//   {
//     id: "5",
//     name: "Leather Crossbody Bag",
//     price: 245,
//     images: ["https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80"],
//     category: "accessories",
//     isNewArrival: true,
//   },
//   {
//     id: "7",
//     name: "Pleated Maxi Skirt",
//     price: 195,
//     images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80"],
//     category: "bottoms",
//     isNewArrival: true,
//   },
// ];

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
          paddingBottom: "133.33%", // 4/3 * 100
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
          ${product.price}
        </p>
      </div>
    </a>
  );
};

// ─── NewArrivals ─────────────────────────────────────────────────────────────
const NewArrivals = ({ products = [] }) => {
  const [btnHovered, setBtnHovered] = useState(false);
  // const newArrivals = getNewArrivals().slice(0, 4);

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
            The latest additions to our collection, crafted with care and
            designed to inspire.
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