import React, { useState, useEffect } from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
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

// ─── Design tokens ────────────────────────────────────────────────────────────
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
};

// ─── Get active path from URL ────────────────────────────────────────────────
const getActivePath = () => window.location.pathname;

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ─── Reusable field components ────────────────────────────────────────────────
const FieldLabel = ({ children, htmlFor }) => (
  <label
    htmlFor={htmlFor}
    style={{
      display: "block",
      fontSize: "clamp(0.75rem, 2.5vw, 0.8125rem)",
      fontWeight: 500,
      color: tokens.foreground,
      marginBottom: "0.375rem",
      fontFamily: tokens.fontBody,
    }}
  >
    {children}
  </label>
);

const FieldError = ({ message }) => {
  if (!message) return null;
  return (
    <p style={{ margin: "0.375rem 0 0", fontSize: "0.75rem", color: tokens.destructive, fontFamily: tokens.fontBody }}>
      {message}
    </p>
  );
};

const TextInput = ({ id, error, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <input
      id={id}
      {...props}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "0.625rem 0.75rem",
        fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)",
        fontFamily: tokens.fontBody,
        color: tokens.foreground,
        backgroundColor: tokens.background,
        border: `1px solid ${error ? tokens.destructive : focused ? tokens.foreground : tokens.border}`,
        borderRadius: tokens.radius,
        outline: "none",
        transition: "border-color 0.15s ease",
        height: "44px",
      }}
    />
  );
};

const SelectInput = ({ id, error, children, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <select
      id={id}
      {...props}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "0.625rem 0.75rem",
        fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)",
        fontFamily: tokens.fontBody,
        color: tokens.foreground,
        backgroundColor: tokens.background,
        border: `1px solid ${error ? tokens.destructive : focused ? tokens.foreground : tokens.border}`,
        borderRadius: tokens.radius,
        outline: "none",
        transition: "border-color 0.15s ease",
        appearance: "none",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.75rem center",
        paddingRight: "2.25rem",
        height: "44px",
      }}
    >
      {children}
    </select>
  );
};

// ─── AddAddress Page ───────────────────────────────────────────────────────
const AddAddress = ({ user }) => {
  const { auth } = usePage().props;
  const currentUser = user ?? auth?.user ?? null;

  const [derivedFirstName, derivedLastName] = React.useMemo(() => {
    const full = (currentUser?.name || "").trim();
    if (!full) return ["", ""];
    const parts = full.split(/\s+/);
    const first = parts[0];
    const last = parts.slice(1).join(" ");
    return [first, last];
  }, [currentUser?.name]);

  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [activePath, setActivePath] = useState("/account/addresses/create");
  const [saveBtnHovered, setSaveBtnHovered] = useState(false);
  const [cancelBtnHovered, setCancelBtnHovered] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    label: "",
    first_name: currentUser?.first_name || derivedFirstName || "",
    last_name: currentUser?.last_name || derivedLastName || "",
    phone: currentUser?.phone || "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    country: "Ghana",
    is_default: false,
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

  const handleNavigate = (url) => {
    window.history.pushState({}, "", url);
    setActivePath(url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setData(field, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/account/addresses/add", {
      onSuccess: () => reset(),
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: tokens.fontBody }}>
      <Header />

      <main style={{ flex: 1, backgroundColor: "rgba(245,245,245,0.6)" }}>
        <div style={{ 
          maxWidth: "1280px", 
          margin: "0 auto", 
          padding: isDesktop ? "2rem 1rem" : isTablet ? "1.75rem 1.25rem" : "1.5rem 1rem" 
        }}>
          {/* Breadcrumb / back link */}
          <Link
            href={"/account/addresses"}
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              background: "none",
              border: "none",
              padding: "0.25rem",
              marginBottom: isDesktop ? "1.5rem" : "1.25rem",
              fontSize: "clamp(0.75rem, 2.5vw, 0.8125rem)",
              fontFamily: tokens.fontBody,
              color: tokens.mutedForeground,
              cursor: "pointer",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => e.target.style.color = tokens.foreground}
            onMouseLeave={(e) => e.target.style.color = tokens.mutedForeground}
          >
            <IconChevronLeft />
            Back to Addresses
          </Link>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isDesktop ? "220px 1fr" : "1fr",
              gap: isDesktop ? "3rem" : isTablet ? "2rem" : "1.5rem",
            }}
          >
            {/* Sidebar */}
            <AccountSidebar activePath="/account/addresses" onNavigate={handleNavigate} />

            {/* Content */}
            <section>
              <div style={{ 
                display: "flex", 
                alignItems: "flex-start", 
                gap: isDesktop ? "0.75rem" : "0.625rem", 
                marginBottom: isDesktop ? "0.5rem" : "0.25rem" 
              }}>
                <div
                  style={{
                    width: isDesktop ? "40px" : "36px",
                    height: isDesktop ? "40px" : "36px",
                    borderRadius: "50%",
                    backgroundColor: tokens.foreground,
                    color: tokens.background,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  <IconMapPin />
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ 
                    fontFamily: tokens.fontDisplay, 
                    fontSize: "clamp(1.25rem, 4vw, 1.5rem)", 
                    fontWeight: 500, 
                    margin: 0, 
                    color: tokens.foreground,
                    lineHeight: 1.2,
                  }}>
                    Add a New Address
                  </h2>
                  <p style={{ 
                    marginTop: "0.25rem", 
                    fontSize: "clamp(0.813rem, 2.5vw, 0.875rem)", 
                    color: tokens.mutedForeground,
                    lineHeight: 1.5,
                  }}>
                    {currentUser?.email
                      ? <>Save a delivery address for faster checkout &mdash; linked to <strong style={{ color: tokens.foreground, fontWeight: 500 }}>{currentUser.email}</strong></>
                      : "Save a delivery address for faster checkout"}
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                style={{
                  marginTop: isDesktop ? "1.5rem" : "1.25rem",
                  backgroundColor: tokens.background,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: tokens.radius,
                  padding: isDesktop ? "2rem" : isTablet ? "1.5rem" : "1.25rem",
                }}
              >
                {/* Label */}
                <div style={{ marginBottom: "1.25rem", maxWidth: isDesktop ? "320px" : "100%" }}>
                  <FieldLabel htmlFor="label">Address label</FieldLabel>
                  <TextInput
                    id="label"
                    type="text"
                    placeholder="Home, Office, etc."
                    value={data.label}
                    onChange={handleChange("label")}
                    error={errors.label}
                  />
                  <FieldError message={errors.label} />
                </div>

                {/* Name row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
                    gap: "1rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <div>
                    <FieldLabel htmlFor="first_name">First name</FieldLabel>
                    <TextInput
                      id="first_name"
                      type="text"
                      value={data.first_name}
                      onChange={handleChange("first_name")}
                      error={errors.first_name}
                    />
                    <FieldError message={errors.first_name} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="last_name">Last name</FieldLabel>
                    <TextInput
                      id="last_name"
                      type="text"
                      value={data.last_name}
                      onChange={handleChange("last_name")}
                      error={errors.last_name}
                    />
                    <FieldError message={errors.last_name} />
                  </div>
                </div>

                {/* Phone */}
                <div style={{ marginBottom: "1.25rem", maxWidth: isDesktop ? "320px" : "100%" }}>
                  <FieldLabel htmlFor="phone">Phone number</FieldLabel>
                  <TextInput
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={data.phone}
                    onChange={handleChange("phone")}
                    error={errors.phone}
                  />
                  <FieldError message={errors.phone} />
                </div>

                {/* Divider */}
                <div style={{ height: "1px", backgroundColor: tokens.border, margin: isDesktop ? "1.5rem 0" : "1.25rem 0" }} />

                {/* Street address */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <FieldLabel htmlFor="address">Street address</FieldLabel>
                  <TextInput
                    id="address"
                    type="text"
                    placeholder="142 Mercer Street"
                    value={data.address}
                    onChange={handleChange("address")}
                    error={errors.address}
                  />
                  <FieldError message={errors.address} />
                </div>

                {/* Apartment */}
                <div style={{ marginBottom: "1.25rem", maxWidth: isDesktop ? "320px" : "100%" }}>
                  <FieldLabel htmlFor="apartment">Apartment, suite, etc. (optional)</FieldLabel>
                  <TextInput
                    id="apartment"
                    type="text"
                    placeholder="Apt 5B"
                    value={data.apartment}
                    onChange={handleChange("apartment")}
                    error={errors.apartment}
                  />
                  <FieldError message={errors.apartment} />
                </div>

                {/* City / State / Zip */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isDesktop ? "1.4fr 1fr 1fr" : "1fr",
                    gap: "1rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <div>
                    <FieldLabel htmlFor="city">City</FieldLabel>
                    <TextInput
                      id="city"
                      type="text"
                      value={data.city}
                      onChange={handleChange("city")}
                      error={errors.city}
                    />
                    <FieldError message={errors.city} />
                  </div>

                  <div>
                    <FieldLabel htmlFor="state">State</FieldLabel>
                    <TextInput
                      id="state"
                      type="text"
                      value={data.state}
                      onChange={handleChange("state")}
                      error={errors.state}
                    />
                    <FieldError message={errors.state} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="zip">ZIP code</FieldLabel>
                    <TextInput
                      id="zip"
                      type="text"
                      value={data.zip}
                      onChange={handleChange("zip")}
                      error={errors.zip}
                    />
                    <FieldError message={errors.zip} />
                  </div>
                </div>

                {/* Country */}
                <div style={{ marginBottom: "1.5rem", maxWidth: isDesktop ? "320px" : "100%" }}>
                  <FieldLabel htmlFor="country">Country</FieldLabel>
                  <SelectInput
                    id="country"
                    value={data.country}
                    onChange={handleChange("country")}
                    error={errors.country}
                  >
                    <option value="Ghana">Ghana</option>
                  </SelectInput>
                  <FieldError message={errors.country} />
                </div>

                {/* Default checkbox */}
                <label
                  htmlFor="is_default"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    marginBottom: isDesktop ? "2rem" : "1.5rem",
                    userSelect: "none",
                    padding: "0.5rem 0",
                  }}
                >
                  <input
                    id="is_default"
                    type="checkbox"
                    checked={data.is_default}
                    onChange={handleChange("is_default")}
                    style={{
                      width: "18px",
                      height: "18px",
                      accentColor: tokens.foreground,
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ 
                    fontSize: "clamp(0.75rem, 2.5vw, 0.8125rem)", 
                    color: tokens.foreground, 
                    fontFamily: tokens.fontBody,
                    lineHeight: 1.4,
                  }}>
                    Set as default delivery address
                  </span>
                </label>

                {/* Actions */}
                <div style={{ 
                  display: "flex", 
                  gap: "0.75rem",
                  flexDirection: isDesktop ? "row" : "column",
                }}>
                  <button
                    type="submit"
                    disabled={processing}
                    onMouseEnter={() => setSaveBtnHovered(true)}
                    onMouseLeave={() => setSaveBtnHovered(false)}
                    style={{
                      padding: "0.625rem 1.25rem",
                      fontSize: "clamp(0.75rem, 2.5vw, 0.8125rem)",
                      fontWeight: 500,
                      fontFamily: tokens.fontBody,
                      borderRadius: tokens.radius,
                      border: "none",
                      backgroundColor: tokens.foreground,
                      color: tokens.background,
                      cursor: processing ? "default" : "pointer",
                      opacity: processing ? 0.6 : saveBtnHovered ? 0.9 : 1,
                      transition: "opacity 0.2s ease",
                      width: isDesktop ? "auto" : "100%",
                      height: isDesktop ? "auto" : "44px",
                    }}
                  >
                    {processing ? "Saving..." : "Save Address"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate("/account/addresses")}
                    onMouseEnter={() => setCancelBtnHovered(true)}
                    onMouseLeave={() => setCancelBtnHovered(false)}
                    style={{
                      padding: "0.625rem 1.25rem",
                      fontSize: "clamp(0.75rem, 2.5vw, 0.8125rem)",
                      fontWeight: 500,
                      fontFamily: tokens.fontBody,
                      borderRadius: tokens.radius,
                      border: `1px solid ${tokens.border}`,
                      backgroundColor: cancelBtnHovered ? tokens.secondary : "transparent",
                      color: tokens.foreground,
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                      width: isDesktop ? "auto" : "100%",
                      height: isDesktop ? "auto" : "44px",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddAddress;