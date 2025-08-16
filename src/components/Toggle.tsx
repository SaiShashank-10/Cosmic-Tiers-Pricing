"use client";
import { motion } from "framer-motion";

type Props = {
  left: string;
  right: string;
  valueRight?: boolean; // true = right selected
  onChange?: (right: boolean) => void;
};

export default function Toggle({ left, right, valueRight = false, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Billing period"
      className="relative inline-flex items-center rounded-full border border-white/20 bg-white/10 p-1 text-sm"
    >
      <button
        role="tab"
        aria-selected={!valueRight}
        className="relative z-10 btn-pill px-4"
        onClick={() => onChange?.(false)}
      >
        {left}
      </button>
      <button
        role="tab"
        aria-selected={valueRight}
        className="relative z-10 btn-pill px-4"
        onClick={() => onChange?.(true)}
      >
        {right}
      </button>
      <motion.div
        aria-hidden
        className="absolute top-1 bottom-1 w-1/2 rounded-full bg-white/20"
        animate={{ x: valueRight ? "100%" : "0%" }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      />
    </div>
  );
}
