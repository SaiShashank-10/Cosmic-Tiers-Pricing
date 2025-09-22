"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import Button from "./Button";
import { Check, X } from "lucide-react";

type Feature = string | { text: string; included: boolean };

type Props = {
  tier: "personal" | "starter" | "premium";
  title: string;
  price: string;
  subtitle?: string; // kept for compatibility (small line, optional)
  description?: string; // new: sentence under title
  features: Feature[];
  cta: string;
  highlight?: boolean;
  badge?: string;
  onClick?: () => void;
  outline?: "silver" | "gold" | "default";
  buttonHalo?: "blue" | "yellow" | "none";
  priceClassName?: string;
  titleAccent?: "neutral" | "blue" | "gold" | "purple";
};

export default function PricingCard({ tier, title, price, subtitle, description, features, cta, highlight, badge, onClick, outline = "default", buttonHalo = "none", priceClassName, titleAccent = "neutral" }: Props) {
  // Card-level pointer tilt values to drive the 3D title effect
  const rXTitle = useMotionValue(0);
  const rYTitle = useMotionValue(0);
  const zTitle = useMotionValue(0);
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const isGoldLux = tier === "premium";

  function onCardMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    rYTitle.set((px - 0.5) * 18);
    rXTitle.set((0.5 - py) * 18);
    glowX.set(px * rect.width);
    glowY.set(py * rect.height);
  }
  function onCardEnter() {
    zTitle.set(12);
  }
  function onCardLeave() {
    rXTitle.set(0);
    rYTitle.set(0);
    zTitle.set(0);
  }

  const titleGlow: string =
    titleAccent === "gold"
      ? "radial-gradient(120px 60px at center, rgba(245,212,107,0.9), rgba(245,212,107,0))"
      : titleAccent === "blue"
      ? "radial-gradient(120px 60px at center, rgba(96,165,250,0.9), rgba(96,165,250,0))"
      : titleAccent === "purple"
      ? "radial-gradient(120px 60px at center, rgba(167,139,250,0.9), rgba(167,139,250,0))"
      : "radial-gradient(120px 60px at center, rgba(255,255,255,0.4), rgba(255,255,255,0))";
  return (
    <motion.div
      whileHover={{ y: -6 }}
      onMouseMove={onCardMove}
      onMouseEnter={onCardEnter}
      onMouseLeave={onCardLeave}
      className={cn(
        "card card-hover p-6 sm:p-8 w-full",
        highlight ? "ring-1 ring-purple-400/40" : "",
        tier === "personal" ? "bg-black/40" : "bg-black/30",
        outline === "silver" && "card-outline-silver",
        outline === "gold" && "card-outline-gold",
        isGoldLux && "overflow-hidden"
      )}
    >
      {/* Premium Gold Glare overlays */}
      {isGoldLux && (
        <>
          {/* Pointer-following gold sheen across the card */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              // Static inner glow; dynamic pointer-based glow removed to satisfy lint and avoid over-brightness
              boxShadow: "0 0 60px rgba(245,212,107,0.22) inset, 0 0 32px rgba(245,212,107,0.18)",
              mixBlendMode: "screen",
              opacity: 0.85,
            }}
          />
          {/* Gold ring accent */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-yellow-300/35 shadow-[0_0_70px_rgba(245,212,107,0.25)_inset,0_0_30px_rgba(245,212,107,0.18)]" aria-hidden />
          {/* Slow sweeping sheen */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl"
            initial={{ x: "-120%" }}
            animate={{ x: "120%" }}
            transition={{ repeat: Infinity, duration: 3.8, ease: "linear" }}
            style={{
              background: "linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.08) 40%, rgba(245,212,107,0.12) 50%, rgba(255,255,255,0.06) 60%, transparent 80%)",
              filter: "blur(14px)",
              opacity: 0.55,
            }}
          />
        </>
      )}
      {badge && (
        <div className="mb-4 flex justify-center">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">{badge}</span>
        </div>
      )}
      {subtitle?.toLowerCase().includes("save") && (
        <div className="absolute right-4 top-4 rounded-full bg-white/15 px-2 py-0.5 text-[10px] text-white/90">
          {subtitle}
        </div>
      )}

      <div className="flex items-baseline gap-3 relative">
        <div className={cn("h-8 w-8 rounded-lg", tier === "starter" ? "bg-purple-500" : tier === "premium" ? "bg-blue-500" : "bg-white/20")} />
        <div className="relative">
          {/* pointer-following glow */}
          <motion.span
            className="pointer-events-none absolute -inset-6 opacity-50 blur-lg"
            style={{ left: glowX, top: glowY, transform: "translate(-50%, -50%)", background: titleGlow, borderRadius: 16 }}
            aria-hidden
          />
          <motion.h3
            style={{
              rotateX: rXTitle,
              rotateY: rYTitle,
              translateZ: zTitle,
              ...(isGoldLux
                ? {
                    backgroundImage:
                      "linear-gradient(180deg,#fde68a,#f59e0b), linear-gradient(110deg, transparent 46%, rgba(245,212,107,0.85) 50%, transparent 54%)",
                    backgroundSize: "100% 100%, 220% 100%",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "0% 0%, -120% 0%",
                  }
                : undefined),
            }}
            animate={isGoldLux ? { backgroundPosition: ["0% 0%, -120% 0%", "0% 0%, 120% 0%"] } : undefined}
            transition={isGoldLux ? { repeat: Infinity, duration: 2.8, ease: "linear" } : undefined}
            className={cn(
              "text-xl font-semibold leading-none relative inline-block",
              titleAccent === "gold" && "text-transparent bg-clip-text",
              // base gold gradient is supplied via inline style when premium
              titleAccent === "blue" && "text-white drop-shadow-[0_0_12px_rgba(59,130,246,.35)]"
            )}
          >
            {title}
          </motion.h3>
        </div>
      </div>

      {description && <p className="mt-4 text-white/70 text-sm leading-relaxed">{description}</p>}

      <div className="mt-6">
        <div className={cn("text-4xl font-bold", priceClassName)}>{price}</div>
        {subtitle && <div className="mt-1 text-sm text-white/70">{subtitle}</div>}
      </div>

      {/* features intentionally removed per design request */}

      <div className={cn("mt-8", buttonHalo !== "none" && "btn-halo", buttonHalo === "blue" && "btn-halo-blue", buttonHalo === "yellow" && "btn-halo-yellow")}
        style={isGoldLux ? { filter: "drop-shadow(0 0 18px rgba(245,212,107,0.35))" } : undefined}
      >
        <Button onClick={onClick} className="w-full" variant={highlight ? "gradient" : "outline"}>
          {cta}
        </Button>
      </div>

      {highlight && <div className="pointer-events-none absolute inset-0 rounded-3xl" style={{ boxShadow: "var(--shadow-glow)" }} />}
    </motion.div>
  );
}

function FeatureRow({ included, children }: { included: boolean; children: React.ReactNode }) {
  // 3D tilt values based on pointer position
  const rX = useMotionValue(0);
  const rY = useMotionValue(0);
  const z = useMotionValue(0);

  const shadow = useTransform(z, (v) => (v > 0 ? "0 8px 20px rgba(59, 130, 246, 0.35)" : "none"));

  function onMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const el = e.currentTarget as HTMLDivElement;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    // Map to -12..12 deg
    rY.set((px - 0.5) * 24);
    rX.set((0.5 - py) * 24);
  }

  function onEnter() {
    z.set(18);
  }
  function onLeave() {
    rX.set(0);
    rY.set(0);
    z.set(0);
  }

  const Icon = included ? Check : X;
  const iconClasses = included ? "text-blue-300" : "text-white/40";
  const rowClasses = included ? "text-white/85" : "text-white/45 line-through";

  return (
    <li className={cn("flex items-center gap-3 text-sm", rowClasses)}>
      <motion.div
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        whileTap={{ scale: 0.95, rotateZ: included ? 5 : -5 }}
        style={{
          perspective: 600,
          rotateX: rX,
          rotateY: rY,
          translateZ: z,
          boxShadow: included ? shadow : "none",
        }}
        className={cn(
          "grid place-items-center h-6 w-6 rounded-md",
          included ? "bg-blue-500/15 border border-blue-400/30" : "bg-white/10 border border-white/15"
        )}
        aria-hidden
      >
        <Icon className={cn("h-4 w-4", iconClasses)} />
      </motion.div>
      <span>{children}</span>
    </li>
  );
}
