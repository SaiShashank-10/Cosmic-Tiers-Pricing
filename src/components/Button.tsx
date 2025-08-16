"use client";
import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps, useMotionValue, useSpring } from "framer-motion";
import { forwardRef, useRef } from "react";

type Props = HTMLMotionProps<"button"> & {
  variant?: "gradient" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  magnetic?: boolean;
};

const base = "btn-pill focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.98]";
const variants: Record<Required<Props>["variant"], string> = {
  gradient: "btn-gradient hover:brightness-110",
  outline: "btn-outline",
  ghost: "text-white/80 hover:text-white hover:bg-white/10",
};
const sizes: Record<Required<Props>["size"], string> = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-5 py-2",
  lg: "text-base px-6 py-3",
};

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "gradient", size = "md", fullWidth, magnetic = false, children, ...rest }, ref) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const tx = useMotionValue(0);
    const ty = useMotionValue(0);
    const springX = useSpring(tx, { stiffness: 300, damping: 20, mass: 0.2 });
    const springY = useSpring(ty, { stiffness: 300, damping: 20, mass: 0.2 });

    function onMove(e: React.MouseEvent<HTMLDivElement>) {
      if (!magnetic) return;
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height; // 0..1
      const dx = (px - 0.5) * 16; // max 16px pull
      const dy = (py - 0.5) * 12;
      tx.set(dx);
      ty.set(dy);
    }
    function onLeave() { tx.set(0); ty.set(0); }

    const btn = (
      <motion.button
        whileHover={{ y: magnetic ? 0 : -1 }}
        whileTap={{ scale: 0.98 }}
        ref={ref}
        style={magnetic ? { translateX: springX, translateY: springY } : undefined}
        className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
        {...rest}
      >
        {children}
      </motion.button>
    );

    if (!magnetic) return btn;
    return (
      <div ref={wrapRef} onMouseMove={onMove} onMouseLeave={onLeave} className={cn(fullWidth && "w-full", "inline-block")}>{btn}</div>
    );
  }
);
Button.displayName = "Button";
export default Button;
