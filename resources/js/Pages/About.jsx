import SEO from '@/Components/SEO';
import React, { useState, useEffect } from "react";
import axios from "axios";
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
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconShoppingBag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconStar = ({ filled, size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled? "#f6aab2" : "none"}
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
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#000" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: tokens.border }}>
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
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

// ─── Star Rating Display ────────────────────────────────────────────────────
const StarRating = ({ rating, size = 16 }) => {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <IconStar key={star} filled={star <= Math.round(rating)} size={size} />
      ))}
    </div>
  );
};

// ─── Review Card Component ──────────────────────────────────────────────────
const ReviewCard = ({ review, isDesktop }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150;
  const shouldTruncate = review.review.length > maxLength;
  
  return (
    <div
      style={{
        backgroundColor: tokens.background,
        border: `1px solid ${tokens.border}`,
        borderRadius: tokens.radius,
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        height: "100%",
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
      {/* Quote Icon */}
      <div style={{ opacity: 1 }}>
        <IconQuote />
      </div>
      
      {/* Rating */}
      <StarRating rating={review.rating} />
      
      {/* Review Text */}
      <p
        style={{
          fontSize: "0.875rem",
          color: tokens.mutedForeground,
          lineHeight: 1.7,
          margin: 0,
          flex: 1,
        }}
      >
        {shouldTruncate && !isExpanded
          ? `${review.review.substring(0, maxLength)}...`
          : review.review}
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
      
      {/* Reviewer Info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          paddingTop: "0.5rem",
          borderTop: `1px solid ${tokens.border}`,
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: tokens.secondary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: tokens.fontDisplay,
            fontSize: "0.875rem",
            fontWeight: 600,
            color: tokens.foreground,
            flexShrink: 0,
          }}
        >
          {review.user?.name
            ? review.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .substring(0, 2)
            : "?"}
        </div>
        <div>
          <p
            style={{
              fontWeight: 500,
              color: tokens.foreground,
              margin: 0,
              fontSize: "0.875rem",
            }}
          >
            {review.user?.name || "Anonymous"}
          </p>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "2px" }}>
            {review.is_verified_purchase && (
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#166534",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Verified Purchase
              </span>
            )}
            <span style={{ fontSize: "0.75rem", color: tokens.mutedForeground }}>
              {new Date(review.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Reviews Section Component ──────────────────────────────────────────────
const ReviewsSection = ({ productId, reviews: initialReviews = [], stats: initialStats = null }) => {
  const [reviews, setReviews] = useState(initialReviews);
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(!initialReviews.length && !!productId);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortBy, setSortBy] = useState("latest");
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!initialReviews.length && productId) {
      fetchReviews();
    }
  }, [productId, currentPage, activeFilter, sortBy]);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: currentPage,
        sort: sortBy,
      };
      
      if (activeFilter) {
        params.rating = activeFilter;
      }
      
      const response = await axios.get(`/api/reviews/product/${productId}`, {
        params,
      });
      
      setReviews(response.data.reviews?.data || response.data.reviews);
      setStats(response.data.stats);
      setTotalPages(response.data.reviews?.last_page || 1);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setError("Failed to load reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = (rating) => {
    setActiveFilter(activeFilter === rating ? null : rating);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  // Calculate rating distribution percentages
  const getDistributionPercentage = (count) => {
    if (!stats?.total_reviews) return 0;
    return (count / stats.total_reviews) * 100;
  };

  return (
    <section
      style={{
        padding: isDesktop ? "6rem 0" : "4rem 0",
        borderTop: `1px solid ${tokens.border}`,
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
        {/* Section Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          <h2
            style={{
              fontFamily: tokens.fontDisplay,
              fontSize: "clamp(1.875rem, 4vw, 2.5rem)",
              fontWeight: 500,
              margin: 0,
              color: tokens.foreground,
            }}
          >
            What The Girlies Are Saying 🌸
          </h2>
          <p
            style={{
              marginTop: "0.75rem",
              color: tokens.mutedForeground,
              fontSize: "1rem",
              lineHeight: 1.6,
            }}
          >
            Real reviews from real CuteBloom babes. Spoiler: they love how cute + affordable it is.
          </p>
        </div>

        {/* Rating Summary */}
        {stats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isDesktop ? "280px 1fr" : "1fr",
              gap: isDesktop ? "3rem" : "2rem",
              marginBottom: "3rem",
              padding: "2rem",
              backgroundColor: tokens.secondary,
              borderRadius: tokens.radius,
            }}
          >
            {/* Average Rating */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: tokens.fontDisplay,
                  fontSize: "4rem",
                  fontWeight: 500,
                  margin: 0,
                  color: tokens.foreground,
                  lineHeight: 1,
                }}
              >
                {stats.average_rating}
              </p>
              <StarRating rating={stats.average_rating} size={20} />
              <p
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.875rem",
                  color: tokens.mutedForeground,
                }}
              >
                Based on {stats.total_reviews} {stats.total_reviews === 1 ? "review" : "reviews"}
              </p>
            </div>

            {/* Rating Bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", justifyContent: "center" }}>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.rating_distribution?.[rating] || 0;
                const percentage = getDistributionPercentage(count);
                
                return (
                  <button
                    key={rating}
                    onClick={() => handleFilterClick(rating)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0.25rem 0",
                      fontFamily: tokens.fontBody,
                      width: "100%",
                      opacity: activeFilter && activeFilter !== rating ? 0.5 : 1,
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: tokens.foreground,
                        fontWeight: 500,
                        minWidth: "3rem",
                        textAlign: "right",
                      }}
                    >
                      {rating} ★
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: "8px",
                        backgroundColor: tokens.border,
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          backgroundColor: "#f6aab2",
                          borderRadius: "4px",
                          width: `${percentage}%`,
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: tokens.mutedForeground,
                        minWidth: "2rem",
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Sort Controls */}
        {reviews.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <p
              style={{
                fontSize: "0.875rem",
                color: tokens.mutedForeground,
                margin: 0,
              }}
            >
              {activeFilter
                ? `Showing ${activeFilter}-star reviews`
                : "Showing all reviews"}
            </p>
            
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[
                { value: "latest", label: "Latest" },
                { value: "highest", label: "Highest Rated" },
                { value: "lowest", label: "Lowest Rated" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  style={{
                    padding: "0.375rem 0.75rem",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    fontFamily: tokens.fontBody,
                    borderRadius: tokens.radius,
                    border: `1px solid ${sortBy === option.value ? "#f6aab2" : tokens.border}`,
                    backgroundColor: sortBy === option.value ? "#f6aab2" : "transparent",
                    color: sortBy === option.value ? tokens.background : tokens.foreground,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 1rem",
              color: tokens.mutedForeground,
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid rgba(0,0,0,0.1)",
                borderTopColor: tokens.foreground,
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 1rem",
              }}
            />
            <p style={{ fontSize: "0.875rem", margin: 0 }}>Loading reviews...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1.5rem",
              backgroundColor: "#fef2f2",
              borderRadius: tokens.radius,
              color: "#991b1b",
              fontSize: "0.875rem",
            }}
          >
            <p style={{ margin: 0 }}>{error}</p>
            <button
              onClick={fetchReviews}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                fontFamily: tokens.fontBody,
                borderRadius: tokens.radius,
                border: "none",
                backgroundColor: tokens.foreground,
                color: tokens.background,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Reviews Grid */}
        {!loading && !error && reviews.length > 0 && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isDesktop ? "repeat(3, 1fr)" : "1fr",
                gap: "1.5rem",
              }}
            >
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isDesktop={isDesktop}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginTop: "3rem",
                }}
              >
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: "0.5rem",
                    border: `1px solid ${tokens.border}`,
                    backgroundColor: "transparent",
                    borderRadius: tokens.radius,
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    opacity: currentPage === 1 ? 0.5 : 1,
                    display: "flex",
                    alignItems: "center",
                    color: tokens.foreground,
                  }}
                >
                  <ChevronLeft />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: tokens.radius,
                      border: `1px solid ${page === currentPage ? tokens.foreground : tokens.border}`,
                      backgroundColor: page === currentPage ? tokens.foreground : "transparent",
                      color: page === currentPage ? tokens.background : tokens.foreground,
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      fontFamily: tokens.fontBody,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: "0.5rem",
                    border: `1px solid ${tokens.border}`,
                    backgroundColor: "transparent",
                    borderRadius: tokens.radius,
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    display: "flex",
                    alignItems: "center",
                    color: tokens.foreground,
                  }}
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && reviews.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 1.5rem",
              backgroundColor: tokens.background,
              border: `1px solid ${tokens.border}`,
              borderRadius: tokens.radius,
            }}
          >
            <div style={{ marginBottom: "1rem", opacity: 0.3 }}>
              <IconQuote />
            </div>
            <h3
              style={{
                fontFamily: tokens.fontDisplay,
                fontSize: "1.25rem",
                fontWeight: 500,
                margin: "0 0 0.5rem",
                color: tokens.foreground,
              }}
            >
              No Reviews Yet
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: tokens.mutedForeground,
                margin: 0,
              }}
            >
              {activeFilter
                ? `No ${activeFilter}-star reviews yet. Be the first to leave one!`
                : "Be the first to review this product and share your thoughts!"}
            </p>
          </div>
        )}
      </div>

      {/* Spin animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

// ─── About Page (Updated with Reviews) ──────────────────────────────────────
const About = ({ collections, productId = null, reviews = [], stats = null }) => {
  const [breadcrumbHomeHovered, setBreadcrumbHomeHovered] = useState(false);
  const [shopBtnHovered, setShopBtnHovered] = useState(false);
  const [newArrivalsBtnHovered, setNewArrivalsBtnHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    injectFonts();
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
      <SEO
        title="About Us"
        description="Founded with a vision to redefine everyday elegance, CuteBloom creates timeless pieces that transcend seasons and trends."
        image="/images/user.jpeg"
        url="/about"
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
              <span style={{ color: tokens.foreground }}>About</span>
            </nav>
          </div>
        </section>

        {/* Hero */}
        <section style={{ padding: isDesktop ? "5rem 0" : "3rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: isDesktop ? "4rem" : "2.5rem", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(2.25rem, 5vw, 3.75rem)", fontWeight: 500, letterSpacing: "-0.02em", margin: 0, color: tokens.foreground }}>
                  About CuteBloom
                </h1>
                <p style={{ fontSize: "1.125rem", color: tokens.mutedForeground, lineHeight: 1.7, margin: 0 }}>
                  CuteBloom is made for the girlies 💕  
                  We create ready-to-wear and official outfits that are cute, comfortable, and affordable — because looking good at work or on a normal day shouldn’t cost a fortune.
                    
                  Every piece is designed to help you walk into any room and feel confident. No stress, no overthinking. Just outfits that fit your life, your budget, and your vibe.
                    
                  Cute. Affordable. Confidence.
                </p>
              </div>
              <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", backgroundColor: tokens.secondary }}>
                <img
                  src="images/user.jpeg"
                  alt="CuteBloom atelier"
                  loading="lazy"
                  style={{ height: "100%", width: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section style={{ borderTop: `1px solid ${tokens.border}`, borderBottom: `1px solid ${tokens.border}`, backgroundColor: "rgba(245,245,245,0.5)", padding: isDesktop ? "6rem 0" : "4rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
            <div style={{ maxWidth: "48rem", margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", gap: "2rem" }}>
              <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.875rem, 4vw, 2.5rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                Our Story
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", color: tokens.mutedForeground, fontSize: "1rem", lineHeight: 1.7 }}>
                <p style={{ margin: 0 }}>
                  CuteBloom was born from one simple belief: every girlie deserves to feel cute and confident — without spending too much 💕
                </p>
                <p style={{ margin: 0 }}>
                  We started small with ready-to-wear and office outfits that we actually wanted to wear ourselves. 
                  Pieces that are easy to style, comfy all day, and affordable enough to buy more than one.
                </p>
                <p style={{ margin: 0 }}>
                  Today we’re growing, but our promise stays the same:  
                  Cute outfits. Real prices. Confidence in every fit.

                  Whether it’s for work, church, or just stepping out, we’ve got you.  
                  Because when you look good, you feel good. And that’s the whole point of Cutebloom. 
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section style={{ padding: isDesktop ? "6rem 0" : "4rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
            <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.875rem, 4vw, 2.5rem)", fontWeight: 500, margin: "0 0 3rem", textAlign: "center", color: tokens.foreground }}>
              Our Values
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr 1fr" : "1fr", gap: isDesktop ? "3rem" : "2rem" }}>
              {/* Value 1 */}
              <div style={{ textAlign: "center" }}>
                <div style={{ margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "50%", backgroundColor: tokens.secondary }}>
                  <span style={{ fontFamily: tokens.fontDisplay, fontSize: "1.5rem", color: tokens.foreground }}>✦</span>
                </div>
                <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: "0 0 0.5rem", color: tokens.foreground }}>
                  Cute + Confidence 💕
                </h3>
                <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, lineHeight: 1.6, margin: 0 }}>
                  We design outfits that make you feel good the moment you wear them. Walk in, stand tall, own it.
                </p>
              </div>
              {/* Value 2 */}
              <div style={{ textAlign: "center" }}>
                <div style={{ margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "50%", backgroundColor: tokens.secondary }}>
                  <span style={{ fontFamily: tokens.fontDisplay, fontSize: "1.5rem", color: tokens.foreground }}>◈</span>
                </div>
                <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: "0 0 0.5rem", color: tokens.foreground }}>
                  Affordable Always
                </h3>
                <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, lineHeight: 1.6, margin: 0 }}>
                  Looking good shouldn’t cost all your salary. We keep prices friendly so you can get more than one fit.
                </p>
              </div>
              {/* Value 3 */}
              <div style={{ textAlign: "center" }}>
                <div style={{ margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "50%", backgroundColor: tokens.secondary }}>
                  <span style={{ fontFamily: tokens.fontDisplay, fontSize: "1.5rem", color: tokens.foreground }}>○</span>
                </div>
                <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: "0 0 0.5rem", color: tokens.foreground }}>
                  For Real Life
                </h3>
                <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, lineHeight: 1.6, margin: 0 }}>
                  From office to church to brunch — our pieces are comfy, wearable, and easy to style. No stress, just bloom.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <ReviewsSection 
          productId={productId}
          reviews={reviews}
          stats={stats}
        />

        {/* Stats Section */}
        <section style={{ borderTop: `1px solid ${tokens.border}`, borderBottom: `1px solid ${tokens.border}`, padding: isDesktop ? "4rem 0" : "3rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem", textAlign: "center" }}>
              <div>
                <p style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(2.25rem, 5vw, 3rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>100+</p>
                <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>Unique Pieces</p>
              </div>
              <div>
                <p style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(2.25rem, 5vw, 3rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>{collections}</p>
                <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>Collections</p>
              </div>
              <div>
                <p style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(2.25rem, 5vw, 3rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>∞</p>
                <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>Possibilities</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ padding: isDesktop ? "6rem 0" : "4rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
            <div style={{ maxWidth: "42rem", margin: "0 auto", textAlign: "center" }}>
              <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.875rem, 4vw, 2.5rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                Discover Our Collections
              </h2>
              <p style={{ marginTop: "1rem", color: tokens.mutedForeground, fontSize: "1rem", lineHeight: 1.6 }}>
                Cute fits for work, church, and every day. All affordable. All confidence. <br />
                Pick your vibe
              </p>
              <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "center" }} className="about-cta-buttons">
                <a
                  href="/collections"
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    padding: "0.75rem 2rem", fontSize: "1rem", fontWeight: 500,
                    fontFamily: tokens.fontBody, textDecoration: "none",
                    borderRadius: tokens.radius, border: "none",
                    backgroundColor: "#f6aab2", color: tokens.background,
                    cursor: "pointer", opacity: shopBtnHovered ? 0.9 : 1,
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseEnter={() => setShopBtnHovered(true)}
                  onMouseLeave={() => setShopBtnHovered(false)}
                >
                  Shop Collections
                </a>
                <a
                  href="/new-arrivals"
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    padding: "0.75rem 2rem", fontSize: "1rem", fontWeight: 500,
                    fontFamily: tokens.fontBody, textDecoration: "none",
                    borderRadius: tokens.radius,
                    border: `1px solid ${tokens.border}`,
                    backgroundColor: newArrivalsBtnHovered ? tokens.secondary : "transparent",
                    color: tokens.foreground, cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={() => setNewArrivalsBtnHovered(true)}
                  onMouseLeave={() => setNewArrivalsBtnHovered(false)}
                >
                  View New Arrivals
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 640px) {
          .about-cta-buttons {
            flex-direction: row !important;
          }
        }
      `}</style>
    </div>
  );
};

export default About;