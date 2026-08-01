import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePage, router } from "@inertiajs/react";
import AccountSidebar from '@/Components/Customer/AccountSidebar';
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
  secondary: "#f5f5f5",
  border: "#e6e6e6",
  radius: "4px",
  green: "#16a34a",
  blue: "#2563eb",
};

// ─── Status config ───────────────────────────────────────────────────────────
const statusConfig = {
  pending: {
    label: "Pending",
    style: { backgroundColor: tokens.secondary, color: tokens.mutedForeground, border: `1px solid ${tokens.border}` },
  },
  processing: {
    label: "Processing",
    style: { backgroundColor: tokens.secondary, color: tokens.foreground, border: `1px solid ${tokens.border}` },
  },
  shipped: {
    label: "Shipped",
    style: { backgroundColor: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd" },
  },
  delivered: {
    label: "Delivered",
    style: { backgroundColor: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" },
  },
  cancelled: {
    label: "Cancelled",
    style: { backgroundColor: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca" },
  },
};

// ─── Get active path from URL ────────────────────────────────────────────────
const getActivePath = () => {
  const path = window.location.pathname;
  if (path === "/account/orders" || path === "/account/orders/") return "/account/orders";
  return path;
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconPackage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m16.5 9.4-9-5.19" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconTruck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 3h15v13H1z" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const IconCheckCircle2 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconXCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const IconChevronDown = ({ isOpen }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f6aab2"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{
      flexShrink: 0,
      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.25s ease",
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconStar = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? "#f6aab2" : "none"}
    stroke="#f6aab2"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconClose = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f6aab2"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Status icon map ─────────────────────────────────────────────────────────
const statusIcons = {
  pending: IconClock,
  processing: IconPackage,
  shipped: IconTruck,
  delivered: IconCheckCircle2,
  cancelled: IconXCircle,
};

// ─── StarRating Component ───────────────────────────────────────────────────
const StarRating = ({ rating, onRate, interactive = true }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div style={{ display: "flex", gap: "0.25rem" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRate(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          style={{
            background: "none",
            border: "none",
            cursor: interactive ? "pointer" : "default",
            padding: 0,
            color: (hoverRating || rating) >= star ? tokens.foreground : tokens.mutedForeground,
            transition: "color 0.2s ease",
          }}
        >
          <IconStar filled={(hoverRating || rating) >= star} />
        </button>
      ))}
    </div>
  );
};

// ─── ReviewModal Component ──────────────────────────────────────────────────
const ReviewModal = ({ isOpen, onClose, order, onSubmit, reviewedItemIds }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setTitle("");
      setReview("");
      const reviewableItems = (order?.items || []).filter(
        (item) => !reviewedItemIds?.has(item.id)
      );
      setSelectedItem(reviewableItems[0] || null);
      setErrors({});
      setIsSubmitting(false);
      setSubmitSuccess(false);
    }
  }, [isOpen, order, reviewedItemIds]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const validate = () => {
    const newErrors = {};
    if (!rating) newErrors.rating = "Please select a rating";
    if (!selectedItem) newErrors.item = "Please select an item to review";
    else if (reviewedItemIds?.has(selectedItem.id)) newErrors.item = "You've already reviewed this item";
    if (!review.trim()) newErrors.review = "Please write your review";
    else if (review.trim().length < 10) newErrors.review = "Review must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        orderId: order.id,
        itemId: selectedItem.id,
        rating,
        review: review.trim(),
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setErrors({ submit: error?.message || "Failed to submit review. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        padding: isMobile ? "0" : "1rem",
      }}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "relative",
          backgroundColor: tokens.background,
          borderRadius: isMobile ? "12px 12px 0 0" : "8px",
          maxWidth: "560px",
          width: "100%",
          maxHeight: isMobile ? "85vh" : "90vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          fontFamily: tokens.fontBody,
        }}
      >
        {submitSuccess ? (
          <div
            style={{
              padding: isMobile ? "2rem 1.5rem" : "3rem 2rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#dcfce7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#166534",
              }}
            >
              <IconCheckCircle2 />
            </div>
            <h3
              style={{
                fontFamily: tokens.fontDisplay,
                fontSize: "clamp(1.25rem, 4vw, 1.5rem)",
                fontWeight: 500,
                margin: 0,
                color: tokens.foreground,
              }}
            >
              Thank You!
            </h3>
            <p style={{ color: tokens.mutedForeground, margin: 0, fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)" }}>
              Your review has been submitted successfully.
            </p>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: isMobile ? "1.25rem" : "1.5rem",
                borderBottom: `1px solid ${tokens.border}`,
              }}
            >
              <h2
                style={{
                  fontFamily: tokens.fontDisplay,
                  fontSize: "clamp(1.25rem, 4vw, 1.5rem)",
                  fontWeight: 500,
                  margin: 0,
                  color: tokens.foreground,
                }}
              >
                Write a Review
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: tokens.mutedForeground,
                  padding: "0.25rem",
                  borderRadius: tokens.radius,
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = tokens.secondary)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <IconClose />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} style={{ 
              padding: isMobile ? "1.25rem" : "1.5rem", 
              display: "flex", 
              flexDirection: "column", 
              gap: "1.25rem" 
            }}>
              {/* Select Item */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)",
                    fontWeight: 500,
                    color: tokens.foreground,
                    marginBottom: "0.5rem",
                  }}
                >
                  Select Item to Review
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {order.items.map((item) => {
                    const isReviewed = reviewedItemIds?.has(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={isReviewed}
                        onClick={() => {
                          if (isReviewed) return;
                          setSelectedItem(item);
                          setErrors({ ...errors, item: undefined });
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.75rem",
                          border: selectedItem?.id === item.id
                            ? `2px solid #f6aab2`
                            : `1px solid #f6aab2`,
                          borderRadius: tokens.radius,
                          backgroundColor: selectedItem?.id === item.id ? tokens.secondary : tokens.background,
                          cursor: isReviewed ? "not-allowed" : "pointer",
                          opacity: isReviewed ? 0.5 : 1,
                          textAlign: "left",
                          fontFamily: tokens.fontBody,
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: tokens.radius,
                            overflow: "hidden",
                            backgroundColor: tokens.secondary,
                            flexShrink: 0,
                          }}
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: tokens.mutedForeground,
                                fontSize: "0.625rem",
                              }}
                            >
                              No img
                            </div>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ 
                            fontWeight: 500, 
                            color: tokens.foreground, 
                            margin: 0, 
                            fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}>
                            {item.name}
                          </p>
                          <p style={{ fontSize: "clamp(0.688rem, 2vw, 0.75rem)", color: tokens.mutedForeground, margin: "2px 0 0" }}>
                            {[item.color, item.size].filter(Boolean).join(" / ")}
                          </p>
                        </div>
                        {isReviewed && (
                          <span style={{ fontSize: "clamp(0.688rem, 2vw, 0.75rem)", color: tokens.mutedForeground, marginLeft: "auto", flexShrink: 0 }}>
                            Reviewed
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.item && (
                  <p style={{ color: "#dc2626", fontSize: "0.75rem", margin: "0.25rem 0 0" }}>{errors.item}</p>
                )}
              </div>

              {/* Rating */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)",
                    fontWeight: 500,
                    color: tokens.foreground,
                    marginBottom: "0.5rem",
                  }}
                >
                  Your Rating
                </label>
                <StarRating rating={rating} onRate={(val) => {
                  setRating(val);
                  setErrors({ ...errors, rating: undefined });
                }} />
                {errors.rating && (
                  <p style={{ color: "#dc2626", fontSize: "0.75rem", margin: "0.25rem 0 0" }}>{errors.rating}</p>
                )}
              </div>

              {/* Review Text */}
              <div>
                <label
                  htmlFor="review-text"
                  style={{
                    display: "block",
                    fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)",
                    fontWeight: 500,
                    color: tokens.foreground,
                    marginBottom: "0.5rem",
                  }}
                >
                  Your Review
                </label>
                <textarea
                  id="review-text"
                  value={review}
                  onChange={(e) => {
                    setReview(e.target.value);
                    setErrors({ ...errors, review: undefined });
                  }}
                  placeholder="Tell others about your experience with this product..."
                  rows={isMobile ? 4 : 5}
                  maxLength={1000}
                  style={{
                    width: "100%",
                    padding: "0.625rem 0.75rem",
                    fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)",
                    fontFamily: tokens.fontBody,
                    border: `1px solid ${errors.review ? "#dc2626" : tokens.border}`,
                    borderRadius: tokens.radius,
                    outline: "none",
                    resize: "vertical",
                    transition: "border-color 0.2s ease",
                    boxSizing: "border-box",
                    lineHeight: 1.6,
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem" }}>
                  {errors.review && (
                    <p style={{ color: "#dc2626", fontSize: "0.75rem", margin: 0 }}>{errors.review}</p>
                  )}
                  <p style={{ color: tokens.mutedForeground, fontSize: "0.75rem", margin: 0, marginLeft: "auto" }}>
                    {review.length}/1000
                  </p>
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div
                  style={{
                    padding: "0.75rem",
                    backgroundColor: "#fee2e2",
                    borderRadius: tokens.radius,
                    color: "#991b1b",
                    fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)",
                  }}
                >
                  {errors.submit}
                </div>
              )}

              {/* Actions */}
              <div style={{ 
                display: "flex", 
                gap: "0.75rem", 
                justifyContent: "flex-end", 
                paddingTop: "0.5rem",
                flexDirection: isMobile ? "column-reverse" : "row",
              }}>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  style={{
                    padding: "0.625rem 1.5rem",
                    fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)",
                    fontWeight: 500,
                    fontFamily: tokens.fontBody,
                    borderRadius: tokens.radius,
                    border: `1px solid #f6aab2`,
                    backgroundColor: "transparent",
                    color: tokens.foreground,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.5 : 1,
                    transition: "background-color 0.2s ease",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedItem}
                  style={{
                    padding: "0.625rem 1.5rem",
                    fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)",
                    fontWeight: 500,
                    fontFamily: tokens.fontBody,
                    borderRadius: tokens.radius,
                    border: "none",
                    backgroundColor: "#f6aab2",
                    color: tokens.background,
                    cursor: isSubmitting || !selectedItem ? "not-allowed" : "pointer",
                    opacity: isSubmitting || !selectedItem ? 0.7 : 1,
                    transition: "opacity 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: tokens.background,
                          borderRadius: "50%",
                          animation: "spin 0.6s linear infinite",
                        }}
                      />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// ─── OrderCard ────────────────────────────────────────────────────────────────
const OrderCard = ({ order, isDesktop, isOpen, onToggle, onLeaveReview, reviewedItemIds }) => {
  const [trackBtnHovered, setTrackBtnHovered] = useState(false);
  const [reviewBtnHovered, setReviewBtnHovered] = useState(false);
  const [headerHovered, setHeaderHovered] = useState(false);

  const isUnpaid = order.payment_status === "unpaid";
  const config = statusConfig[order.order_status] || statusConfig.pending;
  const StatusIcon = statusIcons[order.order_status] || IconClock;
  const allItemsReviewed = order.items.every((item) => reviewedItemIds?.has(item.id));

  const handleCompletePayment = (e) => {
    e.stopPropagation();
    router.visit(`/checkout/${order.id}/pay`);
  };

  const handleLeaveReview = (e) => {
    e.stopPropagation();
    onLeaveReview(order);
  };

  return (
    <div
      style={{
        backgroundColor: tokens.background,
        border: `1px solid ${tokens.border}`,
        borderRadius: tokens.radius,
        overflow: "hidden",
      }}
    >
      {/* Order header */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: isDesktop ? "row" : "column",
          alignItems: isDesktop ? "center" : "flex-start",
          justifyContent: "space-between",
          gap: isDesktop ? "0" : "0.75rem",
          padding: isDesktop ? "1.5rem" : "1.25rem",
          borderBottom: isOpen ? `1px solid ${tokens.border}` : "none",
          backgroundColor: headerHovered ? "#efefef" : tokens.secondary,
          border: "none",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          cursor: "pointer",
          fontFamily: tokens.fontBody,
          textAlign: "left",
          transition: "background-color 0.2s ease",
        }}
        onMouseEnter={() => setHeaderHovered(true)}
        onMouseLeave={() => setHeaderHovered(false)}
      >
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          alignItems: "center", 
          gap: isDesktop ? "1.5rem" : "1rem",
          width: isDesktop ? "auto" : "100%",
        }}>
          <div>
            <p style={{ 
              fontSize: "clamp(0.688rem, 2vw, 0.75rem)", 
              textTransform: "uppercase", 
              letterSpacing: "0.05em", 
              color: tokens.mutedForeground, 
              margin: 0 
            }}>
              Order
            </p>
            <p style={{ 
              fontWeight: 500, 
              color: tokens.foreground, 
              margin: "2px 0 0",
              fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)",
              wordBreak: "break-all",
            }}>
              {order.id}
            </p>
          </div>
          <div>
            <p style={{ 
              fontSize: "clamp(0.688rem, 2vw, 0.75rem)", 
              textTransform: "uppercase", 
              letterSpacing: "0.05em", 
              color: tokens.mutedForeground, 
              margin: 0 
            }}>
              Date
            </p>
            <p style={{ 
              fontWeight: 500, 
              color: tokens.foreground, 
              margin: "2px 0 0",
              fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)",
            }}>
              {order.date}
            </p>
          </div>
          <div>
            <p style={{ 
              fontSize: "clamp(0.688rem, 2vw, 0.75rem)", 
              textTransform: "uppercase", 
              letterSpacing: "0.05em", 
              color: tokens.mutedForeground, 
              margin: 0 
            }}>
              Total
            </p>
            <p style={{ 
              fontWeight: 500, 
              color: tokens.foreground, 
              margin: "2px 0 0",
              fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)",
            }}>
              ₵{Number(order.total).toFixed(2)}
            </p>
          </div>
        </div>

        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: isDesktop ? "1rem" : "0.75rem",
          flexWrap: "wrap",
          width: isDesktop ? "auto" : "100%",
        }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.125rem 0.625rem",
              borderRadius: "9999px",
              fontSize: "clamp(0.688rem, 2vw, 0.75rem)",
              fontWeight: 500,
              ...config.style,
            }}
          >
            <StatusIcon />
            {config.label}
          </span>
          {isUnpaid && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.125rem 0.625rem",
                borderRadius: "9999px",
                fontSize: "clamp(0.688rem, 2vw, 0.75rem)",
                fontWeight: 500,
                backgroundColor: "#fef2f2",
                color: "#991b1b",
                border: "1px solid #fecaca",
              }}
            >
              Incomplete Payment
            </span>
          )}
          <IconChevronDown isOpen={isOpen} />
        </div>
      </button>

      {/* Collapsible content */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.3s ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div style={{ 
            padding: isDesktop ? "1.5rem" : "1.25rem", 
            display: "flex", 
            flexDirection: "column", 
            gap: "1rem" 
          }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: "flex", gap: isDesktop ? "1rem" : "0.75rem" }}>
                <div
                  style={{
                    width: isDesktop ? "80px" : "64px",
                    flexShrink: 0,
                    overflow: "hidden",
                    backgroundColor: tokens.secondary,
                    borderRadius: tokens.radius,
                  }}
                >
                  <div style={{ paddingBottom: "133.33%", position: "relative" }}>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: tokens.mutedForeground,
                        fontSize: "0.625rem",
                      }}>
                        No image
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
                  <div>
                    <p style={{ 
                      fontWeight: 500, 
                      color: tokens.foreground, 
                      margin: 0, 
                      fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: "clamp(0.75rem, 2vw, 0.8125rem)", color: tokens.mutedForeground, margin: "4px 0 0" }}>
                      {[item.color, item.size].filter(Boolean).join(" / ")}{item.color || item.size ? " / " : ""}Qty {item.quantity}
                    </p>
                  </div>
                  {reviewedItemIds?.has(item.id) && (
                    <p style={{ fontSize: "0.75rem", color: tokens.mutedForeground, margin: "4px 0 0", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <IconCheckCircle2 />
                      Reviewed
                    </p>
                  )}
                </div>
                <p style={{ 
                  fontWeight: 500, 
                  color: tokens.foreground, 
                  margin: 0, 
                  fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)", 
                  alignSelf: "center",
                  flexShrink: 0,
                }}>
                  ₵{Number(item.price).toFixed(2)}
                </p>
              </div>
            ))}

            {/* Tracking */}
            {order.tracking && (
              <>
                <hr style={{ margin: 0, border: "none", borderTop: `1px solid ${tokens.border}` }} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: isDesktop ? "row" : "column",
                    alignItems: isDesktop ? "center" : "flex-start",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                  }}
                >
                  <p style={{ fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)", margin: 0, color: tokens.foreground }}>
                    <span style={{ color: tokens.mutedForeground }}>Tracking: </span>
                    <span style={{ fontFamily: "monospace", fontSize: "clamp(0.75rem, 2vw, 0.8125rem)", wordBreak: "break-all" }}>
                      {order.tracking}
                    </span>
                  </p>
                  <button
                    style={{
                      padding: "0.375rem 0.75rem",
                      fontSize: "clamp(0.75rem, 2vw, 0.8125rem)",
                      fontWeight: 500,
                      fontFamily: tokens.fontBody,
                      borderRadius: tokens.radius,
                      border: `1px solid ${tokens.border}`,
                      backgroundColor: trackBtnHovered ? tokens.secondary : "transparent",
                      color: tokens.foreground,
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                      whiteSpace: "nowrap",
                      width: isDesktop ? "auto" : "100%",
                    }}
                    onMouseEnter={() => setTrackBtnHovered(true)}
                    onMouseLeave={() => setTrackBtnHovered(false)}
                  >
                    Track Package
                  </button>
                </div>
              </>
            )}

            {isUnpaid && (
              <>
                <hr style={{ margin: 0, border: "none", borderTop: `1px solid ${tokens.border}` }} />
                <div style={{ 
                  display: "flex", 
                  flexDirection: isDesktop ? "row" : "column", 
                  alignItems: isDesktop ? "center" : "flex-start", 
                  justifyContent: "space-between", 
                  gap: "0.75rem" 
                }}>
                  <p style={{ fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)", margin: 0, color: tokens.foreground }}>
                    This order hasn't been paid for yet.
                  </p>
                  <button
                    onClick={handleCompletePayment}
                    style={{
                      padding: "0.5rem 1rem",
                      fontSize: "clamp(0.75rem, 2vw, 0.8125rem)",
                      fontWeight: 500,
                      fontFamily: tokens.fontBody,
                      borderRadius: tokens.radius,
                      border: "none",
                      backgroundColor: "#f6aab2",
                      color: tokens.background,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      width: isDesktop ? "auto" : "100%",
                    }}
                  >
                    Complete Payment
                  </button>
                </div>
              </>
            )}

            {/* Delivered actions */}
            {order.order_status === "delivered" && !allItemsReviewed && (
              <>
                <hr style={{ margin: 0, border: "none", borderTop: `1px solid ${tokens.border}` }} />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={handleLeaveReview}
                    style={{
                      padding: "0.375rem 0.75rem",
                      fontSize: "clamp(0.75rem, 2vw, 0.8125rem)",
                      fontWeight: 500,
                      fontFamily: tokens.fontBody,
                      borderRadius: tokens.radius,
                      border: `1px solid #f6aab2`,
                      backgroundColor: reviewBtnHovered ? "#f6aab2" : "transparent",
                      color: reviewBtnHovered ? "#fff" : tokens.foreground,
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                      width: isDesktop ? "auto" : "100%",
                    }}
                    onMouseEnter={() => setReviewBtnHovered(true)}
                    onMouseLeave={() => setReviewBtnHovered(false)}
                  >
                    Leave Review
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── AccountOrders Page ──────────────────────────────────────────────────────
const AccountOrders = ({ orders = [] }) => {
  const { props } = usePage();
  const user = props?.auth?.user ?? null;

  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [activePath, setActivePath] = useState("/account/orders");
  const [openOrderId, setOpenOrderId] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);

  const [reviewedItemIds, setReviewedItemIds] = useState(() => {
    const initial = new Set();
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        if (item.is_reviewed) initial.add(item.id);
      });
    });
    return initial;
  });

  useEffect(() => {
    injectFonts();
    setActivePath(getActivePath());

    const handleResize = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024);
      setIsTablet(width >= 640 && width < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      setOpenOrderId(orders[0].id);
    }
  }, [orders]);

  useEffect(() => {
    setReviewedItemIds((prev) => {
      const next = new Set(prev);
      orders.forEach((order) => {
        (order.items || []).forEach((item) => {
          if (item.is_reviewed) next.add(item.id);
        });
      });
      return next;
    });
  }, [orders]);

  const toggleOrder = (id) => {
    setOpenOrderId((current) => (current === id ? null : id));
  };

  const handleLeaveReview = (order) => {
    setSelectedOrderForReview(order);
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      const response = await axios.post('/account/reviews', {
        orderId: reviewData.orderId,
        itemId: reviewData.itemId,
        rating: reviewData.rating,
        review: reviewData.review,
      });

      setReviewedItemIds((prev) => {
        const next = new Set(prev);
        next.add(reviewData.itemId);
        return next;
      });

      return response.data;
    } catch (error) {
      const data = error?.response?.data;

      if (error?.response?.status === 422) {
        const firstFieldError = data?.errors
          ? Object.values(data.errors)[0]?.[0]
          : null;
        throw new Error(firstFieldError || data?.message || "Please check your review and try again.");
      }

      throw new Error(data?.message || "Failed to submit review. Please try again.");
    }
  };

  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ") || user.name || "there"
    : "there";

  const avatarInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
      <Header />

      <main style={{ flex: 1, backgroundColor: "rgba(245,245,245,0.6)" }}>
        <div style={{ 
          maxWidth: "1280px", 
          margin: "0 auto", 
          padding: isDesktop ? "2rem 1rem" : isTablet ? "1.75rem 1.25rem" : "1.5rem 1rem" 
        }}>
          {/* Page header */}
          <div
            style={{
              display: "flex",
              flexDirection: isDesktop ? "row" : "column",
              alignItems: isDesktop ? "center" : "flex-start",
              justifyContent: "space-between",
              gap: isDesktop ? "1rem" : "0.75rem",
              marginBottom: isDesktop ? "2rem" : "1.5rem",
              paddingBottom: isDesktop ? "2rem" : "1.5rem",
              borderBottom: `1px solid ${tokens.border}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: isDesktop ? "1rem" : "0.75rem" }}>
              <div
                style={{
                  width: isDesktop ? "56px" : "48px", 
                  height: isDesktop ? "56px" : "48px", 
                  borderRadius: "50%",
                  backgroundColor: "#f6aab2", 
                  color: tokens.background,
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  fontFamily: tokens.fontDisplay, 
                  fontSize: isDesktop ? "1.125rem" : "1rem", 
                  fontWeight: 600, 
                  flexShrink: 0,
                }}
              >
                {avatarInitials || "?"}
              </div>
              <div>
                <p style={{ fontSize: "clamp(0.75rem, 2.5vw, 0.875rem)", color: tokens.mutedForeground, margin: 0 }}>
                  Welcome back,
                </p>
                <h1 style={{ 
                  fontFamily: tokens.fontDisplay, 
                  fontSize: "clamp(1.25rem, 4vw, 1.875rem)", 
                  fontWeight: 500, 
                  margin: "0.25rem 0 0", 
                  color: tokens.foreground,
                  lineHeight: 1.2,
                }}>
                  {displayName}
                </h1>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isDesktop ? "220px 1fr" : "1fr",
              gap: isDesktop ? "3rem" : isTablet ? "2rem" : "1.5rem",
            }}
          >
            {/* Sidebar */}
            <AccountSidebar activePath={activePath} />

            {/* Content */}
            <section>
              <div style={{ marginBottom: isDesktop ? "1.5rem" : "1.25rem" }}>
                <h2 style={{ 
                  fontFamily: tokens.fontDisplay, 
                  fontSize: "clamp(1.25rem, 3.5vw, 1.5rem)", 
                  fontWeight: 500, 
                  margin: 0, 
                  color: tokens.foreground 
                }}>
                  Order History
                </h2>
                <p style={{ 
                  marginTop: "0.25rem", 
                  fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)", 
                  color: tokens.mutedForeground 
                }}>
                  Track and review your previous orders
                </p>
              </div>

              {orders.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: isDesktop ? "3rem 1.5rem" : "2.5rem 1rem",
                    backgroundColor: tokens.background,
                    border: `1px solid ${tokens.border}`,
                    borderRadius: tokens.radius,
                    color: tokens.mutedForeground,
                    fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)",
                  }}
                >
                  You haven't placed any orders yet.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {orders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      isDesktop={isDesktop}
                      isOpen={openOrderId === order.id}
                      onToggle={() => toggleOrder(order.id)}
                      onLeaveReview={handleLeaveReview}
                      reviewedItemIds={reviewedItemIds}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedOrderForReview(null);
        }}
        order={selectedOrderForReview}
        onSubmit={handleReviewSubmit}
        reviewedItemIds={reviewedItemIds}
      />
    </div>
  );
};

export default AccountOrders;