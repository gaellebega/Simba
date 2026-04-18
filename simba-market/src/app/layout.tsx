import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: "Simba Smart Market — Fresh Groceries in Rwanda",
  description: "Shop fresh fruits, vegetables, beverages, snacks and household products. Fast delivery in Kigali, Rwanda.",
  keywords: ["grocery", "Rwanda", "Kigali", "fresh", "market", "Simba"],
  openGraph: {
    title: "Simba Smart Market",
    description: "Fresh groceries delivered fast in Rwanda",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Navbar />
        <CartDrawer />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 2500,
            style: {
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
            },
          }}
        />
      </body>
    </html>
  );
}
