"use client";
import { useEffect } from "react";
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/translations";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { cart, isCartOpen, setCartOpen, removeFromCart, updateQuantity, cartTotal, language } = useStore();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const total = cartTotal();

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={() => setCartOpen(false)} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col animate-slideInRight shadow-2xl"
        style={{ backgroundColor: "var(--background)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-orange-500" />
            <h2 className="font-bold text-lg" style={{ color: "var(--text)" }}>
              {t(language, "cart.title")}
            </h2>
            {cart.length > 0 && (
              <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)} {t(language, "cart.items")}
              </span>
            )}
          </div>
          <button onClick={() => setCartOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ color: "var(--text)" }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-24 h-24 rounded-full bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-orange-300" />
              </div>
              <p className="font-semibold text-lg" style={{ color: "var(--text)" }}>
                {t(language, "cart.empty")}
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Add some products to get started
              </p>
              <Link href="/categories"
                onClick={() => setCartOpen(false)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm">
                {t(language, "cart.continueShopping")}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl border hover:border-orange-200 transition-colors"
                  style={{ borderColor: "var(--border)" }}>
                  <Link href={`/product/${item.id}`} onClick={() => setCartOpen(false)}>
                    <img src={item.image} alt={item.name}
                      className="w-18 h-18 w-[72px] h-[72px] rounded-lg object-cover shrink-0 hover:opacity-90 transition-opacity" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.id}`} onClick={() => setCartOpen(false)}>
                      <p className="text-sm font-semibold leading-snug truncate hover:text-orange-500 transition-colors"
                        style={{ color: "var(--text)" }}>
                        {language === "kin" ? item.nameKin : language === "fr" ? item.nameFr : item.name}
                      </p>
                    </Link>
                    {item.weight && (
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{item.weight}</p>
                    )}
                    <p className="text-orange-500 font-bold text-sm mt-1">
                      {formatPrice(item.price)} RWF
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border flex items-center justify-center hover:border-orange-400 hover:text-orange-500 transition-colors"
                          style={{ borderColor: "var(--border)", color: "var(--text)" }}>
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold" style={{ color: "var(--text)" }}>
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t px-6 py-4 space-y-3" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between">
              <span className="font-medium" style={{ color: "var(--text-muted)" }}>
                {t(language, "cart.total")}
              </span>
              <span className="font-bold text-xl text-orange-500">
                {formatPrice(total)} RWF
              </span>
            </div>
            <Link href="/checkout"
              onClick={() => setCartOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-full transition-all hover:shadow-lg hover:shadow-orange-200 text-sm">
              {t(language, "cart.checkout")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button onClick={() => setCartOpen(false)}
              className="w-full text-center text-sm py-2 rounded-full border hover:border-orange-400 hover:text-orange-500 transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
              {t(language, "cart.continueShopping")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
