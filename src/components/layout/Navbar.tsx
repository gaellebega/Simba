"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Menu, X, Sun, Moon, Globe, ChevronDown } from "lucide-react";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/translations";
import { Language, Product } from "@/types";
import products from "@/data/products.json";
import { useRouter } from "next/navigation";
import { debounce } from "@/lib/utils";

const LANGS: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "kin", label: "Kinyarwanda" },
];

const NAV_LINKS = (lang: Language) => [
  { label: t(lang, "nav.home"), href: "/" },
  { label: t(lang, "nav.categories"), href: "/categories" },
  { label: t(lang, "nav.deals"), href: "/deals" },
];

export default function Navbar() {
  const { language, theme, toggleCart, setLanguage, setTheme, cartCount } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const count = cartCount();

  /* scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* sync dark mode class */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  /* debounced suggestions */
  const debouncedSearch = debounce((q: string) => {
    if (!q.trim()) { setSuggestions([]); return; }
    const hits = (products as Product[])
      .filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.category.toLowerCase().includes(q.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(q.toLowerCase()))
      )
      .slice(0, 5);
    setSuggestions(hits);
  }, 200);

  useEffect(() => { debouncedSearch(query); }, [query]);

  /* close suggestions on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setSuggestions([]);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* close lang menu on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = document.getElementById("lang-menu-container");
      if (el && !el.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setSuggestions([]);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? "shadow-md" : ""}`}
      style={{
        backgroundColor: "var(--background)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* ── Announcement bar ── */}
      <div className="bg-[#F97316] text-white text-xs py-1.5 text-center font-medium tracking-wide hidden sm:block">
        🦁&nbsp; Free delivery on orders above 10,000 RWF &nbsp;•&nbsp; Shop Fresh, Shop Smart!
      </div>

      {/* ── Main nav ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-full bg-orange-50 border-2 border-orange-200 flex items-center justify-center text-xl leading-none select-none">
              🦁
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-[15px] font-bold text-[#F97316]">Simba</span>
              <span className="text-[10px] font-medium tracking-wide" style={{ color: "var(--text-muted)" }}>
                Smart Market
              </span>
            </div>
          </Link>

          {/* Search — grows to fill available space */}
          <div className="flex-1 max-w-xl relative" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={t(language, "nav.search")}
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl text-sm outline-none
                             focus:ring-2 focus:ring-[#F97316]/40 transition-all duration-200"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1.5px solid var(--border)",
                    color: "var(--text)",
                  }}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => { setQuery(""); setSuggestions([]); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
                  </button>
                )}
              </div>
            </form>

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-1.5 rounded-2xl shadow-lg z-50 overflow-hidden border animate-fadeIn"
                style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
              >
                {suggestions.map(product => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={() => { setSuggestions([]); setQuery(""); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors duration-150"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-9 h-9 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                        {product.name}
                      </p>
                      <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>
                        {product.category} · {product.price.toLocaleString()} RWF
                      </p>
                    </div>
                  </Link>
                ))}
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => setSuggestions([])}
                  className="flex items-center gap-2 px-4 py-2.5 text-[#F97316] text-sm font-medium
                             bg-orange-50/70 dark:bg-orange-950/20 hover:bg-orange-100 transition-colors duration-150"
                >
                  <Search className="w-3.5 h-3.5" />
                  See all results for &ldquo;{query}&rdquo;
                </Link>
              </div>
            )}
          </div>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS(language).map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm font-medium rounded-xl hover:bg-orange-50 hover:text-[#F97316]
                           transition-all duration-200"
                style={{ color: "var(--text)" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-1 ml-auto lg:ml-0">

            {/* Language picker */}
            <div id="lang-menu-container" className="relative hidden md:block">
              <button
                onClick={() => setLangOpen(v => !v)}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-sm font-medium
                           hover:bg-[#F8FAFC] dark:hover:bg-slate-800 transition-all duration-200"
                style={{ color: "var(--text)" }}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden xl:inline uppercase text-xs font-semibold">{language}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
              </button>

              {langOpen && (
                <div
                  className="absolute right-0 top-full mt-1.5 rounded-2xl shadow-lg border z-50 overflow-hidden w-40 animate-fadeIn"
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
                >
                  {LANGS.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150
                        ${language === lang.code
                          ? "bg-orange-50 dark:bg-orange-950/30 text-[#F97316] font-semibold"
                          : "hover:bg-[#F8FAFC] dark:hover:bg-slate-800"
                        }`}
                      style={{ color: language === lang.code ? "#F97316" : "var(--text)" }}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-slate-800 transition-all duration-200"
              style={{ color: "var(--text)" }}
              aria-label="Toggle theme"
            >
              {theme === "light"
                ? <Moon className="w-4 h-4" />
                : <Sun className="w-4 h-4" />
              }
            </button>

            {/* Cart button */}
            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2 pl-2.5 pr-3.5 py-2 rounded-xl
                         bg-[#F97316] hover:bg-[#EA6C0A] text-white font-semibold text-sm
                         transition-all duration-200 hover:shadow-md hover:shadow-orange-200 active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">{t(language, "nav.cart")}</span>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1
                                 bg-white text-[#F97316] text-[10px] font-black rounded-full
                                 flex items-center justify-center leading-none border border-orange-200">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden p-2 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-slate-800 transition-all duration-200"
              style={{ color: "var(--text)" }}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div
            className="lg:hidden pt-3 pb-4 border-t animate-fadeIn"
            style={{ borderColor: "var(--border)" }}
          >
            <nav className="flex flex-col gap-0.5 mb-3">
              {NAV_LINKS(language).map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium rounded-xl hover:bg-orange-50 hover:text-[#F97316] transition-colors"
                  style={{ color: "var(--text)" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Language pills in mobile menu */}
            <div className="flex gap-2 px-4">
              {LANGS.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code); setMobileOpen(false); }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200
                    ${language === lang.code
                      ? "bg-[#F97316] text-white border-[#F97316]"
                      : "border-slate-200 dark:border-slate-700 hover:border-[#F97316] hover:text-[#F97316]"
                    }`}
                  style={{ color: language === lang.code ? "white" : "var(--text-muted)" }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
