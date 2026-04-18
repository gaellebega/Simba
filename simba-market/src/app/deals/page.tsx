"use client";
import productsData from "@/data/products.json";
import { Product } from "@/types";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/translations";
import ProductCard from "@/components/product/ProductCard";
import { Tag, Zap } from "lucide-react";

const allProducts = productsData as Product[];

export default function DealsPage() {
  const { language } = useStore();
  const saleProducts = allProducts.filter((p) => p.badge === "sale" || p.originalPrice);
  const trending = allProducts.filter((p) => p.badge === "trending");

  return (
    <div>
      {/* Hero */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&h=400&fit=crop"
          alt="Deals"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-red-600/85 to-orange-500/70 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-full"><Zap className="w-6 h-6 text-white" /></div>
              <span className="text-white/90 font-medium text-sm uppercase tracking-widest">Limited Time</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">{t(language, "sections.deals")}</h1>
            <p className="text-white/80 mt-1">{saleProducts.length} products on sale right now!</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Sale products */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Tag className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-black" style={{ color: "var(--text)" }}>🏷️ On Sale Now</h2>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
              Up to 30% OFF
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {saleProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* Trending */}
        {trending.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-black" style={{ color: "var(--text)" }}>🔥 Trending Products</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {trending.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* Promo banner */}
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center"
          style={{ background: "linear-gradient(135deg, #F97316 0%, #DC2626 100%)" }}>
          <h2 className="text-white font-black text-3xl sm:text-4xl mb-3">🎉 Special Weekend Offer!</h2>
          <p className="text-white/80 text-lg mb-6">Free delivery on ALL orders this weekend. No minimum!</p>
          <a href="/categories"
            className="inline-block bg-white text-orange-600 font-black px-8 py-3.5 rounded-full hover:bg-orange-50 transition-colors text-base">
            Shop All Products
          </a>
        </div>
      </div>
    </div>
  );
}
