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

// ─── Reusable Components ─────────────────────────────────────────────────────
const HoverLink = ({ href, target, rel, ariaLabel, children, style: baseStyle }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href} target={target} rel={rel} aria-label={ariaLabel}
      style={{
        textDecoration: "none",
        fontSize: "0.875rem",
        display: "flex",
        alignItems: "center",
        color: hovered ? tokens.foreground : tokens.mutedForeground,
        transition: "color 0.2s ease",
        ...baseStyle,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  );
};

// ─── About Page ──────────────────────────────────────────────────────────────
const About = ({ collections }) => {
  const [breadcrumbHomeHovered, setBreadcrumbHomeHovered] = useState(false);
  const [shopBtnHovered, setShopBtnHovered] = useState(false);
  const [newArrivalsBtnHovered, setNewArrivalsBtnHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    injectFonts();
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
                style={{ textDecoration: "none", color: breadcrumbHomeHovered ? tokens.foreground : tokens.mutedForeground, transition: "color 0.2s ease" }}
                onMouseEnter={() => setBreadcrumbHomeHovered(true)}
                onMouseLeave={() => setBreadcrumbHomeHovered(false)}
              >
                Home
              </a>
              <ChevronRight />
              <span style={{ color: tokens.foreground }}>About</span>
            </nav>
          </div>
        </section>

        {/* Hero */}
        <section style={{ padding: isDesktop ? "5rem 0" : "3rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: isDesktop ? "4rem" : "2.5rem", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(2.25rem, 5vw, 3.75rem)", fontWeight: 500, letterSpacing: "-0.02em", margin: 0, color: tokens.foreground }}>
                  About CuteBloom
                </h1>
                <p style={{ fontSize: "1.125rem", color: tokens.mutedForeground, lineHeight: 1.7, margin: 0 }}>
                  Founded with a vision to redefine everyday elegance, CuteBloom 
                  creates timeless pieces that transcend seasons and trends.
                </p>
              </div>
              <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", backgroundColor: tokens.secondary }}>
                <img
                  src="images/user.jpeg"
                  alt="CuteBloom atelier"
                  loading="lazy"
                  style={{ height: "100%", width: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section style={{ borderTop: `1px solid ${tokens.border}`, borderBottom: `1px solid ${tokens.border}`, backgroundColor: "rgba(245,245,245,0.5)", padding: isDesktop ? "6rem 0" : "4rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
            <div style={{ maxWidth: "48rem", margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", gap: "2rem" }}>
              <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.875rem, 4vw, 2.5rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                Our Story
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", color: tokens.mutedForeground, fontSize: "1rem", lineHeight: 1.7 }}>
                <p style={{ margin: 0 }}>
                  CuteBloom was born from a simple belief: that every woman deserves 
                  to feel effortlessly elegant in her everyday life. We started with a 
                  small collection of essential pieces, each designed to be worn and loved 
                  for years to come.
                </p>
                <p style={{ margin: 0 }}>
                  Today, our collections have grown, but our commitment remains unchanged. 
                  We source only the finest fabrics—silk from trusted mills, cashmere from 
                  ethical producers, and linen that softens beautifully with wear.
                </p>
                <p style={{ margin: 0 }}>
                  Every garment is thoughtfully designed in our studio, where we obsess 
                  over the details that matter: the perfect drape, the refined seam, the 
                  versatile silhouette that moves from day to evening with ease.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section style={{ padding: isDesktop ? "6rem 0" : "4rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.875rem, 4vw, 2.5rem)", fontWeight: 500, margin: "0 0 3rem", textAlign: "center", color: tokens.foreground }}>
              Our Values
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr 1fr" : "1fr", gap: isDesktop ? "3rem" : "2rem" }}>
              {/* Value 1 */}
              <div style={{ textAlign: "center" }}>
                <div style={{ margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "50%", backgroundColor: tokens.secondary }}>
                  <span style={{ fontFamily: tokens.fontDisplay, fontSize: "1.5rem", color: tokens.foreground }}>✦</span>
                </div>
                <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: "0 0 0.5rem", color: tokens.foreground }}>
                  Timeless Design
                </h3>
                <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, lineHeight: 1.6, margin: 0 }}>
                  We create pieces that transcend trends, designed to be worn and 
                  cherished for years, not seasons.
                </p>
              </div>
              {/* Value 2 */}
              <div style={{ textAlign: "center" }}>
                <div style={{ margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "50%", backgroundColor: tokens.secondary }}>
                  <span style={{ fontFamily: tokens.fontDisplay, fontSize: "1.5rem", color: tokens.foreground }}>◈</span>
                </div>
                <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: "0 0 0.5rem", color: tokens.foreground }}>
                  Quality Craftsmanship
                </h3>
                <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, lineHeight: 1.6, margin: 0 }}>
                  Each garment is crafted with meticulous attention to detail, using 
                  premium materials that feel as good as they look.
                </p>
              </div>
              {/* Value 3 */}
              <div style={{ textAlign: "center" }}>
                <div style={{ margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "50%", backgroundColor: tokens.secondary }}>
                  <span style={{ fontFamily: tokens.fontDisplay, fontSize: "1.5rem", color: tokens.foreground }}>○</span>
                </div>
                <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: "0 0 0.5rem", color: tokens.foreground }}>
                  Conscious Fashion
                </h3>
                <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, lineHeight: 1.6, margin: 0 }}>
                  We believe in responsible fashion—less, but better. Our pieces are 
                  made to last, reducing the need for constant replacement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section style={{ borderTop: `1px solid ${tokens.border}`, borderBottom: `1px solid ${tokens.border}`, padding: isDesktop ? "4rem 0" : "3rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem", textAlign: "center" }}>
              <div>
                <p style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(2.25rem, 5vw, 3rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>100+</p>
                <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>Unique Pieces</p>
              </div>
              <div>
                <p style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(2.25rem, 5vw, 3rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>{collections}</p>
                <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>Collections</p>
              </div>
              <div>
                <p style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(2.25rem, 5vw, 3rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>∞</p>
                <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>Possibilities</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ padding: isDesktop ? "6rem 0" : "4rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
            <div style={{ maxWidth: "42rem", margin: "0 auto", textAlign: "center" }}>
              <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.875rem, 4vw, 2.5rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                Discover Our Collections
              </h2>
              <p style={{ marginTop: "1rem", color: tokens.mutedForeground, fontSize: "1rem", lineHeight: 1.6 }}>
                Explore our carefully curated pieces and find your perfect wardrobe essentials.
              </p>
              <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "center" }} className="about-cta-buttons">
                <a
                  href="/collections"
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    padding: "0.75rem 2rem", fontSize: "1rem", fontWeight: 500,
                    fontFamily: tokens.fontBody, textDecoration: "none",
                    borderRadius: tokens.radius, border: "none",
                    backgroundColor: tokens.foreground, color: tokens.background,
                    cursor: "pointer", opacity: shopBtnHovered ? 0.9 : 1,
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseEnter={() => setShopBtnHovered(true)}
                  onMouseLeave={() => setShopBtnHovered(false)}
                >
                  Shop Collections
                </a>
                <a
                  href="/new-arrivals"
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    padding: "0.75rem 2rem", fontSize: "1rem", fontWeight: 500,
                    fontFamily: tokens.fontBody, textDecoration: "none",
                    borderRadius: tokens.radius,
                    border: `1px solid ${tokens.border}`,
                    backgroundColor: newArrivalsBtnHovered ? tokens.secondary : "transparent",
                    color: tokens.foreground, cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={() => setNewArrivalsBtnHovered(true)}
                  onMouseLeave={() => setNewArrivalsBtnHovered(false)}
                >
                  View New Arrivals
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 640px) {
          .about-cta-buttons {
            flex-direction: row !important;
          }
        }
      `}</style>
    </div>
  );
};

export default About;