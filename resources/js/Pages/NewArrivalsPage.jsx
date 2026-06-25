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

// ─── Data ────────────────────────────────────────────────────────────────────
const products = [
  {
    id: "1",
    name: "Silk Midi Dress",
    price: 289,
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80"],
    category: "dresses",
    isNewArrival: true,
  },
  {
    id: "2",
    name: "Cashmere Wrap Coat",
    price: 495,
    images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80"],
    category: "outerwear",
    isNewArrival: true,
  },
  {
    id: "3",
    name: "Linen Palazzo Pants",
    price: 165,
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80"],
    category: "bottoms",
    isNewArrival: true,
  },
  {
    id: "4",
    name: "Silk Camisole",
    price: 125,
    images: ["https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80"],
    category: "tops",
    isNewArrival: true,
  },
  {
    id: "5",
    name: "Leather Crossbody Bag",
    price: 245,
    images: ["https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80"],
    category: "accessories",
    isNewArrival: true,
  },
  {
    id: "6",
    name: "Wool Blend Blazer",
    price: 350,
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80"],
    category: "outerwear",
    isNewArrival: true,
  },
  {
    id: "7",
    name: "Pleated Maxi Skirt",
    price: 195,
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80"],
    category: "bottoms",
    isNewArrival: true,
  },
  {
    id: "8",
    name: "Silk Scarf",
    price: 85,
    images: ["https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80"],
    category: "accessories",
    isNewArrival: true,
  },
];

const getNewArrivals = () => products.filter((p) => p.isNewArrival);

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

  return (
    <a
      href={`/product/${product.id}`}
      style={{ display: "block", textDecoration: "none", color: "inherit" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          overflow: "hidden",
          backgroundColor: tokens.secondary,
          position: "relative",
          paddingBottom: "133.33%",
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
        <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: 0, fontFamily: tokens.fontBody }}>
          ${product.price}
        </p>
      </div>
    </a>
  );
};

// ─── NewArrivalsPage ─────────────────────────────────────────────────────────
const NewArrivalsPage = () => {
  const newArrivals = getNewArrivals();
  const [email, setEmail] = useState("");
  const [subscribeBtnHovered, setSubscribeBtnHovered] = useState(false);
  const [breadcrumbHomeHovered, setBreadcrumbHomeHovered] = useState(false);
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

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
      <Header />

      <main style={{ flex: 1 }}>
        {/* Breadcrumb */}
        <section style={{ borderBottom: `1px solid ${tokens.border}` }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem" }}>
            <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
              <a
                href="/"
                style={{
                  textDecoration: "none",
                  color: breadcrumbHomeHovered ? tokens.foreground : tokens.mutedForeground,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={() => setBreadcrumbHomeHovered(true)}
                onMouseLeave={() => setBreadcrumbHomeHovered(false)}
              >
                Home
              </a>
              <ChevronRight />
              <span style={{ color: tokens.foreground }}>New Arrivals</span>
            </nav>
          </div>
        </section>

        {/* Hero */}
        <section style={{ padding: isDesktop ? "4rem 0" : "3rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
            <div style={{ maxWidth: "42rem", margin: "0 auto", textAlign: "center" }}>
              <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(2.25rem, 5vw, 3.75rem)", fontWeight: 500, letterSpacing: "-0.02em", margin: 0, color: tokens.foreground }}>
                New Arrivals
              </h1>
              <p style={{ marginTop: "1.5rem", fontSize: "1.125rem", color: tokens.mutedForeground, lineHeight: 1.7 }}>
                Discover the latest additions to our collection. Each piece is crafted with care 
                and designed to bring timeless elegance to your wardrobe.
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section style={{ paddingBottom: isDesktop ? "6rem" : "4rem" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
            {newArrivals.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: getGridColumns(),
                  gap: isDesktop ? "1.5rem" : "1rem",
                }}
              >
                {newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div style={{ padding: "4rem 0", textAlign: "center" }}>
                <p style={{ color: tokens.mutedForeground }}>
                  New arrivals coming soon. Check back later!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section style={{ borderTop: `1px solid ${tokens.border}`, backgroundColor: tokens.secondary, padding: isDesktop ? "4rem 0" : "3rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
            <div style={{ maxWidth: "36rem", margin: "0 auto", textAlign: "center" }}>
              <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                Be the First to Know
              </h2>
              <p style={{ marginTop: "0.75rem", color: tokens.mutedForeground, fontSize: "1rem", lineHeight: 1.6 }}>
                Subscribe to our newsletter and never miss a new arrival.
              </p>
              <form
                onSubmit={handleSubscribe}
                style={{
                  marginTop: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  justifyContent: "center",
                }}
                className="newarrivals-newsletter-form"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    height: "44px",
                    borderRadius: tokens.radius,
                    border: `1px solid ${tokens.border}`,
                    backgroundColor: tokens.background,
                    padding: "0 1rem",
                    fontSize: "0.875rem",
                    fontFamily: tokens.fontBody,
                    color: tokens.foreground,
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = tokens.foreground)}
                  onBlur={(e) => (e.target.style.borderColor = tokens.border)}
                />
                <button
                  type="submit"
                  style={{
                    height: "44px",
                    borderRadius: tokens.radius,
                    border: "none",
                    backgroundColor: tokens.foreground,
                    padding: "0 1.5rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    fontFamily: tokens.fontBody,
                    color: tokens.background,
                    cursor: "pointer",
                    opacity: subscribeBtnHovered ? 0.9 : 1,
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseEnter={() => setSubscribeBtnHovered(true)}
                  onMouseLeave={() => setSubscribeBtnHovered(false)}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Responsive newsletter form */}
      <style>{`
        @media (min-width: 640px) {
          .newarrivals-newsletter-form {
            flex-direction: row !important;
          }
        }
      `}</style>
    </div>
  );
};

export default NewArrivalsPage;