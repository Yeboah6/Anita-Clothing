import SEO from '@/Components/SEO';
import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
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
  secondary: "#FCE7E9",
  border: "#FCE7E9",
  radius: "4px",
};

// const tokens = {
//   fontDisplay: "'Cormorant Garamond', serif",
//   fontBody: "'Inter', sans-serif",
//   foreground: "#141414",
//   background: "#faf7f2",
//   cardBackground: "#ffffff",
//   mutedForeground: "#737373",
//   border: "#e6e6e6",
//   radius: "4px",
//   accent: "#ff6bb3",
//   green: "#16a34a",
//   destructive: "#ef4444",
// };

// ─── Icons ───────────────────────────────────────────────────────────────────
const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);

const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
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

// ─── Info Card (email / phone / address) ─────────────────────────────────────
const InfoCard = ({ icon, label, children }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "flex-start",
        padding: "1.5rem",
        backgroundColor: tokens.background,
        border: `1px solid ${tokens.border}`,
        borderRadius: tokens.radius,
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
      }}
      onMouseEnter={(e) => {
        setHovered(true);
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          flexShrink: 0,
          borderRadius: "50%",
          backgroundColor: tokens.secondary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: tokens.foreground,
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: "0.8125rem", color: tokens.mutedForeground }}>{label}</p>
        <div style={{ marginTop: "0.25rem", fontSize: "0.9375rem", color: tokens.foreground, fontWeight: 500, lineHeight: 1.5, wordBreak: "break-word" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// ─── Form field styles ────────────────────────────────────────────────────────
const labelStyle = { fontSize: "0.875rem", fontWeight: 500, fontFamily: tokens.fontBody, color: tokens.foreground, marginBottom: "0.5rem", display: "block" };
const inputStyle = { height: "44px", width: "100%", padding: "0 0.875rem", fontSize: "0.9375rem", fontFamily: tokens.fontBody, backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, color: tokens.foreground, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s ease" };
const textareaStyle = { ...inputStyle, height: "auto", padding: "0.75rem 0.875rem", minHeight: "140px", resize: "vertical" };
const errorTextStyle = { fontSize: "0.75rem", color: "#ef4444", margin: "0.375rem 0 0" };

// ─── Contact Page ────────────────────────────────────────────────────────────
// Expects Inertia props from ContactController@index:
//   store: { name, email, phone, address }
const Contact = ({ store = {} }) => {
  const [breadcrumbHomeHovered, setBreadcrumbHomeHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    injectFonts();
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/contact", {
      preserveScroll: true,
      onSuccess: () => {
        setSubmitted(true);
        reset();
        setTimeout(() => setSubmitted(false), 5000);
      },
    });
  };

  const hasStoreInfo = store.email || store.phone || store.address;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
      <SEO
        title="Contact Us"
        description={`Get in touch with ${store.name || "us"} — questions about an order, a product, or anything else.`}
        image="/images/user.jpeg"
        url="/contact"
      />
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
              <span style={{ color: tokens.foreground }}>Contact</span>
            </nav>
          </div>
        </section>

        {/* Hero */}
        <section style={{ padding: isDesktop ? "5rem 0 4rem" : "3rem 0 2.5rem" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
            <div style={{ maxWidth: "42rem" }}>
              <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(2.25rem, 5vw, 3.75rem)", fontWeight: 500, letterSpacing: "-0.02em", margin: 0, color: tokens.foreground }}>
                Get in Touch
              </h1>
              <p style={{ marginTop: "1rem", fontSize: "1.125rem", color: tokens.mutedForeground, lineHeight: 1.7, margin: "1rem 0 0" }}>
                Questions about an order, a product, or anything else? We'd love to hear from you — drop us a message below or reach out directly.
              </p>
            </div>
          </div>
        </section>

        {/* Info + Form */}
        <section style={{ paddingBottom: isDesktop ? "6rem" : "4rem" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1.5fr" : "1fr", gap: isDesktop ? "3rem" : "2.5rem", alignItems: "start" }}>
              {/* Store info */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {hasStoreInfo ? (
                  <>
                    {store.email && (
                      <InfoCard icon={<IconMail />} label="Email us">
                        <a href={`mailto:${store.email}`} style={{ color: "inherit", textDecoration: "none" }}>{store.email}</a>
                      </InfoCard>
                    )}
                    {store.phone && (
                      <InfoCard icon={<IconPhone />} label="Call us">
                        <a href={`tel:${store.phone}`} style={{ color: "inherit", textDecoration: "none" }}>{store.phone}</a>
                      </InfoCard>
                    )}
                    {store.address && (
                      <InfoCard icon={<IconMapPin />} label="Visit us">
                        {store.address}
                      </InfoCard>
                    )}
                  </>
                ) : (
                  <div style={{ padding: "1.5rem", border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, fontSize: "0.875rem", color: tokens.mutedForeground }}>
                    Contact details haven't been set up yet.
                  </div>
                )}
              </div>

              {/* Contact form */}
              <div
                style={{
                  backgroundColor: "rgba(245,245,245,0.5)",
                  border: `1px solid ${tokens.border}`,
                  borderRadius: tokens.radius,
                  padding: isDesktop ? "2.5rem" : "1.5rem",
                }}
              >
                {submitted && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", borderRadius: tokens.radius, backgroundColor: "#f0fdf4", color: "#166534", fontSize: "0.875rem", fontWeight: 500, marginBottom: "1.5rem" }}>
                    <IconCheck /> Thanks — we'll get back to you shortly.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                    <div>
                      <label htmlFor="name" style={labelStyle}>Name</label>
                      <input id="name" type="text" value={data.name} onChange={(e) => setData("name", e.target.value)}
                        style={{ ...inputStyle, borderColor: errors.name ? "#ef4444" : tokens.border }}
                        onFocus={(e) => { if (!errors.name) e.target.style.borderColor = tokens.foreground; }}
                        onBlur={(e) => (e.target.style.borderColor = errors.name ? "#ef4444" : tokens.border)} />
                      {errors.name && <p style={errorTextStyle}>{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" style={labelStyle}>Email</label>
                      <input id="email" type="email" value={data.email} onChange={(e) => setData("email", e.target.value)}
                        style={{ ...inputStyle, borderColor: errors.email ? "#ef4444" : tokens.border }}
                        onFocus={(e) => { if (!errors.email) e.target.style.borderColor = tokens.foreground; }}
                        onBlur={(e) => (e.target.style.borderColor = errors.email ? "#ef4444" : tokens.border)} />
                      {errors.email && <p style={errorTextStyle}>{errors.email}</p>}
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <label htmlFor="subject" style={labelStyle}>Subject</label>
                    <input id="subject" type="text" value={data.subject} onChange={(e) => setData("subject", e.target.value)}
                      style={{ ...inputStyle, borderColor: errors.subject ? "#ef4444" : tokens.border }}
                      onFocus={(e) => { if (!errors.subject) e.target.style.borderColor = tokens.foreground; }}
                      onBlur={(e) => (e.target.style.borderColor = errors.subject ? "#ef4444" : tokens.border)} />
                    {errors.subject && <p style={errorTextStyle}>{errors.subject}</p>}
                  </div>

                  <div style={{ marginBottom: "1.75rem" }}>
                    <label htmlFor="message" style={labelStyle}>Message</label>
                    <textarea id="message" value={data.message} onChange={(e) => setData("message", e.target.value)}
                      style={{ ...textareaStyle, borderColor: errors.message ? "#ef4444" : tokens.border }}
                      onFocus={(e) => { if (!errors.message) e.target.style.borderColor = tokens.foreground; }}
                      onBlur={(e) => (e.target.style.borderColor = errors.message ? "#ef4444" : tokens.border)} />
                    {errors.message && <p style={errorTextStyle}>{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      padding: "0.75rem 2rem", fontSize: "1rem", fontWeight: 500,
                      fontFamily: tokens.fontBody, borderRadius: tokens.radius, border: "none",
                      backgroundColor: "#FCE7E9",
                      cursor: processing ? "not-allowed" : "pointer",
                      opacity: processing ? 0.7 : 1, transition: "opacity 0.2s ease",
                    }}
                  >
                    {processing ? "Sending…" : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;