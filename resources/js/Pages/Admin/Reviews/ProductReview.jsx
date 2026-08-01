import React from "react";

const tokens = {
  fontDisplay: "'Cormorant Garamond', serif",
  fontBody: "'Inter', sans-serif",
  foreground: "#141414",
  mutedForeground: "#737373",
  border: "#e6e6e6",
  radius: "4px",
  accent: "#ff6bb3",
};

const IconStar = ({ filled, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? tokens.accent : "none"}
    stroke={filled ? tokens.accent : tokens.mutedForeground}
    strokeWidth="2"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const StarRow = ({ rating, size }) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <IconStar key={n} filled={n <= Math.round(rating)} size={size} />
    ))}
  </div>
);

const ReviewCard = ({ review }) => (
  <div style={{ padding: "1.25rem 0", borderBottom: `1px solid ${tokens.border}` }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
      <p style={{ margin: 0, fontWeight: 500, fontSize: "0.875rem", color: tokens.foreground, fontFamily: tokens.fontBody }}>
        {review.customer_name}
      </p>
      <p style={{ margin: 0, fontSize: "0.75rem", color: tokens.mutedForeground }}>{review.created_at}</p>
    </div>
    <StarRow rating={review.rating} size={14} />
    <p style={{ marginTop: "0.5rem", marginBottom: 0, fontSize: "0.875rem", lineHeight: 1.6, color: tokens.foreground }}>
      {review.review}
    </p>
  </div>
);

const ProductReviews = ({ reviews = [], averageRating = 0, reviewCount = 0 }) => {
  return (
    <section style={{ maxWidth: "720px", fontFamily: tokens.fontBody }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.5rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>
          Reviews
        </h2>
        {reviewCount > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <StarRow rating={averageRating} size={16} />
            <span style={{ fontSize: "0.875rem", color: tokens.mutedForeground }}>
              {averageRating.toFixed(1)} · {reviewCount} review{reviewCount !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground }}>
          No reviews yet. Be the first to share your thoughts on this piece.
        </p>
      ) : (
        <div>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductReviews;