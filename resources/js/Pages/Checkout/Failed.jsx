import React from "react";
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
  const retryPayment = () => {
    router.get(route("checkout.pay", order.id));
  };

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
              backgroundColor: "#fef2f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <IconX />
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
            Payment Failed
          </h1>
          <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: "0 0 2rem" }}>
            Something went wrong and your payment didn't go through.
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: tokens.mutedForeground }}>Amount</span>
              <span style={{ color: tokens.foreground, fontWeight: 500 }}>
                ₦{Number(order.total_amount).toLocaleString()}
              </span>
            </div>
            {payment?.status && (
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                <span style={{ color: tokens.mutedForeground }}>Status</span>
                <span style={{ color: tokens.red, fontWeight: 500, textTransform: "capitalize" }}>
                  {payment.status}
                </span>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={retryPayment}
              style={{
                flex: 1,
                height: "48px",
                backgroundColor: tokens.pink,
                color: "#ffffff",
                border: "none",
                borderRadius: tokens.radius,
                fontSize: "0.9375rem",
                fontWeight: 600,
                fontFamily: tokens.fontBody,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
            <a
              href="/cart"
              style={{
                flex: 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "48px",
                border: `1px solid ${tokens.border}`,
                color: tokens.foreground,
                borderRadius: tokens.radius,
                fontSize: "0.9375rem",
                fontWeight: 600,
                textDecoration: "none",
                boxSizing: "border-box",
              }}
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