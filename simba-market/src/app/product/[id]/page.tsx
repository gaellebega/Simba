"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { ShoppingCart, Star, ArrowLeft, Package, CheckCircle, Truck, Shield } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import productsData from "@/data/products.json";
import { Product } from "@/types";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/translations";
import { formatPrice, getRelatedProducts } from "@/lib/utils";
import ProductCard from "@/components/product/ProductCard";

const allProducts = productsData as Product[];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = allProducts.find((p) => p.id === id);

  if (!product) notFound();

  const { addToCart, language } = useStore();
  const related = getRelatedProducts(product, allProducts, 4);

  const displayName = language === "kin" ? product.nameKin : language === "fr" ? product.nameFr : product.name;
  const displayDesc = language === "kin" ? product.descriptionKin : language === "fr" ? product.descriptionFr : product.description;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(t(language, "misc.addedToCart"), {
      icon: "🛒",
      style: { borderRadius: "12px", background: "#F97316", color: "#fff", fontWeight: "600" },
    });
  };

  const BADGE_STYLES: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    sale: "bg-red-100 text-red-700",
    trending: "bg-orange-100 text-orange-700",
    organic: "bg-green-100 text-green-700",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-orange-500 transition-colors">
          {t(language, "nav.categories")}
        </Link>
        <span>/</span>
        <Link href={`/categories?cat=${product.category}`} className="hover:text-orange-500 transition-colors capitalize">
          {t(language, `categories.${product.category}`)}
        </Link>
        <span>/</span>
        <span className="truncate max-w-[150px]" style={{ color: "var(--text)" }}>{product.name}</span>
      </nav>

      {/* Back button */}
      <Link href="/categories"
        className="inline-flex items-center gap-2 text-sm font-medium hover:text-orange-500 transition-colors mb-6"
        style={{ color: "var(--text-muted)" }}>
        <ArrowLeft className="w-4 h-4" />
        {t(language, "cart.continueShopping")}
      </Link>

      {/* Product detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Image */}
        <div className="relative">
          <div className="sticky top-24">
            <div className="rounded-3xl overflow-hidden aspect-square bg-gray-50 dark:bg-gray-900 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className={`absolute top-4 left-4 text-sm font-bold px-3 py-1.5 rounded-full ${BADGE_STYLES[product.badge] || ""}`}>
                  {t(language, `badges.${product.badge}`)}
                  {discount ? ` -${discount}%` : ""}
                </span>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { icon: Truck, text: "Fast Delivery" },
                { icon: Shield, text: "Quality Guaranteed" },
                { icon: Package, text: "Fresh Products" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1 p-3 rounded-xl text-center"
                  style={{ backgroundColor: "var(--surface)" }}>
                  <Icon className="w-5 h-5 text-orange-500" />
                  <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-orange-500 font-semibold text-sm capitalize mb-2">
            {t(language, `categories.${product.category}`)} · {product.brand}
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 leading-tight"
            style={{ color: "var(--text)" }}>
            {displayName}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
              ))}
            </div>
            <span className="font-bold text-sm" style={{ color: "var(--text)" }}>{product.rating}</span>
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>({product.reviews} {t(language, "product.reviews")})</span>
            {product.inStock && (
              <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                {t(language, "product.inStock")}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6 p-4 rounded-2xl" style={{ backgroundColor: "var(--surface)" }}>
            <span className="text-3xl sm:text-4xl font-black text-green-600 dark:text-green-400">
              {formatPrice(product.price)}
            </span>
            <span className="text-lg font-semibold" style={{ color: "var(--text-muted)" }}>RWF</span>
            {product.originalPrice && (
              <>
                <span className="text-lg line-through" style={{ color: "var(--text-muted)" }}>
                  {formatPrice(product.originalPrice)} RWF
                </span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-full">
                  -{discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
            {displayDesc}
          </p>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {product.weight && (
              <div className="p-3 rounded-xl" style={{ backgroundColor: "var(--surface)" }}>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>{t(language, "product.weight")}</p>
                <p className="font-bold text-sm" style={{ color: "var(--text)" }}>{product.weight}</p>
              </div>
            )}
            {product.brand && (
              <div className="p-3 rounded-xl" style={{ backgroundColor: "var(--surface)" }}>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>{t(language, "product.brand")}</p>
                <p className="font-bold text-sm" style={{ color: "var(--text)" }}>{product.brand}</p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map((tag) => (
              <span key={tag} className="bg-orange-50 dark:bg-orange-950/30 text-orange-600 text-xs font-medium px-3 py-1 rounded-full capitalize">
                #{tag}
              </span>
            ))}
          </div>

          {/* Add to cart */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-full transition-all hover:shadow-xl hover:shadow-orange-200 text-base active:scale-95">
              <ShoppingCart className="w-5 h-5" />
              {product.inStock ? t(language, "product.addToCart") : t(language, "product.outOfStock")}
            </button>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2" style={{ color: "var(--text)" }}>
            🔗 {t(language, "product.related")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
