import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";

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

// ─── Simple SVG Icons ────────────────────────────────────────────────────────
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TikTokIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M14 3v10.5a3.5 3.5 0 1 1-3.5-3.5" />
    <path d="M14 3c1 2 3 4 6 4" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

// ─── Hoverable Link ──────────────────────────────────────────────────────────
const HoverLink = ({ href, target, rel, ariaLabel, children, style: baseStyle }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
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

// ─── Footer ──────────────────────────────────────────────────────────────────
const Footer = () => {
  const [email, setEmail] = useState("");
  const [btnHovered, setBtnHovered] = useState(false);
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

  const handleSubmit = (e) => {
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

  const getGridColumns = () => {
    if (isDesktop) return "1fr 1fr 1fr 1fr";
    if (isTablet) return "1fr 1fr";
    return "1fr";
  };

  return (
    <footer
      style={{
        borderTop: `1px solid ${tokens.border}`,
        backgroundColor: tokens.secondary,
        fontFamily: tokens.fontBody,
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: isDesktop ? "3rem 1rem" : "2rem 1.25rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: getGridColumns(),
            gap: isDesktop ? "2rem" : "1.75rem",
            textAlign: isDesktop ? "left" : "center",
          }}
        >
          {/* Brand */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "0.75rem",
            alignItems: isDesktop ? "flex-start" : "center"
          }}>
            <a
              href="/"
              style={{
                display: "inline-block",
                textDecoration: "none",
                color: tokens.foreground,
              }}
            >
              <img
                src="/images/logo.png"
                alt="CuteBloom Logo"
                style={{ 
                  height: isDesktop ? "55px" : "48px", 
                  width: "auto", 
                  borderRadius: tokens.radius, 
                  objectFit: "cover" 
                }}
              />
            </a>
            <p
              style={{
                fontSize: "0.875rem",
                color: tokens.mutedForeground,
                lineHeight: 1.6,
                margin: 0,
                maxWidth: "320px",
              }}
            >
              Outfits that makes you feel cute and confident.
            </p>
            {/* Social icons for mobile */}
            {!isDesktop && (
              <div style={{ display: "flex", gap: "1.25rem", marginTop: "0.25rem" }}>
                <HoverLink
                  href="https://instagram.com/ser_nita21"
                  target="_blank"
                  rel="noopener noreferrer"
                  ariaLabel="Instagram"
                >
                  <InstagramIcon />
                </HoverLink>
                <HoverLink
                  href="https://tiktok.com/@eshun_23"
                  target="_blank"
                  rel="noopener noreferrer"
                  ariaLabel="TikTok"
                >
                  <TikTokIcon />
                </HoverLink>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "0.75rem",
            alignItems: isDesktop ? "flex-start" : "center"
          }}>
            <h4
              style={{
                fontFamily: tokens.fontDisplay,
                fontSize: "1.125rem",
                fontWeight: 500,
                margin: 0,
                color: tokens.foreground,
              }}
            >
              Quick Links
            </h4>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: isDesktop ? "flex-start" : "center" }}>
              <HoverLink href="/collections">All Collections</HoverLink>
              <HoverLink href="/new-arrivals">New Arrivals</HoverLink>
              <HoverLink href="/#about">About Us</HoverLink>
              <HoverLink href="/contact">Contact Us</HoverLink>
            </nav>
          </div>

          {/* Contact */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "0.75rem",
            alignItems: isDesktop ? "flex-start" : "center"
          }}>
            <h4
              style={{
                fontFamily: tokens.fontDisplay,
                fontSize: "1.125rem",
                fontWeight: 500,
                margin: 0,
                color: tokens.foreground,
              }}
            >
              Contact
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                fontSize: "0.875rem",
                color: tokens.mutedForeground,
                alignItems: isDesktop ? "flex-start" : "center",
              }}
            >
              <HoverLink href="mailto:serwaaakoto392@gmail.com" ariaLabel="Email">
                serwaaakoto392@gmail.com
              </HoverLink>
              <HoverLink href="tel:+233 27 722 3535" ariaLabel="Phone">
                +233 27 722 3535
              </HoverLink>
            </div>
            {isDesktop && (
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem" }}>
                <HoverLink
                  href="https://instagram.com/ser_nita21"
                  target="_blank"
                  rel="noopener noreferrer"
                  ariaLabel="Instagram"
                >
                  <InstagramIcon />
                </HoverLink>
                <HoverLink
                  href="https://tiktok.com/@eshun_23"
                  target="_blank"
                  rel="noopener noreferrer"
                  ariaLabel="TikTok"
                >
                  <TikTokIcon />
                </HoverLink>
              </div>
            )}
          </div>

          {/* Newsletter */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "0.75rem",
            alignItems: isDesktop ? "flex-start" : "center"
          }}>
            <h4
              style={{
                fontFamily: tokens.fontDisplay,
                fontSize: "1.125rem",
                fontWeight: 500,
                margin: 0,
                color: tokens.foreground,
              }}
            >
              Stay Updated
            </h4>
            <p
              style={{
                fontSize: "0.875rem",
                color: tokens.mutedForeground,
                lineHeight: 1.6,
                margin: 0,
                maxWidth: "320px",
              }}
            >
              Subscribe for exclusive offers and new arrivals.
            </p>
            <form 
              onSubmit={handleSubmit} 
              style={{ 
                display: "flex", 
                gap: "0.5rem",
                width: "100%",
                maxWidth: isDesktop ? "none" : "320px",
                flexDirection: isDesktop ? "row" : "column",
              }}
            >
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitting}
                style={{
                  flex: 1,
                  padding: "0.625rem 0.75rem",
                  fontSize: "0.875rem",
                  fontFamily: tokens.fontBody,
                  backgroundColor: tokens.background,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: tokens.radius,
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
                  padding: "0.625rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  fontFamily: tokens.fontBody,
                  backgroundColor: "#f6aab2",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: tokens.radius,
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.7 : btnHovered ? 0.9 : 1,
                  transition: "opacity 0.2s ease",
                  whiteSpace: "nowrap",
                  width: !isDesktop ? "100%" : "auto",
                }}
                onMouseEnter={() => setBtnHovered(true)}
                onMouseLeave={() => setBtnHovered(false)}
              >
                {submitting ? "Joining..." : "Join"}
              </button>
            </form>
            {feedback && (
              <p
                style={{
                  fontSize: "0.8125rem",
                  margin: 0,
                  color: feedback.type === "success" ? "#16a34a" : "#ef4444",
                  textAlign: isDesktop ? "left" : "center",
                }}
              >
                {feedback.message}
              </p>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            marginTop: isDesktop ? "3rem" : "2rem",
            borderTop: `1px solid ${tokens.border}`,
            paddingTop: isDesktop ? "2rem" : "1.5rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.8125rem",
              color: tokens.mutedForeground,
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} CuteBloom. All rights reserved || Everyday With God is Everyday in Victory!
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;