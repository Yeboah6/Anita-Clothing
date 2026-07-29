import React, { useState, useEffect } from "react";
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
  green: "#16a34a",
};

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={tokens.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default function Success({ order, payment }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);


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
              backgroundColor: "#f0fdf4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: `0 auto ${isDesktop ? "1.5rem" : "1.25rem"}`,
            }}
          >
            <IconCheck />
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
            Payment Successful
          </h1>
          <p style={{ 
            fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)", 
            color: tokens.mutedForeground, 
            margin: `0 0 ${isDesktop ? "2rem" : "1.5rem"}`,
            padding: isDesktop ? "0" : "0 0.25rem",
          }}>
            Thank you — your order has been confirmed.
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
              marginBottom: "0.5rem",
              flexWrap: "wrap",
              gap: "0.25rem",
            }}>
              <span style={{ color: tokens.mutedForeground }}>Amount Paid</span>
              <span style={{ color: tokens.foreground, fontWeight: 500 }}>
                ₵ {Number(order.total_amount).toLocaleString()}
              </span>
            </div>
            {payment?.reference && (
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginBottom: "0.5rem",
                flexWrap: "wrap",
                gap: "0.25rem",
              }}>
                <span style={{ color: tokens.mutedForeground, flexShrink: 0 }}>Reference</span>
                <span style={{ 
                  color: tokens.foreground, 
                  fontWeight: 500, 
                  wordBreak: "break-all",
                  textAlign: "right",
                  maxWidth: isDesktop ? "none" : "60%",
                }}>
                  {payment.reference}
                </span>
              </div>
            )}
            {payment?.channel && (
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.25rem",
              }}>
                <span style={{ color: tokens.mutedForeground }}>Channel</span>
                <span style={{ 
                  color: tokens.foreground, 
                  fontWeight: 500, 
                  textTransform: "capitalize" 
                }}>
                  {payment.channel}
                </span>
              </div>
            )}
          </div>

          <a
            href="/collections"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: isDesktop ? "48px" : "44px",
              backgroundColor: tokens.pink,
              color: "#ffffff",
              borderRadius: tokens.radius,
              fontSize: "clamp(0.875rem, 2.5vw, 0.9375rem)",
              fontWeight: 600,
              textDecoration: "none",
              boxSizing: "border-box",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => e.target.style.opacity = "0.9"}
            onMouseLeave={(e) => e.target.style.opacity = "1"}
          >
            Continue Shopping
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}