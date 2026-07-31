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

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const availableColors = [
  { name: "Black", hex: "#1a1a1a" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy", hex: "#000080" },
  { name: "Camel", hex: "#C19A6B" },
  { name: "Champagne", hex: "#F7E7CE" },
  { name: "Olive", hex: "#808000" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Sage", hex: "#9CAF88" },
  { name: "Blush", hex: "#DE5D83" },
];

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconBell = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconUpload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const IconArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconLoader = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ animation: "anita-spin 0.8s linear infinite" }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// ─── Custom Select Component ─────────────────────────────────────────────────
const CustomSelect = ({ value, onChange, options, placeholder, style, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);
  const selectRef = React.useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} style={{ position: "relative", ...style }}>
      <button
        type="button"
        onClick={handleToggle}
        style={{
          width: "100%",
          height: "40px",
          padding: "0 2rem 0 0.75rem",
          fontSize: "0.875rem",
          fontFamily: tokens.fontBody,
          backgroundColor: tokens.background,
          border: `1px solid ${error ? tokens.destructive : isOpen ? tokens.foreground : tokens.border}`,
          borderRadius: tokens.radius,
          color: value ? tokens.foreground : tokens.mutedForeground,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "border-color 0.2s ease",
          outline: "none",
          whiteSpace: "nowrap",
          textAlign: "left",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", flex: 1, minWidth: 0 }}>
          {displayText}
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "0.5rem",
            flexShrink: 0,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <IconChevronDown />
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 50,
            backgroundColor: tokens.background,
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            overflow: "hidden",
            maxHeight: "240px",
            overflowY: "auto",
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            const isHovered = hoveredOption === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHoveredOption(option.value)}
                onMouseLeave={() => setHoveredOption(null)}
                style={{
                  width: "100%",
                  padding: "0.625rem 0.75rem",
                  fontSize: "0.875rem",
                  fontFamily: tokens.fontBody,
                  backgroundColor: isSelected ? tokens.secondary : isHovered ? tokens.secondary : "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  color: tokens.foreground,
                  fontWeight: isSelected ? 500 : 400,
                  transition: "background-color 0.1s ease",
                  outline: "none",
                  display: "block",
                  lineHeight: 1.4,
                }}
              >
                {option.label}
              </button>
            );
          })}
          {options.length === 0 && (
            <div style={{ padding: "1rem 0.75rem", textAlign: "center", color: tokens.mutedForeground, fontSize: "0.8125rem" }}>
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Input Styles ────────────────────────────────────────────────────────────
const inputStyle = { height: "40px", width: "100%", padding: "0 0.75rem", fontSize: "0.875rem", fontFamily: tokens.fontBody, backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, color: tokens.foreground, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s ease" };
const textareaStyle = { width: "100%", padding: "0.75rem", fontSize: "0.875rem", fontFamily: tokens.fontBody, backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, color: tokens.foreground, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s ease", resize: "vertical", minHeight: "100px" };
const labelStyle = { fontSize: "0.875rem", fontWeight: 500, fontFamily: tokens.fontBody, color: tokens.foreground, marginBottom: "0.5rem", display: "block" };

const cardStyle = {
  backgroundColor: tokens.background,
  border: `1px solid ${tokens.border}`,
  borderRadius: tokens.radius,
};
const cardHeaderStyle = {
  padding: "1.25rem 1.5rem",
  borderBottom: `1px solid ${tokens.border}`,
  borderTopLeftRadius: tokens.radius,
  borderTopRightRadius: tokens.radius,
};

// ─── EditProduct Page ────────────────────────────────────────────────────────
const EditProduct = ({ product, categories }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState("/admin/products");


  const { data, setData, post, processing, errors, transform } = useForm({
    _method: "put",
    name: product.name ?? "",
    category_id: product.category_id ?? "",
    price: product.price != null ? String(product.price) : "",
    discount_amount: product.discount_amount != null ? String(product.discount_amount) : "0",
    stock_quantity: product.stock_quantity != null ? String(product.stock_quantity) : "0",
    sku: product.sku ?? "",
    description: product.description ?? "",
    featured: !!product.featured,
    status: product.status ?? "active",
    variants: (product.variants ?? []).map((v) => ({
      id: v.id ?? null,
      size: v.size ?? "",
      color: v.color ?? "",
      stock_quantity: v.stock_quantity ?? 0,
    })),
    new_images: [], // File[]
    deleted_image_ids: [], // ids of existing images marked for removal
  });

  // ─── Local UI-only state ───────────────────────────────────────────────────
  const [existingImages, setExistingImages] = useState(
    (product.images ?? []).map((img) => ({
      id: img.id,
      url: img.url ?? `/storage/${img.image}`,
    }))
  );
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [variantRows, setVariantRows] = useState(
    (product.variants ?? []).map((v, i) => ({
      id: v.id,
      key: v.id ? `existing-${v.id}` : `row-${i}`,
      size: v.size ?? "",
      color: v.color ?? "",
      stockQuantity: String(v.stock_quantity ?? 0),
    }))
  );
  const [newVariant, setNewVariant] = useState({ size: "", color: "", stockQuantity: "0" });

  const [touched, setTouched] = useState({});
  const [saveBtnHovered, setSaveBtnHovered] = useState(false);
  const [cancelBtnHovered, setCancelBtnHovered] = useState(false);
  const [addVariantBtnHovered, setAddVariantBtnHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [backBtnHovered, setBackBtnHovered] = useState(false);
  const [deleteImageHovered, setDeleteImageHovered] = useState(null);

  useEffect(() => {
    injectFonts();

    const styleId = "anita-spin-keyframes";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = "@keyframes anita-spin { to { transform: rotate(360deg); } }";
      document.head.appendChild(style);
    }

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) { setSidebarCollapsed(true); setMobileSidebarOpen(false); } else { setSidebarCollapsed(false); }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigate = (url) => { setActiveUrl(url); if (isMobile) setMobileSidebarOpen(false); };

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setData(field, value);
    if (!touched[field]) setTouched((prev) => ({ ...prev, [field]: true }));
  };
  const handleBlur = (field) => () => setTouched((prev) => ({ ...prev, [field]: true }));

  // ─── Existing image removal ────────────────────────────────────────────────
  const handleRemoveExistingImage = (imageId) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    setData("deleted_image_ids", [...data.deleted_image_ids, imageId]);
  };

  // ─── New image upload ──────────────────────────────────────────────────────
  const addImageFiles = (files) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewImagePreviews((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
      setData("new_images", [...data.new_images, file]);
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    addImageFiles(files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    addImageFiles(files);
  };

  const handleRemoveNewImage = (index) => {
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setData("new_images", data.new_images.filter((_, i) => i !== index));
  };

  // ─── Variant management ─────────────────────────────────────────────────────
  const syncVariantsToForm = (rows) => {
    setData(
      "variants",
      rows.map((r) => ({
        id: r.id ?? null,
        size: r.size,
        color: r.color,
        stock_quantity: parseInt(r.stockQuantity) || 0,
      }))
    );
  };

  const handleAddVariant = () => {
    if (newVariant.size || newVariant.color) {
      const rows = [
        ...variantRows,
        { key: `new-${Date.now()}`, size: newVariant.size, color: newVariant.color, stockQuantity: newVariant.stockQuantity },
      ];
      setVariantRows(rows);
      syncVariantsToForm(rows);
      setNewVariant({ size: "", color: "", stockQuantity: "0" });
    }
  };

  const handleRemoveVariant = (key) => {
    const rows = variantRows.filter((v) => v.key !== key);
    setVariantRows(rows);
    syncVariantsToForm(rows);
  };

  // ─── Validation ─────────────────────────────────────────────────────────────
  const clientErrors = {};
  if (touched.name && !data.name.trim()) clientErrors.name = "Product name is required";
  if (touched.category_id && !data.category_id) clientErrors.category_id = "Category is required";
  if (touched.price && (!data.price || parseFloat(data.price) <= 0)) clientErrors.price = "Valid price is required";
  if (touched.sku && !data.sku.trim()) clientErrors.sku = "SKU is required";
  if (touched.description && !data.description.trim()) clientErrors.description = "Description is required";

  const fieldError = (field) => errors[field] || clientErrors[field];

  const isValid =
    data.name.trim() &&
    data.category_id &&
    data.price &&
    parseFloat(data.price) > 0 &&
    data.sku.trim() &&
    data.description.trim();

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({ name: true, category_id: true, price: true, sku: true, description: true });

    if (!isValid) return;

    post("/admin/products/" + product.id, {
      forceFormData: true,
      onSuccess: () => {
        setNewImagePreviews([]);
      },
      onError: () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    });
  };

  const categoryOptions = (categories ?? []).map((c) => ({ value: c.id, label: c.name }));
  const sizeOptions = availableSizes.map((s) => ({ value: s, label: s }));
  const colorOptions = availableColors.map((c) => ({ value: c.name, label: c.name }));
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: tokens.fontBody, backgroundColor: "rgba(245,245,245,0.6)" }}>
      {mobileSidebarOpen && isMobile && <div onClick={() => setMobileSidebarOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40, backgroundColor: "rgba(0,0,0,0.5)", cursor: "pointer" }} />}
      <AdminSidebar collapsed={sidebarCollapsed} isMobile={isMobile} isOpen={mobileSidebarOpen} onNavigate={handleNavigate} activeUrl={activeUrl} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header style={{ position: "sticky", top: 0, zIndex: 30, height: "64px", display: "flex", alignItems: "center", gap: "1rem", borderBottom: `1px solid ${tokens.border}`, backgroundColor: tokens.background, padding: "0 1rem" }}>
          <button onClick={() => { if (isMobile) { setMobileSidebarOpen(!mobileSidebarOpen); } else { setSidebarCollapsed(!sidebarCollapsed); } }} aria-label="Toggle sidebar"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: tokens.radius, border: "none", background: "transparent", cursor: "pointer", color: tokens.foreground, transition: "background-color 0.15s ease", flexShrink: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = tokens.secondary)} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
            {isMobile ? <IconMenu /> : <IconChevronLeft style={{ transform: sidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }} />}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "auto" }}>
            {/* <button aria-label="Notifications" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: tokens.radius, border: "none", background: "transparent", cursor: "pointer", color: tokens.mutedForeground, transition: "background-color 0.15s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = tokens.secondary)} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}><IconBell /></button> */}
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#f6aab2", color: tokens.background, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 600, fontFamily: tokens.fontBody }}>CB</div>
          </div>
        </header>

        {/* Page heading */}
        <div style={{ borderBottom: `1px solid ${tokens.border}`, backgroundColor: tokens.background, padding: "1.5rem" }}>
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <a href="/admin/products" style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", fontWeight: 500, fontFamily: tokens.fontBody, textDecoration: "none", color: backBtnHovered ? tokens.foreground : tokens.mutedForeground, transition: "color 0.15s ease", whiteSpace: "nowrap" }}
                onMouseEnter={() => setBackBtnHovered(true)} onMouseLeave={() => setBackBtnHovered(false)}>
                <IconArrowLeft /> Back
              </a>
              <div>
                <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 500, margin: 0, color: tokens.foreground }}>
                  Edit Product
                </h1>
                <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: tokens.mutedForeground }}>
                  Editing: {product.name} ({product.sku})
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <a href="/admin/products"
                style={{ display: "inline-flex", alignItems: "center", padding: "0.5rem 1.25rem", fontSize: "0.875rem", fontWeight: 500, fontFamily: tokens.fontBody, borderRadius: tokens.radius, border: `1px solid #f6aab2`, backgroundColor: cancelBtnHovered ? "#f6aab2" : "transparent", color: cancelBtnHovered ? "#fff" : tokens.foreground, textDecoration: "none", cursor: "pointer", transition: "background-color 0.2s ease", whiteSpace: "nowrap" }}
                onMouseEnter={() => setCancelBtnHovered(true)} onMouseLeave={() => setCancelBtnHovered(false)}>
                Cancel
              </a>
              <button onClick={handleSubmit}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, fontFamily: tokens.fontBody, borderRadius: tokens.radius, border: "none", backgroundColor: "#f6aab2", color: tokens.background, cursor: processing ? "not-allowed" : "pointer", opacity: processing ? 0.7 : saveBtnHovered ? 0.9 : 1, transition: "opacity 0.2s ease", whiteSpace: "nowrap" }}
                onMouseEnter={() => setSaveBtnHovered(true)} onMouseLeave={() => setSaveBtnHovered(false)}
                disabled={processing}>
                {processing && <IconLoader />}
                {processing ? "Saving…" : "Update Product"}
              </button>
            </div>
          </div>
        </div>

        {/* Form content */}
        <main style={{ flex: 1, padding: "1.5rem" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1.5rem" }}>
              {/* Left column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Basic Information */}
                <div style={cardStyle}>
                  <div style={cardHeaderStyle}>
                    <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.125rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>Basic Information</h3>
                  </div>
                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label htmlFor="name" style={labelStyle}>Product Name *</label>
                      <input id="name" type="text" value={data.name} onChange={handleChange("name")} onBlur={handleBlur("name")} placeholder="Enter product name"
                        style={{ ...inputStyle, borderColor: fieldError("name") ? tokens.destructive : tokens.border }}
                        onFocus={(e) => { if (!fieldError("name")) e.target.style.borderColor = tokens.foreground; }} />
                      {fieldError("name") && <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{fieldError("name")}</p>}
                    </div>
                    <div>
                      <label htmlFor="description" style={labelStyle}>Description *</label>
                      <textarea id="description" value={data.description} onChange={handleChange("description")} onBlur={handleBlur("description")} placeholder="Enter product description"
                        style={{ ...textareaStyle, borderColor: fieldError("description") ? tokens.destructive : tokens.border }}
                        onFocus={(e) => { if (!fieldError("description")) e.target.style.borderColor = tokens.foreground; }} />
                      {fieldError("description") && <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{fieldError("description")}</p>}
                    </div>
                    <div>
                      <label style={labelStyle}>Category *</label>
                      <CustomSelect value={data.category_id} onChange={(val) => { setData("category_id", val); setTouched((prev) => ({ ...prev, category_id: true })); }} options={categoryOptions} placeholder="Select category" error={fieldError("category_id")} />
                      {fieldError("category_id") && <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{fieldError("category_id")}</p>}
                    </div>
                  </div>
                </div>

                {/* Pricing & Inventory */}
                <div style={cardStyle}>
                  <div style={cardHeaderStyle}>
                    <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.125rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>Pricing & Inventory</h3>
                  </div>
                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                      <div>
                        <label htmlFor="price" style={labelStyle}>Price ($) *</label>
                        <input id="price" type="number" step="0.01" min="0" value={data.price} onChange={handleChange("price")} onBlur={handleBlur("price")} placeholder="0.00"
                          style={{ ...inputStyle, borderColor: fieldError("price") ? tokens.destructive : tokens.border }}
                          onFocus={(e) => { if (!fieldError("price")) e.target.style.borderColor = tokens.foreground; }} />
                        {fieldError("price") && <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{fieldError("price")}</p>}
                      </div>
                      <div>
                        <label htmlFor="discount_amount" style={labelStyle}>Discount ($)</label>
                        <input id="discount_amount" type="number" step="0.01" min="0" value={data.discount_amount} onChange={handleChange("discount_amount")} placeholder="0.00"
                          style={inputStyle} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                      <div>
                        <label htmlFor="sku" style={labelStyle}>SKU *</label>
                        <input id="sku" type="text" value={data.sku} onChange={handleChange("sku")} onBlur={handleBlur("sku")} placeholder="e.g. DRESS-001"
                          style={{ ...inputStyle, borderColor: fieldError("sku") ? tokens.destructive : tokens.border }}
                          onFocus={(e) => { if (!fieldError("sku")) e.target.style.borderColor = tokens.foreground; }} />
                        {fieldError("sku") && <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "4px 0 0" }}>{fieldError("sku")}</p>}
                      </div>
                      <div>
                        <label htmlFor="stock_quantity" style={labelStyle}>Stock Quantity</label>
                        <input id="stock_quantity" type="number" min="0" value={data.stock_quantity} onChange={handleChange("stock_quantity")} placeholder="0"
                          style={inputStyle} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Status</label>
                      <CustomSelect value={data.status} onChange={(val) => setData("status", val)} options={statusOptions} placeholder="Select status" />
                    </div>
                    <div>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem", color: tokens.foreground }}>
                        <div onClick={() => setData("featured", !data.featured)}
                          style={{ width: "18px", height: "18px", borderRadius: "3px", border: data.featured ? `1px solid ${tokens.foreground}` : `1px solid ${tokens.border}`, backgroundColor: data.featured ? tokens.foreground : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s ease", flexShrink: 0 }}>
                          {data.featured && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                        </div>
                        Featured product
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Images */}
                <div style={{ ...cardStyle, overflow: "hidden" }}>
                  <div style={cardHeaderStyle}>
                    <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.125rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>Product Images</h3>
                  </div>
                  <div style={{ padding: "1.5rem" }}>
                    {errors.new_images && (
                      <p style={{ fontSize: "0.75rem", color: tokens.destructive, margin: "0 0 1rem" }}>{errors.new_images}</p>
                    )}

                    {/* Existing images */}
                    {existingImages.length > 0 && (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
                        {existingImages.map((img) => (
                          <div key={`existing-${img.id}`} style={{ position: "relative", borderRadius: tokens.radius, overflow: "hidden", backgroundColor: tokens.secondary, aspectRatio: "3/4" }}>
                            <img src={img.url} alt="Product" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <button type="button" onClick={() => handleRemoveExistingImage(img.id)}
                              style={{ position: "absolute", top: "4px", right: "4px", width: "24px", height: "24px", borderRadius: "50%", border: "none", backgroundColor: deleteImageHovered === `existing-${img.id}` ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)", color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.15s ease" }}
                              onMouseEnter={() => setDeleteImageHovered(`existing-${img.id}`)} onMouseLeave={() => setDeleteImageHovered(null)}>
                              <IconX />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New image previews */}
                    {newImagePreviews.length > 0 && (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
                        {newImagePreviews.map((preview, index) => (
                          <div key={`new-${index}`} style={{ position: "relative", borderRadius: tokens.radius, overflow: "hidden", backgroundColor: tokens.secondary, aspectRatio: "3/4" }}>
                            <img src={preview} alt={`New ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <button type="button" onClick={() => handleRemoveNewImage(index)}
                              style={{ position: "absolute", top: "4px", right: "4px", width: "24px", height: "24px", borderRadius: "50%", border: "none", backgroundColor: deleteImageHovered === `new-${index}` ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)", color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.15s ease" }}
                              onMouseEnter={() => setDeleteImageHovered(`new-${index}`)} onMouseLeave={() => setDeleteImageHovered(null)}>
                              <IconX />
                            </button>
                            <span style={{ position: "absolute", bottom: "4px", left: "4px", padding: "2px 6px", borderRadius: tokens.radius, backgroundColor: tokens.foreground, color: tokens.background, fontSize: "0.625rem", fontWeight: 500 }}>New</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload area */}
                    <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
                      onClick={() => document.getElementById("editImageUpload").click()}
                      style={{ border: `2px dashed ${isDragging ? tokens.foreground : tokens.border}`, borderRadius: tokens.radius, padding: "2rem", textAlign: "center", cursor: "pointer", backgroundColor: isDragging ? tokens.secondary : "transparent", transition: "all 0.2s ease" }}>
                      <input id="editImageUpload" type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                      <div style={{ color: tokens.mutedForeground, marginBottom: "0.5rem" }}><IconUpload /></div>
                      <p style={{ fontSize: "0.8125rem", fontWeight: 500, color: tokens.foreground, margin: "0 0 0.25rem" }}>Add more images</p>
                      <p style={{ fontSize: "0.75rem", color: tokens.mutedForeground, margin: 0 }}>Drag & drop or click to browse (max 5MB each)</p>
                    </div>
                  </div>
                </div>

                {/* Variants */}
                <div style={cardStyle}>
                  <div style={cardHeaderStyle}>
                    <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: "1.125rem", fontWeight: 500, margin: 0, color: tokens.foreground }}>Product Variants ({variantRows.length})</h3>
                  </div>
                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "0.5rem", alignItems: "end" }}>
                      <div>
                        <label style={{ ...labelStyle, fontSize: "0.75rem", marginBottom: "0.25rem" }}>Size</label>
                        <CustomSelect value={newVariant.size} onChange={(val) => setNewVariant((prev) => ({ ...prev, size: val }))} options={sizeOptions} placeholder="Size" />
                      </div>
                      <div>
                        <label style={{ ...labelStyle, fontSize: "0.75rem", marginBottom: "0.25rem" }}>Color</label>
                        <CustomSelect value={newVariant.color} onChange={(val) => setNewVariant((prev) => ({ ...prev, color: val }))} options={colorOptions} placeholder="Color" />
                      </div>
                      <div>
                        <label style={{ ...labelStyle, fontSize: "0.75rem", marginBottom: "0.25rem" }}>Qty</label>
                        <input type="number" min="0" value={newVariant.stockQuantity} onChange={(e) => setNewVariant((prev) => ({ ...prev, stockQuantity: e.target.value }))} placeholder="0"
                          style={{ ...inputStyle, height: "40px" }} onFocus={(e) => (e.target.style.borderColor = tokens.foreground)} onBlur={(e) => (e.target.style.borderColor = tokens.border)} />
                      </div>
                      <button type="button" onClick={handleAddVariant}
                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: tokens.radius, border: `1px solid ${tokens.border}`, backgroundColor: addVariantBtnHovered ? tokens.secondary : tokens.background, color: tokens.foreground, cursor: "pointer", transition: "background-color 0.15s ease" }}
                        onMouseEnter={() => setAddVariantBtnHovered(true)} onMouseLeave={() => setAddVariantBtnHovered(false)}>
                        <IconPlus />
                      </button>
                    </div>

                    {variantRows.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                        {variantRows.map((variant) => (
                          <div key={variant.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.625rem 0.75rem", borderRadius: tokens.radius, backgroundColor: tokens.secondary, border: `1px solid ${tokens.border}`, fontSize: "0.8125rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <span style={{ fontWeight: 500, color: tokens.foreground }}>{variant.size || "Any size"}</span>
                              <span style={{ color: tokens.mutedForeground }}>/</span>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                {variant.color && <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: availableColors.find((c) => c.name === variant.color)?.hex || tokens.border, border: "1px solid rgba(0,0,0,0.2)", flexShrink: 0 }} />}
                                <span style={{ color: tokens.foreground }}>{variant.color || "Any color"}</span>
                              </div>
                              <span style={{ color: tokens.mutedForeground, marginLeft: "0.5rem" }}>Qty: {variant.stockQuantity}</span>
                            </div>
                            <button type="button" onClick={() => handleRemoveVariant(variant.key)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: tokens.mutedForeground, padding: "4px", borderRadius: tokens.radius, display: "flex", alignItems: "center", transition: "color 0.15s ease" }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = tokens.destructive)} onMouseLeave={(e) => (e.currentTarget.style.color = tokens.mutedForeground)}>
                              <IconX />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {variantRows.length === 0 && (
                      <p style={{ fontSize: "0.8125rem", color: tokens.mutedForeground, textAlign: "center", padding: "1rem 0", margin: 0 }}>
                        No variants yet. Add size and color combinations above.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom action bar */}
            <div style={{ marginTop: "1.5rem", padding: "1rem 1.5rem", backgroundColor: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem" }}>
              <a href="/admin/products"
                style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem", fontWeight: 500, fontFamily: tokens.fontBody, borderRadius: tokens.radius, border: `1px solid #f6aab2`, backgroundColor: cancelBtnHovered ? "#f6aab2" : "transparent", color: cancelBtnHovered ? "#fff" : tokens.foreground, textDecoration: "none", cursor: "pointer", transition: "background-color 0.2s ease" }}
                onMouseEnter={() => setCancelBtnHovered(true)} onMouseLeave={() => setCancelBtnHovered(false)}>
                Cancel
              </a>
              <button type="submit" disabled={processing}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1.5rem", fontSize: "0.875rem", fontWeight: 500, fontFamily: tokens.fontBody, borderRadius: tokens.radius, border: "none", backgroundColor: "#f6aab2", color: tokens.background, cursor: processing ? "not-allowed" : "pointer", opacity: processing ? 0.7 : saveBtnHovered ? 0.9 : 1, transition: "opacity 0.2s ease" }}
                onMouseEnter={() => setSaveBtnHovered(true)} onMouseLeave={() => setSaveBtnHovered(false)}>
                {processing && <IconLoader />}
                {processing ? "Saving…" : "Update Product"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditProduct;