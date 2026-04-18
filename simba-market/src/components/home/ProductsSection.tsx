"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types";

interface Props {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
  accent?: string;       /* small coloured label above heading */
  alt?: boolean;         /* alternating section background */
}

export default function ProductsSection({
  title, subtitle, products,
  viewAllHref, viewAllLabel,
  accent, alt,
}: Props) {
  if (products.length === 0) return null;

  return (
    <section className={alt ? "section-alt" : ""}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            {accent && (
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-2">
                {accent}
              </p>
            )}
            <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                {subtitle}
              </p>
            )}
          </div>

          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="flex items-center gap-1.5 text-[#F97316] hover:text-[#EA6C0A]
                         font-semibold text-sm transition-colors duration-200 shrink-0 ml-6 group"
            >
              {viewAllLabel ?? "View All"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          )}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
