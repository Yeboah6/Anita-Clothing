import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
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
};

export default function Payment({ order, paystackPublicKey }) {
  const [loading, setLoading] = useState(false);
  const { post, processing, errors } = useForm({});

  const handlePay = () => {
    setLoading(true);
    post(`/checkout/${order.id}/pay`, {
      onFinish: () => setLoading(false),
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: tokens.cream, fontFamily: tokens.fontBody }}>
      <Header />

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1rem" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            backgroundColor: "#ffffff",
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius,
            padding: "2.5rem 2rem",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: tokens.fontDisplay,
              fontSize: "1.75rem",
              fontWeight: 600,
              margin: "0 0 0.5rem",
              color: tokens.foreground,
            }}
          >
            Complete Your Payment
          </h1>
          <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: "0 0 2rem" }}>
            Order #{order.id}
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "1rem 0",
              borderTop: `1px solid ${tokens.border}`,
              borderBottom: `1px solid ${tokens.border}`,
              marginBottom: "2rem",
              fontSize: "1rem",
            }}
          >
            <span style={{ color: tokens.mutedForeground }}>Total</span>
            <span style={{ fontWeight: 600, color: tokens.foreground }}>
              ₵{Number(order.total_amount).toLocaleString()}
            </span>
          </div>

          {errors.payment && (
            <p style={{ color: "#ef4444", fontSize: "0.8125rem", marginBottom: "1rem" }}>
              {errors.payment}
            </p>
          )}

          <button
            onClick={handlePay}
            disabled={processing || loading}
            style={{
              width: "100%",
              height: "50px",
              backgroundColor: tokens.pink,
              color: "#ffffff",
              border: "none",
              borderRadius: tokens.radius,
              fontSize: "0.9375rem",
              fontWeight: 600,
              fontFamily: tokens.fontBody,
              cursor: processing || loading ? "not-allowed" : "pointer",
              opacity: processing || loading ? 0.7 : 1,
              transition: "opacity 0.15s ease",
            }}
          >
            {loading ? "Redirecting to Paystack…" : "Pay with Paystack"}
          </button>

          <p style={{ fontSize: "0.75rem", color: tokens.mutedForeground, marginTop: "1rem" }}>
            You'll be redirected to Paystack's secure checkout.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}