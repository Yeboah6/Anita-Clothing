import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
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
  destructive: "#ef4444",
  green: "#16a34a",
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconMinus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const IconShoppingBag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

// ─── CartLineItem ─────────────────────────────────────────────────────────────
const CartLineItem = ({ item, onUpdateQuantity, onRemove, isDesktop }) => {
  const [removeHovered, setRemoveHovered] = useState(false);
  const lineTotal = (item.price * item.quantity).toFixed(2);

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        padding: "1.5rem 0",
        borderBottom: `1px solid ${tokens.border}`,
      }}
    >
      {/* Image */}
      <div style={{
        width: isDesktop ? "120px" : "88px",
        flexShrink: 0,
        backgroundColor: tokens.secondary,
        borderRadius: tokens.radius,
        overflow: "hidden"
      }}>
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
                objectFit: "cover"
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
              fontSize: "0.625rem"
            }}>
              No image
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minWidth: 0
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
          <div style={{ minWidth: 0 }}>
            <a
              href={`/product/${item.slug || item.product_id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h3 style={{
                fontFamily: tokens.fontDisplay,
                fontSize: "1.0625rem",
                fontWeight: 500,
                margin: 0,
                color: tokens.foreground,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}>
                {item.name}
              </h3>
            </a>
            <p style={{ fontSize: "0.8125rem", color: tokens.mutedForeground, margin: "0.25rem 0 0" }}>
              {[item.size, item.color].filter(Boolean).join(" / ") || "—"}
            </p>
            <p style={{ fontSize: "0.8125rem", color: tokens.mutedForeground, margin: "0.25rem 0 0" }}>
              ${Number(item.price).toFixed(2)} each
            </p>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.name}`}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: removeHovered ? tokens.destructive : tokens.mutedForeground,
              transition: "color 0.15s ease",
              flexShrink: 0,
              height: "fit-content",
            }}
            onMouseEnter={() => setRemoveHovered(true)}
            onMouseLeave={() => setRemoveHovered(false)}
          >
            <IconTrash />
          </button>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "0.75rem"
        }}>
          {/* Quantity stepper */}
          <div style={{
            display: "flex",
            alignItems: "center",
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius
          }}>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
              style={{
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                background: "transparent",
                cursor: item.quantity <= 1 ? "not-allowed" : "pointer",
                color: item.quantity <= 1 ? tokens.border : tokens.foreground,
                opacity: item.quantity <= 1 ? 0.5 : 1
              }}
            >
              <IconMinus />
            </button>
            <span style={{
              minWidth: "32px",
              textAlign: "center",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: tokens.foreground
            }}>
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
              style={{
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: tokens.foreground
              }}
            >
              <IconPlus />
            </button>
          </div>

          <p style={{
            fontSize: "0.9375rem",
            fontWeight: 500,
            color: tokens.foreground,
            margin: 0
          }}>
            ${lineTotal}
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Main Cart Component ─────────────────────────────────────────────────────
const Cart = () => {
  const { serverCart } = usePage().props;
  const [isDesktop, setIsDesktop] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  // Initialize cart from server data
  useEffect(() => {
    console.log('ServerCart received:', serverCart); // Debug log
    
    if (serverCart?.items && serverCart.items.length > 0) {
      setItems(serverCart.items.map(item => ({
        id: item.id, // Using cart item ID for API calls
        product_id: item.product_id,
        name: item.name,
        price: Number(item.price),
        image: item.image,
        slug: item.slug,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      })));
    }
  }, [serverCart]);

  useEffect(() => {
    injectFonts();
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    // Optimistic update
    setItems(prev => 
      prev.map(item => 
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      const item = items.find(i => i.id === cartItemId);
      await axios.put(`/cart/${item.product_id}`, { 
        size: item.size, 
        color: item.color, 
        quantity: newQuantity 
      });
    } catch (err) {
      console.error('Failed to update quantity:', err);
      setError('Failed to update cart. Please try again.');
      // Revert on error
      const item = items.find(i => i.id === cartItemId);
      if (item) {
        setItems(prev => 
          prev.map(i => 
            i.id === cartItemId ? { ...i, quantity: item.quantity } : i
          )
        );
      }
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    const itemToRemove = items.find(i => i.id === cartItemId);
    if (!itemToRemove) return;

    // Optimistic update
    setItems(prev => prev.filter(item => item.id !== cartItemId));

    try {
      await axios.delete(`/cart/${itemToRemove.product_id}`, { 
        data: { 
          size: itemToRemove.size, 
          color: itemToRemove.color 
        } 
      });
    } catch (err) {
      console.error('Failed to remove item:', err);
      setError('Failed to remove item. Please try again.');
      // Revert on error
      setItems(prev => [...prev, itemToRemove]);
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    
    const previousItems = [...items];
    setItems([]);

    try {
      await axios.delete('/cart/clear');
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError('Failed to clear cart. Please try again.');
      // Revert on error
      setItems(previousItems);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const isEmpty = items.length === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
      <Header />

      <main style={{ flex: 1, backgroundColor: "rgba(245,245,245,0.4)" }}>
        <div style={{ maxWidth: "1024px", margin: "0 auto", padding: isDesktop ? "3rem 1rem" : "2rem 1rem" }}>
          {/* Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "2rem"
          }}>
            <div>
              <h1 style={{
                fontFamily: tokens.fontDisplay,
                fontSize: "clamp(1.875rem, 4vw, 2.5rem)",
                fontWeight: 500,
                margin: 0,
                color: tokens.foreground
              }}>
                Shopping Bag
              </h1>
              {!isEmpty && (
                <p style={{
                  fontSize: "0.875rem",
                  color: tokens.mutedForeground,
                  margin: "0.5rem 0 0"
                }}>
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>
              )}
            </div>
            {!isEmpty && (
              <button
                onClick={handleClearCart}
                style={{
                  background: "none",
                  border: "none",
                  color: tokens.mutedForeground,
                  cursor: "pointer",
                  fontSize: "0.8125rem",
                  fontFamily: tokens.fontBody,
                  textDecoration: "underline",
                }}
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              padding: "1rem",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: tokens.radius,
              color: tokens.destructive,
              fontSize: "0.875rem",
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: tokens.destructive,
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: "0.8125rem"
                }}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Empty cart */}
          {isEmpty ? (
            <div style={{
              textAlign: "center",
              padding: "4rem 1rem",
              backgroundColor: tokens.background,
              border: `1px solid ${tokens.border}`,
              borderRadius: tokens.radius
            }}>
              <div style={{
                color: tokens.mutedForeground,
                display: "flex",
                justifyContent: "center",
                marginBottom: "1rem"
              }}>
                <IconShoppingBag />
              </div>
              <h2 style={{
                fontFamily: tokens.fontDisplay,
                fontSize: "1.375rem",
                fontWeight: 500,
                margin: "0 0 0.5rem",
                color: tokens.foreground
              }}>
                Your bag is empty
              </h2>
              <p style={{
                fontSize: "0.875rem",
                color: tokens.mutedForeground,
                margin: "0 0 1.5rem"
              }}>
                Looks like you haven't added anything yet.
              </p>
              <a
                href="/collections"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.625rem 1.75rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  fontFamily: tokens.fontBody,
                  textDecoration: "none",
                  borderRadius: tokens.radius,
                  backgroundColor: tokens.foreground,
                  color: tokens.background,
                }}
              >
                Continue Shopping
              </a>
            </div>
          ) : (
            /* Cart with items */
            <div style={{
              display: "grid",
              gridTemplateColumns: isDesktop ? "1fr 380px" : "1fr",
              gap: "2rem",
              alignItems: "start"
            }}>
              {/* Items list */}
              <div style={{
                backgroundColor: tokens.background,
                border: `1px solid ${tokens.border}`,
                borderRadius: tokens.radius,
                padding: "0 1.5rem"
              }}>
                {items.map((item) => (
                  <CartLineItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                    isDesktop={isDesktop}
                  />
                ))}

                {/* Continue shopping link */}
                <div style={{ padding: "1.5rem 0", textAlign: "center" }}>
                  <a
                    href="/collections"
                    style={{
                      fontSize: "0.875rem",
                      color: tokens.mutedForeground,
                      textDecoration: "none",
                      fontFamily: tokens.fontBody,
                    }}
                  >
                    ← Continue Shopping
                  </a>
                </div>
              </div>

              {/* Order summary */}
              <div style={{
                backgroundColor: tokens.background,
                border: `1px solid ${tokens.border}`,
                borderRadius: tokens.radius,
                padding: "1.5rem",
                position: isDesktop ? "sticky" : "static",
                top: "88px"
              }}>
                <h3 style={{
                  fontFamily: tokens.fontDisplay,
                  fontSize: "1.25rem",
                  fontWeight: 500,
                  margin: "0 0 1.25rem",
                  color: tokens.foreground
                }}>
                  Order Summary
                </h3>

                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  fontSize: "0.875rem"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: tokens.mutedForeground
                  }}>
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: tokens.mutedForeground
                  }}>
                    <span>Delivery fee</span>
                    <span>Calculated at checkout</span>
                  </div>

                  {/* <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: tokens.mutedForeground
                  }}>
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div> */}

                  <hr style={{
                    border: "none",
                    borderTop: `1px solid ${tokens.border}`,
                    margin: "0.5rem 0"
                  }} />

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "1.0625rem",
                    fontWeight: 600,
                    color: tokens.foreground
                  }}>
                    <span>Estimated Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <a
                  href="/checkout"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "48px",
                    marginTop: "1.5rem",
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                    fontFamily: tokens.fontBody,
                    textDecoration: "none",
                    borderRadius: tokens.radius,
                    border: "none",
                    backgroundColor: tokens.foreground,
                    color: tokens.background,
                    boxSizing: "border-box",
                  }}
                >
                  Proceed to Checkout
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;