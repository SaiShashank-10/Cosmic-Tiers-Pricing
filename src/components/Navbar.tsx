"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Navbar({ hideLinks = false }: { hideLinks?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "border-b border-white/10",
        scrolled ? "bg-black/40 backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <div className="container-1200 flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-[--primary-start]" />
          <span className="font-semibold">S-Hatch</span>
        </Link>

        {!hideLinks && (
          <nav className="hidden md:flex items-center gap-7 text-sm text-white/80">
            <Link href="#features" className="hover:text-white">Features</Link>
            <Link href="#download" className="hover:text-white">Download</Link>
            <Link href="#resources" className="hover:text-white">Resources</Link>
            <Link href="#pricing" className="hover:text-white">Pricing</Link>
            <Link href="#business" className="hover:text-white">Business VPN</Link>
          </nav>
        )}

        <div className="hidden md:flex items-center gap-3">
          <a href="#login" className="btn-pill border border-transparent text-white/80 hover:text-white hover:bg-white/10">Login</a>
          <Link href="/signup" className="btn-gradient btn-pill">Sign up</Link>
        </div>

        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="md:hidden inline-flex items-center justify-center rounded-full border border-white/20 p-2"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      <motion.div
        initial={false}
        animate={{ y: open ? 0 : -400, opacity: open ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="md:hidden fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10"
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <span className="font-semibold">Menu</span>
          <button aria-label="Close menu" className="p-2 rounded-full border border-white/20" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 pb-6 space-y-4">
          {!hideLinks && (
            <>
              {[
                { href: "#features", label: "Features" },
                { href: "#download", label: "Download" },
                { href: "#resources", label: "Resources" },
                { href: "#pricing", label: "Pricing" },
                { href: "#business", label: "Business VPN" },
              ].map((i) => (
                <a key={i.href} href={i.href} className="block text-white/90" onClick={() => setOpen(false)}>
                  {i.label}
                </a>
              ))}
            </>
          )}
          <div className="pt-2 grid grid-cols-2 gap-3">
            <a href="#login" onClick={() => setOpen(false)} className="btn-pill border border-transparent text-white/80 hover:text-white hover:bg-white/10 text-center">Login</a>
            <Link href="/signup" onClick={() => setOpen(false)} className="btn-gradient btn-pill text-center">Sign up</Link>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
