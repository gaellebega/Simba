"use client";
import Link from "next/link";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { Product } from "@/types";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/translations";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  highlightQuery?: string;
}

const BADGE_CONFIG: Record<string, { bg: string; text: string }> = {
  new:      { bg: "bg-[#2563EB]",  text: "text-white" },
  sale:     { bg: "bg-red-500",    text: "text-white" },
  trending: { bg: "bg-[#F97316]",  text: "text-white" },
  organic:  { bg: "bg-[#22C55E]",  text: "text-white" },
};

function HighlightText({ text, query }: { text: string; query?: string }) {
  if (!query?.trim()) return <>{text}</>;
  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

export default function ProductCard({ product, highlightQuery }: Props) {
  const { addToCart, language } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(t(language, "misc.addedToCart"), {
      icon: "🛒",
      style: {
        borderRadius: "12px",
        background: "#F97316",
        color: "#fff",
        fontWeight: "600",
        fontSize: "14px",
      },
    });
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const displayName =
    language === "kin" ? product.nameKin :
    language === "fr"  ? product.nameFr  :
    product.name;

  const badge = product.badge ? BADGE_CONFIG[product.badge] : null;

  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <div
        className="product-card rounded-2xl overflow-hidden border group cursor-pointer h-full flex flex-col bg-white dark:bg-slate-900"
        style={{ borderColor: "var(--border)" }}
      >
        {/* ── Image ── */}
        <div className="relative overflow-hidden bg-[#F8FAFC] dark:bg-slate-800" style={{ aspectRatio: "1/1" }}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Badge */}
          {badge && (
            <span className={`absolute top-2.5 left-2.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${badge.bg} ${badge.text} shadow-sm`}>
              {t(language, `badges.${product.badge}`)}
              {product.badge === "sale" && discount ? ` −${discount}%` : ""}
            </span>
          )}

          {/* Wishlist — visible on hover */}
          <button
            onClick={e => e.preventDefault()}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90
                       flex items-center justify-center opacity-0 group-hover:opacity-100
                       hover:bg-red-50 hover:text-red-500 transition-all duration-200 shadow-sm"
            style={{ color: "var(--text-muted)" }}
            aria-label="Add to wishlist"
          >
            <Heart className="w-3.5 h-3.5" />
          </button>

          {/* Out-of-stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-[#0F172A] font-semibold text-xs px-3 py-1.5 rounded-full">
                {t(language, "product.outOfStock")}
              </span>
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="p-4 flex flex-col flex-1 gap-2">

          {/* Category label */}
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#F97316]">
            {t(language, `categories.${product.category}`)}
          </p>

          {/* Product name */}
          <h3
            className="text-sm font-medium leading-snug line-clamp-2 flex-1"
            style={{ color: "var(--text)" }}
          >
            <HighlightText text={displayName} query={highlightQuery} />
          </h3>

          {/* Weight */}
          {product.weight && (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {product.weight}
            </p>
          )}

          {/* Star rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-slate-200 fill-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              ({product.reviews})
            </span>
          </div>

          {/* Price row */}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[#22C55E]">
              {formatPrice(product.price)}
              <span className="text-xs font-normal ml-0.5">RWF</span>
            </span>
            {product.originalPrice && (
              <span className="text-xs line-through" style={{ color: "var(--text-muted)" }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Add to cart — full width */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="mt-auto w-full flex items-center justify-center gap-2
                       bg-[#F97316] hover:bg-[#EA6C0A] disabled:bg-slate-200 disabled:cursor-not-allowed
                       text-white disabled:text-slate-400 text-xs font-semibold
                       py-2.5 rounded-xl transition-all duration-200
                       hover:shadow-md hover:shadow-orange-200/60 active:scale-[0.98]"
          >
            <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
            {t(language, "product.addToCart")}
          </button>
        </div>
      </div>
    </Link>
  );
}
