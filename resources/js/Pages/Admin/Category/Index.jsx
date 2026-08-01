import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import AdminSidebar from "@/Components/Admin/AdminSidebar";

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
  destructive: "#ef4444",
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconRefresh = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

// ─── Input Styles ────────────────────────────────────────────────────────────
const inputStyle = {
  height: "40px",
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

// ─── AddCategory Page ────────────────────────────────────────────────────────
const AddCategory = ({ storeUrl = "/admin/categories/add" }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState("/admin/categories/add");

  const [touched, setTouched] = useState({});
  const [saveBtnHovered, setSaveBtnHovered] = useState(false);
  const [cancelBtnHovered, setCancelBtnHovered] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // ─── Inertia form ──────────────────────────────────────────────────────────
  const { data, setData, post, processing, errors, isDirty, reset, clearErrors } = useForm({
    name: "",
    slug: "",
  });

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  useEffect(() => {
    injectFonts();

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
        setMobileSidebarOpen(false);
      } else {
        setSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigate = (url) => {
    setActiveUrl(url);
    if (isMobile) setMobileSidebarOpen(false);
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    if (field === "name") {
      setData((prevData) => ({
        ...prevData,
        name: value,
        slug: slugManuallyEdited ? prevData.slug : generateSlug(value),
      }));
    } else {
      setData("slug", value);
      setSlugManuallyEdited(true);
    }

    if (!touched[field]) setTouched((prev) => ({ ...prev, [field]: true }));
    if (errors[field]) clearErrors(field);
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleRegenerateSlug = () => {
    setData("slug", generateSlug(data.name));
    setSlugManuallyEdited(false);
    clearErrors("slug");
    if (!touched.slug) setTouched((prev) => ({ ...prev, slug: true }));
  };

  // Client-side validation (mirrors server rules for instant feedback)
  const clientErrors = {};
  if (touched.name && !data.name.trim()) clientErrors.name = "Category name is required";
  if (touched.slug && !data.slug.trim()) clientErrors.slug = "Slug is required";
  if (touched.slug && data.slug.trim() && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    clientErrors.slug = "Slug must contain only lowercase letters, numbers, and hyphens";
  }

  // Server errors take precedence once returned
  const nameError = errors.name || clientErrors.name;
  const slugError = errors.slug || clientErrors.slug;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, slug: true });

    if (!data.name.trim() || !data.slug.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
      return;
    }

    post(storeUrl, {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        setTouched({});
        setSlugManuallyEdited(false);
      },
    });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: tokens.fontBody, backgroundColor: "rgba(245,245,245,0.6)" }}>
      {/* Mobile overlay */}
      {mobileSidebarOpen && isMobile && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 40, backgroundColor: "rgba(0,0,0,0.5)", cursor: "pointer" }}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        isMobile={isMobile}
        isOpen={mobileSidebarOpen}
        onNavigate={handleNavigate}
        activeUrl={activeUrl}
      />

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            height: "64px",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            borderBottom: `1px solid ${tokens.border}`,
            backgroundColor: tokens.background,
            padding: "0 1rem",
          }}
        >
          <button
            onClick={() => {
              if (isMobile) {
                setMobileSidebarOpen(!mobileSidebarOpen);
              } else {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
            aria-label="Toggle sidebar"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: tokens.radius,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: tokens.foreground,
              transition: "background-color 0.15s ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = tokens.secondary)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {isMobile ? (
              <IconMenu />
            ) : (
              <IconChevronLeft
                style={{
                  transform: sidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              />
            )}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "auto" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#f6aab2",
                color: tokens.background,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 600,
                fontFamily: tokens.fontBody,
              }}
            >
              CB
            </div>
          </div>
        </header>

        {/* Page heading */}
        <div style={{ borderBottom: `1px solid ${tokens.border}`, backgroundColor: tokens.background, padding: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div>
              <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                Add Category
              </h1>
              <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
                Create a new product category for your catalog
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.5rem 1.25rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  fontFamily: tokens.fontBody,
                  borderRadius: tokens.radius,
                  border: `1px solid ${tokens.border}`,
                  backgroundColor: cancelBtnHovered ? "#f6aab2" : "transparent",
                  color: cancelBtnHovered ? "#ffffff" : tokens.foreground,
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={() => setCancelBtnHovered(true)}
                onMouseLeave={() => setCancelBtnHovered(false)}
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={processing || !isDirty}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.5rem 1.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  fontFamily: tokens.fontBody,
                  borderRadius: tokens.radius,
                  border: "none",
                  backgroundColor: "#f6aab2",
                  color: tokens.background,
                  cursor: processing || !isDirty ? "not-allowed" : "pointer",
                  opacity: processing || !isDirty ? 0.6 : saveBtnHovered ? 0.9 : 1,
                  transition: "opacity 0.2s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={() => setSaveBtnHovered(true)}
                onMouseLeave={() => setSaveBtnHovered(false)}
              >
                {processing ? "Saving..." : "Save Category"}
              </button>
            </div>
          </div>
        </div>

        {/* Form content */}
        <main style={{ flex: 1, padding: "1.5rem" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ maxWidth: "640px" }}>
              <div
                style={{
                  backgroundColor: tokens.background,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: tokens.radius,
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${tokens.border}` }}>
                  <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.125rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                    Category Details
                  </h3>
                </div>

                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {/* Category Name */}
                  <div>
                    <label htmlFor="name" style={labelStyle}>Category Name *</label>
                    <input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={handleChange("name")}
                      onBlur={handleBlur("name")}
                      placeholder="e.g. Summer Dresses"
                      style={{
                        ...inputStyle,
                        borderColor: nameError ? tokens.destructive : tokens.border,
                      }}
                      onFocus={(e) => {
                        if (!nameError) e.target.style.borderColor = tokens.foreground;
                      }}
                    />
                    {nameError && (
                      <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{nameError}</p>
                    )}
                  </div>

                  {/* Slug */}
                  <div>
                    <label htmlFor="slug" style={labelStyle}>Slug *</label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <div style={{ flex: 1 }}>
                        <input
                          id="slug"
                          type="text"
                          value={data.slug}
                          onChange={handleChange("slug")}
                          onBlur={handleBlur("slug")}
                          placeholder="e.g. summer-dresses"
                          style={{
                            ...inputStyle,
                            borderColor: slugError ? tokens.destructive : tokens.border,
                          }}
                          onFocus={(e) => {
                            if (!slugError) e.target.style.borderColor = tokens.foreground;
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRegenerateSlug}
                        title="Generate from name"
                        style={{
                          width: "40px",
                          height: "40px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: tokens.radius,
                          border: `1px solid ${tokens.border}`,
                          backgroundColor: tokens.background,
                          color: tokens.mutedForeground,
                          cursor: "pointer",
                          transition: "background-color 0.15s ease",
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = tokens.secondary)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = tokens.background)}
                      >
                        <IconRefresh />
                      </button>
                    </div>
                    {slugError && (
                      <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>
                        {slugError}
                      </p>
                    )}
                    <p style={{ fontSize: "0.75rem", color: tokens.mutedForeground, margin: "4px 0 0" }}>
                      The slug is used in the URL. Use lowercase letters, numbers, and hyphens only.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons at bottom */}
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem 1.5rem",
                  backgroundColor: tokens.background,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: tokens.radius,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                }}
              >
                <button
                  type="button"
                  style={{
                    padding: "0.5rem 1.25rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    fontFamily: tokens.fontBody,
                    borderRadius: tokens.radius,
                    border: `1px solid #f6aab2`,
                    backgroundColor: cancelBtnHovered ? "#f6aab2" : "transparent",
                   color: cancelBtnHovered ? "#ffffff" : tokens.foreground,
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={() => setCancelBtnHovered(true)}
                  onMouseLeave={() => setCancelBtnHovered(false)}
                  onClick={() => window.history.back()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing || !isDirty}
                  style={{
                    padding: "0.5rem 1.5rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    fontFamily: tokens.fontBody,
                    borderRadius: tokens.radius,
                    border: "none",
                    backgroundColor: "#f6aab2",
                    color: tokens.background,
                    cursor: processing || !isDirty ? "not-allowed" : "pointer",
                    opacity: processing || !isDirty ? 0.6 : saveBtnHovered ? 0.9 : 1,
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseEnter={() => setSaveBtnHovered(true)}
                  onMouseLeave={() => setSaveBtnHovered(false)}
                >
                  {processing ? "Saving..." : "Save Category"}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddCategory;