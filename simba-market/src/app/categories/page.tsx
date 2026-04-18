"use client";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, X, SlidersHorizontal } from "lucide-react";
import productsData from "@/data/products.json";
import { Product, Category } from "@/types";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/translations";
import ProductCard from "@/components/product/ProductCard";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import { CATEGORY_IMAGES } from "@/lib/utils";

const allProducts = productsData as Product[];

const CATEGORIES: Category[] = ["fruits", "vegetables", "beverages", "snacks", "household", "dairy", "meat", "bakery"];
const CATEGORY_EMOJIS: Record<Category, string> = {
  fruits: "🍊", vegetables: "🥦", beverages: "🥤", snacks: "🍟",
  household: "🧹", dairy: "🥛", meat: "🍗", bakery: "🍞",
};

function CategoriesContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") as Category | null;
  const { language } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialCat);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<string>("default");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = allProducts;
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    result = result.filter((p) => p.price <= maxPrice);

    switch (sortBy) {
      case "price-asc": return [...result].sort((a, b) => a.price - b.price);
      case "price-desc": return [...result].sort((a, b) => b.price - a.price);
      case "rating": return [...result].sort((a, b) => b.rating - a.rating);
      case "name": return [...result].sort((a, b) => a.name.localeCompare(b.name));
      default: return result;
    }
  }, [selectedCategory, maxPrice, sortBy]);

  const heroImage = selectedCategory ? CATEGORY_IMAGES[selectedCategory] : CATEGORY_IMAGES.fruits;

  return (
    <div>
      {/* Category hero */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img src={heroImage} alt="category" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 to-black/30 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              {selectedCategory
                ? `${CATEGORY_EMOJIS[selectedCategory]} ${t(language, `categories.${selectedCategory}`)}`
                : `🛍️ ${t(language, "nav.categories")}`}
            </h1>
            <p className="text-white/70 mt-2 text-sm sm:text-base">
              {filtered.length} {t(language, "search.results")}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${!selectedCategory
              ? "bg-orange-500 text-white shadow-md shadow-orange-200"
              : "border hover:border-orange-400 hover:text-orange-500"}`}
            style={!selectedCategory ? {} : { borderColor: "var(--border)", color: "var(--text-muted)", backgroundColor: "var(--background)" }}>
            {t(language, "search.allCategories")}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedCategory === cat
                ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                : "border hover:border-orange-400 hover:text-orange-500"}`}
              style={selectedCategory === cat ? {} : { borderColor: "var(--border)", color: "var(--text-muted)", backgroundColor: "var(--background)" }}>
              {CATEGORY_EMOJIS[cat]}
              {t(language, `categories.${cat}`)}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter sidebar (desktop) */}
          <aside className="hidden lg:block w-56 shrink-0">
            <FilterPanel
              maxPrice={maxPrice} setMaxPrice={setMaxPrice}
              sortBy={sortBy} setSortBy={setSortBy}
            />
          </aside>

          {/* Mobile filter toggle */}
          <div className="lg:hidden">
            <button onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium hover:border-orange-400 hover:text-orange-500 transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)", backgroundColor: "var(--background)" }}>
              <SlidersHorizontal className="w-4 h-4" />
              {t(language, "search.filters")}
            </button>

            {filtersOpen && (
              <>
                <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setFiltersOpen(false)} />
                <div className="fixed bottom-0 left-0 right-0 z-50 p-6 rounded-t-3xl shadow-2xl animate-slideInRight"
                  style={{ backgroundColor: "var(--background)" }}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg" style={{ color: "var(--text)" }}>{t(language, "search.filters")}</h3>
                    <button onClick={() => setFiltersOpen(false)}><X className="w-5 h-5" style={{ color: "var(--text-muted)" }} /></button>
                  </div>
                  <FilterPanel maxPrice={maxPrice} setMaxPrice={setMaxPrice} sortBy={sortBy} setSortBy={setSortBy} />
                </div>
              </>
            )}
          </div>

          {/* Products grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-6xl mb-4 block">🔍</span>
                <p className="font-semibold text-lg mb-2" style={{ color: "var(--text)" }}>No products found</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  maxPrice, setMaxPrice, sortBy, setSortBy,
}: {
  maxPrice: number; setMaxPrice: (v: number) => void;
  sortBy: string; setSortBy: (v: string) => void;
}) {
  const prices = [2000, 3000, 5000, 10000];
  const sorts = [
    { value: "default", label: "Default" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
    { value: "name", label: "Name A-Z" },
  ];

  return (
    <div className="space-y-6 p-4 rounded-2xl border" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
      <div>
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
          <Filter className="w-4 h-4 text-orange-500" /> Sort By
        </h3>
        <div className="space-y-1.5">
          {sorts.map((s) => (
            <button key={s.value} onClick={() => setSortBy(s.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${sortBy === s.value
                ? "bg-orange-50 dark:bg-orange-950/30 text-orange-600 font-semibold"
                : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
              style={{ color: sortBy === s.value ? "#F97316" : "var(--text-muted)" }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>
          Max Price: <span className="text-orange-500">{maxPrice.toLocaleString()} RWF</span>
        </h3>
        <input type="range" min={500} max={10000} step={500} value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-orange-500" />
        <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          <span>500 RWF</span><span>10,000 RWF</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {prices.map((p) => (
            <button key={p} onClick={() => setMaxPrice(p)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${maxPrice === p
                ? "bg-orange-500 text-white border-orange-500"
                : "hover:border-orange-400 hover:text-orange-500"}`}
              style={maxPrice !== p ? { borderColor: "var(--border)", color: "var(--text-muted)" } : {}}>
              {(p / 1000).toFixed(0)}k
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><SkeletonGrid count={12} /></div>}>
      <CategoriesContent />
    </Suspense>
  );
}
