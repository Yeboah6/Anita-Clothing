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
  background: "#ffffff",
  secondary: "#f5f5f5",
  border: "#e6e6e6",
  radius: "4px",
};

// ─── CategoryCard ─────────────────────────────────────────────────────────────
const CategoryCard = ({ category }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={`/category/${category.slug}`}
      style={{ display: "block", textDecoration: "none", color: "inherit", position: "relative", overflow: "hidden" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 4:5 aspect ratio image container */}
      <div
        style={{
          overflow: "hidden",
          backgroundColor: tokens.secondary,
          position: "relative",
          paddingBottom: "125%", // 5/4 * 100
        }}
      >
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            loading="lazy"
            style={{
              position: "absolute",
              inset: 0,
              height: "100%",
              width: "100%",
              objectFit: "cover",
              transition: "transform 700ms ease",
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, backgroundColor: tokens.secondary }} />
        )}
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: hovered ? "rgba(20, 20, 20, 0.3)" : "rgba(20, 20, 20, 0.2)",
            transition: "background-color 0.3s ease",
          }}
        />
        {/* Centered text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontFamily: tokens.fontDisplay,
              fontSize: "clamp(1.25rem, 2.5vw, 1.875rem)",
              fontWeight: 500,
              color: "#ffffff",
              margin: 0,
            }}
          >
            {category.name}
          </h3>
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "0.875rem",
              color: "rgba(255, 255, 255, 0.8)",
              fontFamily: tokens.fontBody,
            }}
          >
            {category.productCount} {category.productCount === 1 ? "piece" : "pieces"}
          </p>
        </div>
      </div>
    </a>
  );
};

// ─── CategoryPreview ─────────────────────────────────────────────────────────
const CategoryPreview = ({ categories = [] }) => {
  const [btnHovered, setBtnHovered] = useState(false);

  useEffect(() => {
    injectFonts();
  }, []);

  if (categories.length === 0) return null;

  return (
    <section
      style={{
        padding: "4rem 0",
        fontFamily: tokens.fontBody,
        backgroundColor: tokens.secondary,
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
            Shop by Category
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
            Cute fits for work, church, and every day. All affordable. All confidence.
            Pick your vibe
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
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: "3.5rem", textAlign: "center" }}>
          <a
            href="/collections"
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
              border: `1px solid #f6aab2`,
              backgroundColor: btnHovered ? "#f6aab2" : "transparent",
              color: btnHovered ? "#fff" : tokens.foreground,
              transition: "background-color 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
          >
            View All Collections
          </a>
        </div>
      </div>
    </section>
  );
};

export default CategoryPreview;