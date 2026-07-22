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

// ─── Simple SVG Icons ────────────────────────────────────────────────────────
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

  useEffect(() => {
    injectFonts();

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
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
          padding: "3rem 1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isDesktop ? "1fr 1fr 1fr 1fr" : "1fr 1fr",
            gap: "2rem",
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
              style={{ height: "55px", width: "auto", borderRadius: tokens.radius, objectFit: "cover" }}
            />
            </a>
            <p
              style={{
                fontSize: "0.875rem",
                color: tokens.mutedForeground,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Timeless elegance for the modern woman. Curated collections that
              celebrate understated luxury.
            </p>
          </div>

          {/* Quick Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <HoverLink href="/collections">All Collections</HoverLink>
              <HoverLink href="/collections?filter=new">New Arrivals</HoverLink>
              <HoverLink href="/#about">About Us</HoverLink>
            </nav>
          </div>

          {/* Contact */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
              }}
            >
              <p style={{ margin: 0 }}>hello@anitaclothing.com</p>
              <p style={{ margin: 0 }}>+1 (555) 123-4567</p>
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem" }}>
              <HoverLink
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                ariaLabel="Instagram"
              >
                <InstagramIcon />
              </HoverLink>
              <HoverLink
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                ariaLabel="Facebook"
              >
                <FacebookIcon />
              </HoverLink>
              <HoverLink href="mailto:hello@anitaclothing.com" ariaLabel="Email">
                <MailIcon />
              </HoverLink>
            </div>
          </div>

          {/* Newsletter */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
              }}
            >
              Subscribe for exclusive offers and new arrivals.
            </p>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.875rem",
                  fontFamily: tokens.fontBody,
                  backgroundColor: tokens.background,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: tokens.radius,
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
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  fontFamily: tokens.fontBody,
                  backgroundColor: tokens.foreground,
                  color: "#ffffff",
                  border: "none",
                  borderRadius: tokens.radius,
                  cursor: "pointer",
                  opacity: btnHovered ? 0.9 : 1,
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={() => setBtnHovered(true)}
                onMouseLeave={() => setBtnHovered(false)}
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            marginTop: "3rem",
            borderTop: `1px solid ${tokens.border}`,
            paddingTop: "2rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              color: tokens.mutedForeground,
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} CuteBloom. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;