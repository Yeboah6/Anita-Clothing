import React, {
  useState,
  useReducer,
  useEffect,
  useContext,
  createContext,
} from "react";

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
  border: "#e6e6e6",
  radius: "4px",
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

// ─── Icons (inline SVG replacing lucide-react) ───────────────────────────────
const IconShoppingBag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const IconMenu = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconX = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
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

// ─── CartButton ───────────────────────────────────────────────────────────────
const CartButton = () => {
  const { toggleCart, getCartCount } = useCart();
  const [hovered, setHovered] = useState(false);
  const count = getCartCount();

  return (
    <button
      onClick={toggleCart}
      aria-label="Open shopping bag"
      style={{
        ...ghostIconBtn,
        backgroundColor: hovered ? tokens.border : "transparent",
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
    </button>
  );
};

// ─── Header ───────────────────────────────────────────────────────────────────
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Collections", path: "/collections" },
  { name: "New Arrivals", path: "/new-arrivals" },
  { name: "About", path: "/about" },
];

const NavLink = ({ href, children, onClick }) => {
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

  useEffect(() => { injectFonts(); }, []);

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
            <span
              style={{
                fontFamily: tokens.fontDisplay,
                fontSize: "clamp(1.5rem, 3vw, 1.875rem)",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: tokens.foreground,
              }}
            >
              ANITA
            </span>
          </a>

          {/* Desktop nav */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
            }}
            className="anita-desktop-nav"
          >
            {navLinks.map((link) => (
              <NavLink key={link.name} href={link.path}>
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <CartButton />

            {/* Hamburger — visible on mobile only via inline media trick */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              style={{
                ...ghostIconBtn,
                backgroundColor: menuBtnHovered ? tokens.border : "transparent",
              }}
              onMouseEnter={() => setMenuBtnHovered(true)}
              onMouseLeave={() => setMenuBtnHovered(false)}
              className="anita-mobile-menu-btn"
            >
              {isMenuOpen ? <IconX /> : <IconMenu />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {isMenuOpen && (
          <nav
            style={{
              borderTop: `1px solid ${tokens.border}`,
              padding: "1rem 0",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
            className="anita-mobile-nav"
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
          </nav>
        )}
      </div>

      {/* Responsive rules */}
      <style>{`
        .anita-desktop-nav { display: none; }
        .anita-mobile-menu-btn { display: inline-flex; }
        .anita-mobile-nav { display: flex; }
        @media (min-width: 768px) {
          .anita-desktop-nav { display: flex; }
          .anita-mobile-menu-btn { display: none; }
          .anita-mobile-nav { display: none; }
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