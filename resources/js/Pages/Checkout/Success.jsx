import React from "react";
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
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: tokens.cream, fontFamily: tokens.fontBody }}>
      <Header />

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1rem" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "440px",
            backgroundColor: "#ffffff",
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius,
            padding: "2.5rem 2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              backgroundColor: "#f0fdf4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <IconCheck />
          </div>

          <h1
            style={{
              fontFamily: tokens.fontDisplay,
              fontSize: "1.875rem",
              fontWeight: 600,
              margin: "0 0 0.5rem",
              color: tokens.foreground,
            }}
          >
            Payment Successful
          </h1>
          <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: "0 0 2rem" }}>
            Thank you — your order has been confirmed.
          </p>

          <div
            style={{
              textAlign: "left",
              border: `1px solid ${tokens.border}`,
              borderRadius: tokens.radius,
              padding: "1.25rem",
              marginBottom: "2rem",
              fontSize: "0.875rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ color: tokens.mutedForeground }}>Order</span>
              <span style={{ color: tokens.foreground, fontWeight: 500 }}>#{order.id}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ color: tokens.mutedForeground }}>Amount Paid</span>
              <span style={{ color: tokens.foreground, fontWeight: 500 }}>
                ₦{Number(order.total_amount).toLocaleString()}
              </span>
            </div>
            {payment?.reference && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: tokens.mutedForeground }}>Reference</span>
                <span style={{ color: tokens.foreground, fontWeight: 500, wordBreak: "break-all" }}>
                  {payment.reference}
                </span>
              </div>
            )}
            {payment?.channel && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: tokens.mutedForeground }}>Channel</span>
                <span style={{ color: tokens.foreground, fontWeight: 500, textTransform: "capitalize" }}>
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
              height: "48px",
              backgroundColor: tokens.pink,
              color: "#ffffff",
              borderRadius: tokens.radius,
              fontSize: "0.9375rem",
              fontWeight: 600,
              textDecoration: "none",
              boxSizing: "border-box",
            }}
          >
            Continue Shopping
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}