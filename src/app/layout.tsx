// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import FloatingNav from "@/components/FloatingNav";
import { CartProvider } from "@/components/context/CartContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kush High | Nigeria’s Legit Marijuana & Accessories Plug 🌿",
  description:
    "Shop premium marijuana strains and smoking accessories in Nigeria. Fast, discreet, nationwide delivery.",
  keywords: [
    "Kush High",
    "Marijuana Nigeria",
    "Weed accessories",
    "Cannabis store",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} bg-[#0a0a0a] text-white overflow-x-hidden antialiased`}
      >
        <CartProvider>
          {/* Page Content */}
          <main className="relative min-h-screen">{children}</main>

          {/* Floating Navigation always on top */}
          <FloatingNav />
        </CartProvider>
      </body>
    </html>
  );
}
