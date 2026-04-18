"use client";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/translations";
import { CATEGORY_IMAGES } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

const CATEGORIES = [
  { key: "fruits", emoji: "🍊", color: "from-orange-400 to-yellow-400" },
  { key: "vegetables", emoji: "🥦", color: "from-green-400 to-emerald-500" },
  { key: "beverages", emoji: "🥤", color: "from-blue-400 to-cyan-500" },
  { key: "snacks", emoji: "🍟", color: "from-yellow-400 to-orange-400" },
  { key: "household", emoji: "🧹", color: "from-purple-400 to-indigo-500" },
  { key: "dairy", emoji: "🥛", color: "from-sky-300 to-blue-400" },
  { key: "meat", emoji: "🍗", color: "from-red-400 to-rose-500" },
  { key: "bakery", emoji: "🍞", color: "from-amber-400 to-yellow-500" },
];

export default function CategoriesSection() {
  const { language } = useStore();

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black" style={{ color: "var(--text)" }}>
            {t(language, "sections.categories")}
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Find exactly what you need
          </p>
        </div>
        <Link href="/categories"
          className="flex items-center gap-1 text-orange-500 hover:text-orange-600 font-semibold text-sm transition-colors">
          {t(language, "misc.viewAll")}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {CATEGORIES.map(({ key, emoji, color }) => (
          <Link key={key} href={`/categories?cat=${key}`}
            className="group relative overflow-hidden rounded-2xl aspect-square flex flex-col items-center justify-end p-3 sm:p-4 cursor-pointer hover:scale-105 transition-transform duration-200">
            {/* Background image */}
            <img
              src={CATEGORY_IMAGES[key]}
              alt={key}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${color} opacity-70 group-hover:opacity-80 transition-opacity`} />

            {/* Content */}
            <div className="relative z-10 text-center">
              <span className="text-2xl sm:text-3xl block mb-1">{emoji}</span>
              <p className="text-white font-bold text-xs sm:text-sm leading-tight">
                {t(language, `categories.${key}`)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
