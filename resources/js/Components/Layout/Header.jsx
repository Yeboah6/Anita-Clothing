import React, {
  useState,
  useReducer,
  useEffect,
  useContext,
  createContext,
} from "react";
import { usePage, useForm } from "@inertiajs/react";

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
  foreground: "#f6aab2",
  background: "#ffffff",
  mutedForeground: "#737373",
  border: "#e6e6e6",
  radius: "4px",
  destructive: "#ef4444",
  adminColor: "#f6aab2",
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

export function CartProvider({ children }) {
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
    loadItems: (items) => {
      dispatch({ type: "CLEAR_CART" });
      items.forEach(item => {
        dispatch({ type: "ADD_ITEM", payload: item });
      });
    },
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

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconShoppingBag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f6aab2" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconDashboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const IconShield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// ─── Ghost icon button base style ─────────────────────────────────────────────
const ghostIconBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
  borderRadius: tokens.radius,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  color: tokens.foreground,
  position: "relative",
  padding: 0,
  transition: "background-color 0.15s ease",
};

// ─── Logout Button Component ───────────────────────────────────────────────
const LogoutButton = () => {
  const { post, processing } = useForm();
  const [hovered, setHovered] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    post('/logout');
  };

  return (
    <button
      onClick={handleLogout}
      disabled={processing}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        width: "100%",
        padding: "0.5rem 0.75rem",
        fontSize: "0.8125rem",
        fontWeight: 500,
        fontFamily: tokens.fontBody,
        border: "none",
        background: "none",
        cursor: processing ? "not-allowed" : "pointer",
        color: hovered ? tokens.destructive : tokens.mutedForeground,
        borderRadius: tokens.radius,
        transition: "all 0.15s ease",
        opacity: processing ? 0.5 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <IconLogout />
      {processing ? "Signing out…" : "Sign Out"}
    </button>
  );
};

// ─── User Dropdown Menu ───────────────────────────────────────────────────
const UserDropdown = ({ user, isAdmin = false, isMobile = false, isCustomer = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const dropdownRef = React.useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.name?.split(" ")[0] || "Account";
  const userEmail = user?.email || "";

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {/* User info header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 0.75rem",
          borderRadius: tokens.radius,
        }}>
          <IconUser />
          <div>
            <div style={{ fontSize: "0.875rem", fontWeight: 500, color: tokens.foreground }}>
              {displayName}
              {isAdmin && (
                <span style={{
                  marginLeft: "0.5rem",
                  padding: "0.125rem 0.375rem",
                  fontSize: "0.625rem",
                  backgroundColor: tokens.adminColor,
                  color: "white",
                  borderRadius: "2px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}>
                  Admin
                </span>
              )}
            </div>
            <div style={{ fontSize: "0.75rem", color: tokens.mutedForeground }}>{userEmail}</div>
          </div>
        </div>
        
        {/* Admin-only link */}
        {isAdmin && (
          <a
            href="/admin"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 0.75rem",
              textDecoration: "none",
              color: tokens.adminColor,
              fontSize: "0.875rem",
              fontWeight: 600,
              fontFamily: tokens.fontBody,
              borderRadius: tokens.radius,
              transition: "background-color 0.15s ease",
            }}
          >
            <IconDashboard />
            Dashboard
          </a>
        )}
        
        {/* Customer links */}
        {isCustomer && (
          <>
            <a
              href="/account/profile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.75rem",
                textDecoration: "none",
                color: tokens.foreground,
                fontSize: "0.875rem",
                fontWeight: 500,
                fontFamily: tokens.fontBody,
                borderRadius: tokens.radius,
                transition: "background-color 0.15s ease",
              }}
            >
              <IconUser />
              My Profile
            </a>
            <a
              href="/account/orders"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.75rem",
                textDecoration: "none",
                color: tokens.foreground,
                fontSize: "0.875rem",
                fontFamily: tokens.fontBody,
                borderRadius: tokens.radius,
                transition: "background-color 0.15s ease",
              }}
            >
              <IconShoppingBag />
              Orders
            </a>
            <a
              href="/account/addresses"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.75rem",
                textDecoration: "none",
                color: tokens.foreground,
                fontSize: "0.875rem",
                fontFamily: tokens.fontBody,
                borderRadius: tokens.radius,
                transition: "background-color 0.15s ease",
              }}
            >
              <IconMapPin />
              Addresses
            </a>
          </>
        )}
        
        <LogoutButton />
      </div>
    );
  }

  // Desktop version
  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
        aria-expanded={isOpen}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.375rem 0.5rem",
          fontSize: "0.875rem",
          fontWeight: 500,
          fontFamily: tokens.fontBody,
          border: isAdmin ? `1px solid ${tokens.adminColor}` : "none",
          background: btnHovered ? tokens.border : "transparent",
          borderRadius: tokens.radius,
          cursor: "pointer",
          color: isAdmin ? tokens.adminColor : tokens.foreground,
          transition: "background-color 0.15s ease",
        }}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
      >
        {isAdmin ? <IconShield /> : <IconUser />}
        <span style={{ maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {displayName}
        </span>
        <IconChevronDown />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "0.5rem",
            minWidth: "200px",
            backgroundColor: tokens.background,
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius,
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
            padding: "0.5rem",
            zIndex: 100,
          }}
        >
          {/* User info header */}
          <div style={{ padding: "0.5rem 0.75rem", borderBottom: `1px solid ${tokens.border}`, marginBottom: "0.5rem" }}>
            <div style={{ fontSize: "0.875rem", fontWeight: 500, color: tokens.foreground, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {displayName}
              {isAdmin && (
                <span style={{
                  padding: "0.125rem 0.375rem",
                  fontSize: "0.625rem",
                  backgroundColor: tokens.adminColor,
                  color: "white",
                  borderRadius: "2px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}>
                  Admin
                </span>
              )}
            </div>
            <div style={{ fontSize: "0.75rem", color: tokens.mutedForeground, marginTop: "2px" }}>
              {userEmail}
            </div>
          </div>

          {/* Admin-only link */}
          {isAdmin && (
            <>
              <a
                href="/admin"
                onClick={() => setIsOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.75rem",
                  textDecoration: "none",
                  color: tokens.adminColor,
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  fontFamily: tokens.fontBody,
                  borderRadius: tokens.radius,
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tokens.border}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <IconDashboard />
                Dashboard
              </a>
              <div style={{ borderTop: `1px solid ${tokens.border}`, margin: "0.5rem 0" }} />
            </>
          )}

          {/* Customer links */}
          {isCustomer && (
            <>
              <a
                href="/account/profile"
                onClick={() => setIsOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.75rem",
                  textDecoration: "none",
                  color: tokens.foreground,
                  fontSize: "0.8125rem",
                  fontFamily: tokens.fontBody,
                  borderRadius: tokens.radius,
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tokens.border}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <IconUser />
                My Profile
              </a>

              <a
                href="/account/orders"
                onClick={() => setIsOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.75rem",
                  textDecoration: "none",
                  color: tokens.foreground,
                  fontSize: "0.8125rem",
                  fontFamily: tokens.fontBody,
                  borderRadius: tokens.radius,
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tokens.border}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <IconShoppingBag />
                My Orders
              </a>

              <a
              href="/account/addresses"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.75rem",
                textDecoration: "none",
                color: tokens.foreground,
                fontSize: "0.875rem",
                fontFamily: tokens.fontBody,
                borderRadius: tokens.radius,
                transition: "background-color 0.15s ease",
              }}
            >
              <IconMapPin />
              Addresses
            </a>
            </>
          )}

          <div style={{ borderTop: `1px solid ${tokens.border}`, marginTop: "0.5rem", paddingTop: "0.5rem" }}>
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
};

// ─── CartButton ───────────────────────────────────────────────────────────────
const CartButton = () => {
  const { getCartCount } = useCart();
  const [hovered, setHovered] = useState(false);
  const count = getCartCount();

  return (
    <a
      href="/cart"
      aria-label="View shopping cart"
      style={{
        ...ghostIconBtn,
        backgroundColor: hovered ? tokens.border : "transparent",
        textDecoration: "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <IconShoppingBag />
      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-2px",
            right: "-2px",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            backgroundColor: tokens.foreground,
            color: tokens.background,
            fontSize: "10px",
            fontWeight: 500,
            fontFamily: tokens.fontBody,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </a>
  );
};

// ─── Header ───────────────────────────────────────────────────────────────────
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Collections", path: "/collections" },
  { name: "New Arrivals", path: "/new-arrivals" },
  { name: "About", path: "/about" },
];

const NavLink = ({ href, children, onClick, style: extraStyle }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onClick={onClick}
      style={{
        fontSize: "0.875rem",
        fontWeight: 500,
        fontFamily: tokens.fontBody,
        textDecoration: "none",
        color: hovered ? tokens.foreground : tokens.mutedForeground,
        transition: "color 0.15s ease",
        ...extraStyle,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuBtnHovered, setMenuBtnHovered] = useState(false);
  const [registerHovered, setRegisterHovered] = useState(false);
  const [loginHovered, setLoginHovered] = useState(false);

  // Pull the authenticated user from Inertia's shared props
  const { props } = usePage();
  const user = props?.auth?.user ?? null;
  
  // Determine user type based on role
  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  useEffect(() => { injectFonts(); }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        borderBottom: `1px solid ${tokens.border}`,
        backgroundColor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        fontFamily: tokens.fontBody,
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
        {/* Main row */}
        <div
          style={{
            display: "flex",
            height: "64px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <a
            href="/"
            style={{ textDecoration: "none", color: tokens.foreground, display: "flex", alignItems: "center" }}
          >
            <img
              src="/images/logo.png"
              alt="CuteBloom Logo"
              style={{ height: "55px", width: "auto", borderRadius: tokens.radius, objectFit: "cover" }}
            />
          </a>

          {/* Desktop nav */}
          <nav className="anita-desktop-nav">
            {navLinks.map((link) => (
              <NavLink key={link.name} href={link.path}>
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {/* Desktop auth links */}
            <div className="anita-desktop-auth">
              {isLoggedIn ? (
                <UserDropdown user={user} isAdmin={isAdmin} isCustomer={isCustomer} />
              ) : (
                <>
                  <a
                    href="/register"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "0.375rem 0.875rem",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      fontFamily: tokens.fontBody,
                      textDecoration: "none",
                      borderRadius: tokens.radius,
                      border: "none",
                      backgroundColor: tokens.foreground,
                      color: tokens.background,
                      opacity: registerHovered ? 0.9 : 1,
                      transition: "opacity 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={() => setRegisterHovered(true)}
                    onMouseLeave={() => setRegisterHovered(false)}
                  >
                    Register
                  </a>
                  <a
                    href="/login"
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      fontFamily: tokens.fontBody,
                      textDecoration: "none",
                      color: loginHovered ? tokens.foreground : tokens.mutedForeground,
                      transition: "color 0.15s ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={() => setLoginHovered(true)}
                    onMouseLeave={() => setLoginHovered(false)}
                  >
                    Sign In
                  </a>
                </>
              )}
            </div>

            <CartButton />

            {/* Hamburger — visible on mobile only */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="anita-mobile-menu-btn"
              style={{
                ...ghostIconBtn,
                backgroundColor: menuBtnHovered ? tokens.border : "transparent",
              }}
              onMouseEnter={() => setMenuBtnHovered(true)}
              onMouseLeave={() => setMenuBtnHovered(false)}
            >
              {isMenuOpen ? <IconX /> : <IconMenu />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {isMenuOpen && (
          <nav
            className="anita-mobile-nav"
            style={{
              borderTop: `1px solid ${tokens.border}`,
              padding: "1rem 0",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                href={link.path}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}

            {/* Mobile auth divider */}
            <div style={{ height: "1px", backgroundColor: tokens.border, margin: "0.25rem 0" }} />

            {/* Mobile auth links */}
            {isLoggedIn ? (
              <div style={{ padding: "0 0.75rem" }}>
                <UserDropdown 
                  user={user}
                  isAdmin={isAdmin}
                  isCustomer={isCustomer}
                  isMobile={true}
                />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <NavLink href="/register" onClick={() => setIsMenuOpen(false)}>
                  Create Account
                </NavLink>
                <NavLink href="/login" onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </NavLink>
              </div>
            )}
          </nav>
        )}
      </div>

      {/* Responsive rules */}
      <style>{`
        .anita-desktop-nav {
          display: none;
        }
        .anita-desktop-auth {
          display: none;
        }
        .anita-mobile-menu-btn {
          display: inline-flex;
        }

        @media (min-width: 768px) {
          .anita-desktop-nav {
            display: flex !important;
            align-items: center;
            gap: 2rem;
          }
          .anita-desktop-auth {
            display: flex !important;
            align-items: center;
            gap: 0.75rem;
            margin-right: 0.5rem;
          }
          .anita-mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

// ─── Export wrapped in CartProvider ──────────────────────────────────────────
const HeaderWithCart = () => (
  <CartProvider>
    <Header />
  </CartProvider>
);

export default HeaderWithCart;