"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, useTransform, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Button from "@/components/Button";
import ParticlesBG from "@/components/ParticlesBG";
import ProgressDots from "@/components/forms/ProgressDots";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import { createPortal } from "react-dom";

const steps = ["Account Details", "Startup Basic Info", "Company Profile", "Detailed Description"] as const;

type Account = {
  name: string; // Founder's Full Name
  email: string; // Founder's Email
  password: string;
  confirmPassword: string;
  phoneCountry: string;
  phone: string;
  linkedin?: string; // optional URL
};
type Startup = {
  startupName: string;
  logo?: string; // PNG/SVG (required by UX, validated in form)
  tagline: string; // max 150
  website?: string; // optional URL
  foundingYear: string; // YYYY numeric
  hqCountry: string; // dropdown
  hqState: string;
  hqCity: string;
  hqZip: string; // numeric
};
type Company = {
  startupType: string; // dropdown
  industries: string[]; // multi-select
  stage: string; // dropdown
  foundersCount: string; // numeric string for simplicity
  employeesRange: string; // dropdown
  fundingStatus: string; // dropdown
  investors?: string; // optional text
  revenueRange?: string; // optional dropdown
  registrationNumber?: string; // optional text
};

type FormData = {
  account: Account;
  startup: Startup;
  company: Company;
  description: {
    mission: string;
    vision: string;
    detailsHtml: string; // rich text
    products: string[]; // tags
    audience: string; // dropdown
    businessModel: string; // dropdown
  };
};

const initial: FormData = {
  account: { name: "", email: "", password: "", confirmPassword: "", phoneCountry: "+91", phone: "", linkedin: "" },
  startup: { startupName: "", logo: undefined, tagline: "", website: "", foundingYear: "", hqCountry: "India", hqState: "", hqCity: "", hqZip: "" },
  company: { startupType: "", industries: [], stage: "", foundersCount: "", employeesRange: "", fundingStatus: "", investors: "", revenueRange: "", registrationNumber: "" },
  description: { mission: "", vision: "", detailsHtml: "", products: [], audience: "", businessModel: "" },
};

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initial);
  const [direction, setDirection] = useState<1 | -1>(1);
  const prefersReduced = useReducedMotion();
  const [showSuccess, setShowSuccess] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Validation gate for step 1 (Account)
  const canNext = useMemo(() => {
    if (step !== 0) return true;
    const a = data.account;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email);
    const pwdOk = a.password.length >= 8 && a.password === a.confirmPassword;
    const nameOk = a.name.trim().length > 1;
    const digits = a.phone.replace(/\D/g, "");
    const phoneOk = digits.length >= 7 && digits.length <= 15;
    const linkedinOk = !a.linkedin || /^https?:\/\//i.test(a.linkedin);
    return nameOk && emailOk && phoneOk && pwdOk && linkedinOk;
  }, [step, data]);

  function next() {
    setDirection(1);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  setBurstKey((k) => k + 1);
  }
  function prev() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  setBurstKey((k) => k + 1);
  }

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  // 3D modal variants with perspective and z-depth
  const pane = prefersReduced
    ? {
        enter: (dir: 1 | -1) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
        center: { opacity: 1, x: 0, transition: { duration: 0.2 } },
        exit: (dir: 1 | -1) => ({ opacity: 0, x: dir > 0 ? -60 : 60, transition: { duration: 0.18 } }),
      }
    : {
        enter: (dir: 1 | -1) => ({
          opacity: 0,
          rotateY: dir > 0 ? -35 : 35,
          x: dir > 0 ? 120 : -120,
          z: -120,
          scale: 0.96,
          filter: "blur(2px)",
        }),
        center: {
          opacity: 1,
          rotateY: 0,
          x: 0,
          z: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { type: "spring", stiffness: 240, damping: 26 },
        },
        exit: (dir: 1 | -1) => ({
          opacity: 0,
          rotateY: dir > 0 ? 35 : -35,
          x: dir > 0 ? -120 : 120,
          z: -160,
          scale: 0.94,
          filter: "blur(3px)",
          transition: { duration: 0.28 },
        }),
      } as const;

  // Keyboard navigation (Left/Right/Enter)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") {
        if (step === 0 && !canNext) return;
        next();
      }
      if (e.key === "Enter") {
        if (step < steps.length - 1) {
          if (step === 0 && !canNext) return;
          next();
        } else {
          setShowSuccess(true);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, canNext]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      <ParticlesBG />
      <div className="absolute inset-0 star-gradient -z-10" />
      <div className="absolute inset-0 grid-overlay -z-10 opacity-40" />

      {/* Ambient orbs */}
      <div className="pointer-events-none absolute -z-10 inset-0">
        <div className="absolute -top-24 -left-20 size-80 rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute bottom-0 -right-20 size-96 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <main className="pt-24 pb-16 px-6">
        <section className="container-1200 mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold">Get Started</h1>
              <p className="text-white/60 mt-1">Step {step + 1} of {steps.length} — {steps[step]}</p>
            </div>
            <ProgressDots step={step} />
          </div>

          {/* Interactive 3D Step Cards */}
          <StepCards data={data} step={step} onSelect={(i) => setStep(i)} />

          {/* 3D Stage + Interactive Cube (right) */}
          <div className="mt-10 grid md:grid-cols-[minmax(0,640px)_1fr] gap-10 items-start">
            {/* Left: Wizard */}
            <div className="relative">
              <StageLights />
              <motion.div className="relative w-full" style={{ perspective: 1400 }}>
                <ProgressBar step={step} total={steps.length} />
                {/* Ghost stack for depth */}
                <GhostPanel index={step - 1} title={steps[step - 1]} offset={-1} />
                <GhostPanel index={step + 1} title={steps[step + 1]} offset={1} />

                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={pane}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="relative [transform-style:preserve-3d]"
                    onTouchStart={(e) => (touchStartX.current = e.touches[0]?.clientX ?? 0)}
                    onTouchEnd={(e) => {
                      const x = e.changedTouches[0]?.clientX ?? 0;
                      const dx = x - (touchStartX.current ?? 0);
                      const threshold = 70;
                      if (dx > threshold) {
                        prev();
                      } else if (dx < -threshold) {
                        if (step === 0 && !canNext) return;
                        next();
                      }
                    }}
                  >
                    <ModalShell>
                      {step === 0 && (
                        <AccountForm value={data.account} onChange={(v) => update("account", v)} />
                      )}
                      {step === 1 && (
                        <StartupForm value={data.startup} onChange={(v) => update("startup", v)} />
                      )}
                      {step === 2 && (
                        <CompanyForm value={data.company} onChange={(v) => update("company", v)} />
                      )}
                      {step === 3 && (
                        <DescriptionForm value={data.description} onChange={(v) => update("description", v)} />
                      )}

                      <div className="mt-8 flex items-center gap-3">
                        <Button variant="outline" onClick={prev} disabled={step === 0}>Back</Button>
                        {step < steps.length - 1 ? (
                          <Button onClick={next} disabled={!canNext} magnetic>Next</Button>
                        ) : (
                          <Button onClick={() => setShowSuccess(true)} magnetic>Finish</Button>
                        )}
                      </div>
                    </ModalShell>
                    <StepBurst key={burstKey} />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Right: Interactive Cube */}
            <div className="relative md:sticky md:top-28">
              <CubePreview3D data={data} step={step} onSelectStep={(i) => setStep(i)} />
            </div>
          </div>
          {/* Success Overlay */}
          <AnimatePresence>
            {showSuccess && (
              <SuccessOverlay onClose={() => setShowSuccess(false)} />
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

// 3D Tilt helpers
// 3D Modal shell with sheen and soft border glow
function ModalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-[0_10px_50px_rgba(0,0,0,.35)]">
      <SheenOverlay />
      <div className="p-6 sm:p-8">
        {children}
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
    </div>
  );
}

function StageLights() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const bg = useMotionTemplate`radial-gradient(420px 280px at ${x}px ${y}px, rgba(99,102,241,0.15), transparent 60%)`;
  useEffect(() => {
    function onMove(e: MouseEvent) {
      const el = ref.current?.parentElement as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);
  return <motion.div ref={ref} className="absolute inset-0 -z-10" style={{ background: bg }} aria-hidden />;
}

function SheenOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const bg = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, rgba(99,102,241,0.22), transparent 60%)`;

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const el = ref.current?.parentElement as HTMLElement | null;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (inside) {
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      }
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return (
    <motion.div ref={ref} className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: bg }} />
  );
}

function StepCards({ data, step, onSelect }: { data: FormData; step: number; onSelect: (i: number) => void }) {
  // completion per step (0..1)
  const accountDone = (() => {
    const a = data.account;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email);
    const pwdOk = a.password.length >= 8 && a.password === a.confirmPassword;
    const nameOk = a.name.trim().length > 1;
    const digits = a.phone.replace(/\D/g, "");
    const phoneOk = digits.length >= 7 && digits.length <= 15;
    const linkedinOk = !a.linkedin || /^https?:\/\//i.test(a.linkedin);
    const checks = [nameOk, emailOk, phoneOk, pwdOk, linkedinOk];
    return checks.filter(Boolean).length / checks.length;
  })();
  const startupFields = [
    data.startup.startupName,
    data.startup.logo,
    data.startup.tagline,
    data.startup.foundingYear,
    data.startup.hqCountry,
    data.startup.hqState,
    data.startup.hqCity,
    data.startup.hqZip,
  ];
  const startupDone = startupFields.filter((v) => !!(v && String(v).toString().trim().length > 0)).length / startupFields.length;
  const companyFields = [
    data.company.startupType,
    data.company.industries.length > 0 ? "ok" : "",
    data.company.stage,
    data.company.foundersCount,
    data.company.employeesRange,
    data.company.fundingStatus,
  ];
  const companyDone = companyFields.filter((v) => !!(v && String(v).trim().length > 0)).length / companyFields.length;
  const descriptionDone = (
    (data.description.mission || "").trim() &&
    (data.description.vision || "").trim() &&
    (data.description.detailsHtml || "").trim() &&
    data.description.products.length > 0 &&
    (data.description.audience || "").trim() &&
    (data.description.businessModel || "").trim()
  ) ? 1 : 0;

  const items = [
  { title: "Account Details", pct: accountDone },
  { title: "Startup Basic Info", pct: startupDone },
  { title: "Company Profile", pct: companyDone },
  { title: "Detailed Description", pct: descriptionDone },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((it, i) => (
        <StepCard key={it.title} active={step === i} title={it.title} pct={it.pct} onClick={() => onSelect(i)} />
      ))}
    </div>
  );
}

function StepCard({ title, pct, active, onClick }: { title: string; pct: number; active: boolean; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const lx = useMotionValue(0);
  const ly = useMotionValue(0);
  const sheen = useMotionTemplate`radial-gradient(180px 140px at ${lx}px ${ly}px, rgba(255,255,255,0.12), transparent 60%)`;
  const intensity = 12;
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * intensity);
    rx.set((0.5 - py) * intensity);
    lx.set(px * r.width);
    ly.set(py * r.height);
  }
  function onLeave() { rx.set(0); ry.set(0); }
  const pctLabel = `${Math.round(pct * 100)}%`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      style={{ rotateX: rx, rotateY: ry, perspective: 800 }}
      className={`relative overflow-hidden rounded-2xl border px-4 py-4 select-none cursor-pointer ${active ? "border-sky-300/60 bg-white/10" : "border-white/12 bg-white/5"}`}
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      aria-pressed={active}
    >
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: sheen }} aria-hidden />
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-semibold">{title}</div>
        {pct >= 1 ? (
          <div className="flex items-center gap-1 text-emerald-300 text-xs">
            <CheckCircle2 size={16} /> Done
          </div>
        ) : (
          <div className="text-xs text-white/60">{pctLabel}</div>
        )}
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-purple-400 to-sky-400" style={{ width: pctLabel }} />
      </div>
    </motion.div>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = ((step + 1) / total) * 100;
  return (
    <div className="mb-6">
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-400 to-sky-400"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 text-xs text-white/60">{Math.round(pct)}% complete</div>
    </div>
  );
}

function StepBurst() {
  // radial sparkles burst on step change
  const dots = Array.from({ length: 14 }).map((_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    const dist = 40 + (i % 3) * 16;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;
    return { x, y, delay: i * 0.008 };
  });
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden>
      {dots.map((d, idx) => (
        <motion.span
          key={idx}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.2], x: d.x, y: d.y }}
          transition={{ duration: 0.6, delay: d.delay, ease: "easeOut" }}
          className="size-1.5 rounded-full bg-white/70 shadow-[0_0_14px_rgba(255,255,255,.45)]"
        />
      ))}
    </div>
  );
}

function SuccessOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative w-full max-w-md rounded-2xl border border-white/15 bg-white/10 p-6 text-center"
      >
        <Confetti />
  <h3 className="text-2xl font-bold">You&apos;re all set!</h3>
        <p className="text-white/70 mt-1">Your signup details are ready to submit.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={onClose} variant="outline">Close</Button>
          <Button onClick={() => { onClose(); alert("Submitted!"); }}>Submit</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 24 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.3;
        const rot = (Math.random() - 0.5) * 120;
        const color = i % 3 === 0 ? "bg-pink-400" : i % 3 === 1 ? "bg-yellow-300" : "bg-sky-400";
        return (
          <motion.span
            key={i}
            initial={{ y: -20, opacity: 0, rotate: 0 }}
            animate={{ y: [ -20, 220, 300 ], opacity: [0, 1, 0.8], rotate: rot }}
            transition={{ duration: 1.6, delay, ease: "easeOut" }}
            style={{ left: `${left}%` }}
            className={`absolute top-0 size-2 ${color} rounded-[2px] shadow-[0_0_10px_rgba(255,255,255,.3)]`}
          />
        );
      })}
    </div>
  );
}
function GhostPanel({ index, title, offset }: { index: number; title?: string; offset: -1 | 1 }) {
  if (index < 0 || index >= steps.length) return null;
  const side = offset < 0 ? -1 : 1;
  return (
    <div
      aria-hidden
      className="absolute left-1/2 -translate-x-1/2 top-0 w-full max-w-3xl"
      style={{ perspective: 1400 }}
    >
      <motion.div
        className="rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-md"
        style={{ transformOrigin: side < 0 ? "left center" : "right center" as const }}
        initial={{ opacity: 0.12, rotateY: side * -25, x: side * -120, y: 22, scale: 0.98 }}
        animate={{ opacity: 0.12, rotateY: side * -25, x: side * -120, y: 22, scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <div className="px-6 py-4 text-white/50 text-sm">
          {title ?? ""}
        </div>
        <div className="h-16" />
      </motion.div>
    </div>
  );
}

// Generic 3D tilt wrapper with pointer-following sheen
function TiltItem({ children, className, intensity = 12, active = false }: { children: React.ReactNode; className?: string; intensity?: number; active?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const lx = useMotionValue(0);
  const ly = useMotionValue(0);
  const sheen = useMotionTemplate`radial-gradient(220px 160px at ${lx}px ${ly}px, rgba(99,102,241,${active ? 0.28 : 0.18}), transparent 60%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * intensity);
    rx.set((0.5 - py) * intensity);
    lx.set(px * r.width);
    ly.set(py * r.height);
  }
  function onLeave() { rx.set(0); ry.set(0); }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, perspective: 900 }}
      className={`relative ${className ?? ""}`}
    >
      <motion.div className="pointer-events-none absolute inset-0 rounded-xl" style={{ background: sheen }} aria-hidden />
      {children}
    </motion.div>
  );
}

// Lightweight micro-tilt for small UI text (labels, checklist)
function MicroTilt({ children, className, intensity = 4 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * intensity);
    rx.set((0.5 - py) * intensity);
  }
  function onLeave() { rx.set(0); ry.set(0); }
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ rotateX: rx, rotateY: ry }} className={className}>
      {children}
    </motion.div>
  );
}

// Subtle parallax for inline validation messages
function HintParallax({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 6; // max ~3px each side
    const dy = ((e.clientY - r.top) / r.height - 0.5) * 6;
    tx.set(dx);
    ty.set(dy);
  }
  function onLeave() { tx.set(0); ty.set(0); }
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ x: tx, y: ty }} className={className}>
      {children}
    </motion.div>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <label className="block mb-4">
      <MicroTilt className="inline-block">
        <span className="block text-xs uppercase tracking-wide text-white/60 mb-1">{label}</span>
      </MicroTilt>
      <TiltItem active={focused}>
        <input
          {...props}
          onFocus={(e: React.FocusEvent<HTMLInputElement>) => { props.onFocus?.(e); setFocused(true); }}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => { props.onBlur?.(e); setFocused(false); }}
          className="w-full rounded-xl bg-white/10 text-white placeholder-white/40 border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-white/30"
        />
      </TiltItem>
    </label>
  );
}

function TextArea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <label className="block mb-4">
      <MicroTilt className="inline-block">
        <span className="block text-xs uppercase tracking-wide text-white/60 mb-1">{label}</span>
      </MicroTilt>
      <TiltItem active={focused}>
        <textarea
          {...props}
          onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => { props.onFocus?.(e); setFocused(true); }}
          onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => { props.onBlur?.(e); setFocused(false); }}
          rows={6}
          className="w-full rounded-xl bg-white/10 text-white placeholder-white/40 border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-white/30"
        />
      </TiltItem>
    </label>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block mb-4">
      <MicroTilt className="inline-block"><span className="block text-xs uppercase tracking-wide text-white/60 mb-1">{label}</span></MicroTilt>
      <TiltItem>
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl bg-white/10 text-white border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-white/30 appearance-none pr-10"
          >
            <option value="" disabled hidden>Select...</option>
            {options.map((opt) => (
              <option key={opt} value={opt} className="bg-[#0b1020]">{opt || "—"}</option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60" />
        </div>
      </TiltItem>
    </label>
  );
}

function MultiSelect({ label, values, options, onChange }: { label: string; values: string[]; options: string[]; onChange: (vals: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    function updatePos() {
      const el = btnRef.current; if (!el) return;
      const r = el.getBoundingClientRect();
      setPos({ top: r.bottom + 8, left: Math.min(r.left, Math.max(8, window.innerWidth - 300)), width: r.width });
    }
    if (open) {
      updatePos();
      window.addEventListener("scroll", updatePos, true);
      window.addEventListener("resize", updatePos);
    }
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [open]);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (btnRef.current && (btnRef.current === t || btnRef.current.contains(t))) return;
      setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function toggle(opt: string) {
    if (values.includes(opt)) onChange(values.filter((v) => v !== opt));
    else onChange([...values, opt]);
  }

  return (
    <div className="mb-4">
      <MicroTilt className="inline-block"><span className="block text-xs uppercase tracking-wide text-white/60 mb-1">{label}</span></MicroTilt>
      <TiltItem>
        <button type="button" ref={btnRef} onClick={() => setOpen((o) => !o)} className="w-full rounded-xl bg-white/10 text-white border border-white/15 px-4 py-3 text-left">
          {values.length ? (
            <div className="flex flex-wrap gap-2">
              {values.map((v) => <span key={v} className="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/15">{v}</span>)}
            </div>
          ) : <span className="text-white/50">Select one or more…</span>}
        </button>
      </TiltItem>
      {open && pos && createPortal(
        <div style={{ position: "fixed", top: pos.top, left: pos.left, width: Math.max(260, pos.width), zIndex: 50 }} className="card p-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="w-full mb-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/15 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30" />
          <div className="max-h-56 overflow-y-auto">
            {filtered.map((o) => (
              <label key={o} className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/10">
                <input type="checkbox" checked={values.includes(o)} onChange={() => toggle(o)} className="accent-sky-400" />
                <span>{o}</span>
              </label>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function TagsInput({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const v = input.trim();
      if (v && !values.includes(v)) onChange([...values, v]);
      setInput("");
    }
    if (e.key === "Backspace" && !input && values.length) {
      onChange(values.slice(0, -1));
    }
  }
  return (
    <label className="block mb-4">
      <MicroTilt className="inline-block"><span className="block text-xs uppercase tracking-wide text-white/60 mb-1">{label}</span></MicroTilt>
      <TiltItem>
        <div className="w-full rounded-xl bg-white/10 text-white border border-white/15 px-3 py-2 flex items-center gap-2 flex-wrap">
          {values.map((v) => (
            <span key={v} className="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/15 flex items-center gap-1">
              {v}
              <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="text-white/60 hover:text-white">×</button>
            </span>
          ))}
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} placeholder={placeholder} className="flex-1 bg-transparent outline-none px-1 py-1 placeholder-white/40" />
        </div>
      </TiltItem>
    </label>
  );
}

function CountrySelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const countries = ["India", "United States", "United Kingdom", "Singapore", "Australia", "Canada", "Germany", "France", "Italy", "Netherlands", "Brazil", "UAE"];
  return <SelectField label={label} value={value} onChange={onChange} options={countries} />;
}

function RichTextEditor({ label, html, onChange }: { label: string; html: string; onChange: (html: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== html) {
      ref.current.innerHTML = html || "";
    }
  }, [html]);
  function emit() {
    onChange(ref.current?.innerHTML || "");
  }
  return (
    <div className="mb-4">
      <MicroTilt className="inline-block"><span className="block text-xs uppercase tracking-wide text-white/60 mb-1">{label}</span></MicroTilt>
      <TiltItem>
        <div
          ref={ref}
          contentEditable
          onInput={emit}
          className="min-h-[140px] w-full rounded-xl bg-white/10 text-white border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-white/30 prose prose-invert max-w-none"
          suppressContentEditableWarning
        />
      </TiltItem>
      <div className="text-xs text-white/50 mt-1">Use basic formatting: bold, italic, lists.</div>
    </div>
  );
}

function AccountForm({ value, onChange }: { value: Account; onChange: (v: Account) => void }) {
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email);
  const phoneDigits = (value.phone || "").replace(/\D/g, "");
  const phoneValid = phoneDigits.length >= 7 && phoneDigits.length <= 15;
  const passLen = (value.password || "").length >= 8;
  const passNum = /\d/.test(value.password || "");
  const passAlpha = /[A-Za-z]/.test(value.password || "");
  const passMatch = value.password === value.confirmPassword && value.confirmPassword.length > 0;
  const linkedinValid = !value.linkedin || /^https?:\/\//i.test(value.linkedin);

  return (
    <div>
      <Field label="Full name" value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} placeholder="Jane Doe" />
  {!value.name && <HintParallax className="text-xs text-white/40 -mt-3 mb-3">Enter your full name.</HintParallax>}

      <Field label="Email" type="email" value={value.email} onChange={(e) => onChange({ ...value, email: e.target.value })} placeholder="jane@startup.com" />
      {value.email && !emailValid && (
        <HintParallax className="text-xs text-red-300 -mt-3 mb-3">Use a valid email like name@domain.com</HintParallax>
      )}

      <label className="block mb-4">
        <span className="block text-xs uppercase tracking-wide text-white/60 mb-1">Phone</span>
        <TiltItem>
          <div className="flex items-center gap-2">
            <CountryCodeSelect value={value.phoneCountry} onChange={(cc) => onChange({ ...value, phoneCountry: cc })} />
            <input type="tel" value={value.phone} onChange={(e) => onChange({ ...value, phone: e.target.value })} placeholder="98765 43210" className="flex-1 h-[44px] rounded-xl bg-white/10 text-white placeholder-white/40 border border-white/15 px-4 outline-none focus:ring-2 focus:ring-white/30" />
          </div>
        </TiltItem>
      </label>
      {value.phone && !phoneValid && (
        <HintParallax className="text-xs text-red-300 -mt-3 mb-3">Enter 7–15 digits. Example: {value.phoneCountry} 9876543210</HintParallax>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Password" type="password" value={value.password} onChange={(e) => onChange({ ...value, password: e.target.value })} placeholder="••••••••" />
        <Field label="Confirm Password" type="password" value={value.confirmPassword} onChange={(e) => onChange({ ...value, confirmPassword: e.target.value })} placeholder="••••••••" />
      </div>
      {(value.password || value.confirmPassword) && (
        <ul className="text-xs mt-2 space-y-1">
          <motion.li whileHover={{ y: -1, rotateZ: -0.5 }} className={passLen ? "text-green-300" : "text-red-300"}>• At least 8 characters</motion.li>
          <motion.li whileHover={{ y: -1, rotateZ: 0.3 }} className={passAlpha ? "text-green-300" : "text-red-300"}>• Contains a letter</motion.li>
          <motion.li whileHover={{ y: -1, rotateZ: -0.2 }} className={passNum ? "text-green-300" : "text-red-300"}>• Contains a number</motion.li>
          <motion.li whileHover={{ y: -1, rotateZ: 0.4 }} className={passMatch ? "text-green-300" : "text-red-300"}>• Matches confirm password</motion.li>
        </ul>
      )}

      <Field label="LinkedIn Profile (optional)" type="url" value={value.linkedin || ""} onChange={(e) => onChange({ ...value, linkedin: e.target.value })} placeholder="https://linkedin.com/in/username" />
      {value.linkedin && !linkedinValid && (
        <HintParallax className="text-xs text-red-300 -mt-3 mb-3">Enter a valid URL starting with http(s)://</HintParallax>
      )}
    </div>
  );
}

type CC = { code: string; label: string; flag: string };
const CC_LIST: CC[] = [
  { code: "+91", label: "India", flag: "🇮🇳" },
  { code: "+1", label: "United States", flag: "🇺🇸" },
  { code: "+44", label: "United Kingdom", flag: "🇬🇧" },
  { code: "+971", label: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+65", label: "Singapore", flag: "🇸🇬" },
  { code: "+61", label: "Australia", flag: "🇦🇺" },
  { code: "+1", label: "Canada", flag: "🇨🇦" },
  { code: "+49", label: "Germany", flag: "🇩🇪" },
  { code: "+33", label: "France", flag: "🇫🇷" },
  { code: "+39", label: "Italy", flag: "🇮🇹" },
  { code: "+31", label: "Netherlands", flag: "🇳🇱" },
  { code: "+55", label: "Brazil", flag: "🇧🇷" },
];

function CountryCodeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const current = CC_LIST.find((c) => c.code === value) || CC_LIST[0];
  const list = CC_LIST.filter((c) => (c.label + c.code).toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    function updatePos() {
      const el = btnRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const top = rect.bottom + 8; // 8px gap
      const left = Math.min(rect.left, Math.max(8, window.innerWidth - 280)); // keep on screen
      setPos({ top, left, width: rect.width });
    }
    if (open) {
      updatePos();
      window.addEventListener("scroll", updatePos, true);
      window.addEventListener("resize", updatePos);
    }
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [open]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (btnRef.current && (btnRef.current === target || btnRef.current.contains(target))) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    if (open) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="inline-block">
      <button ref={btnRef} type="button" onClick={() => setOpen((o) => !o)} className="rounded-xl h-[44px] bg-white/10 text-white border border-white/15 px-3 flex items-center gap-2 w-28 sm:w-32 justify-between">
        <span className="flex items-center gap-2"><span>{current.flag}</span><span className="text-white/80">{current.code}</span></span>
        <ChevronDown size={16} className="text-white/60" />
      </button>
      {open && pos && createPortal(
        <div style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 50, width: 256 }} className="card p-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search country" className="w-full mb-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/15 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30" />
          <div className="max-h-56 overflow-y-auto space-y-1">
            {list.map((c) => (
              <button key={c.label + c.code} type="button" onClick={() => { onChange(c.code); setOpen(false); }} className="w-full text-left px-2 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2">
                <span>{c.flag}</span>
                <span className="flex-1 text-sm">{c.label}</span>
                <span className="text-white/60 text-sm">{c.code}</span>
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function StartupForm({ value, onChange }: { value: Startup; onChange: (v: Startup) => void }) {
  function onLogoChange(file?: File) {
    if (!file) return onChange({ ...value, logo: undefined });
    const extOk = file.type === "image/png" || file.type === "image/svg+xml";
    if (!extOk) {
      alert("Please upload a PNG or SVG file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange({ ...value, logo: String(reader.result) });
    reader.readAsDataURL(file);
  }

  const taglineLen = value.tagline.length;
  const yearOk = /^\d{4}$/.test(value.foundingYear);

  return (
    <div>
      <Field label="Startup Name" value={value.startupName} onChange={(e) => onChange({ ...value, startupName: e.target.value })} placeholder="Acme Labs" />

      <div className="flex items-center gap-4 mb-4">
        <TiltItem>
          <div className="size-14 rounded-xl bg-white/10 border border-white/15 grid place-items-center overflow-hidden">
            {value.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value.logo} alt="Startup logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white/50 text-xs">Logo</span>
            )}
          </div>
        </TiltItem>
        <label className="btn-outline px-3 py-2 cursor-pointer text-sm">
          <input type="file" accept="image/png,image/svg+xml" className="hidden" onChange={(e) => onLogoChange(e.target.files?.[0])} />
          Upload logo (PNG/SVG)
        </label>
      </div>

      <Field label="Tagline / One-liner (max 150)" value={value.tagline} onChange={(e) => onChange({ ...value, tagline: e.target.value.slice(0, 150) })} placeholder="Build the future of ..." />
      <div className="-mt-3 mb-3 text-xs text-white/50">{taglineLen}/150</div>

      <Field label="Startup Website URL (optional)" type="url" value={value.website || ""} onChange={(e) => onChange({ ...value, website: e.target.value })} placeholder="https://example.com" />

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Founding Year (YYYY)" value={value.foundingYear} onChange={(e) => onChange({ ...value, foundingYear: e.target.value.replace(/[^\d]/g, '').slice(0,4) })} placeholder="2024" />
        {!yearOk && value.foundingYear && <HintParallax className="text-xs text-red-300 -mt-3 mb-3">Enter a 4-digit year</HintParallax>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <CountrySelect label="Country" value={value.hqCountry} onChange={(v) => onChange({ ...value, hqCountry: v })} />
        <Field label="State/Province" value={value.hqState} onChange={(e) => onChange({ ...value, hqState: e.target.value })} placeholder="State" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="City" value={value.hqCity} onChange={(e) => onChange({ ...value, hqCity: e.target.value })} placeholder="City" />
        <Field label="Pincode / ZIP" value={value.hqZip} onChange={(e) => onChange({ ...value, hqZip: e.target.value.replace(/[^\d]/g, '') })} placeholder="123456" />
      </div>
    </div>
  );
}

function CompanyForm({ value, onChange }: { value: Company; onChange: (v: Company) => void }) {
  const types = ["Tech", "Non-Tech", "SaaS", "eCommerce", "EdTech", "FinTech", "AI/ML", "HealthTech"];
  const stages = ["Idea", "Prototype", "MVP", "Early Revenue", "Growth", "Scaling"];
  const employees = ["1–5", "6–10", "11–50", "51–200", "200+"];
  const funding = ["Bootstrapped", "Pre-Seed", "Seed", "Series A", "Series B", "Series C", "Public"];
  const industryOptions = ["Fintech", "Health", "SaaS", "EdTech", "AI/ML", "eCommerce", "HealthTech", "GovTech", "Climate", "Gaming"];
  const revenueRanges = ["< $50k", "$50k–$200k", "$200k–$1M", "$1M–$5M", ">$5M"];

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-4">
        <SelectField label="Startup Type" value={value.startupType} onChange={(v) => onChange({ ...value, startupType: v })} options={types} />
        <SelectField label="Stage" value={value.stage} onChange={(v) => onChange({ ...value, stage: v })} options={stages} />
      </div>

      <div className="mt-4">
        <MultiSelect label="Industry / Sector" values={value.industries} options={industryOptions} onChange={(vals) => onChange({ ...value, industries: vals })} />
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-4">
        <Field label="Number of Founders" value={value.foundersCount} onChange={(e) => onChange({ ...value, foundersCount: e.target.value.replace(/[^\d]/g, '') })} placeholder="2" />
        <SelectField label="Employees" value={value.employeesRange} onChange={(v) => onChange({ ...value, employeesRange: v })} options={employees} />
        <SelectField label="Funding Status" value={value.fundingStatus} onChange={(v) => onChange({ ...value, fundingStatus: v })} options={funding} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <Field label="Investor Names (optional)" value={value.investors || ""} onChange={(e) => onChange({ ...value, investors: e.target.value })} placeholder="Investor A, Investor B" />
        <SelectField label="Annual Revenue (optional)" value={value.revenueRange || ""} onChange={(v) => onChange({ ...value, revenueRange: v })} options={["", ...revenueRanges]} />
      </div>

      <Field label="Company Registration Number (optional)" value={value.registrationNumber || ""} onChange={(e) => onChange({ ...value, registrationNumber: e.target.value })} placeholder="CIN / Reg#" />
    </div>
  );
}

function DescriptionForm({ value, onChange }: { value: FormData["description"]; onChange: (v: FormData["description"]) => void }) {
  return (
    <div>
      <TextArea label="Mission Statement" value={value.mission} onChange={(e) => onChange({ ...value, mission: e.target.value })} placeholder="Why do you exist?" />
      <TextArea label="Vision Statement" value={value.vision} onChange={(e) => onChange({ ...value, vision: e.target.value })} placeholder="Where are you heading?" />

      <RichTextEditor label="Detailed Description" html={value.detailsHtml} onChange={(html) => onChange({ ...value, detailsHtml: html })} />

      <TagsInput label="Key Products / Services" values={value.products} onChange={(vals) => onChange({ ...value, products: vals })} placeholder="Press Enter to add" />

      <div className="grid sm:grid-cols-2 gap-4">
        <SelectField label="Target Audience" value={value.audience} onChange={(v) => onChange({ ...value, audience: v })} options={["B2B", "B2C", "B2G", "Niche Industries"]} />
        <SelectField label="Business Model" value={value.businessModel} onChange={(v) => onChange({ ...value, businessModel: v })} options={["Subscription", "Marketplace", "Direct Sales", "Freemium", "Other"]} />
      </div>
    </div>
  );
}

// (Old FloatingPreview removed; replaced with CubePreview3D)

// New: Interactive 3D cube preview
function CubePreview3D({ data, step, onSelectStep }: { data: FormData; step: number; onSelectStep: (i: number) => void }) {
  const size = 260; // face size in px
  const rx = useMotionValue(-8);
  const ry = useMotionValue(-15);
  const springRx = rx; // simple, responsive motion already smooth
  const springRy = ry;
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const vel = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const lastMove = useRef<number>(Date.now());
  const rafRef = useRef<number | null>(null);
  const lightX = useMotionValue(0);
  const lightY = useMotionValue(0);
  const sheen = useMotionTemplate`radial-gradient(340px circle at ${lightX}px ${lightY}px, rgba(99,102,241,0.18), rgba(59,130,246,0.08) 35%, transparent 60%)`;

  // Auto-rotate cube to the current step face
  useEffect(() => {
    const faceYaw: Record<number, number> = {
      0: 0,    // Founder -> front
      1: -90,  // Startup -> right
      2: -180, // Company -> back
      3: 90,   // About -> left
    };
    // Only change yaw, preserve current pitch a bit for depth
    ry.set(faceYaw[step] ?? 0);
  }, [step, ry]);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!draggingRef.current) return;
      const prev = lastPos.current;
      if (!prev) return;
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      const k = 0.4;
      const newRy = ry.get() + dx * k;
      const newRx = rx.get() - dy * k;
      vel.current.vy = dx * k; // note: vy corresponds to yaw (ry)
      vel.current.vx = -dy * k; // vx corresponds to pitch (rx)
      ry.set(newRy);
      rx.set(newRx);
      lastMove.current = Date.now();
    }
    function onUp() {
      draggingRef.current = false;
      lastPos.current = null;
      // Inertia spin
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      function stepInertia() {
        const f = 0.94; // friction
        vel.current.vx *= f;
        vel.current.vy *= f;
        if (Math.abs(vel.current.vx) < 0.01 && Math.abs(vel.current.vy) < 0.01) return;
        rx.set(rx.get() + vel.current.vx);
        ry.set(ry.get() + vel.current.vy);
        rafRef.current = requestAnimationFrame(stepInertia);
      }
      rafRef.current = requestAnimationFrame(stepInertia);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  function onTouchMove(e: TouchEvent) {
      if (!draggingRef.current) return;
      const t = e.touches[0];
      if (!t) return;
      const prev = lastPos.current;
      if (!prev) return;
      const dx = t.clientX - prev.x;
      const dy = t.clientY - prev.y;
      lastPos.current = { x: t.clientX, y: t.clientY };
      const k = 0.4;
      const newRy = ry.get() + dx * k;
      const newRx = rx.get() - dy * k;
      vel.current.vy = dx * k;
      vel.current.vx = -dy * k;
      ry.set(newRy);
      rx.set(newRx);
      lastMove.current = Date.now();
    }
    function onTouchEnd() {
      draggingRef.current = false;
      lastPos.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      function stepInertia() {
        const f = 0.94;
        vel.current.vx *= f;
        vel.current.vy *= f;
        if (Math.abs(vel.current.vx) < 0.01 && Math.abs(vel.current.vy) < 0.01) return;
        rx.set(rx.get() + vel.current.vx);
        ry.set(ry.get() + vel.current.vy);
        rafRef.current = requestAnimationFrame(stepInertia);
      }
      rafRef.current = requestAnimationFrame(stepInertia);
    }
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [rx, ry]);

  function onDown(e: React.MouseEvent) {
    draggingRef.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }
  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    if (!t) return;
    draggingRef.current = true;
    lastPos.current = { x: t.clientX, y: t.clientY };
  }

  // Idle gentle auto-rotate
  useEffect(() => {
    let raf: number;
    function loop() {
      const idleMs = Date.now() - lastMove.current;
      if (!draggingRef.current && idleMs > 2500) {
        ry.set(ry.get() - 0.08);
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ry]);

  const faces = [
    { key: "Founder", lines: [data.account.name || "Your name", data.account.email || "email@domain"] },
    { key: "Startup", lines: [data.startup.startupName || "Startup Name", data.startup.tagline || "Tagline"], icon: data.startup.logo },
    { key: "Company", lines: [data.company.startupType || "Type", data.company.stage || "Stage"] },
    { key: "About", lines: [data.description.mission || "Mission" ] },
  ];

  function onContainerMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    lightX.set(e.clientX - rect.left);
    lightY.set(e.clientY - rect.top);
  }

  function snapYaw(deg: number) {
    ry.set(deg);
  }

  return (
    <div className="relative h-full min-h-[420px]">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-2xl" />
      <div ref={containerRef} onMouseMove={onContainerMove} className="relative grid place-items-center h-full [perspective:1100px]">
        {/* Lighting sheen following pointer */}
        <motion.div aria-hidden className="pointer-events-none absolute inset-8 rounded-3xl" style={{ background: sheen, filter: "blur(12px)" }} />
  <motion.div onMouseDown={onDown} onTouchStart={onTouchStart} style={{ rotateX: springRx, rotateY: springRy }} className="relative [transform-style:preserve-3d] select-none cursor-grab active:cursor-grabbing" aria-label="3D preview cube">
          {/* Shadow under cube */}
          <motion.div aria-hidden className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[230px] h-12 rounded-full bg-black/50 blur-2xl" style={{ opacity: 0.55 }} />

          {/* Cube faces */}
          <Face label={faces[0].key} lines={faces[0].lines} size={size} style={{ transform: `translateZ(${size / 2}px)` }} highlight={step === 0} rx={rx} ry={ry} onSnap={() => { snapYaw(0); onSelectStep(0); }} />
          <Face label={faces[1].key} lines={faces[1].lines} size={size} style={{ transform: `rotateY(90deg) translateZ(${size / 2}px)` }} image={faces[1].icon} highlight={step === 1} rx={rx} ry={ry} onSnap={() => { snapYaw(-90); onSelectStep(1); }} />
          <Face label={faces[2].key} lines={faces[2].lines} size={size} style={{ transform: `rotateY(180deg) translateZ(${size / 2}px)` }} image={faces[2].icon} highlight={step === 2} rx={rx} ry={ry} onSnap={() => { snapYaw(-180); onSelectStep(2); }} />
          <Face label={faces[3].key} lines={faces[3].lines} size={size} style={{ transform: `rotateY(-90deg) translateZ(${size / 2}px)` }} highlight={step === 3} rx={rx} ry={ry} onSnap={() => { snapYaw(90); onSelectStep(3); }} />
          {/* Top and bottom for polish */}
          <div className="absolute" style={{ width: size, height: size, transform: `rotateX(90deg) translateZ(${size / 2}px)`, background: "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.02))", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, boxShadow: "0 0 40px rgba(99,102,241,0.18) inset" }} />
          <div className="absolute" style={{ width: size, height: size, transform: `rotateX(-90deg) translateZ(${size / 2}px)`, background: "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.02))", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, boxShadow: "0 0 40px rgba(59,130,246,0.18) inset" }} />
        </motion.div>
      </div>
    </div>
  );
}

function Face({ label, lines, size, style, image, highlight, rx, ry, onSnap }: { label: string; lines: string[]; size: number; style: React.CSSProperties; image?: string; highlight?: boolean; rx: ReturnType<typeof useMotionValue<number>>; ry: ReturnType<typeof useMotionValue<number>>; onSnap: () => void }) {
  const x = useTransform(ry, (v) => v * -0.6);
  const y = useTransform(rx, (v) => v * 0.6);
  const contentTransform = useMotionTemplate`translateZ(22px) translateX(${x}px) translateY(${y}px)`;
  return (
    <div className="absolute [backface-visibility:hidden] rounded-2xl overflow-hidden" style={{ width: size, height: size, ...style }} onClick={onSnap}>
      <div className="w-full h-full relative card p-4 sm:p-5 border border-white/15 shadow-[0_0_24px_rgba(99,102,241,0.12),_0_0_24px_rgba(59,130,246,0.12)] [transform-style:preserve-3d]">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="icon" className="absolute top-3 right-3 size-8 rounded-md border border-white/20" />
        )}
        <motion.div style={{ transform: contentTransform }}>
          <div className="text-white/60 text-xs">{label}</div>
          <div className="text-white font-semibold leading-tight mt-1 line-clamp-2 break-words">{lines[0]}</div>
          {lines[1] && <div className="text-white/70 text-sm mt-0.5 line-clamp-1 break-words">{lines[1]}</div>}
        </motion.div>
        {/* Glow ring when highlighted */}
        {highlight && <div className="absolute inset-0 rounded-2xl ring-2 ring-sky-300/50 shadow-[0_0_60px_rgba(56,189,248,0.35)] pointer-events-none" />}
      </div>
    </div>
  );
}
