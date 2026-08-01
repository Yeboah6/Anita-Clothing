import React, { useState, useEffect } from "react";

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

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconStar = ({ filled, size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? "#f6aab2" : "none"}
    stroke="#f6aab2"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconQuote = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#000" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: tokens.border }}>
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
  </svg>
);

const StarRating = ({ rating, size = 16 }) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <IconStar key={star} filled={star <= Math.round(rating)} size={size} />
    ))}
  </div>
);

const ReviewCard = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 140;
  const shouldTruncate = review.review.length > maxLength;

  return (
    <div
      style={{
        backgroundColor: tokens.background,
        border: `1px solid ${tokens.border}`,
        borderRadius: tokens.radius,
        padding: "1.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        height: "100%",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ opacity: 1 }}>
        <IconQuote />
      </div>

      <StarRating rating={review.rating} />

      <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, lineHeight: 1.7, margin: 0, flex: 1 }}>
        {shouldTruncate && !isExpanded ? `${review.review.substring(0, maxLength)}...` : review.review}
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: "none",
              border: "none",
              color: tokens.foreground,
              cursor: "pointer",
              fontSize: "0.8125rem",
              fontWeight: 500,
              fontFamily: tokens.fontBody,
              padding: 0,
              marginLeft: "0.25rem",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
            }}
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingTop: "0.5rem", borderTop: `1px solid ${tokens.border}` }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: tokens.secondary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: tokens.fontDisplay,
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: tokens.foreground,
            flexShrink: 0,
          }}
        >
          {review.user?.name
            ? review.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
            : "?"}
        </div>
        <div>
          <p style={{ fontWeight: 500, color: tokens.foreground, margin: 0, fontSize: "0.8125rem" }}>
            {review.user?.name || "Anonymous"}
          </p>
          <span style={{ fontSize: "0.75rem", color: tokens.mutedForeground }}>
            {new Date(review.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── ReviewsSection (Home) ───────────────────────────────────────────────────
const ReviewsSection = ({ reviews = [], stats = null }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!reviews.length) return null; // nothing to feature yet — say nothing rather than an empty block on the homepage

  return (
    <section style={{ padding: isDesktop ? "6rem 0" : "4rem 0", borderTop: `1px solid ${tokens.border}`, fontFamily: tokens.fontBody }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.875rem, 4vw, 2.5rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>
            Loved by Our Customers
          </h2>
          {stats && stats.total_reviews > 0 && (
            <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              <StarRating rating={stats.average_rating} size={18} />
              <span style={{ fontSize: "0.9375rem", color: tokens.mutedForeground }}>
                {stats.average_rating} out of 5 · {stats.total_reviews} review{stats.total_reviews !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "repeat(3, 1fr)" : "1fr", gap: "1.5rem" }}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;