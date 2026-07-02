import React, { useState, useEffect, useRef } from "react";
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
const IconBell = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconRefresh = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
const AddCategory = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState("/admin/categories/add");

  // Form state
  const [form, setForm] = useState({
    name: "",
    slug: "",
  });

  // UI state
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveBtnHovered, setSaveBtnHovered] = useState(false);
  const [cancelBtnHovered, setCancelBtnHovered] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [slugError, setSlugError] = useState("");

  // Auto-generate slug from name
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
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug when name changes and slug hasn't been manually edited
      if (field === "name" && !slugManuallyEdited) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });

    if (!touched[field]) setTouched((prev) => ({ ...prev, [field]: true }));

    // Clear slug error when user types
    if (field === "slug") {
      setSlugError("");
      setSlugManuallyEdited(true);
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleRegenerateSlug = () => {
    setForm((prev) => ({
      ...prev,
      slug: generateSlug(prev.name),
    }));
    setSlugManuallyEdited(false);
    setSlugError("");
    if (!touched.slug) setTouched((prev) => ({ ...prev, slug: true }));
  };

  // Validation
  const errors = {};
  if (touched.name && !form.name.trim()) errors.name = "Category name is required";
  if (touched.slug && !form.slug.trim()) errors.slug = "Slug is required";
  if (touched.slug && form.slug.trim() && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
    errors.slug = "Slug must contain only lowercase letters, numbers, and hyphens";
  }

  const isValid =
    form.name.trim() &&
    form.slug.trim() &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug) &&
    !slugError;

  const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitted(true);
      setTouched({ name: true, slug: true });

      // Client-side validation
      const errors = {};
      if (!form.name.trim()) errors.name = "Category name is required";
      if (!form.slug.trim()) errors.slug = "Slug is required";
      else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug))
        errors.slug = "Slug must contain only lowercase letters, numbers, and hyphens";

      if (Object.keys(errors).length > 0) return;

      setIsSaving(true);
      setSlugError("");

      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch("/admin/categories/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: form.name.trim(),
            slug: form.slug.trim(),
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Success
          alert("Category created successfully!");
          setForm({ name: "", slug: "" });
          setTouched({});
          setSubmitted(false);
          setSlugManuallyEdited(false);
        } else if (data.errors) {
          // Validation errors from server
          if (data.errors.name) {
            // Highlight name error
            setTouched((prev) => ({ ...prev, name: true }));
            console.error(data.errors.name[0]);
          }
          if (data.errors.slug) {
            setSlugError(data.errors.slug[0]);
            setTouched((prev) => ({ ...prev, slug: true }));
          }
        } else if (data.message) {
          alert(data.message);
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Network error. Please try again.");
      } finally {
        setIsSaving(false);
      }
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
            <button
              aria-label="Notifications"
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
                color: tokens.mutedForeground,
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = tokens.secondary)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <IconBell />
            </button>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: tokens.foreground,
                color: tokens.background,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 600,
                fontFamily: tokens.fontBody,
              }}
            >
              AN
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
                  backgroundColor: cancelBtnHovered ? tokens.secondary : "transparent",
                  color: tokens.foreground,
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
                onClick={handleSubmit}
                disabled={isSaving}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.5rem 1.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  fontFamily: tokens.fontBody,
                  borderRadius: tokens.radius,
                  border: "none",
                  backgroundColor: tokens.foreground,
                  color: tokens.background,
                  cursor: isSaving ? "not-allowed" : "pointer",
                  opacity: isSaving ? 0.7 : saveBtnHovered ? 0.9 : 1,
                  transition: "opacity 0.2s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={() => setSaveBtnHovered(true)}
                onMouseLeave={() => setSaveBtnHovered(false)}
              >
                {isSaving ? "Saving..." : "Save Category"}
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
                      value={form.name}
                      onChange={handleChange("name")}
                      onBlur={handleBlur("name")}
                      placeholder="e.g. Summer Dresses"
                      style={{
                        ...inputStyle,
                        borderColor: errors.name ? tokens.destructive : tokens.border,
                      }}
                      onFocus={(e) => {
                        if (!errors.name) e.target.style.borderColor = tokens.foreground;
                      }}
                      onBlur={(e) => {
                        if (!errors.name) e.target.style.borderColor = tokens.border;
                      }}
                    />
                    {errors.name && (
                      <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{errors.name}</p>
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
                          value={form.slug}
                          onChange={handleChange("slug")}
                          onBlur={handleBlur("slug")}
                          placeholder="e.g. summer-dresses"
                          style={{
                            ...inputStyle,
                            borderColor: (errors.slug || slugError) ? tokens.destructive : tokens.border,
                          }}
                          onFocus={(e) => {
                            if (!errors.slug && !slugError) e.target.style.borderColor = tokens.foreground;
                          }}
                          onBlur={(e) => {
                            if (!errors.slug && !slugError) e.target.style.borderColor = tokens.border;
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
                    {(errors.slug || slugError) && (
                      <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>
                        {errors.slug || slugError}
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
                    border: `1px solid ${tokens.border}`,
                    backgroundColor: cancelBtnHovered ? tokens.secondary : "transparent",
                    color: tokens.foreground,
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
                  disabled={isSaving}
                  style={{
                    padding: "0.5rem 1.5rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    fontFamily: tokens.fontBody,
                    borderRadius: tokens.radius,
                    border: "none",
                    backgroundColor: tokens.foreground,
                    color: tokens.background,
                    cursor: isSaving ? "not-allowed" : "pointer",
                    opacity: isSaving ? 0.7 : saveBtnHovered ? 0.9 : 1,
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseEnter={() => setSaveBtnHovered(true)}
                  onMouseLeave={() => setSaveBtnHovered(false)}
                >
                  {isSaving ? "Saving..." : "Save Category"}
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