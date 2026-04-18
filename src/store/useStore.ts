"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Language, Product, Theme } from "@/types";

interface AppState {
  cart: CartItem[];
  language: Language;
  theme: Theme;
  isCartOpen: boolean;
  searchQuery: string;

  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  setSearchQuery: (q: string) => void;

  cartTotal: () => number;
  cartCount: () => number;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      language: "en",
      theme: "light",
      isCartOpen: false,
      searchQuery: "",

      addToCart: (product) => {
        const cart = get().cart;
        const existing = cart.find((i) => i.id === product.id);
        if (existing) {
          set({
            cart: cart.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },

      removeFromCart: (id) => {
        set({ cart: get().cart.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        set({
          cart: get().cart.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },

      clearCart: () => set({ cart: [] }),

      setLanguage: (language) => set({ language }),

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
        }
      },

      toggleCart: () => set({ isCartOpen: !get().isCartOpen }),
      setCartOpen: (open) => set({ isCartOpen: open }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      cartTotal: () =>
        get().cart.reduce((sum, i) => sum + i.price * i.quantity, 0),

      cartCount: () =>
        get().cart.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "simba-market-store",
      partialize: (state) => ({
        cart: state.cart,
        language: state.language,
        theme: state.theme,
      }),
    }
  )
);
