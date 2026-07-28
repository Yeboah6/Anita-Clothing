import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
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
  destructive: "#ef4444",
  green: "#16a34a",
};

// ─── Icons ───────────────────────────────────────────────────────────────────
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

const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
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

// Helper: build the flat formData shape this page uses from an Address row
const addressToFormFields = (addr) => ({
  firstName: addr.first_name || "",
  lastName: addr.last_name || "",
  phone: addr.phone || "",
  address: addr.address || "",
  apartment: addr.apartment || "",
  city: addr.city || "",
  state: addr.state || "",
  zip: addr.zip || "",
});

const getDefaultAddress = (addresses) =>
  addresses.find((a) => a.is_default) || addresses[0] || null;

// ─── Saved Address Card ───────────────────────────────────────────────────────
const SavedAddressOption = ({ addr, selected, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={() => onSelect(addr.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        width: "100%",
        textAlign: "left",
        padding: "1rem",
        borderRadius: tokens.radius,
        border: `1px solid ${selected ? tokens.foreground : tokens.border}`,
        backgroundColor: selected ? tokens.secondary : hovered ? "rgba(245,245,245,0.5)" : tokens.background,
        cursor: "pointer",
        transition: "border-color 0.15s ease, background-color 0.15s ease",
      }}
    >
      <span
        style={{
          marginTop: "2px",
          width: "16px",
          height: "16px",
          flexShrink: 0,
          borderRadius: "50%",
          border: `1.5px solid ${selected ? tokens.foreground : tokens.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && (
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: tokens.foreground }} />
        )}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 500, color: tokens.foreground }}>
            {addr.label || "Address"}
          </span>
          {addr.is_default && (
            <span
              style={{
                display: "inline-block",
                padding: "0.0625rem 0.4375rem",
                borderRadius: "9999px",
                fontSize: "0.625rem",
                fontWeight: 500,
                backgroundColor: tokens.background,
                color: tokens.foreground,
                border: `1px solid ${tokens.border}`,
              }}
            >
              Default
            </span>
          )}
        </span>
        <span style={{ display: "block", fontSize: "0.8125rem", color: tokens.mutedForeground, lineHeight: 1.5 }}>
          {[addr.first_name, addr.last_name].filter(Boolean).join(" ")}
          <br />
          {addr.address}{addr.apartment ? `, ${addr.apartment}` : ""}
          <br />
          {addr.city}, {addr.state} {addr.zip}
        </span>
      </span>
    </button>
  );
};

// ─── Checkout Page ───────────────────────────────────────────────────────────
const Checkout = () => {
  const { serverCart, userInfo, addresses = [] } = usePage().props;
  const [items, setItems] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [errors, setErrors] = useState({});

  // Which saved address is active — an address id, or "new" for manual entry
  const initialDefaultAddress = getDefaultAddress(addresses);
  const [selectedAddressId, setSelectedAddressId] = useState(
    initialDefaultAddress ? initialDefaultAddress.id : "new"
  );

  const [formData, setFormData] = useState({
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
    firstName: userInfo?.first_name || "",
    lastName: userInfo?.last_name || "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
    ...(initialDefaultAddress ? addressToFormFields(initialDefaultAddress) : {}),
  });

  // Initialize cart from server data
  useEffect(() => {
    if (serverCart?.items && serverCart.items.length > 0) {
      setItems(serverCart.items.map(item => ({
        id: item.id,
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

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Selecting a saved address fills the delivery fields; selecting "new"
  // clears them for manual entry.
  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    setErrors({});

    if (id === "new") {
      setFormData((prev) => ({
        ...prev,
        firstName: userInfo?.first_name || "",
        lastName: userInfo?.last_name || "",
        address: "",
        apartment: "",
        city: "",
        state: "",
        zip: "",
        notes: "",
      }));
      return;
    }

    const addr = addresses.find((a) => a.id === id);
    if (!addr) return;

    setFormData((prev) => ({
      ...prev,
      ...addressToFormFields(addr),
      // Keep whatever email/phone the user already has unless the address
      // has its own phone on file.
      phone: addr.phone || prev.phone,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    
    if (!formData.zip.trim()) {
      newErrors.zip = "ZIP code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setIsSubmitting(true);

  try {
    const response = await axios.post('/checkout', {
      ...formData,
      address_id: selectedAddressId !== "new" ? selectedAddressId : null,
      items: items.map(item => ({
        product_id: item.product_id,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    if (response.data?.redirect) {
      window.location.href = response.data.redirect;
      return;
    }

    // Fallback in case redirect is ever missing
    setIsSubmitted(true);

  } catch (err) {
    console.error('Checkout failed:', err);
    if (err.response?.data?.errors) {
      setErrors(err.response.data.errors);
    } else {
      setErrors({ submit: 'Failed to process order. Please try again.' });
    }
  } finally {
    setIsSubmitting(false);
  }
};

  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = subtotal;

  // Success state
  if (isSubmitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 1rem" }}>
          <div style={{ maxWidth: "28rem", textAlign: "center" }}>
            <CheckCircle2 />
            <h1 style={{ marginTop: "1.5rem", fontFamily: tokens.fontDisplay, fontSize: "1.875rem", fontWeight: 500, color: tokens.foreground }}>
              Thank You for Your Order!
            </h1>
            <p style={{ marginTop: "1rem", color: tokens.mutedForeground, lineHeight: 1.6 }}>
              Your order has been received and is being processed. 
              You will receive a confirmation email shortly at {formData.email}.
            </p>
            <p style={{ marginTop: "0.5rem", color: tokens.mutedForeground, fontSize: "0.875rem" }}>
              Order Total: ₵{total.toFixed(2)}
            </p>
            <a
              href="/collections"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                marginTop: "2rem", padding: "0.75rem 2rem", fontSize: "1rem",
                fontWeight: 500, fontFamily: tokens.fontBody, textDecoration: "none",
                borderRadius: tokens.radius, border: "none",
                backgroundColor: tokens.foreground, color: tokens.background,
                cursor: "pointer",
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

  // Empty cart state
  if (items.length === 0) {
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

  const showManualFields = selectedAddressId === "new" || addresses.length === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
      <Header />

      <main style={{ flex: 1 }}>
        {/* Breadcrumb */}
        <section style={{ borderBottom: `1px solid ${tokens.border}` }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem" }}>
            <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
              <a href="/" style={{ textDecoration: "none", color: tokens.mutedForeground }}>
                Home
              </a>
              <ChevronRight />
              <a href="/cart" style={{ textDecoration: "none", color: tokens.mutedForeground }}>
                Cart
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

            {errors.submit && (
              <div style={{
                padding: "1rem",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: tokens.radius,
                color: tokens.destructive,
                fontSize: "0.875rem",
                marginBottom: "1.5rem",
              }}>
                {errors.submit}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: isDesktop ? "3rem" : "2rem" }}>
              {/* Checkout Form */}
              <div>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  {/* Contact Info */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                      Contact Information
                    </h2>
                    <div>
                      <label htmlFor="email" style={labelStyle}>Email *</label>
                      <input
                        id="email" type="email" placeholder="your@email.com"
                        value={formData.email} onChange={handleInputChange("email")}
                        style={{
                          ...inputStyle,
                          borderColor: errors.email ? tokens.destructive : tokens.border,
                        }}
                        onFocus={(e) => (e.target.style.borderColor = errors.email ? tokens.destructive : tokens.foreground)}
                        onBlur={(e) => (e.target.style.borderColor = errors.email ? tokens.destructive : tokens.border)}
                      />
                      {errors.email && (
                        <p style={{ color: tokens.destructive, fontSize: "0.75rem", margin: "0.25rem 0 0" }}>{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" style={labelStyle}>Phone *</label>
                      <input
                        id="phone" type="tel" placeholder="+1 (555) 000-0000"
                        value={formData.phone} onChange={handleInputChange("phone")}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = tokens.foreground)}
                        onBlur={(e) => (e.target.style.borderColor = tokens.border)}
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                        Delivery Address
                      </h2>
                    </div>

                    {/* Saved address picker */}
                    {addresses.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {addresses.map((addr) => (
                          <SavedAddressOption
                            key={addr.id}
                            addr={addr}
                            selected={selectedAddressId === addr.id}
                            onSelect={handleSelectAddress}
                          />
                        ))}

                        <button
                          type="button"
                          onClick={() => handleSelectAddress("new")}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.75rem 1rem",
                            fontSize: "0.8125rem",
                            fontWeight: 500,
                            fontFamily: tokens.fontBody,
                            borderRadius: tokens.radius,
                            border: `1px dashed ${selectedAddressId === "new" ? tokens.foreground : tokens.border}`,
                            backgroundColor: selectedAddressId === "new" ? tokens.secondary : "transparent",
                            color: tokens.foreground,
                            cursor: "pointer",
                            transition: "background-color 0.15s ease, border-color 0.15s ease",
                          }}
                        >
                          <IconPlus />
                          Use a different address
                        </button>
                      </div>
                    )}

                    {/* Manual entry fields — shown when there are no saved
                        addresses, or "Use a different address" is selected */}
                    {showManualFields && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {addresses.length > 0 && (
                          <p style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: tokens.mutedForeground, margin: 0 }}>
                            <IconMapPin />
                            Enter a new delivery address below
                          </p>
                        )}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                          <div>
                            <label htmlFor="firstName" style={labelStyle}>First Name *</label>
                            <input 
                              id="firstName" value={formData.firstName} onChange={handleInputChange("firstName")} 
                              style={{
                                ...inputStyle,
                                borderColor: errors.firstName ? tokens.destructive : tokens.border,
                              }}
                              onFocus={(e) => (e.target.style.borderColor = tokens.foreground)}
                              onBlur={(e) => (e.target.style.borderColor = errors.firstName ? tokens.destructive : tokens.border)}
                            />
                            {errors.firstName && (
                              <p style={{ color: tokens.destructive, fontSize: "0.75rem", margin: "0.25rem 0 0" }}>{errors.firstName}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="lastName" style={labelStyle}>Last Name *</label>
                            <input 
                              id="lastName" value={formData.lastName} onChange={handleInputChange("lastName")} 
                              style={{
                                ...inputStyle,
                                borderColor: errors.lastName ? tokens.destructive : tokens.border,
                              }}
                              onFocus={(e) => (e.target.style.borderColor = tokens.foreground)}
                              onBlur={(e) => (e.target.style.borderColor = errors.lastName ? tokens.destructive : tokens.border)}
                            />
                            {errors.lastName && (
                              <p style={{ color: tokens.destructive, fontSize: "0.75rem", margin: "0.25rem 0 0" }}>{errors.lastName}</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="address" style={labelStyle}>Address *</label>
                          <input 
                            id="address" placeholder="Street address" value={formData.address} onChange={handleInputChange("address")} 
                            style={{
                              ...inputStyle,
                              borderColor: errors.address ? tokens.destructive : tokens.border,
                            }}
                            onFocus={(e) => (e.target.style.borderColor = tokens.foreground)}
                            onBlur={(e) => (e.target.style.borderColor = errors.address ? tokens.destructive : tokens.border)}
                          />
                          {errors.address && (
                            <p style={{ color: tokens.destructive, fontSize: "0.75rem", margin: "0.25rem 0 0" }}>{errors.address}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="apartment" style={labelStyle}>Apartment, suite, etc. (optional)</label>
                          <input id="apartment" placeholder="Apt 4B" value={formData.apartment} onChange={handleInputChange("apartment")} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                          <div>
                            <label htmlFor="city" style={labelStyle}>City *</label>
                            <input 
                              id="city" value={formData.city} onChange={handleInputChange("city")} 
                              style={{
                                ...inputStyle,
                                borderColor: errors.city ? tokens.destructive : tokens.border,
                              }}
                              onFocus={(e) => (e.target.style.borderColor = tokens.foreground)}
                              onBlur={(e) => (e.target.style.borderColor = errors.city ? tokens.destructive : tokens.border)}
                            />
                            {errors.city && (
                              <p style={{ color: tokens.destructive, fontSize: "0.75rem", margin: "0.25rem 0 0" }}>{errors.city}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="state" style={labelStyle}>State *</label>
                            <input 
                              id="state" value={formData.state} onChange={handleInputChange("state")} 
                              style={{
                                ...inputStyle,
                                borderColor: errors.state ? tokens.destructive : tokens.border,
                              }}
                              onFocus={(e) => (e.target.style.borderColor = tokens.foreground)}
                              onBlur={(e) => (e.target.style.borderColor = errors.state ? tokens.destructive : tokens.border)}
                            />
                            {errors.state && (
                              <p style={{ color: tokens.destructive, fontSize: "0.75rem", margin: "0.25rem 0 0" }}>{errors.state}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="zip" style={labelStyle}>ZIP Code *</label>
                            <input 
                              id="zip" value={formData.zip} onChange={handleInputChange("zip")} 
                              style={{
                                ...inputStyle,
                                borderColor: errors.zip ? tokens.destructive : tokens.border,
                              }}
                              onFocus={(e) => (e.target.style.borderColor = tokens.foreground)}
                              onBlur={(e) => (e.target.style.borderColor = errors.zip ? tokens.destructive : tokens.border)}
                            />
                            {errors.zip && (
                              <p style={{ color: tokens.destructive, fontSize: "0.75rem", margin: "0.25rem 0 0" }}>{errors.zip}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Notes */}
                  <div>
                    <label htmlFor="notes" style={labelStyle}>Order Notes (optional)</label>
                    <textarea
                      id="notes"
                      placeholder="Special instructions for delivery"
                      value={formData.notes}
                      onChange={handleInputChange("notes")}
                      rows="3"
                      style={{
                        ...inputStyle,
                        height: "auto",
                        padding: "0.75rem",
                        resize: "vertical",
                        fontFamily: tokens.fontBody,
                      }}
                      onFocus={(e) => (e.target.style.borderColor = tokens.foreground)}
                      onBlur={(e) => (e.target.style.borderColor = tokens.border)}
                    />
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
                      opacity: isSubmitting ? 0.7 : 1,
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    {isSubmitting ? "Processing..." : `Place Order • ₵${total.toFixed(2)}`}
                  </button>
                </form>
              </div>

              {/* Order Summary */}
              <div style={isDesktop ? { paddingLeft: "2rem" } : {}}>
                <div style={{ 
                  padding: "1.5rem", 
                  borderRadius: tokens.radius, 
                  border: `1px solid ${tokens.border}`, 
                  backgroundColor: "rgba(245,245,245,0.5)",
                  position: isDesktop ? "sticky" : "static",
                  top: "88px"
                }}>
                  <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.25rem", fontWeight: 500, margin: "0 0 1rem", color: tokens.foreground }}>
                    Order Summary
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "400px", overflowY: "auto" }}>
                    {items.map((item) => (
                      <div key={item.id} style={{ display: "flex", gap: "1rem" }}>
                        <div style={{ width: "64px", flexShrink: 0, overflow: "hidden", backgroundColor: tokens.secondary, borderRadius: tokens.radius }}>
                          <div style={{ paddingBottom: "133.33%", position: "relative" }}>
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{ position: "absolute", inset: 0, height: "100%", width: "100%", objectFit: "cover" }}
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
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
                          <p style={{ fontWeight: 500, fontSize: "0.875rem", margin: 0, color: tokens.foreground, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.name}
                          </p>
                          <p style={{ fontSize: "0.75rem", color: tokens.mutedForeground, margin: "2px 0" }}>
                            {[item.color, item.size].filter(Boolean).join(" / ") || "—"}
                          </p>
                          <p style={{ fontSize: "0.75rem", color: tokens.mutedForeground, margin: 0 }}>
                            Qty: {item.quantity} × ₵{Number(item.price).toFixed(2)}
                          </p>
                        </div>
                        <p style={{ fontWeight: 500, fontSize: "0.875rem", color: tokens.foreground, margin: 0, alignSelf: "center", whiteSpace: "nowrap" }}>
                          ₵{(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <hr style={{ margin: "1rem 0", border: "none", borderTop: `1px solid ${tokens.border}` }} />

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <span style={{ color: tokens.mutedForeground }}>Subtotal ({totalItems} items)</span>
                      <span style={{ color: tokens.foreground }}>₵{subtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <hr style={{ margin: "1rem 0", border: "none", borderTop: `1px solid ${tokens.border}` }} />

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.125rem", fontWeight: 500 }}>
                    <span style={{ color: tokens.foreground }}>Total</span>
                    <span style={{ color: tokens.foreground }}>₵{total.toFixed(2)}</span>
                  </div>

                    <p style={{ 
                      marginTop: "0.5rem", 
                      fontSize: "0.75rem", 
                      color: tokens.green,
                      textAlign: "center" 
                    }}>
                      🎉 Delivery in Accra is from 30 to 35!
                    </p>
                    <p style={{ 
                      marginTop: "0.5rem", 
                      fontSize: "0.75rem", 
                      color: tokens.green,
                      textAlign: "center" 
                    }}>
                      🎉 Delivery outside Accra is based on station fare!
                    </p>
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

export default Checkout;