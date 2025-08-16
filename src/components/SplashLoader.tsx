"use client";
import { motion } from "framer-motion";

export default function SplashLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0B0F19] text-white">
      <div className="absolute inset-0 star-gradient -z-10" />
      <div className="absolute inset-0 grid-overlay -z-10 opacity-40" />

      <div className="h-full w-full flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, backgroundPosition: ["0% 0%, -120% 0%", "0% 0%, 120% 0%"] }}
          transition={{ duration: 0.5, backgroundPosition: { repeat: Infinity, duration: 2.6, ease: "linear" } }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text"
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

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-6 w-full max-w-6xl">
          <CardSkeleton />
          <CardSkeleton highlight />
          <CardSkeleton gold />
        </div>
      </div>
    </div>
  );
}

function CardSkeleton({ highlight = false, gold = false }: { highlight?: boolean; gold?: boolean }) {
  return (
    <div className={["relative p-6 sm:p-8 w-full rounded-3xl border border-white/10 bg-black/30 backdrop-blur", highlight ? "ring-1 ring-purple-400/40" : ""].join(" ")}
    >
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
      <div className="mb-4 flex justify-center">
        <div className="h-6 w-20 rounded-full bg-white/10" />
      </div>
      <div className="flex items-baseline gap-3">
        <div className="h-8 w-8 rounded-lg bg-white/20" />
        <div className="space-y-2">
          <Shimmer className="h-4 w-28" />
          <Shimmer className="h-3 w-16" />
        </div>
      </div>
      <div className="mt-6">
        <Shimmer className="h-8 w-24" />
        <div className="mt-1">
          <Shimmer className="h-3 w-32" />
        </div>
      </div>
      <ul className="mt-6 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <div className="h-6 w-6 rounded-md bg-white/10 border border-white/15" />
            <Shimmer className="h-3 w-44" />
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <div className="h-10 w-full rounded-xl bg-white/10 border border-white/15" />
      </div>
    </div>
  );
}

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <motion.div className={["relative overflow-hidden rounded-md bg-white/10", className].join(" ")}>
      <motion.div
        aria-hidden
        className="absolute inset-0"
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }}
      />
    </motion.div>
  );
}
