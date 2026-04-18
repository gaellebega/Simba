"use client";
import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import productsData from "@/data/products.json";
import { Product, Category } from "@/types";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/translations";
import ProductCard from "@/components/product/ProductCard";
import { debounce } from "@/lib/utils";

const allProducts = productsData as Product[];
const CATEGORIES: Category[] = ["fruits", "vegetables", "beverages", "snacks", "household", "dairy", "meat", "bakery"];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useStore();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
    setInputValue(q);
  }, [searchParams]);

  const debouncedSetQuery = useMemo(
    () => debounce((val: unknown) => {
      setQuery(val as string);
      if ((val as string).trim()) {
        router.replace(`/search?q=${encodeURIComponent(val as string)}`);
      }
    }, 300),
    [router]
  );

  const handleInputChange = (val: string) => {
    setInputValue(val);
    debouncedSetQuery(val);
  };

  const results = useMemo(() => {
    let filtered = allProducts;

    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    filtered = filtered.filter((p) => p.price <= maxPrice);

    return filtered;
  }, [query, selectedCategory, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search input */}
      <div className="relative max-w-2xl mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={t(language, "search.placeholder")}
          className="w-full pl-12 pr-12 py-4 rounded-2xl text-base outline-none focus:ring-2 focus:ring-orange-400 transition-all"
          style={{
            backgroundColor: "var(--surface)",
            border: "1.5px solid var(--border)",
            color: "var(--text)",
          }}
          autoFocus
        />
        {inputValue && (
          <button onClick={() => { setInputValue(""); setQuery(""); router.replace("/search"); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:text-orange-500 transition-colors"
            style={{ color: "var(--text-muted)" }}>
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Results count + filters */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {query.trim() ? (
            <>
              <span className="font-bold text-orange-500">{results.length}</span> {t(language, "search.results")} for
              {" "}<span className="font-semibold" style={{ color: "var(--text)" }}>&ldquo;{query}&rdquo;</span>
            </>
          ) : (
            <>Showing all <span className="font-bold text-orange-500">{results.length}</span> products</>
          )}
        </p>

        <button onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium hover:border-orange-400 hover:text-orange-500 transition-colors"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)", backgroundColor: "var(--background)" }}>
          <SlidersHorizontal className="w-4 h-4" />
          {t(language, "search.filters")}
        </button>
      </div>

      {/* Filters panel */}
      {filtersOpen && (
        <div className="mb-6 p-4 rounded-2xl border animate-fadeIn" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>{t(language, "search.category")}</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${!selectedCategory ? "bg-orange-500 text-white border-orange-500" : "hover:border-orange-400"}`}
                  style={!selectedCategory ? {} : { borderColor: "var(--border)", color: "var(--text-muted)" }}>
                  {t(language, "search.allCategories")}
                </button>
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${selectedCategory === cat ? "bg-orange-500 text-white border-orange-500" : "hover:border-orange-400"}`}
                    style={selectedCategory === cat ? {} : { borderColor: "var(--border)", color: "var(--text-muted)" }}>
                    {t(language, `categories.${cat}`)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>
                {t(language, "search.priceRange")}: <span className="text-orange-500">{maxPrice.toLocaleString()} RWF</span>
              </h3>
              <input type="range" min={500} max={10000} step={500} value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-orange-500" />
              <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                <span>500 RWF</span><span>10,000 RWF</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-7xl mb-6 block">🔍</span>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>{t(language, "search.noResults")}</h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Try different keywords or browse all categories
          </p>
          <a href="/categories"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full transition-colors text-sm">
            Browse All Products
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} highlightQuery={query} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="skeleton h-14 rounded-2xl max-w-2xl mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
              <div className="skeleton aspect-square" />
              <div className="p-4 space-y-2">
                <div className="skeleton h-4 rounded w-3/4" />
                <div className="skeleton h-4 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
