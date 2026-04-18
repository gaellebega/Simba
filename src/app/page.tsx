"use client";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/translations";
import { getTrendingProducts, getRecommendedProducts } from "@/lib/utils";
import productsData from "@/data/products.json";
import { Product } from "@/types";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import ProductsSection from "@/components/home/ProductsSection";
import PromoBanner from "@/components/home/PromoBanner";

const allProducts = productsData as Product[];

export default function HomePage() {
  const { language, cart } = useStore();
  const cartIds = cart.map((i) => i.id);

  const trending = getTrendingProducts(allProducts, 8);
  const recommended = getRecommendedProducts(cartIds, allProducts, 8);
  const deals = allProducts.filter((p) => p.badge === "sale").slice(0, 8);
  const newArrivals = allProducts.filter((p) => p.badge === "new").slice(0, 4);

  return (
    <>
      <HeroSection />
      <CategoriesSection />

      <ProductsSection
        title={t(language, "sections.trending")}
        subtitle="Most loved products this week"
        products={trending}
        viewAllHref="/categories"
        viewAllLabel={t(language, "misc.viewAll")}
        emoji="🔥"
      />

      <PromoBanner />

      <ProductsSection
        title={t(language, "sections.deals")}
        subtitle="Save big on quality products"
        products={deals}
        viewAllHref="/deals"
        viewAllLabel={t(language, "misc.viewAll")}
        emoji="🏷️"
      />

      <ProductsSection
        title={t(language, "sections.recommended")}
        subtitle="Handpicked just for you"
        products={recommended.length > 0 ? recommended : allProducts.slice(0, 8)}
        viewAllHref="/categories"
        viewAllLabel={t(language, "misc.viewAll")}
        emoji="⭐"
      />

      {newArrivals.length > 0 && (
        <ProductsSection
          title="New Arrivals"
          subtitle="Fresh additions to our collection"
          products={newArrivals}
          emoji="✨"
        />
      )}

      {/* Newsletter */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center p-8 sm:p-12 rounded-3xl"
          style={{ background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)" }}>
          <span className="text-3xl mb-3 block">📬</span>
          <h3 className="text-white font-black text-2xl sm:text-3xl mb-3">
            Stay in the Loop
          </h3>
          <p className="text-orange-100 mb-6 text-sm sm:text-base">
            Subscribe for exclusive deals, new arrivals, and weekly fresh picks.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email..."
              className="flex-1 px-4 py-3 rounded-full text-gray-800 text-sm outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="bg-white text-orange-600 font-bold px-6 py-3 rounded-full hover:bg-orange-50 transition-colors text-sm whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
