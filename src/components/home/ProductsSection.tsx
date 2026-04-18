"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types";

interface Props {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
  emoji?: string;
}

export default function ProductsSection({ title, subtitle, products, viewAllHref, viewAllLabel, emoji }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-2" style={{ color: "var(--text)" }}>
            {emoji && <span>{emoji}</span>}
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{subtitle}</p>
          )}
        </div>
        {viewAllHref && (
          <Link href={viewAllHref}
            className="flex items-center gap-1 text-orange-500 hover:text-orange-600 font-semibold text-sm transition-colors whitespace-nowrap ml-4">
            {viewAllLabel || "View All"}
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
