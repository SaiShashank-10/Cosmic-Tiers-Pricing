"use client";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Match page background aesthetics */}
      <div className="absolute inset-0 star-gradient -z-10" />
      <div className="absolute inset-0 grid-overlay -z-10 opacity-40" />

      <main className="pt-28 pb-20">
        {/* Title shimmer */}
        <div className="container-1200 px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, backgroundPosition: ["0% 0%, -120% 0%", "0% 0%, 120% 0%"] }}
            transition={{ duration: 0.5, backgroundPosition: { repeat: Infinity, duration: 2.8, ease: "linear" } }}
            className="mx-auto max-w-3xl text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6)), linear-gradient(110deg, transparent 46%, rgba(245,212,107,0.9) 50%, transparent 54%)",
              backgroundSize: "100% 100%, 220% 100%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "0% 0%, -120% 0%",
            }}
          >
            Cosmic - Tiers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mt-4 max-w-2xl text-white/60"
          >
            Preparing pricing…
          </motion.p>
        </div>

        {/* Card skeletons */}
        <div className="container-1200 px-6 mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Basic skeleton */}
          <SkeletonCard variant="basic" />
          {/* Standard skeleton */}
          <SkeletonCard variant="standard" highlight />
          {/* Premium skeleton with gold sweep */}
          <SkeletonCard variant="premium" gold />
        </div>
      </main>
    </div>
  );
}

function SkeletonCard({ variant, highlight = false, gold = false }: { variant: "basic" | "standard" | "premium"; highlight?: boolean; gold?: boolean }) {
  return (
    <div
      className={[
        "relative p-6 sm:p-8 w-full rounded-3xl border border-white/10 bg-black/30 backdrop-blur",
        highlight ? "ring-1 ring-purple-400/40" : "",
      ].join(" ")}
    >
      {/* Premium gold sweep */}
      {gold && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl"
            initial={{ x: "-120%" }}
            animate={{ x: "120%" }}
            transition={{ repeat: Infinity, duration: 3.2, ease: "linear" }}
            style={{
              background:
                "linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.08) 40%, rgba(245,212,107,0.14) 50%, rgba(255,255,255,0.06) 60%, transparent 80%)",
              filter: "blur(14px)",
              opacity: 0.55,
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-yellow-300/35 shadow-[0_0_70px_rgba(245,212,107,0.25)_inset,0_0_30px_rgba(245,212,107,0.18)]"
          />
        </>
      )}

      {/* Top badge placeholder */}
      <div className="mb-4 flex justify-center">
        <div className="h-6 w-20 rounded-full bg-white/10" />
      </div>

      {/* Title row */}
      <div className="flex items-baseline gap-3">
        <div
          className={{
            basic: "bg-white/20",
            standard: "bg-purple-500",
            premium: "bg-blue-500",
          }[variant] + " h-8 w-8 rounded-lg"}
        />
        <div className="space-y-2">
          <ShimmerBar className="h-4 w-28" />
          <ShimmerBar className="h-3 w-16" />
        </div>
      </div>

      {/* Price */}
      <div className="mt-6">
        <ShimmerBar className="h-8 w-24" />
        <div className="mt-1">
          <ShimmerBar className="h-3 w-32" />
        </div>
      </div>

      {/* Feature list */}
      <ul className="mt-6 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <div className="h-6 w-6 rounded-md bg-white/10 border border-white/15" />
            <ShimmerBar className="h-3 w-44" />
          </li>
        ))}
      </ul>

      {/* Button */}
      <div className="mt-8">
        <div className="h-10 w-full rounded-xl bg-white/10 border border-white/15" />
      </div>
    </div>
  );
}

function ShimmerBar({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={["relative overflow-hidden rounded-md bg-white/10", className].join(" ")}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0"
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
        }}
      />
    </motion.div>
  );
}
