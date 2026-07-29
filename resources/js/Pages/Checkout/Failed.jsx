import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import Header from "@/Components/Layout/Header";
import Footer from "@/Components/Layout/Footer";

const tokens = {
  fontDisplay: "'Cormorant Garamond', serif",
  fontBody: "'Inter', sans-serif",
  cream: "#faf7f2",
  pink: "#ff6bb3",
  foreground: "#141414",
  mutedForeground: "#737373",
  border: "#e6e6e6",
  radius: "6px",
  red: "#ef4444",
};

const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={tokens.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

export default function Failed({ order, payment }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [tryAgainHovered, setTryAgainHovered] = useState(false);
  const [backToCartHovered, setBackToCartHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024);
      setIsTablet(width >= 640 && width < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const retryPayment = () => {
    router.get(route("checkout.pay", order.id));
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh", 
      backgroundColor: tokens.cream, 
      fontFamily: tokens.fontBody 
    }}>
      <Header />

      <main style={{ 
        flex: 1, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: isDesktop ? "3rem 1rem" : isTablet ? "2rem 1rem" : "1.5rem 1rem" 
      }}>
        <div
          style={{
            width: "100%",
            maxWidth: isDesktop ? "440px" : "100%",
            backgroundColor: "#ffffff",
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius,
            padding: isDesktop ? "2.5rem 2rem" : isTablet ? "2rem 1.75rem" : "1.75rem 1.25rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: isDesktop ? "72px" : "60px",
              height: isDesktop ? "72px" : "60px",
              borderRadius: "50%",
              backgroundColor: "#fef2f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: `0 auto ${isDesktop ? "1.5rem" : "1.25rem"}`,
            }}
          >
            <IconX />
          </div>

          <h1
            style={{
              fontFamily: tokens.fontDisplay,
              fontSize: "clamp(1.5rem, 5vw, 1.875rem)",
              fontWeight: 600,
              margin: "0 0 0.5rem",
              color: tokens.foreground,
              lineHeight: 1.2,
            }}
          >
            Payment Failed
          </h1>
          <p style={{ 
            fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)", 
            color: tokens.mutedForeground, 
            margin: `0 0 ${isDesktop ? "2rem" : "1.5rem"}`,
            padding: isDesktop ? "0" : "0 0.25rem",
            lineHeight: 1.6,
          }}>
            Something went wrong and your payment didn't go through.
          </p>

          <div
            style={{
              textAlign: "left",
              border: `1px solid ${tokens.border}`,
              borderRadius: tokens.radius,
              padding: isDesktop ? "1.25rem" : isTablet ? "1rem" : "0.875rem",
              marginBottom: isDesktop ? "2rem" : "1.5rem",
              fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)",
            }}
          >
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              marginBottom: "0.5rem",
              flexWrap: "wrap",
              gap: "0.25rem",
            }}>
              <span style={{ color: tokens.mutedForeground }}>Order</span>
              <span style={{ color: tokens.foreground, fontWeight: 500, wordBreak: "break-all" }}>
                #{order.id}
              </span>
            </div>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.25rem",
            }}>
              <span style={{ color: tokens.mutedForeground }}>Amount</span>
              <span style={{ color: tokens.foreground, fontWeight: 500 }}>
                ₵ {Number(order.total_amount).toLocaleString()}
              </span>
            </div>
            {payment?.status && (
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginTop: "0.5rem",
                flexWrap: "wrap",
                gap: "0.25rem",
              }}>
                <span style={{ color: tokens.mutedForeground }}>Status</span>
                <span style={{ 
                  color: tokens.red, 
                  fontWeight: 500, 
                  textTransform: "capitalize" 
                }}>
                  {payment.status}
                </span>
              </div>
            )}
          </div>

          <div style={{ 
            display: "flex", 
            gap: "0.75rem",
            flexDirection: isDesktop ? "row" : "column",
          }}>
            <button
              onClick={retryPayment}
              style={{
                flex: isDesktop ? 1 : "none",
                height: isDesktop ? "48px" : "44px",
                width: isDesktop ? "auto" : "100%",
                backgroundColor: tryAgainHovered ? "#ff85c3" : tokens.pink,
                color: "#ffffff",
                border: "none",
                borderRadius: tokens.radius,
                fontSize: "clamp(0.875rem, 2.5vw, 0.9375rem)",
                fontWeight: 600,
                fontFamily: tokens.fontBody,
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={() => setTryAgainHovered(true)}
              onMouseLeave={() => setTryAgainHovered(false)}
            >
              Try Again
            </button>
            <a
              href="/cart"
              style={{
                flex: isDesktop ? 1 : "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: isDesktop ? "48px" : "44px",
                width: isDesktop ? "auto" : "100%",
                border: `1px solid ${backToCartHovered ? tokens.foreground : tokens.border}`,
                backgroundColor: backToCartHovered ? "#f9f9f9" : "#ffffff",
                color: tokens.foreground,
                borderRadius: tokens.radius,
                fontSize: "clamp(0.875rem, 2.5vw, 0.9375rem)",
                fontWeight: 600,
                textDecoration: "none",
                boxSizing: "border-box",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={() => setBackToCartHovered(true)}
              onMouseLeave={() => setBackToCartHovered(false)}
            >
              Back to Cart
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}