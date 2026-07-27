import React from "react";
import Header from '@/Components/Layout/Header';
import Footer from '@/Components/Layout/Footer';

const tokens = {
  fontDisplay: "'Cormorant Garamond', serif",
  fontBody: "'Inter', sans-serif",
  foreground: "#141414",
  mutedForeground: "#737373",
  background: "#ffffff",
  border: "#e6e6e6",
  radius: "4px",
};

const Unsubscribed = () => (
  <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
    <Header />
    <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1rem" }}>
      <div style={{ textAlign: "center", maxWidth: "420px" }}>
        <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.75rem", fontWeight: 500, margin: "0 0 0.75rem", color: tokens.foreground }}>
          You've been unsubscribed
        </h1>
        <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, lineHeight: 1.6 }}>
          You won't receive any more newsletter emails from us. Changed your mind? You can resubscribe any time from the footer of our site.
        </p>
        <a href="/" style={{ color: tokens.foreground, fontWeight: 500, textDecoration: "underline" }}>
          Back to home
        </a>
      </div>
    </main>
    <Footer />
  </div>
);

export default Unsubscribed;