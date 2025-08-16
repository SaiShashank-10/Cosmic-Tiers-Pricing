"use client";
import { motion } from "framer-motion";

export default function ProgressDots({ step, total = 4 }: { step: number; total?: number }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length: total }, (_, i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-white/20"
          animate={{ scale: i === step ? 1.2 : 1, backgroundColor: i === step ? "#93c5fd" : "#ffffff33" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      ))}
    </div>
  );
}
