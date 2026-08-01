import SEO from '@/Components/SEO';
import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
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

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ─── ProductCard ─────────────────────────────────────────────────────────────
const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const image = product.images?.[0];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <a
      href={`/product/${product.slug ?? product.id}`}
      style={{ display: "block", textDecoration: "none", color: "inherit" }}
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      onTouchStart={() => setIsMobile(true)}
    >
      <div
        style={{
          overflow: "hidden",
          backgroundColor: tokens.secondary,
          position: "relative",
          paddingBottom: "133.33%",
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
      <div style={{ marginTop: "0.75rem" }}>
        <h3
          style={{
            fontFamily: tokens.fontDisplay,
            fontSize: "clamp(0.938rem, 2.5vw, 1.125rem)",
            fontWeight: 500,
            margin: "0 0 4px",
            color: tokens.foreground,
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </h3>
        <p style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)", color: tokens.mutedForeground, margin: 0, fontFamily: tokens.fontBody }}>
          ₵{product.price}
        </p>
      </div>
    </a>
  );
};

// ─── NewArrivalsPage ─────────────────────────────────────────────────────────
const NewArrivalsPage = ({ products = [] }) => {
  const [email, setEmail] = useState("");
  const [subscribeBtnHovered, setSubscribeBtnHovered] = useState(false);
  const [breadcrumbHomeHovered, setBreadcrumbHomeHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    injectFonts();

    const handleResize = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024);
      setIsTablet(width >= 640 && width < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getGridColumns = () => {
    if (isDesktop) return "1fr 1fr 1fr 1fr";
    if (isTablet) return "1fr 1fr 1fr";
    return "1fr 1fr";
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    router.post(
      "/newsletter/subscribe",
      { email },
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: (page) => {
          const status = page.props.flash?.newsletter_status;
          setFeedback({
            type: "success",
            message:
              status === "already_subscribed"
                ? "You're already on the list!"
                : "Thanks for subscribing!",
          });
          setEmail("");
        },
        onError: (errors) => {
          setFeedback({
            type: "error",
            message: errors.email || "Something went wrong. Please try again.",
          });
        },
        onFinish: () => setSubmitting(false),
      }
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
      <SEO
        title="New Arrivals"
        description="Discover the latest additions to our collection — each piece crafted with care and designed to bring timeless elegance to your wardrobe."
        url="/new-arrivals"
      />
      <Header />

      <main style={{ flex: 1 }}>
        {/* Breadcrumb */}
        <section style={{ borderBottom: `1px solid ${tokens.border}` }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: isDesktop ? "1rem" : "0.75rem 1rem" }}>
            <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "clamp(0.75rem, 2vw, 0.875rem)", color: tokens.mutedForeground }}>
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
        <section style={{ padding: isDesktop ? "4rem 0" : isTablet ? "2.5rem 0" : "2rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.25rem" }}>
            <div style={{ maxWidth: "42rem", margin: "0 auto", textAlign: "center" }}>
              <h1 style={{ 
                fontFamily: tokens.fontDisplay, 
                fontSize: "clamp(1.75rem, 6vw, 3.75rem)", 
                fontWeight: 500, 
                letterSpacing: "-0.02em", 
                margin: 0, 
                color: tokens.foreground,
                lineHeight: 1.1,
              }}>
                New Arrivals
              </h1>
              <p style={{ 
                marginTop: isDesktop ? "1.5rem" : "1rem", 
                fontSize: "clamp(0.938rem, 2.5vw, 1.125rem)", 
                color: tokens.mutedForeground, 
                lineHeight: 1.7,
                padding: isDesktop ? "0" : "0 0.5rem",
              }}>
                New In For The Girlies ✨. <br /> Fresh drops just for you. Work fits, weekend looks, and everything in between — all cute, comfy, and wallet-friendly.  
                <br />  Which one are you grabbing first?
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section style={{ paddingBottom: isDesktop ? "6rem" : isTablet ? "3rem" : "2.5rem" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.25rem" }}>
            {products.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: getGridColumns(),
                  gap: isDesktop ? "1.5rem" : "1rem",
                }}
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div style={{ padding: isDesktop ? "4rem 0" : "3rem 0", textAlign: "center" }}>
                <p style={{ color: tokens.mutedForeground, fontSize: "clamp(0.875rem, 2vw, 1rem)" }}>
                  New arrivals coming soon. Check back later!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section style={{ 
          borderTop: `1px solid ${tokens.border}`, 
          backgroundColor: tokens.secondary, 
          padding: isDesktop ? "4rem 0" : "2.5rem 0" 
        }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.25rem" }}>
            <div style={{ maxWidth: "36rem", margin: "0 auto", textAlign: "center" }}>
              <h2 style={{ 
                fontFamily: tokens.fontDisplay, 
                fontSize: "clamp(1.25rem, 4vw, 1.875rem)", 
                fontWeight: 500, 
                margin: 0, 
                color: tokens.foreground,
                lineHeight: 1.2,
              }}>
                Be the First to Know
              </h2>
              <p style={{ 
                marginTop: isDesktop ? "0.75rem" : "0.5rem", 
                color: tokens.mutedForeground, 
                fontSize: "clamp(0.875rem, 2vw, 1rem)", 
                lineHeight: 1.6,
                padding: "0 0.5rem",
              }}>
                Subscribe to our newsletter and never miss a new arrival.
              </p>
              <form
                onSubmit={handleSubscribe}
                style={{
                  marginTop: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  justifyContent: "center",
                  maxWidth: isDesktop ? "none" : "400px",
                  margin: "1.25rem auto 0",
                }}
                className="newarrivals-newsletter-form"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={submitting}
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
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = tokens.foreground)}
                  onBlur={(e) => (e.target.style.borderColor = tokens.border)}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    height: "44px",
                    borderRadius: tokens.radius,
                    border: "none",
                    backgroundColor: "#f6aab2",
                    padding: "0 1.5rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    fontFamily: tokens.fontBody,
                    color: tokens.background,
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.7 : subscribeBtnHovered ? 0.9 : 1,
                    transition: "opacity 0.2s ease",
                    width: "100%",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={() => setSubscribeBtnHovered(true)}
                  onMouseLeave={() => setSubscribeBtnHovered(false)}
                >
                  {submitting ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
              {feedback && (
                <p
                  style={{
                    marginTop: "0.75rem",
                    fontSize: "0.8125rem",
                    color: feedback.type === "success" ? "#16a34a" : "#ef4444",
                    padding: "0 0.5rem",
                  }}
                >
                  {feedback.message}
                </p>
              )}
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
            max-width: none !important;
          }
          .newarrivals-newsletter-form input {
            width: auto !important;
          }
          .newarrivals-newsletter-form button {
            width: auto !important;
  flex-shrink: 0;
          }
        }
        @media (max-width: 639px) {
          .newarrivals-newsletter-form {
            padding: 0 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default NewArrivalsPage;