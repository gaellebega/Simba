import { Product } from "@/types";

export function formatPrice(price: number): string {
  return price.toLocaleString("en-RW");
}

export function getRelatedProducts(product: Product, allProducts: Product[], limit = 4): Product[] {
  return allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export function getRecommendedProducts(cartProductIds: string[], allProducts: Product[], limit = 8): Product[] {
  if (cartProductIds.length === 0) {
    return allProducts.filter((p) => p.badge === "trending").slice(0, limit);
  }
  const cartCategories = allProducts
    .filter((p) => cartProductIds.includes(p.id))
    .map((p) => p.category);

  return allProducts
    .filter((p) => !cartProductIds.includes(p.id) && cartCategories.includes(p.category))
    .slice(0, limit);
}

export function getTrendingProducts(allProducts: Product[], limit = 8): Product[] {
  return allProducts.filter((p) => p.badge === "trending" || p.rating >= 4.7).slice(0, limit);
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

export const CATEGORY_IMAGES: Record<string, string> = {
  fruits: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&h=300&fit=crop",
  vegetables: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=300&fit=crop",
  beverages: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&h=300&fit=crop",
  snacks: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&h=300&fit=crop",
  household: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop",
  dairy: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=300&fit=crop",
  meat: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=300&fit=crop",
  bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=300&fit=crop",
};

export const CATEGORY_COLORS: Record<string, string> = {
  fruits: "from-orange-400 to-yellow-400",
  vegetables: "from-green-400 to-emerald-500",
  beverages: "from-blue-400 to-cyan-500",
  snacks: "from-yellow-400 to-orange-400",
  household: "from-purple-400 to-indigo-500",
  dairy: "from-sky-300 to-blue-400",
  meat: "from-red-400 to-rose-500",
  bakery: "from-amber-400 to-yellow-500",
};
