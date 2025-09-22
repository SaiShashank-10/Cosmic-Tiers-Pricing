"use client";
import { motion } from "framer-motion";

export default function CosmicTitle({ text, orbit = true }: { text: string; orbit?: boolean }) {
  return (
    <div className="relative inline-grid place-items-center">
      {/* Glowing orbit ring (draw-in + slow rotate) */}
      {orbit && (
        <div className="pointer-events-none absolute -inset-x-8 -top-10 -bottom-8">
          <motion.svg
            viewBox="0 0 100 100"
            className="w-[480px] max-w-[80vw] h-auto mx-auto"
            initial={false}
          >
            {/* subtle halo */}
            <defs>
              <radialGradient id="halo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(124,58,237,0.35)" />
                <stop offset="60%" stopColor="rgba(56,189,248,0.15)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>
              <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="50%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#fde68a" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#halo)" />
            <motion.g
              initial={{ rotate: -30 }}
              animate={{ rotate: 330 }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              style={{ transformOrigin: "50% 50%" }}
            >
              <motion.circle
                cx="50"
                cy="50"
                r="34"
                fill="none"
                stroke="url(#ring)"
                strokeWidth="1.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
              {/* orbiting comet */}
              <motion.circle
                cx="84"
                cy="50"
                r="1.6"
                fill="#fff"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.2, 1, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
              />
            </motion.g>
          </motion.svg>
        </div>
      )}

      {/* Title text with cosmic gradient and brief reveal */}
      <motion.h1
        initial={{ opacity: 0, y: 10, letterSpacing: "0.1em", filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, letterSpacing: "0.02em", filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-3xl text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight text-transparent bg-clip-text"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #ffffff, rgba(255,255,255,0.85)), radial-gradient(120% 180% at 20% 0%, #a78bfa 0%, #60a5fa 40%, #fde68a 70%, #f59e0b 100%)",
          backgroundBlendMode: "overlay, normal",
        }}
      >
        {text}
      </motion.h1>

      {/* sweeping highlight over letters */}
      <motion.div
        aria-hidden
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={{ repeat: Infinity, duration: 2.8, ease: "linear", delay: 0.2 }}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10"
        style={{
          background:
            "linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.25) 50%, transparent 65%)",
          filter: "blur(8px)",
          opacity: 0.5,
        }}
      />
    </div>
  );
}
