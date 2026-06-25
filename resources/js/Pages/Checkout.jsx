import React, { useState, useEffect, createContext, useContext, useReducer } from "react";
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
};

// ─── Cart Context ─────────────────────────────────────────────────────────────
const CART_STORAGE_KEY = "anita-clothing-cart";

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );
      if (existingIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + action.payload.quantity,
        };
        return { ...state, items: updatedItems, isOpen: true };
      }
      return { ...state, items: [...state.items, action.payload], isOpen: true };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(
              item.productId === action.payload.productId &&
              item.size === action.payload.size &&
              item.color === action.payload.color
            )
        ),
      };
    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) =>
              !(
                item.productId === action.payload.productId &&
                item.size === action.payload.size &&
                item.color === action.payload.color
              )
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === action.payload.productId &&
          item.size === action.payload.size &&
          item.color === action.payload.color
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    case "LOAD_CART":
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

const CartContext = createContext(undefined);

function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) });
      } catch (e) {
        console.error("Failed to load cart:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const value = {
    state,
    addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
    removeItem: (productId, size, color) =>
      dispatch({ type: "REMOVE_ITEM", payload: { productId, size, color } }),
    updateQuantity: (productId, size, color, quantity) =>
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, size, color, quantity } }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    toggleCart: () => dispatch({ type: "TOGGLE_CART" }),
    openCart: () => dispatch({ type: "OPEN_CART" }),
    closeCart: () => dispatch({ type: "CLOSE_CART" }),
    getCartTotal: () =>
      state.items.reduce((total, item) => total + item.price * item.quantity, 0),
    getCartCount: () =>
      state.items.reduce((count, item) => count + item.quantity, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}

// ─── Sample cart items for demo ──────────────────────────────────────────────
const sampleCartItems = [
  {
    productId: "1",
    name: "Silk Midi Dress",
    price: 289,
    quantity: 1,
    size: "M",
    color: "Champagne",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
  },
  {
    productId: "5",
    name: "Leather Crossbody Bag",
    price: 245,
    quantity: 1,
    size: "One Size",
    color: "Tan",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
  },
];

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

const CheckCircle2 = ({ size = 64, color = tokens.green }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
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

// ─── Form Input Styles ───────────────────────────────────────────────────────
const inputStyle = {
  height: "44px",
  width: "100%",
  padding: "0 0.75rem",
  fontSize: "0.875rem",
  fontFamily: tokens.fontBody,
  backgroundColor: tokens.background,
  border: `1px solid ${tokens.border}`,
  borderRadius: tokens.radius,
  color: tokens.foreground,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s ease",
};

const labelStyle = {
  fontSize: "0.875rem",
  fontWeight: 500,
  fontFamily: tokens.fontBody,
  color: tokens.foreground,
  marginBottom: "0.5rem",
  display: "block",
};

// ─── Checkout Page ───────────────────────────────────────────────────────────
const CheckoutPage = () => {
  const { state, getCartTotal, clearCart } = useCart();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [breadcrumbHomeHovered, setBreadcrumbHomeHovered] = useState(false);
  const [placeOrderBtnHovered, setPlaceOrderBtnHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    injectFonts();
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      clearCart();
    }, 1500);
  };

  // Success state
  if (isSubmitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 1rem" }}>
          <div style={{ maxWidth: "28rem", textAlign: "center" }}>
            <CheckCircle2 />
            <h1 style={{ marginTop: "1.5rem", fontFamily: tokens.fontDisplay, fontSize: "1.875rem", fontWeight: 500, color: tokens.foreground }}>
              Thank You!
            </h1>
            <p style={{ marginTop: "1rem", color: tokens.mutedForeground, lineHeight: 1.6 }}>
              Your order has been received. We'll be in touch soon with shipping details.
            </p>
            <a
              href="/collections"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                marginTop: "2rem", padding: "0.75rem 2rem", fontSize: "1rem",
                fontWeight: 500, fontFamily: tokens.fontBody, textDecoration: "none",
                borderRadius: tokens.radius, border: "none",
                backgroundColor: tokens.foreground, color: tokens.background,
                cursor: "pointer", opacity: placeOrderBtnHovered ? 0.9 : 1,
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={() => setPlaceOrderBtnHovered(true)}
              onMouseLeave={() => setPlaceOrderBtnHovered(false)}
            >
              Continue Shopping
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Empty cart state
  if (state.items.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 1rem" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.875rem", fontWeight: 500, color: tokens.foreground, margin: "0 0 0.5rem" }}>
              Your bag is empty
            </h1>
            <p style={{ color: tokens.mutedForeground, margin: "0 0 1.5rem" }}>
              Add some items to your bag before checking out.
            </p>
            <a
              href="/collections"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                padding: "0.75rem 2rem", fontSize: "1rem", fontWeight: 500,
                fontFamily: tokens.fontBody, textDecoration: "none",
                borderRadius: tokens.radius, border: "none",
                backgroundColor: tokens.foreground, color: tokens.background,
                cursor: "pointer",
              }}
            >
              Browse Collections
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const total = getCartTotal();

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
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
              <span style={{ color: tokens.foreground }}>Checkout</span>
            </nav>
          </div>
        </section>

        {/* Checkout Content */}
        <section style={{ padding: isDesktop ? "3rem 0" : "2rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
            <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.875rem, 4vw, 2.5rem)", fontWeight: 500, margin: "0 0 2rem", color: tokens.foreground }}>
              Checkout
            </h1>

            <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: isDesktop ? "3rem" : "2rem" }}>
              {/* Checkout Form */}
              <div>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  {/* Contact Info */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                      Contact Information
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div>
                        <label htmlFor="email" style={labelStyle}>Email</label>
                        <input
                          id="email" type="email" placeholder="your@email.com" required
                          value={formData.email} onChange={handleInputChange("email")}
                          style={inputStyle}
                          onFocus={(e) => (e.target.style.borderColor = tokens.foreground)}
                          onBlur={(e) => (e.target.style.borderColor = tokens.border)}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" style={labelStyle}>Phone (optional)</label>
                        <input
                          id="phone" type="tel" placeholder="+1 (555) 000-0000"
                          value={formData.phone} onChange={handleInputChange("phone")}
                          style={inputStyle}
                          onFocus={(e) => (e.target.style.borderColor = tokens.foreground)}
                          onBlur={(e) => (e.target.style.borderColor = tokens.border)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                      Shipping Address
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                          <label htmlFor="firstName" style={labelStyle}>First Name</label>
                          <input id="firstName" required value={formData.firstName} onChange={handleInputChange("firstName")} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                        </div>
                        <div>
                          <label htmlFor="lastName" style={labelStyle}>Last Name</label>
                          <input id="lastName" required value={formData.lastName} onChange={handleInputChange("lastName")} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="address" style={labelStyle}>Address</label>
                        <input id="address" placeholder="Street address" required value={formData.address} onChange={handleInputChange("address")} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                      </div>
                      <div>
                        <label htmlFor="apartment" style={labelStyle}>Apartment, suite, etc. (optional)</label>
                        <input id="apartment" placeholder="Apt 4B" value={formData.apartment} onChange={handleInputChange("apartment")} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                        <div>
                          <label htmlFor="city" style={labelStyle}>City</label>
                          <input id="city" required value={formData.city} onChange={handleInputChange("city")} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                        </div>
                        <div>
                          <label htmlFor="state" style={labelStyle}>State</label>
                          <input id="state" required value={formData.state} onChange={handleInputChange("state")} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                        </div>
                        <div>
                          <label htmlFor="zip" style={labelStyle}>ZIP Code</label>
                          <input id="zip" required value={formData.zip} onChange={handleInputChange("zip")} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Note */}
                  <div style={{ padding: "1rem", borderRadius: tokens.radius, border: `1px solid ${tokens.border}`, backgroundColor: tokens.secondary }}>
                    <p style={{ fontSize: "0.875rem", color: tokens.mutedForeground, margin: 0, lineHeight: 1.6 }}>
                      <strong style={{ color: tokens.foreground }}>Note:</strong> This is a demo checkout. No payment will be processed.
                      In a production environment, secure payment processing would be integrated here.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: "100%", height: "48px", padding: "0 1.5rem",
                      fontSize: "1rem", fontWeight: 500, fontFamily: tokens.fontBody,
                      borderRadius: tokens.radius, border: "none",
                      backgroundColor: tokens.foreground, color: tokens.background,
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      opacity: isSubmitting ? 0.7 : (placeOrderBtnHovered ? 0.9 : 1),
                      transition: "opacity 0.2s ease",
                    }}
                    onMouseEnter={() => setPlaceOrderBtnHovered(true)}
                    onMouseLeave={() => setPlaceOrderBtnHovered(false)}
                  >
                    {isSubmitting ? "Processing..." : `Place Order • $${total}`}
                  </button>
                </form>
              </div>

              {/* Order Summary */}
              <div style={isDesktop ? { paddingLeft: "2rem" } : {}}>
                <div style={{ padding: "1.5rem", borderRadius: tokens.radius, border: `1px solid ${tokens.border}`, backgroundColor: "rgba(245,245,245,0.5)" }}>
                  <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: "0 0 1rem", color: tokens.foreground }}>
                    Order Summary
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {state.items.map((item) => (
                      <div key={`${item.productId}-${item.size}-${item.color}`} style={{ display: "flex", gap: "1rem" }}>
                        <div style={{ width: "64px", flexShrink: 0, overflow: "hidden", backgroundColor: tokens.secondary, borderRadius: tokens.radius }}>
                          <div style={{ paddingBottom: "133.33%", position: "relative" }}>
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ position: "absolute", inset: 0, height: "100%", width: "100%", objectFit: "cover" }}
                            />
                          </div>
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <p style={{ fontWeight: 500, fontSize: "0.875rem", margin: 0, color: tokens.foreground }}>{item.name}</p>
                          <p style={{ fontSize: "0.75rem", color: tokens.mutedForeground, margin: "2px 0" }}>
                            {item.color} / {item.size}
                          </p>
                          <p style={{ fontSize: "0.75rem", color: tokens.mutedForeground, margin: 0 }}>
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p style={{ fontWeight: 500, fontSize: "0.875rem", color: tokens.foreground, margin: 0, alignSelf: "center" }}>
                          ${item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <hr style={{ margin: "1rem 0", border: "none", borderTop: `1px solid ${tokens.border}` }} />

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <span style={{ color: tokens.mutedForeground }}>Subtotal</span>
                      <span style={{ color: tokens.foreground }}>${total}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <span style={{ color: tokens.mutedForeground }}>Shipping</span>
                      <span style={{ color: tokens.mutedForeground }}>Calculated at next step</span>
                    </div>
                  </div>

                  <hr style={{ margin: "1rem 0", border: "none", borderTop: `1px solid ${tokens.border}` }} />

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.125rem", fontWeight: 500 }}>
                    <span style={{ color: tokens.foreground }}>Total</span>
                    <span style={{ color: tokens.foreground }}>${total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// ─── Wrapper with CartProvider and demo items ────────────────────────────────
const Checkout = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Pre-populate cart with sample items for demo
    if (!initialized) {
      const existing = localStorage.getItem(CART_STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(sampleCartItems));
      }
      setInitialized(true);
    }
  }, [initialized]);

  return (
    <CartProvider>
      <CheckoutPage />
    </CartProvider>
  );
};

export default Checkout;