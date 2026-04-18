"use client";
import Link from "next/link";
import { ShoppingBag, ChevronRight, Truck, Shield, Clock } from "lucide-react";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/translations";

export default function HeroSection() {
  const { language } = useStore();

  return (
    <section className="relative overflow-hidden">
      {/* Main hero */}
      <div className="relative min-h-[500px] sm:min-h-[580px] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&h=700&fit=crop"
            alt="Fresh grocery market"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-300 text-sm font-medium px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              🦁 Simba Smart Market — Kigali
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              {t(language, "hero.title")}
              <span className="block text-orange-400 mt-1">to Your Door 🚀</span>
            </h1>

            <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              {t(language, "hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/categories"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-7 py-3.5 rounded-full transition-all hover:shadow-xl hover:shadow-orange-500/30 text-sm sm:text-base active:scale-95">
                <ShoppingBag className="w-5 h-5" />
                {t(language, "hero.cta")}
              </Link>
              <Link href="/deals"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-full border border-white/30 transition-all text-sm sm:text-base backdrop-blur-sm">
                {t(language, "hero.secondary")}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8">
              {[
                { icon: Truck, text: "Free delivery 10k+ RWF" },
                { icon: Shield, text: "100% Fresh guarantee" },
                { icon: Clock, text: "Fast 2hr delivery" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                  <Icon className="w-4 h-4 text-orange-400" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-orange-400">
            {[
              { value: "500+", label: "Products" },
              { value: "10k+", label: "Happy Customers" },
              { value: "8", label: "Categories" },
              { value: "2hr", label: "Avg Delivery" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center py-4 px-2">
                <p className="text-2xl sm:text-3xl font-black">{value}</p>
                <p className="text-orange-100 text-xs sm:text-sm mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
