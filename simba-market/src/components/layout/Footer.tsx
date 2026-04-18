"use client";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/translations";

export default function Footer() {
  const { language } = useStore();

  const categories = [
    { label: t(language, "categories.fruits"), href: "/categories?cat=fruits" },
    { label: t(language, "categories.vegetables"), href: "/categories?cat=vegetables" },
    { label: t(language, "categories.beverages"), href: "/categories?cat=beverages" },
    { label: t(language, "categories.snacks"), href: "/categories?cat=snacks" },
    { label: t(language, "categories.household"), href: "/categories?cat=household" },
    { label: t(language, "categories.dairy"), href: "/categories?cat=dairy" },
  ];

  const quickLinks = [
    { label: t(language, "nav.home"), href: "/" },
    { label: t(language, "nav.categories"), href: "/categories" },
    { label: t(language, "nav.deals"), href: "/deals" },
  ];

  return (
    <footer className="mt-16" style={{ backgroundColor: "#0F172A", color: "#94A3B8" }}>
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 border-2 border-orange-500/30 flex items-center justify-center">
                <span className="text-2xl">🦁</span>
              </div>
              <div>
                <p className="font-bold text-xl text-white">Simba</p>
                <p className="text-xs text-orange-400">Smart Market</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4">{t(language, "footer.tagline")}</p>
            <div className="flex gap-3">
              {["f", "in", "tw", "yt"].map((label, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-orange-500 flex items-center justify-center transition-colors text-gray-300 hover:text-white text-xs font-bold">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t(language, "footer.quickLinks")}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t(language, "nav.categories")}</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link href={cat.href}
                    className="text-sm hover:text-orange-400 transition-colors">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t(language, "footer.contact")}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                <span className="text-sm">{t(language, "footer.address")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <a href="tel:+250788000000" className="text-sm hover:text-orange-400 transition-colors">
                  {t(language, "footer.phone")}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <a href="mailto:support@simbamarket.rw" className="text-sm hover:text-orange-400 transition-colors">
                  {t(language, "footer.email")}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-center sm:text-left">
              © {new Date().getFullYear()} Simba Smart Market. {t(language, "footer.rights")}
            </p>
            <div className="flex items-center gap-4 text-xs">
              <a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a>
              <span className="flex items-center gap-1">
                🇷🇼 <span>Made in Rwanda</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
