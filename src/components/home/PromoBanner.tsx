"use client";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/translations";
import { Tag, Zap, Star } from "lucide-react";

export default function PromoBanner() {
  const { language } = useStore();

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Main promo */}
        <div className="sm:col-span-2 relative overflow-hidden rounded-2xl min-h-[200px] flex items-center p-8">
          <img
            src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&h=400&fit=crop"
            alt="Fresh produce deals"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 to-orange-500/60" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              <Zap className="w-3.5 h-3.5" />
              LIMITED TIME OFFER
            </div>
            <h3 className="text-white font-black text-2xl sm:text-3xl mb-2">
              {t(language, "sections.deals")}
            </h3>
            <p className="text-white/80 text-sm mb-4">Up to 30% off on selected fresh products</p>
            <Link href="/deals"
              className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-5 py-2.5 rounded-full hover:bg-orange-50 transition-colors text-sm">
              <Tag className="w-4 h-4" />
              Shop Deals
            </Link>
          </div>
        </div>

        {/* Side promos */}
        <div className="flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-2xl flex-1 min-h-[90px] flex items-center p-5">
            <img
              src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=200&fit=crop"
              alt="Fresh fruits"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/85 to-green-500/60" />
            <div className="relative z-10">
              <p className="text-white text-xs font-medium mb-0.5">🍊 Fresh Arrivals</p>
              <p className="text-white font-black text-lg">Exotic Fruits</p>
              <p className="text-white/80 text-xs">Starting from 1,000 RWF</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl flex-1 min-h-[90px] flex items-center p-5">
            <img
              src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=200&fit=crop"
              alt="Fresh vegetables"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/85 to-emerald-600/60" />
            <div className="relative z-10">
              <p className="text-white text-xs font-medium mb-0.5">🥦 Daily Fresh</p>
              <p className="text-white font-black text-lg">Organic Veggies</p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                <span className="text-white/80 text-xs ml-1">Top rated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
