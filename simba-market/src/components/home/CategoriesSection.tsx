"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/translations";
import { CATEGORY_IMAGES } from "@/lib/utils";

const CATEGORIES = [
  { key: "fruits",    emoji: "🍊", color: "from-orange-500/80 to-yellow-500/70"  },
  { key: "vegetables",emoji: "🥦", color: "from-green-600/80 to-emerald-500/70"  },
  { key: "beverages", emoji: "🥤", color: "from-blue-600/80 to-cyan-500/70"      },
  { key: "snacks",    emoji: "🍟", color: "from-yellow-500/80 to-orange-500/70"  },
  { key: "household", emoji: "🧹", color: "from-purple-600/80 to-indigo-500/70"  },
  { key: "dairy",     emoji: "🥛", color: "from-sky-500/80 to-blue-400/70"       },
  { key: "meat",      emoji: "🍗", color: "from-red-600/80 to-rose-500/70"       },
  { key: "bakery",    emoji: "🍞", color: "from-amber-500/80 to-yellow-400/70"   },
];

export default function CategoriesSection() {
  const { language } = useStore();

  return (
    <section className="section-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-2">
              Browse
            </p>
            <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              {t(language, "sections.categories")}
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Find exactly what you need
            </p>
          </div>
          <Link
            href="/categories"
            className="flex items-center gap-1.5 text-[#F97316] hover:text-[#EA6C0A]
                       font-semibold text-sm transition-colors duration-200 shrink-0 ml-6 group"
          >
            {t(language, "misc.viewAll")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>

        {/* Category grid — 4 cols on mobile, 8 on desktop */}
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {CATEGORIES.map(({ key, emoji, color }) => (
            <Link
              key={key}
              href={`/categories?cat=${key}`}
              className="group relative overflow-hidden rounded-2xl flex flex-col items-center justify-end
                         transition-all duration-200 hover:scale-[1.04] hover:shadow-md cursor-pointer"
              style={{ aspectRatio: "3/4" }}
            >
              {/* Background */}
              <img
                src={CATEGORY_IMAGES[key]}
                alt={key}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Gradient */}
              <div className={`absolute inset-0 bg-linear-to-t ${color}`} />

              {/* Label */}
              <div className="relative z-10 text-center pb-3 px-1">
                <span className="text-xl sm:text-2xl block mb-1 drop-shadow">{emoji}</span>
                <p className="text-white font-semibold text-[11px] sm:text-xs leading-tight">
                  {t(language, `categories.${key}`)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
