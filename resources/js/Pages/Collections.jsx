import SEO from '@/Components/SEO';
import React, { useState, useEffect } from "react";
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
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconShoppingBag = () => (
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
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
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

// ─── CategoryCard ────────────────────────────────────────────────────────────
const CategoryCard = ({ category }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={`/category/${category.slug}`}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        position: "relative",
        overflow: "hidden",
        borderRadius: tokens.radius,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          overflow: "hidden",
          backgroundColor: tokens.secondary,
          position: "relative",
          paddingBottom: "125%",
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
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: hovered ? "rgba(20, 20, 20, 0.3)" : "rgba(20, 20, 20, 0.2)",
            transition: "background-color 0.3s ease",
          }}
        />
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

// ─── Collections Page ────────────────────────────────────────────────────────
const Collections = ({ categories = [] }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    injectFonts();

    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getGridColumns = () => {
    if (isDesktop) return "1fr 1fr 1fr";
    if (window.innerWidth >= 768) return "1fr 1fr";
    return "1fr";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: tokens.fontBody,
      }}
    >
      <SEO
        title="Shop Collections"
        description="Cute fits for work, church, and every day. All affordable. All confidence.
                      Pick your vibe"
        url="/collections"
      />
      <Header />

      <main style={{ flex: 1 }}>
        {/* Hero */}
        <section
          style={{
            backgroundColor: tokens.secondary,
            padding: "4rem 0",
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 1rem",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontFamily: tokens.fontDisplay,
                fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                margin: 0,
                color: tokens.foreground,
              }}
            >
              Our Collections
            </h1>
            <p
              style={{
                margin: "1rem auto 0",
                maxWidth: "32rem",
                color: tokens.mutedForeground,
                fontSize: "1rem",
                lineHeight: 1.7,
              }}
            >
              Cute fits for work, church, and every day. All affordable. All confidence.
              Pick your vibe
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section
          style={{
            padding: isDesktop ? "4rem 0" : "3rem 0",
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 1rem",
            }}
          >
            {categories.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: getGridColumns(),
                  gap: "1.5rem",
                }}
              >
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            ) : (
              <p style={{ textAlign: "center", color: tokens.mutedForeground, fontSize: "0.875rem" }}>
                No collections available yet.
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Collections;