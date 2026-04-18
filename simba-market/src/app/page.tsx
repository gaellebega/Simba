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
  const cartIds = cart.map(i => i.id);

  const trending    = getTrendingProducts(allProducts, 8);
  const recommended = getRecommendedProducts(cartIds, allProducts, 8);
  const deals       = allProducts.filter(p => p.badge === "sale").slice(0, 8);
  const newArrivals = allProducts.filter(p => p.badge === "new").slice(0, 4);

  return (
    <>
      <HeroSection />

      {/* Categories — alt background */}
      <CategoriesSection />

      {/* Trending — white */}
      <ProductsSection
        title={t(language, "sections.trending")}
        subtitle="Most loved products this week"
        accent="Trending"
        products={trending}
        viewAllHref="/categories"
        viewAllLabel={t(language, "misc.viewAll")}
      />

      {/* Promo banner — sits between sections */}
      <PromoBanner />

      {/* Deals — alt background */}
      <ProductsSection
        alt
        title={t(language, "sections.deals")}
        subtitle="Save big on quality products"
        accent="Limited Offers"
        products={deals}
        viewAllHref="/deals"
        viewAllLabel={t(language, "misc.viewAll")}
      />

      {/* Recommended — white */}
      <ProductsSection
        title={t(language, "sections.recommended")}
        subtitle="Handpicked just for you"
        accent="For You"
        products={recommended.length > 0 ? recommended : allProducts.slice(0, 8)}
        viewAllHref="/categories"
        viewAllLabel={t(language, "misc.viewAll")}
      />

      {/* New arrivals — alt background */}
      {newArrivals.length > 0 && (
        <ProductsSection
          alt
          title="New Arrivals"
          subtitle="Fresh additions to our collection"
          accent="Just In"
          products={newArrivals}
        />
      )}

      {/* Newsletter */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div
          className="max-w-2xl mx-auto text-center px-8 py-12 rounded-2xl"
          style={{ background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)" }}
        >
          <p className="text-orange-100 text-xs font-semibold uppercase tracking-widest mb-3">
            Stay Updated
          </p>
          <h3 className="text-white font-bold text-2xl sm:text-3xl mb-2">
            Get the Best Deals First
          </h3>
          <p className="text-orange-100 mb-8 text-sm sm:text-base">
            Subscribe for exclusive offers, new arrivals, and weekly picks.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email..."
              className="flex-1 px-4 py-3 rounded-xl text-[#0F172A] text-sm outline-none
                         focus:ring-2 focus:ring-white/50 transition-all"
            />
            <button
              className="bg-white text-[#F97316] font-bold px-6 py-3 rounded-xl
                         hover:bg-orange-50 transition-colors text-sm whitespace-nowrap"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
