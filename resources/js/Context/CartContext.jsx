import React, {
  useState,
  useReducer,
  useEffect,
  useContext,
  createContext,
} from "react";

// ─── Cart Context ─────────────────────────────────────────────────────────────
export const CART_STORAGE_KEY = "anita-clothing-cart";

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
      // First clear existing items
      dispatch({ type: "CLEAR_CART" });
      // Then add all items one by one
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

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}

export default CartContext;