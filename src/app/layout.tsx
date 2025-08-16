import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import RootClient from "@/components/RootClient";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pivien — Secure VPN Pricing",
  description: "Pixel‑perfect clone of a VPN pricing page with animated starfield and gradient UI.",
  metadataBase: new URL("https://example.com"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-[#0B0F19] text-white`}>
        <RootClient>{children}</RootClient>
        {/* Razorpay Checkout (optional, safe to include even if unused) */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
