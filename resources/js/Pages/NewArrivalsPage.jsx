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
  const image = product.images?.[0];

  return (
    <a
      href={`/product/${product.slug ?? product.id}`}
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
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

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
                    backgroundColor: tokens.foreground,
                    padding: "0 1.5rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    fontFamily: tokens.fontBody,
                    color: tokens.background,
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.7 : subscribeBtnHovered ? 0.9 : 1,
                    transition: "opacity 0.2s ease",
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
          }
        }
      `}</style>
    </div>
  );
};

export default NewArrivalsPage;