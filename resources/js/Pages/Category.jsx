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

const getCategoryBySlug = (slug) => categories.find((c) => c.slug === slug);
const getProductsByCategory = (categorySlug) => products.filter((p) => p.category === categorySlug);

// ─── Get slug from URL ───────────────────────────────────────────────────────
const getSlugFromURL = () => {
  const path = window.location.pathname;
  const match = path.match(/\/category\/([^/]+)/);
  return match ? match[1] : null;
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

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
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
      <div style={{ overflow: "hidden", backgroundColor: tokens.secondary, position: "relative", paddingBottom: "133.33%" }}>
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            style={{
              position: "absolute", inset: 0, height: "100%", width: "100%",
              objectFit: "cover", transition: "transform 500ms ease",
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: tokens.mutedForeground, fontSize: "0.75rem" }}>
            No image
          </div>
        )}
      </div>
      <div style={{ marginTop: "1rem" }}>
        <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.125rem", fontWeight: 500, margin: "0 0 4px", color: hovered ? tokens.mutedForeground : tokens.foreground, transition: "color 0.2s ease" }}>
          {product.name}
        </h3>
        <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: 0, fontFamily: tokens.fontBody }}>
          ${product.price}
        </p>
      </div>
    </a>
  );
};

// ─── Category Page ───────────────────────────────────────────────────────────
const Category = ({ category, products = [] }) => {
  const slug = getSlugFromURL();
  // const category = getCategoryBySlug(slug || "");
  // const categoryProducts = getProductsByCategory(slug || "");
  const [breadcrumbHomeHovered, setBreadcrumbHomeHovered] = useState(false);
  const [breadcrumbCollectionsHovered, setBreadcrumbCollectionsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    injectFonts();
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getGridColumns = () => {
    if (isDesktop) return "1fr 1fr 1fr 1fr";
    if (window.innerWidth >= 768) return "1fr 1fr 1fr";
    return "1fr 1fr";
  };

  // Not found state
  if (!category) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.875rem", color: tokens.foreground, margin: "0 0 1rem" }}>
              Category not found
            </h1>
            <a
              href="/collections"
              style={{ color: tokens.mutedForeground, textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s ease" }}
              onMouseEnter={(e) => (e.target.style.color = tokens.foreground)}
              onMouseLeave={(e) => (e.target.style.color = tokens.mutedForeground)}
            >
              Back to Collections
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
      <Header />

      <main style={{ flex: 1 }}>
        {/* Hero */}
        <section style={{ position: "relative", height: "40vh", minHeight: "300px", overflow: "hidden" }}>
          {category.image && (
            <img
              src={category.image}
              alt={category.name}
              style={{ height: "100%", width: "100%", objectFit: "cover", display: "block" }}
            />
          )}
           <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(20,20,20,0.4)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#ffffff", padding: "0 1rem" }}>
              <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(2.25rem, 5vw, 3.75rem)", fontWeight: 500, margin: 0 }}>
                {category.name}
              </h1>
            </div>
        </section>

        {/* Breadcrumb */}
        <section style={{ borderBottom: `1px solid ${tokens.border}` }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem" }}>
            <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
              <a
                href="/"
                style={{ textDecoration: "none", color: breadcrumbHomeHovered ? tokens.foreground : tokens.mutedForeground, transition: "color 0.2s ease" }}
                onMouseEnter={() => setBreadcrumbHomeHovered(true)}
                onMouseLeave={() => setBreadcrumbHomeHovered(false)}
              >
                Home
              </a>
              <ChevronRight />
              <a
                href="/collections"
                style={{ textDecoration: "none", color: breadcrumbCollectionsHovered ? tokens.foreground : tokens.mutedForeground, transition: "color 0.2s ease" }}
                onMouseEnter={() => setBreadcrumbCollectionsHovered(true)}
                onMouseLeave={() => setBreadcrumbCollectionsHovered(false)}
              >
                Collections
              </a>
              <ChevronRight />
              <span style={{ color: tokens.foreground }}>{category.name}</span>
            </nav>
          </div>
        </section>

        {/* Products Grid */}
        <section style={{ padding: isDesktop ? "4rem 0" : "3rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
            <p style={{ marginBottom: "2rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
              {products.length} {products.length === 1 ? "piece" : "pieces"}
            </p>
            {products.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: getGridColumns(), gap: isDesktop ? "1.5rem" : "1rem" }}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div style={{ padding: "4rem 0", textAlign: "center" }}>
                <p style={{ color: tokens.mutedForeground }}>
                  No products in this category yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Category;