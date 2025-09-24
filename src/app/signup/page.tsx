"use client";
//           filter: "blur(2px)",
//         }),
//         center: {
//           opacity: 1,
//           rotateY: 0,
//           x: 0,
//           z: 0,
//           scale: 1,
//           filter: "blur(0px)",
//           transition: { type: "spring", stiffness: 240, damping: 26 },
//         },
//         exit: (dir: 1 | -1) => ({
//           opacity: 0,
//           rotateY: dir > 0 ? 35 : -35,
//           x: dir > 0 ? -120 : 120,
//           z: -160,
//           scale: 0.94,
//           filter: "blur(3px)",
//           transition: { duration: 0.28 },
//         }),
//       } as const;

//   // Keyboard navigation (Left/Right/Enter)
//   useEffect(() => {
//     function onKey(e: KeyboardEvent) {
//       if (e.key === "ArrowLeft") prev();
//       if (e.key === "ArrowRight") {
//         if (step === 0 && !canNext) return;
//         next();
//       }
//       if (e.key === "Enter") {
//         if (step < steps.length - 1) {
//           if (step === 0 && !canNext) return;
//           next();
//         } else {
//           setShowSuccess(true);
//         }
//       }
//     }
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [step, canNext]);

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//   <Navbar hideLinks />
//       <ParticlesBG />
//       <div className="absolute inset-0 star-gradient -z-10" />
//       <div className="absolute inset-0 grid-overlay -z-10 opacity-40" />

//       {/* Ambient orbs */}
//       <div className="pointer-events-none absolute -z-10 inset-0">
//         <div className="absolute -top-24 -left-20 size-80 rounded-full bg-purple-500/25 blur-3xl" />
//         <div className="absolute bottom-0 -right-20 size-96 rounded-full bg-blue-500/20 blur-3xl" />
//       </div>

//       <main className="pt-24 pb-16 px-6">
//         <section className="container-1200 mx-auto">
//           <div className="flex items-center justify-between gap-4">
//             <div>
//               <h1 className="text-3xl sm:text-4xl font-extrabold">Get Started</h1>
//               <p className="text-white/60 mt-1">Step {step + 1} of {steps.length} — {steps[step]}</p>
//             </div>
//             <ProgressDots step={step} />
//           </div>

//           {/* Interactive 3D Step Cards */}
//           <StepCards data={data} step={step} onSelect={(i) => setStep(i)} />

//           {/* 3D Stage + Interactive Cube (right) */}
//           <div className="mt-10 grid md:grid-cols-[minmax(0,640px)_1fr] gap-10 items-start">
//             {/* Left: Wizard */}
//             <div className="relative">
//               <StageLights />
//               <motion.div className="relative w-full" style={{ perspective: 1400 }}>
//                 <StepSlider3D
//                   step={step}
//                   total={steps.length}
//                   labels={[...steps]}
//                   onChange={(i) => {
//                     if (i === step) return;
//                     setDirection(i > step ? 1 : -1);
//                     setStep(i);
//                     setBurstKey((k) => k + 1);
//                   }}
//                 />
//                 {/* Ghost stack for depth */}
//                 <GhostPanel index={step - 1} title={steps[step - 1]} offset={-1} />
//                 <GhostPanel index={step + 1} title={steps[step + 1]} offset={1} />

//                 <AnimatePresence mode="wait" custom={direction}>
//                   <motion.div
//                     key={step}
//                     custom={direction}
//                     variants={pane}
//                     initial="enter"
//                     animate="center"
//                     exit="exit"
//                     className="relative [transform-style:preserve-3d]"
//                     onTouchStart={(e) => (touchStartX.current = e.touches[0]?.clientX ?? 0)}
//                     onTouchEnd={(e) => {
//                       const x = e.changedTouches[0]?.clientX ?? 0;
//                       const dx = x - (touchStartX.current ?? 0);
//                       const threshold = 70;
//                       if (dx > threshold) {
//                         prev();
//                       } else if (dx < -threshold) {
//                         if (step === 0 && !canNext) return;
//                         next();
//                       }
//                     }}
//                   >
//                     <ModalShell>
//                       {step === 0 && (
//                         <AccountForm value={data.account} onChange={(v) => update("account", v)} />
//                       )}
//                       {step === 1 && (
//                         <StartupForm value={data.startup} onChange={(v) => update("startup", v)} />
//                       )}
//                       {step === 2 && (
//                         <CompanyForm value={data.company} onChange={(v) => update("company", v)} />
//                       )}
//                       {step === 3 && (
//                         <DescriptionForm value={data.description} onChange={(v) => update("description", v)} />
//                       )}

//                       <div className="mt-8 flex items-center gap-3">
//                         <Button variant="outline" onClick={prev} disabled={step === 0}>Back</Button>
//                         {step < steps.length - 1 ? (
//                           <Button onClick={next} disabled={!canNext} magnetic>Next</Button>
//                         ) : (
//                           <Button onClick={() => setShowSuccess(true)} magnetic>Finish</Button>
//                         )}
//                       </div>
//                     </ModalShell>
//                     <StepBurst key={burstKey} />
//                   </motion.div>
//                 </AnimatePresence>
//               </motion.div>
//             </div>

//             {/* Right: Interactive Cube */}
//             <div className="relative mt-6 md:mt-0 md:sticky md:top-1/2 md:-translate-y-1/2 md:transform">
//               <CubePreview3D data={data} step={step} onSelectStep={(i) => setStep(i)} />
//             </div>
//           </div>
//           {/* Success Overlay */}
//           <AnimatePresence>
//             {showSuccess && (
//               <SuccessOverlay onClose={() => setShowSuccess(false)} />
//             )}
//           </AnimatePresence>
//         </section>
//       </main>
//     </div>
//   );
// }

// // 3D Tilt helpers
// // 3D Modal shell with sheen and soft border glow
// function ModalShell({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-[0_10px_50px_rgba(0,0,0,.35)]">
//       <SheenOverlay />
//       <div className="p-6 sm:p-8">
//         {children}
//       </div>
//       <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
//     </div>
//   );
// }

// function StageLights() {
//   const ref = useRef<HTMLDivElement>(null);
//   const x = useMotionValue(0);
//   const y = useMotionValue(0);
//   const bg = useMotionTemplate`radial-gradient(420px 280px at ${x}px ${y}px, rgba(99,102,241,0.15), transparent 60%)`;
//   useEffect(() => {
//     function onMove(e: MouseEvent) {
//       const el = ref.current?.parentElement as HTMLElement | null;
//       if (!el) return;
//       const r = el.getBoundingClientRect();
//       x.set(e.clientX - r.left);
//       y.set(e.clientY - r.top);
//     }
//     window.addEventListener("mousemove", onMove);
//     return () => window.removeEventListener("mousemove", onMove);
//   }, [x, y]);
//   return <motion.div ref={ref} className="absolute inset-0 -z-10" style={{ background: bg }} aria-hidden />;
// }

// function SheenOverlay() {
//   const ref = useRef<HTMLDivElement>(null);
//   const x = useMotionValue(0);
//   const y = useMotionValue(0);
//   const bg = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, rgba(99,102,241,0.22), transparent 60%)`;

//   useEffect(() => {
//     function onMove(e: MouseEvent) {
//       const el = ref.current?.parentElement as HTMLElement | null;
//       if (!el) return;
//       const rect = el.getBoundingClientRect();
//       const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
//       if (inside) {
//         x.set(e.clientX - rect.left);
//         y.set(e.clientY - rect.top);
//       }
//     }
//     window.addEventListener("mousemove", onMove);
//     return () => window.removeEventListener("mousemove", onMove);
//   }, [x, y]);

//   return (
//     <motion.div ref={ref} className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: bg }} />
//   );
// }

// function StepCards({ data, step, onSelect }: { data: FormData; step: number; onSelect: (i: number) => void }) {
//   // completion per step (0..1)
//   const accountDone = (() => {
//     const a = data.account;
//     const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email);
//     const pwdOk = a.password.length >= 8 && a.password === a.confirmPassword;
//     const nameOk = a.name.trim().length > 1;
//     const digits = a.phone.replace(/\D/g, "");
//     const phoneOk = digits.length >= 7 && digits.length <= 15;
//     const linkedinOk = !a.linkedin || /^https?:\/\//i.test(a.linkedin);
//     const checks = [nameOk, emailOk, phoneOk, pwdOk, linkedinOk];
//     return checks.filter(Boolean).length / checks.length;
//   })();
//   const startupFields = [
//     data.startup.startupName,
//     data.startup.logo,
//     data.startup.tagline,
//     data.startup.foundingYear,
//     data.startup.hqCountry,
//     data.startup.hqState,
//     data.startup.hqCity,
//     data.startup.hqZip,
//   ];
//   const startupDone = startupFields.filter((v) => !!(v && String(v).toString().trim().length > 0)).length / startupFields.length;
//   const companyFields = [
//     data.company.startupType,
//     data.company.industries.length > 0 ? "ok" : "",
//     data.company.stage,
//     data.company.foundersCount,
//     data.company.employeesRange,
//     data.company.fundingStatus,
//   ];
//   const companyDone = companyFields.filter((v) => !!(v && String(v).trim().length > 0)).length / companyFields.length;
//   const descriptionDone = (
//     (data.description.mission || "").trim() &&
//     (data.description.vision || "").trim() &&
//     (data.description.detailsHtml || "").trim() &&
//     data.description.products.length > 0 &&
//     (data.description.audience || "").trim() &&
//     (data.description.businessModel || "").trim()
//   ) ? 1 : 0;

//   const items = [
//   { title: "Account Details", pct: accountDone },
//   { title: "Startup Basic Info", pct: startupDone },
//   { title: "Company Profile", pct: companyDone },
//   { title: "Detailed Description", pct: descriptionDone },
//   ];

//   return (
//     <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
//       {items.map((it, i) => (
//         <StepCard key={it.title} active={step === i} title={it.title} pct={it.pct} onClick={() => onSelect(i)} />
//       ))}
//     </div>
//   );
// }

// function StepCard({ title, pct, active, onClick }: { title: string; pct: number; active: boolean; onClick: () => void }) {
//   const ref = useRef<HTMLDivElement>(null);
//   const rx = useMotionValue(0);
//   const ry = useMotionValue(0);
//   const lx = useMotionValue(0);
//   const ly = useMotionValue(0);
//   const sheen = useMotionTemplate`radial-gradient(180px 140px at ${lx}px ${ly}px, rgba(255,255,255,0.12), transparent 60%)`;
//   const intensity = 12;
//   function onMove(e: React.MouseEvent<HTMLDivElement>) {
//     const el = ref.current; if (!el) return;
//     const r = el.getBoundingClientRect();
//     const px = (e.clientX - r.left) / r.width;
//     const py = (e.clientY - r.top) / r.height;
//     ry.set((px - 0.5) * intensity);
//     rx.set((0.5 - py) * intensity);
//     lx.set(px * r.width);
//     ly.set(py * r.height);
//   }
//   function onLeave() { rx.set(0); ry.set(0); }
//   const pctLabel = `${Math.round(pct * 100)}%`;

//   return (
//     <motion.div
//       ref={ref}
//       onMouseMove={onMove}
//       onMouseLeave={onLeave}
//       whileHover={{ y: -4 }}
//       whileTap={{ scale: 0.98 }}
//       style={{ rotateX: rx, rotateY: ry, perspective: 800 }}
//       className={`relative overflow-hidden rounded-2xl border px-4 py-4 select-none cursor-pointer ${active ? "border-sky-300/60 bg-white/10" : "border-white/12 bg-white/5"}`}
//       onClick={onClick}
//       tabIndex={0}
//       role="button"
//       onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
//       aria-pressed={active}
//     >
//       <motion.div className="pointer-events-none absolute inset-0" style={{ background: sheen }} aria-hidden />
//       <div className="flex items-center justify-between gap-2">
//         <div className="text-sm font-semibold">{title}</div>
//         {pct >= 1 ? (
//           <div className="flex items-center gap-1 text-emerald-300 text-xs">
//             <CheckCircle2 size={16} /> Done
//           </div>
//         ) : (
//           <div className="text-xs text-white/60">{pctLabel}</div>
//         )}
//       </div>
//       <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
//         <div className="h-full rounded-full bg-gradient-to-r from-purple-400 to-sky-400" style={{ width: pctLabel }} />
//       </div>
//     </motion.div>
//   );
// }

// function StepSlider3D({ step, total, onChange, labels }: { step: number; total: number; onChange: (i: number) => void; labels?: string[] }) {
//   const trackRef = useRef<HTMLDivElement>(null);
//   const [w, setW] = useState(0);
//   const handleX = useMotionValue(0);
//   const [dragging, setDragging] = useState(false);
//   const prefersReduced = useReducedMotion();
//   const [hoverIdx, setHoverIdx] = useState<number | null>(null);
//   const [burstAt, setBurstAt] = useState<number | null>(null);

//   // measure width
//   useEffect(() => {
//     function measure() {
//       const el = trackRef.current; if (!el) return;
//       setW(el.clientWidth);
//     }
//     measure();
//     const ro = new ResizeObserver(measure);
//     if (trackRef.current) ro.observe(trackRef.current);
//     return () => ro.disconnect();
//   }, []);

//   const segments = Math.max(1, total - 1);
//   const segW = w / segments;

//   // sync knob with external step changes
//   useEffect(() => {
//     const target = segW * step;
//     if (prefersReduced) {
//       handleX.set(target);
//     } else {
//       const controls = animate(handleX, target, { duration: 0.35, ease: "easeInOut" });
//       return () => controls.stop();
//     }
//   }, [step, segW, handleX, prefersReduced]);

//   // 3D lighting/sheens
//   const lx = useMotionValue(0);
//   const ly = useMotionValue(0);
//   const sheen = useMotionTemplate`radial-gradient(260px 120px at ${lx}px ${ly}px, rgba(99,102,241,0.18), transparent 60%)`;

//   // Animated scanlines across track (futuristic HUD)
//   const scanPos = useMotionValue(0);
//   useEffect(() => {
//     if (prefersReduced) return;
//     const controls = animate(scanPos, [0, 60], { duration: 2.4, repeat: Infinity, repeatType: "reverse", ease: "linear" });
//     return () => controls.stop();
//   }, [scanPos, prefersReduced]);

//   function onTrackMove(e: React.MouseEvent<HTMLDivElement>) {
//     const el = trackRef.current; if (!el) return;
//     const r = el.getBoundingClientRect();
//     lx.set(e.clientX - r.left); ly.set(e.clientY - r.top);
//     const px = (e.clientX - r.left) / Math.max(1, r.width);
//     const idx = Math.round(px * (total - 1));
//     setHoverIdx(Math.max(0, Math.min(total - 1, idx)));
//   }

//   function onTrackLeave() { setHoverIdx(null); }

//   function onTrackClick(e: React.MouseEvent<HTMLDivElement>) {
//     const el = trackRef.current; if (!el) return;
//     const r = el.getBoundingClientRect();
//     const px = (e.clientX - r.left) / Math.max(1, r.width);
//     const idx = Math.round(px * (total - 1));
//     onChange(Math.max(0, Math.min(total - 1, idx)));
//     setBurstAt(handleX.get());
//     setTimeout(() => setBurstAt(null), 600);
//   }

//   function onDragEnd() {
//     setDragging(false);
//     const raw = handleX.get();
//     const idx = Math.max(0, Math.min(total - 1, Math.round(raw / segW)));
//     onChange(idx);
//     setBurstAt(raw);
//     setTimeout(() => setBurstAt(null), 600);
//   }

//   // knob tilt
//   const kx = useMotionValue(0);
//   const ky = useMotionValue(0);
//   function onKnobMove(e: React.MouseEvent<HTMLDivElement>) {
//     const el = e.currentTarget as HTMLDivElement;
//     const r = el.getBoundingClientRect();
//     const px = (e.clientX - r.left) / r.width;
//     const py = (e.clientY - r.top) / r.height;
//     ky.set((px - 0.5) * 16);
//     kx.set((0.5 - py) * 16);
//   }
//   function onKnobLeave() { kx.set(0); ky.set(0); }

//   // pct available if needed for future UI readouts

//   // Neon spinning halo around knob
//   const spin = useMotionValue(0);
//   useEffect(() => {
//     if (prefersReduced) return;
//     const controls = animate(spin, 360, { duration: 6, ease: "linear", repeat: Infinity });
//     return () => controls.stop();
//   }, [spin, prefersReduced]);
//   const halo = useMotionTemplate`conic-gradient(from ${spin}deg, rgba(56,189,248,0.0), rgba(56,189,248,0.6) 20%, rgba(168,85,247,0.6) 50%, rgba(56,189,248,0.6) 80%, rgba(56,189,248,0.0))`;

//   return (
//     <div className="mb-4 select-none" onMouseMove={onTrackMove} onMouseLeave={onTrackLeave}>
//       <div ref={trackRef} className="relative h-10 w-full rounded-xl border border-white/10 bg-white/[0.06] overflow-visible"
//            onClick={onTrackClick}>
//         {/* sheen */}
//         <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-xl" style={{ background: sheen }} />
//         {/* scanlines */}
//         <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-xl mix-blend-screen opacity-40"
//           style={{
//             backgroundImage: useMotionTemplate`repeating-linear-gradient(90deg, rgba(99,102,241,0.14) 0px, rgba(99,102,241,0.14) 1px, transparent 1px, transparent 8px)`,
//             backgroundPositionX: scanPos,
//             backgroundSize: "48px 100%",
//           }}
//         />
//         {/* fill */}
//         <motion.div aria-hidden className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-sky-400"
//           style={{ width: handleX }} />
//         {/* ticks */}
//         <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between">
//           {Array.from({ length: total }).map((_, i) => {
//             const active = i === step;
//             const near = hoverIdx === i;
//             return (
//               <div key={i} className="relative">
//                 <div className={`h-1.5 w-1.5 rounded-full transition-transform duration-150 ${i <= step ? "bg-sky-300" : "bg-white/30"}`}
//                   style={{ transform: prefersReduced ? undefined : `scale(${active ? 1.35 : near ? 1.2 : 1})` }} />
//                 {active && (
//                   <div className="absolute -inset-2 rounded-full bg-sky-300/25 blur-sm" aria-hidden />
//                 )}
//               </div>
//             );
//           })}
//         </div>
//         {/* knob */}
//         <motion.div
//           role="slider"
//           aria-valuemin={0}
//           aria-valuemax={total - 1}
//           aria-valuenow={step}
//           aria-label="Step"
//           drag="x"
//           dragMomentum={false}
//           dragConstraints={trackRef}
//           onDragStart={() => setDragging(true)}
//           onDragEnd={onDragEnd}
//           style={{ x: handleX, rotateX: kx, rotateY: ky }}
//           onMouseMove={onKnobMove}
//           onMouseLeave={onKnobLeave}
//           tabIndex={0}
//           onKeyDown={(e) => {
//             if (e.key === "ArrowRight") onChange(Math.min(total - 1, step + 1));
//             if (e.key === "ArrowLeft") onChange(Math.max(0, step - 1));
//           }}
//           className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 grid place-items-center h-8 w-8 rounded-2xl cursor-grab active:cursor-grabbing shadow-[0_10px_32px_rgba(56,189,248,0.35)] ${dragging ? "ring-2 ring-sky-300/60" : "ring-1 ring-white/20"} bg-gradient-to-br from-white/70 to-white/30 backdrop-blur`}
//         >
//           {/* halo */}
//           {!prefersReduced && (
//             <motion.div aria-hidden className="absolute -inset-0.5 rounded-2xl" style={{ background: halo, filter: "blur(5px)" }} />
//           )}
//           <div className="h-3 w-3 rounded-md bg-sky-400/80 shadow-[0_0_16px_rgba(56,189,248,0.7)_inset]" />
//         </motion.div>
//         {/* label bubble above knob */}
//         {labels && labels[step] && (
//           <motion.div className="absolute -translate-x-1/2 bottom-full mb-1.5 px-1.5 py-0.5 rounded-md text-[10px] bg-white/10 border border-white/15 backdrop-blur"
//             style={{ left: handleX }}>
//             {labels[step]}
//           </motion.div>
//         )}
//         {/* mini burst on snap */}
//         {burstAt !== null && (
//           <div className="pointer-events-none absolute inset-0">
//             <div className="absolute top-1/2 -translate-y-1/2" style={{ left: burstAt }}>
//               {Array.from({ length: 10 }).map((_, i) => {
//                 const angle = (i / 10) * Math.PI * 2;
//                 const dist = 10 + (i % 2) * 6;
//                 const x = Math.cos(angle) * dist;
//                 const y = Math.sin(angle) * dist;
//                 return (
//                   <motion.span key={i} className="absolute size-1.5 rounded-full bg-sky-300"
//                     initial={{ opacity: 0, x: 0, y: 0, scale: 0.6 }}
//                     animate={{ opacity: [0, 1, 0], x, y, scale: [0.6, 1, 0.4] }}
//                     transition={{ duration: 0.5, delay: i * 0.01, ease: "easeOut" }} />
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>
//       <div className="mt-2 text-xs text-white/60">{Math.round(((step + 1) / total) * 100)}% complete</div>
//     </div>
//   );
// }

// function StepBurst() {
//   // radial sparkles burst on step change
//   const dots = Array.from({ length: 14 }).map((_, i) => {
//     const angle = (i / 14) * Math.PI * 2;
//     const dist = 40 + (i % 3) * 16;
//     const x = Math.cos(angle) * dist;
//     const y = Math.sin(angle) * dist;
//     return { x, y, delay: i * 0.008 };
//   });
//   return (
//     <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden>
//       {dots.map((d, idx) => (
//         <motion.span
//           key={idx}
//           initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
//           animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.2], x: d.x, y: d.y }}
//           transition={{ duration: 0.6, delay: d.delay, ease: "easeOut" }}
//           className="size-1.5 rounded-full bg-white/70 shadow-[0_0_14px_rgba(255,255,255,.45)]"
//         />
//       ))}
//     </div>
//   );
// }

// function SuccessOverlay({ onClose }: { onClose: () => void }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm"
//       role="dialog"
//       aria-modal="true"
//     >
//       <motion.div
//         initial={{ y: 30, opacity: 0, scale: 0.98 }}
//         animate={{ y: 0, opacity: 1, scale: 1 }}
//         exit={{ y: 30, opacity: 0, scale: 0.98 }}
//         transition={{ type: "spring", stiffness: 260, damping: 22 }}
//         className="relative w-full max-w-md rounded-2xl border border-white/15 bg-white/10 p-6 text-center"
//       >
//         <Confetti />
//   <h3 className="text-2xl font-bold">You&apos;re all set!</h3>
//         <p className="text-white/70 mt-1">Your signup details are ready to submit.</p>
//         <div className="mt-6 flex items-center justify-center gap-3">
//           <Button onClick={onClose} variant="outline">Close</Button>
//           <Button onClick={() => { onClose(); alert("Submitted!"); }}>Submit</Button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

// function Confetti() {
//   const pieces = Array.from({ length: 24 });
//   return (
//     <div className="pointer-events-none absolute inset-0 overflow-hidden">
//       {pieces.map((_, i) => {
//         const left = Math.random() * 100;
//         const delay = Math.random() * 0.3;
//         const rot = (Math.random() - 0.5) * 120;
//         const color = i % 3 === 0 ? "bg-pink-400" : i % 3 === 1 ? "bg-yellow-300" : "bg-sky-400";
//         return (
//           <motion.span
//             key={i}
//             initial={{ y: -20, opacity: 0, rotate: 0 }}
//             animate={{ y: [ -20, 220, 300 ], opacity: [0, 1, 0.8], rotate: rot }}
//             transition={{ duration: 1.6, delay, ease: "easeOut" }}
//             style={{ left: `${left}%` }}
//             className={`absolute top-0 size-2 ${color} rounded-[2px] shadow-[0_0_10px_rgba(255,255,255,.3)]`}
//           />
//         );
//       })}
//     </div>
//   );
// }
// function GhostPanel({ index, title, offset }: { index: number; title?: string; offset: -1 | 1 }) {
//   if (index < 0 || index >= steps.length) return null;
//   const side = offset < 0 ? -1 : 1;
//   return (
//     <div
//       aria-hidden
//       className="absolute left-1/2 -translate-x-1/2 top-0 w-full max-w-3xl"
//       style={{ perspective: 1400 }}
//     >
//       <motion.div
//         className="rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-md"
//         style={{ transformOrigin: side < 0 ? "left center" : "right center" as const }}
//         initial={{ opacity: 0.12, rotateY: side * -25, x: side * -120, y: 22, scale: 0.98 }}
//         animate={{ opacity: 0.12, rotateY: side * -25, x: side * -120, y: 22, scale: 0.98 }}
//         transition={{ duration: 0.2 }}
//       >
//         <div className="px-6 py-4 text-white/50 text-sm">
//           {title ?? ""}
//         </div>
//         <div className="h-16" />
//       </motion.div>
//     </div>
//   );
// }

// // Generic 3D tilt wrapper with pointer-following sheen
// function TiltItem({ children, className, intensity = 12, active = false }: { children: React.ReactNode; className?: string; intensity?: number; active?: boolean }) {
//   const ref = useRef<HTMLDivElement>(null);
//   const rx = useMotionValue(0);
//   const ry = useMotionValue(0);
//   const lx = useMotionValue(0);
//   const ly = useMotionValue(0);
//   const sheen = useMotionTemplate`radial-gradient(220px 160px at ${lx}px ${ly}px, rgba(99,102,241,${active ? 0.28 : 0.18}), transparent 60%)`;

//   function onMove(e: React.MouseEvent<HTMLDivElement>) {
//     const el = ref.current; if (!el) return;
//     const r = el.getBoundingClientRect();
//     const px = (e.clientX - r.left) / r.width;
//     const py = (e.clientY - r.top) / r.height;
//     ry.set((px - 0.5) * intensity);
//     rx.set((0.5 - py) * intensity);
//     lx.set(px * r.width);
//     ly.set(py * r.height);
//   }
//   function onLeave() { rx.set(0); ry.set(0); }

//   return (
//     <motion.div
//       ref={ref}
//       onMouseMove={onMove}
//       onMouseLeave={onLeave}
//       style={{ rotateX: rx, rotateY: ry, perspective: 900 }}
//       className={`relative ${className ?? ""}`}
//     >
//       <motion.div className="pointer-events-none absolute inset-0 rounded-xl" style={{ background: sheen }} aria-hidden />
//       {children}
//     </motion.div>
//   );
// }

// // Lightweight micro-tilt for small UI text (labels, checklist)
// function MicroTilt({ children, className, intensity = 4 }: { children: React.ReactNode; className?: string; intensity?: number }) {
//   const ref = useRef<HTMLDivElement>(null);
//   const rx = useMotionValue(0);
//   const ry = useMotionValue(0);
//   function onMove(e: React.MouseEvent<HTMLDivElement>) {
//     const el = ref.current; if (!el) return;
//     const r = el.getBoundingClientRect();
//     const px = (e.clientX - r.left) / r.width;
//     const py = (e.clientY - r.top) / r.height;
//     ry.set((px - 0.5) * intensity);
//     rx.set((0.5 - py) * intensity);
//   }
//   function onLeave() { rx.set(0); ry.set(0); }
//   return (
//     <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ rotateX: rx, rotateY: ry }} className={className}>
//       {children}
//     </motion.div>
//   );
// }

// // Subtle parallax for inline validation messages
// function HintParallax({ children, className }: { children: React.ReactNode; className?: string }) {
//   const ref = useRef<HTMLDivElement>(null);
//   const tx = useMotionValue(0);
//   const ty = useMotionValue(0);
//   function onMove(e: React.MouseEvent<HTMLDivElement>) {
//     const el = ref.current; if (!el) return;
//     const r = el.getBoundingClientRect();
//     const dx = ((e.clientX - r.left) / r.width - 0.5) * 6; // max ~3px each side
//     const dy = ((e.clientY - r.top) / r.height - 0.5) * 6;
//     tx.set(dx);
//     ty.set(dy);
//   }
//   function onLeave() { tx.set(0); ty.set(0); }
//   return (
//     <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ x: tx, y: ty }} className={className}>
//       {children}
//     </motion.div>
//   );
// }

// function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
//   const [focused, setFocused] = useState(false);
//   return (
//     <label className="block mb-4">
//       <MicroTilt className="inline-block">
//         <span className="block text-xs uppercase tracking-wide text-white/60 mb-1">{label}</span>
//       </MicroTilt>
//       <TiltItem active={focused}>
//         <input
//           {...props}
//           onFocus={(e: React.FocusEvent<HTMLInputElement>) => { props.onFocus?.(e); setFocused(true); }}
//           onBlur={(e: React.FocusEvent<HTMLInputElement>) => { props.onBlur?.(e); setFocused(false); }}
//           className="w-full rounded-xl bg-white/10 text-white placeholder-white/40 border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-white/30"
//         />
//       </TiltItem>
//     </label>
//   );
// }

// function TextArea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
//   const [focused, setFocused] = useState(false);
//   return (
//     <label className="block mb-4">
//       <MicroTilt className="inline-block">
//         <span className="block text-xs uppercase tracking-wide text-white/60 mb-1">{label}</span>
//       </MicroTilt>
//       <TiltItem active={focused}>
//         <textarea
//           {...props}
//           onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => { props.onFocus?.(e); setFocused(true); }}
//           onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => { props.onBlur?.(e); setFocused(false); }}
//           rows={6}
//           className="w-full rounded-xl bg-white/10 text-white placeholder-white/40 border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-white/30"
//         />
//       </TiltItem>
//     </label>
//   );
// }

// function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
//   return (
//     <label className="block mb-4">
//       <MicroTilt className="inline-block"><span className="block text-xs uppercase tracking-wide text-white/60 mb-1">{label}</span></MicroTilt>
//       <TiltItem>
//         <div className="relative">
//           <select
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             className="w-full rounded-xl bg-white/10 text-white border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-white/30 appearance-none pr-10"
//           >
//             <option value="" disabled hidden>Select...</option>
//             {options.map((opt) => (
//               <option key={opt} value={opt} className="bg-[#0b1020]">{opt || "—"}</option>
//             ))}
//           </select>
//           <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60" />
//         </div>
//       </TiltItem>
//     </label>
//   );
// }

// function MultiSelect({ label, values, options, onChange }: { label: string; values: string[]; options: string[]; onChange: (vals: string[]) => void }) {
//   const [open, setOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const btnRef = useRef<HTMLButtonElement>(null);
//   const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
//   const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

//   useEffect(() => {
//     function updatePos() {
//       const el = btnRef.current; if (!el) return;
//       const r = el.getBoundingClientRect();
//       setPos({ top: r.bottom + 8, left: Math.min(r.left, Math.max(8, window.innerWidth - 300)), width: r.width });
//     }
//     if (open) {
//       updatePos();
//       window.addEventListener("scroll", updatePos, true);
//       window.addEventListener("resize", updatePos);
//     }
//     return () => {
//       window.removeEventListener("scroll", updatePos, true);
//       window.removeEventListener("resize", updatePos);
//     };
//   }, [open]);
//   useEffect(() => {
//     function onDoc(e: MouseEvent) {
//       const t = e.target as Node;
//       if (btnRef.current && (btnRef.current === t || btnRef.current.contains(t))) return;
//       setOpen(false);
//     }
//     if (open) document.addEventListener("mousedown", onDoc);
//     return () => document.removeEventListener("mousedown", onDoc);
//   }, [open]);

//   function toggle(opt: string) {
//     if (values.includes(opt)) onChange(values.filter((v) => v !== opt));
//     else onChange([...values, opt]);
//   }

//   return (
//     <div className="mb-4">
//       <MicroTilt className="inline-block"><span className="block text-xs uppercase tracking-wide text-white/60 mb-1">{label}</span></MicroTilt>
//       <TiltItem>
//         <button type="button" ref={btnRef} onClick={() => setOpen((o) => !o)} className="w-full rounded-xl bg-white/10 text-white border border-white/15 px-4 py-3 text-left">
//           {values.length ? (
//             <div className="flex flex-wrap gap-2">
//               {values.map((v) => <span key={v} className="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/15">{v}</span>)}
//             </div>
//           ) : <span className="text-white/50">Select one or more…</span>}
//         </button>
//       </TiltItem>
//       {open && pos && createPortal(
//         <div style={{ position: "fixed", top: pos.top, left: pos.left, width: Math.max(260, pos.width), zIndex: 50 }} className="card p-2">
//           <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="w-full mb-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/15 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30" />
//           <div className="max-h-56 overflow-y-auto">
//             {filtered.map((o) => (
//               <label key={o} className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/10">
//                 <input type="checkbox" checked={values.includes(o)} onChange={() => toggle(o)} className="accent-sky-400" />
//                 <span>{o}</span>
//               </label>
//             ))}
//           </div>
//         </div>,
//         document.body
//       )}
//     </div>
//   );
// }

// function TagsInput({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
//   const [input, setInput] = useState("");
//   function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
//     if (e.key === "Enter" || e.key === ",") {
//       e.preventDefault();
//       const v = input.trim();
//       if (v && !values.includes(v)) onChange([...values, v]);
//       setInput("");
//     }
//     if (e.key === "Backspace" && !input && values.length) {
//       onChange(values.slice(0, -1));
//     }
//   }
//   return (
//     <label className="block mb-4">
//       <MicroTilt className="inline-block"><span className="block text-xs uppercase tracking-wide text-white/60 mb-1">{label}</span></MicroTilt>
//       <TiltItem>
//         <div className="w-full rounded-xl bg-white/10 text-white border border-white/15 px-3 py-2 flex items-center gap-2 flex-wrap">
//           {values.map((v) => (
//             <span key={v} className="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/15 flex items-center gap-1">
//               {v}
//               <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="text-white/60 hover:text-white">×</button>
//             </span>
//           ))}
//           <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} placeholder={placeholder} className="flex-1 bg-transparent outline-none px-1 py-1 placeholder-white/40" />
//         </div>
//       </TiltItem>
//     </label>
//   );
// }

// function CountrySelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
//   const countries = ["India", "United States", "United Kingdom", "Singapore", "Australia", "Canada", "Germany", "France", "Italy", "Netherlands", "Brazil", "UAE"];
//   return <SelectField label={label} value={value} onChange={onChange} options={countries} />;
// }

// function RichTextEditor({ label, html, onChange }: { label: string; html: string; onChange: (html: string) => void }) {
//   const ref = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     if (ref.current && ref.current.innerHTML !== html) {
//       ref.current.innerHTML = html || "";
//     }
//   }, [html]);
//   function emit() {
//     onChange(ref.current?.innerHTML || "");
//   }
//   return (
//     <div className="mb-4">
//       <MicroTilt className="inline-block"><span className="block text-xs uppercase tracking-wide text-white/60 mb-1">{label}</span></MicroTilt>
//       <TiltItem>
//         <div
//           ref={ref}
//           contentEditable
//           onInput={emit}
//           className="min-h-[140px] w-full rounded-xl bg-white/10 text-white border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-white/30 prose prose-invert max-w-none"
//           suppressContentEditableWarning
//         />
//       </TiltItem>
//       <div className="text-xs text-white/50 mt-1">Use basic formatting: bold, italic, lists.</div>
//     </div>
//   );
// }

// function AccountForm({ value, onChange }: { value: Account; onChange: (v: Account) => void }) {
//   const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email);
//   const phoneDigits = (value.phone || "").replace(/\D/g, "");
//   const phoneValid = phoneDigits.length >= 7 && phoneDigits.length <= 15;
//   const passLen = (value.password || "").length >= 8;
//   const passNum = /\d/.test(value.password || "");
//   const passAlpha = /[A-Za-z]/.test(value.password || "");
//   const passMatch = value.password === value.confirmPassword && value.confirmPassword.length > 0;
//   const linkedinValid = !value.linkedin || /^https?:\/\//i.test(value.linkedin);

//   return (
//     <div>
//       <Field label="Full name" value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} placeholder="Jane Doe" />
//   {!value.name && <HintParallax className="text-xs text-white/40 -mt-3 mb-3">Enter your full name.</HintParallax>}

//       <Field label="Email" type="email" value={value.email} onChange={(e) => onChange({ ...value, email: e.target.value })} placeholder="jane@startup.com" />
//       {value.email && !emailValid && (
//         <HintParallax className="text-xs text-red-300 -mt-3 mb-3">Use a valid email like name@domain.com</HintParallax>
//       )}

//       <label className="block mb-4">
//         <span className="block text-xs uppercase tracking-wide text-white/60 mb-1">Phone</span>
//         <TiltItem>
//           <div className="flex items-center gap-2">
//             <CountryCodeSelect value={value.phoneCountry} onChange={(cc) => onChange({ ...value, phoneCountry: cc })} />
//             <input type="tel" value={value.phone} onChange={(e) => onChange({ ...value, phone: e.target.value })} placeholder="98765 43210" className="flex-1 h-[44px] rounded-xl bg-white/10 text-white placeholder-white/40 border border-white/15 px-4 outline-none focus:ring-2 focus:ring-white/30" />
//           </div>
//         </TiltItem>
//       </label>
//       {value.phone && !phoneValid && (
//         <HintParallax className="text-xs text-red-300 -mt-3 mb-3">Enter 7–15 digits. Example: {value.phoneCountry} 9876543210</HintParallax>
//       )}

//       <div className="grid sm:grid-cols-2 gap-4">
//         <Field label="Password" type="password" value={value.password} onChange={(e) => onChange({ ...value, password: e.target.value })} placeholder="••••••••" />
//         <Field label="Confirm Password" type="password" value={value.confirmPassword} onChange={(e) => onChange({ ...value, confirmPassword: e.target.value })} placeholder="••••••••" />
//       </div>
//       {(value.password || value.confirmPassword) && (
//         <ul className="text-xs mt-2 space-y-1">
//           <motion.li whileHover={{ y: -1, rotateZ: -0.5 }} className={passLen ? "text-green-300" : "text-red-300"}>• At least 8 characters</motion.li>
//           <motion.li whileHover={{ y: -1, rotateZ: 0.3 }} className={passAlpha ? "text-green-300" : "text-red-300"}>• Contains a letter</motion.li>
//           <motion.li whileHover={{ y: -1, rotateZ: -0.2 }} className={passNum ? "text-green-300" : "text-red-300"}>• Contains a number</motion.li>
//           <motion.li whileHover={{ y: -1, rotateZ: 0.4 }} className={passMatch ? "text-green-300" : "text-red-300"}>• Matches confirm password</motion.li>
//         </ul>
//       )}

//       <Field label="LinkedIn Profile (optional)" type="url" value={value.linkedin || ""} onChange={(e) => onChange({ ...value, linkedin: e.target.value })} placeholder="https://linkedin.com/in/username" />
//       {value.linkedin && !linkedinValid && (
//         <HintParallax className="text-xs text-red-300 -mt-3 mb-3">Enter a valid URL starting with http(s)://</HintParallax>
//       )}
//     </div>
//   );
// }

// type CC = { code: string; label: string; flag: string };
// const CC_LIST: CC[] = [
//   { code: "+91", label: "India", flag: "🇮🇳" },
//   { code: "+1", label: "United States", flag: "🇺🇸" },
//   { code: "+44", label: "United Kingdom", flag: "🇬🇧" },
//   { code: "+971", label: "United Arab Emirates", flag: "🇦🇪" },
//   { code: "+65", label: "Singapore", flag: "🇸🇬" },
//   { code: "+61", label: "Australia", flag: "🇦🇺" },
//   { code: "+1", label: "Canada", flag: "🇨🇦" },
//   { code: "+49", label: "Germany", flag: "🇩🇪" },
//   { code: "+33", label: "France", flag: "🇫🇷" },
//   { code: "+39", label: "Italy", flag: "🇮🇹" },
//   { code: "+31", label: "Netherlands", flag: "🇳🇱" },
//   { code: "+55", label: "Brazil", flag: "🇧🇷" },
// ];

// function CountryCodeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
//   const [open, setOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const btnRef = useRef<HTMLButtonElement>(null);
//   const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
//   const current = CC_LIST.find((c) => c.code === value) || CC_LIST[0];
//   const list = CC_LIST.filter((c) => (c.label + c.code).toLowerCase().includes(query.toLowerCase()));

//   useEffect(() => {
//     function updatePos() {
//       const el = btnRef.current;
//       if (!el) return;
//       const rect = el.getBoundingClientRect();
//       const top = rect.bottom + 8; // 8px gap
//       const left = Math.min(rect.left, Math.max(8, window.innerWidth - 280)); // keep on screen
//       setPos({ top, left, width: rect.width });
//     }
//     if (open) {
//       updatePos();
//       window.addEventListener("scroll", updatePos, true);
//       window.addEventListener("resize", updatePos);
//     }
//     return () => {
//       window.removeEventListener("scroll", updatePos, true);
//       window.removeEventListener("resize", updatePos);
//     };
//   }, [open]);

//   useEffect(() => {
//     function onDocClick(e: MouseEvent) {
//       const target = e.target as Node;
//       if (btnRef.current && (btnRef.current === target || btnRef.current.contains(target))) return;
//       setOpen(false);
//     }
//     function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
//     if (open) {
//       document.addEventListener("mousedown", onDocClick);
//       document.addEventListener("keydown", onKey);
//     }
//     return () => {
//       document.removeEventListener("mousedown", onDocClick);
//       document.removeEventListener("keydown", onKey);
//     };
//   }, [open]);

//   return (
//     <div className="inline-block">
//       <button ref={btnRef} type="button" onClick={() => setOpen((o) => !o)} className="rounded-xl h-[44px] bg-white/10 text-white border border-white/15 px-3 flex items-center gap-2 w-28 sm:w-32 justify-between">
//         <span className="flex items-center gap-2"><span>{current.flag}</span><span className="text-white/80">{current.code}</span></span>
//         <ChevronDown size={16} className="text-white/60" />
//       </button>
//       {open && pos && createPortal(
//         <div style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 50, width: 256 }} className="card p-2">
//           <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search country" className="w-full mb-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/15 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30" />
//           <div className="max-h-56 overflow-y-auto space-y-1">
//             {list.map((c) => (
//               <button key={c.label + c.code} type="button" onClick={() => { onChange(c.code); setOpen(false); }} className="w-full text-left px-2 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2">
//                 <span>{c.flag}</span>
//                 <span className="flex-1 text-sm">{c.label}</span>
//                 <span className="text-white/60 text-sm">{c.code}</span>
//               </button>
//             ))}
//           </div>
//         </div>,
//         document.body
//       )}
//     </div>
//   );
// }

// function StartupForm({ value, onChange }: { value: Startup; onChange: (v: Startup) => void }) {
//   function onLogoChange(file?: File) {
//     if (!file) return onChange({ ...value, logo: undefined });
//     const extOk = file.type === "image/png" || file.type === "image/svg+xml";
//     if (!extOk) {
//       alert("Please upload a PNG or SVG file");
//       return;
//     }
//     const reader = new FileReader();
//     reader.onload = () => onChange({ ...value, logo: String(reader.result) });
//     reader.readAsDataURL(file);
//   }

//   const taglineLen = value.tagline.length;
//   const yearOk = /^\d{4}$/.test(value.foundingYear);

//   return (
//     <div>
//       <Field label="Startup Name" value={value.startupName} onChange={(e) => onChange({ ...value, startupName: e.target.value })} placeholder="Acme Labs" />

//       <div className="flex items-center gap-4 mb-4">
//         <TiltItem>
//           <div className="size-14 rounded-xl bg-white/10 border border-white/15 grid place-items-center overflow-hidden">
//             {value.logo ? (
//               // eslint-disable-next-line @next/next/no-img-element
//               <img src={value.logo} alt="Startup logo" className="w-full h-full object-cover" />
//             ) : (
//               <span className="text-white/50 text-xs">Logo</span>
//             )}
//           </div>
//         </TiltItem>
//         <label className="btn-outline px-3 py-2 cursor-pointer text-sm">
//           <input type="file" accept="image/png,image/svg+xml" className="hidden" onChange={(e) => onLogoChange(e.target.files?.[0])} />
//           Upload logo (PNG/SVG)
//         </label>
//       </div>

//       <Field label="Tagline / One-liner (max 150)" value={value.tagline} onChange={(e) => onChange({ ...value, tagline: e.target.value.slice(0, 150) })} placeholder="Build the future of ..." />
//       <div className="-mt-3 mb-3 text-xs text-white/50">{taglineLen}/150</div>

//       <Field label="Startup Website URL (optional)" type="url" value={value.website || ""} onChange={(e) => onChange({ ...value, website: e.target.value })} placeholder="https://example.com" />

//       <div className="grid sm:grid-cols-2 gap-4">
//         <Field label="Founding Year (YYYY)" value={value.foundingYear} onChange={(e) => onChange({ ...value, foundingYear: e.target.value.replace(/[^\d]/g, '').slice(0,4) })} placeholder="2024" />
//         {!yearOk && value.foundingYear && <HintParallax className="text-xs text-red-300 -mt-3 mb-3">Enter a 4-digit year</HintParallax>}
//       </div>

//       <div className="grid sm:grid-cols-2 gap-4">
//         <CountrySelect label="Country" value={value.hqCountry} onChange={(v) => onChange({ ...value, hqCountry: v })} />
//         <Field label="State/Province" value={value.hqState} onChange={(e) => onChange({ ...value, hqState: e.target.value })} placeholder="State" />
//       </div>
//       <div className="grid sm:grid-cols-2 gap-4">
//         <Field label="City" value={value.hqCity} onChange={(e) => onChange({ ...value, hqCity: e.target.value })} placeholder="City" />
//         <Field label="Pincode / ZIP" value={value.hqZip} onChange={(e) => onChange({ ...value, hqZip: e.target.value.replace(/[^\d]/g, '') })} placeholder="123456" />
//       </div>
//     </div>
//   );
// }

// function CompanyForm({ value, onChange }: { value: Company; onChange: (v: Company) => void }) {
//   const types = ["Tech", "Non-Tech", "SaaS", "eCommerce", "EdTech", "FinTech", "AI/ML", "HealthTech"];
//   const stages = ["Idea", "Prototype", "MVP", "Early Revenue", "Growth", "Scaling"];
//   const employees = ["1–5", "6–10", "11–50", "51–200", "200+"];
//   const funding = ["Bootstrapped", "Pre-Seed", "Seed", "Series A", "Series B", "Series C", "Public"];
//   const industryOptions = ["Fintech", "Health", "SaaS", "EdTech", "AI/ML", "eCommerce", "HealthTech", "GovTech", "Climate", "Gaming"];
//   const revenueRanges = ["< $50k", "$50k–$200k", "$200k–$1M", "$1M–$5M", ">$5M"];

//   return (
//     <div>
//       <div className="grid sm:grid-cols-2 gap-4">
//         <SelectField label="Startup Type" value={value.startupType} onChange={(v) => onChange({ ...value, startupType: v })} options={types} />
//         <SelectField label="Stage" value={value.stage} onChange={(v) => onChange({ ...value, stage: v })} options={stages} />
//       </div>

//       <div className="mt-4">
//         <MultiSelect label="Industry / Sector" values={value.industries} options={industryOptions} onChange={(vals) => onChange({ ...value, industries: vals })} />
//       </div>

//       <div className="grid sm:grid-cols-3 gap-4 mt-4">
//         <Field label="Number of Founders" value={value.foundersCount} onChange={(e) => onChange({ ...value, foundersCount: e.target.value.replace(/[^\d]/g, '') })} placeholder="2" />
//         <SelectField label="Employees" value={value.employeesRange} onChange={(v) => onChange({ ...value, employeesRange: v })} options={employees} />
//         <SelectField label="Funding Status" value={value.fundingStatus} onChange={(v) => onChange({ ...value, fundingStatus: v })} options={funding} />
//       </div>

//       <div className="grid sm:grid-cols-2 gap-4 mt-4">
//         <Field label="Investor Names (optional)" value={value.investors || ""} onChange={(e) => onChange({ ...value, investors: e.target.value })} placeholder="Investor A, Investor B" />
//         <SelectField label="Annual Revenue (optional)" value={value.revenueRange || ""} onChange={(v) => onChange({ ...value, revenueRange: v })} options={["", ...revenueRanges]} />
//       </div>

//       <Field label="Company Registration Number (optional)" value={value.registrationNumber || ""} onChange={(e) => onChange({ ...value, registrationNumber: e.target.value })} placeholder="CIN / Reg#" />
//     </div>
//   );
// }

// function DescriptionForm({ value, onChange }: { value: FormData["description"]; onChange: (v: FormData["description"]) => void }) {
//   return (
//     <div>
//       <TextArea label="Mission Statement" value={value.mission} onChange={(e) => onChange({ ...value, mission: e.target.value })} placeholder="Why do you exist?" />
//       <TextArea label="Vision Statement" value={value.vision} onChange={(e) => onChange({ ...value, vision: e.target.value })} placeholder="Where are you heading?" />

//       <RichTextEditor label="Detailed Description" html={value.detailsHtml} onChange={(html) => onChange({ ...value, detailsHtml: html })} />

//       <TagsInput label="Key Products / Services" values={value.products} onChange={(vals) => onChange({ ...value, products: vals })} placeholder="Press Enter to add" />

//       <div className="grid sm:grid-cols-2 gap-4">
//         <SelectField label="Target Audience" value={value.audience} onChange={(v) => onChange({ ...value, audience: v })} options={["B2B", "B2C", "B2G", "Niche Industries"]} />
//         <SelectField label="Business Model" value={value.businessModel} onChange={(v) => onChange({ ...value, businessModel: v })} options={["Subscription", "Marketplace", "Direct Sales", "Freemium", "Other"]} />
//       </div>
//     </div>
//   );
// }

// // (Old FloatingPreview removed; replaced with CubePreview3D)

// // New: Interactive 3D cube preview
// function CubePreview3D({ data, step, onSelectStep }: { data: FormData; step: number; onSelectStep: (i: number) => void }) {
//   const size = 260; // face size in px
//   const rx = useMotionValue(-8);
//   const ry = useMotionValue(-15);
//   const springRx = rx; // keep slight pitch for depth
//   const springRy = ry;
//   const containerRef = useRef<HTMLDivElement>(null);
//   const lightX = useMotionValue(0);
//   const lightY = useMotionValue(0);
//   const sheen = useMotionTemplate`radial-gradient(340px circle at ${lightX}px ${lightY}px, rgba(99,102,241,0.18), rgba(59,130,246,0.08) 35%, transparent 60%)`;

//   // Auto-rotate cube to the current step face
//   useEffect(() => {
//     const faceYaw: Record<number, number> = {
//       0: 0,    // Founder -> front
//       1: -90,  // Startup -> right
//       2: -180, // Company -> back
//       3: 90,   // About -> left
//     };
//     // Tween to the new face only when step changes
//     const controls = animate(ry, faceYaw[step] ?? 0, { duration: 0.35, ease: "easeInOut" });
//     return () => controls.stop();
//   }, [step, ry]);
//   // Remove drag, inertia, and idle auto-rotate; cube only rotates when step changes

//   // Build display strings for requested fields (Mission, Vision, Products, Audience, Model)
//   const products = data.description.products || [];
//   const productsSummary = products.length
//     ? products.slice(0, 2).join(", ") + (products.length > 2 ? ` +${products.length - 2} more` : "")
//     : "";
//   const missionLine = (data.description.mission || "").trim() ? `Mission: ${data.description.mission}` : "";
//   const visionLine = (data.description.vision || "").trim() ? `Vision: ${data.description.vision}` : "";
//   const productsLine = productsSummary ? `Products: ${productsSummary}` : "";
//   const audienceLine = data.description.audience ? `Audience: ${data.description.audience}` : "";
//   const modelLine = data.description.businessModel ? `Model: ${data.description.businessModel}` : "";
//   const faces = [
//     { key: "Founder", lines: [data.account.name || "Your name", data.account.email || "email@domain"] },
//     { key: "Startup", lines: [data.startup.startupName || "Startup Name", data.startup.tagline || "Tagline"], icon: data.startup.logo },
//   { key: "Company", lines: [data.company.startupType || "Type", data.company.stage || "Stage"] },
//   { key: "Details", lines: [missionLine, visionLine, productsLine, audienceLine, modelLine].filter((s) => !!s) as string[] },
//   ];

//   function onContainerMove(e: React.MouseEvent<HTMLDivElement>) {
//     const el = containerRef.current;
//     if (!el) return;
//     const rect = el.getBoundingClientRect();
//     lightX.set(e.clientX - rect.left);
//     lightY.set(e.clientY - rect.top);
//   }

//   function snapYaw(deg: number) {
//     // snap quickly when selecting by clicking a face
//     const controls = animate(ry, deg, { duration: 0.25, ease: "easeInOut" });
//     setTimeout(() => controls.stop(), 260);
//   }

//   return (
//     <div className="relative h-full min-h-[420px]">
//       <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-2xl" />
//       <div ref={containerRef} onMouseMove={onContainerMove} className="relative grid place-items-center h-full [perspective:1100px]">
//         {/* Lighting sheen following pointer */}
//   <motion.div aria-hidden className="pointer-events-none absolute inset-8 rounded-3xl" style={{ background: sheen, filter: "blur(12px)" }} />
//   <motion.div style={{ rotateX: springRx, rotateY: springRy }} className="relative [transform-style:preserve-3d] select-none cursor-default" aria-label="3D preview cube">
//           {/* Shadow under cube */}
//           <motion.div aria-hidden className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[230px] h-12 rounded-full bg-black/50 blur-2xl" style={{ opacity: 0.55 }} />

//           {/* Cube faces */}
//           <Face label={faces[0].key} lines={faces[0].lines} size={size} style={{ transform: `translateZ(${size / 2}px)` }} highlight={step === 0} rx={rx} ry={ry} onSnap={() => { snapYaw(0); onSelectStep(0); }} />
//           <Face label={faces[1].key} lines={faces[1].lines} size={size} style={{ transform: `rotateY(90deg) translateZ(${size / 2}px)` }} image={faces[1].icon} highlight={step === 1} rx={rx} ry={ry} onSnap={() => { snapYaw(-90); onSelectStep(1); }} />
//           <Face label={faces[2].key} lines={faces[2].lines} size={size} style={{ transform: `rotateY(180deg) translateZ(${size / 2}px)` }} image={faces[2].icon} highlight={step === 2} rx={rx} ry={ry} onSnap={() => { snapYaw(-180); onSelectStep(2); }} />
//           <Face label={faces[3].key} lines={faces[3].lines} size={size} style={{ transform: `rotateY(-90deg) translateZ(${size / 2}px)` }} highlight={step === 3} rx={rx} ry={ry} onSnap={() => { snapYaw(90); onSelectStep(3); }} />
//           {/* Top and bottom for polish */}
//           <div className="absolute" style={{ width: size, height: size, transform: `rotateX(90deg) translateZ(${size / 2}px)`, background: "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.02))", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, boxShadow: "0 0 40px rgba(99,102,241,0.18) inset" }} />
//           <div className="absolute" style={{ width: size, height: size, transform: `rotateX(-90deg) translateZ(${size / 2}px)`, background: "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.02))", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, boxShadow: "0 0 40px rgba(59,130,246,0.18) inset" }} />
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// function Face({ label, lines, size, style, image, highlight, rx, ry, onSnap }: { label: string; lines: string[]; size: number; style: React.CSSProperties; image?: string; highlight?: boolean; rx: ReturnType<typeof useMotionValue<number>>; ry: ReturnType<typeof useMotionValue<number>>; onSnap: () => void }) {
//   // Keep content centered: clamp translation to a small range so rotation doesn't shove text off-face
//   const x = useTransform(ry, (v) => Math.max(-12, Math.min(12, v * -0.06)));
//   const y = useTransform(rx, (v) => Math.max(-10, Math.min(10, v * 0.6)));
//   const contentTransform = useMotionTemplate`translateZ(22px) translateX(${x}px) translateY(${y}px)`;
//   return (
//     <div className="absolute [backface-visibility:hidden] rounded-2xl overflow-hidden" style={{ width: size, height: size, ...style }} onClick={onSnap}>
//       <div className="w-full h-full relative card p-4 sm:p-5 border border-white/15 shadow-[0_0_24px_rgba(99,102,241,0.12),_0_0_24px_rgba(59,130,246,0.12)] [transform-style:preserve-3d]">
//         {image && (
//           // eslint-disable-next-line @next/next/no-img-element
//           <img src={image} alt="icon" className="absolute top-3 right-3 size-8 rounded-md border border-white/20" />
//         )}
//         <motion.div style={{ transform: contentTransform }}>
//           <div className="text-white/60 text-xs">{label}</div>
//           {lines.slice(0, 5).map((ln, idx) => (
//             <div
//               key={idx}
//               className={
//                 idx === 0
//                   ? "text-white font-semibold leading-tight mt-1 line-clamp-2 break-words whitespace-normal"
//                   : idx === 1
//                   ? "text-white/90 text-[13px] mt-0.5 line-clamp-1 break-words whitespace-normal"
//                   : "text-white/70 text-[12px] mt-0.5 line-clamp-1 break-words whitespace-normal"
//               }
//             >
//               {ln}
//             </div>
//           ))}
//         </motion.div>
//         {/* Glow ring when highlighted */}
//         {highlight && <div className="absolute inset-0 rounded-2xl ring-2 ring-sky-300/50 shadow-[0_0_60px_rgba(56,189,248,0.35)] pointer-events-none" />}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useRef, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { auth } from '@/lib/firebaseClient';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useSearchParams } from 'next/navigation';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { ChevronLeftIcon, Grid2x2PlusIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <g>
      <path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
    </g>
  </svg>
);

interface MousePosition {
  x: number;
  y: number;
}

function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return mousePosition;
}

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}
function hexToRgb(hex: string): number[] {
  hex = hex.replace('#', '');

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const hexInt = parseInt(hex, 16);
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;
  return [red, green, blue];
}

const Particles: React.FC<ParticlesProps> = ({
  className = '',
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = '#ffffff',
  vx = 0,
  vy = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mousePosition = useMousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext('2d');
    }
    initCanvas();
    animate();
    window.addEventListener('resize', initCanvas);

    return () => {
      window.removeEventListener('resize', initCanvas);
    };
  }, [color]);

  useEffect(() => {
    onMouseMove();
  }, [mousePosition.x, mousePosition.y]);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  type Circle = {
    x: number;
    y: number;
    translateX: number;
    translateY: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    dx: number;
    dy: number;
    magnetism: number;
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const circleParams = (): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const pSize = Math.floor(Math.random() * 2) + size;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  };

  const rgb = hexToRgb(color);

  const drawCircle = (circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${rgb.join(', ')}, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h,
      );
    }
  };

  const drawParticles = () => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number,
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  const animate = () => {
    clearContext();
    circles.current.forEach((circle: Circle, i: number) => {
      // Handle the alpha value
      const edge = [
        circle.x + circle.translateX - circle.size, // distance from left edge
        canvasSize.current.w - circle.x - circle.translateX - circle.size, // distance from right edge
        circle.y + circle.translateY - circle.size, // distance from top edge
        canvasSize.current.h - circle.y - circle.translateY - circle.size, // distance from bottom edge
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
      );
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease;

      drawCircle(circle, true);

      // circle gets out of the canvas
      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        // remove the circle from the array
        circles.current.splice(i, 1);
        // create a new circle
        const newCircle = circleParams();
        drawCircle(newCircle);
        // update the circle position
      }
    });
    window.requestAnimationFrame(animate);
  };

  return (
    <div
      className={cn('pointer-events-none', className)}
      ref={canvasContainerRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};

function MinimalAuthPage() {
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { data: session, status } = useSession();
    const search = useSearchParams();
    const plan = search?.get('plan') ?? null;

    // When the user becomes authenticated and a plan is present, trigger checkout
    useEffect(() => {
      if (status === 'authenticated' && plan) {
        // trigger checkout flow
        void initiateCheckout(plan as string);
      }
    }, [status, plan]);

    function handleGoogleSignIn() {
      setLoading(true);
      // Use NextAuth signIn to initiate Google OAuth flow and redirect back to site root
      try {
        const cb = typeof window !== 'undefined' ? `${window.location.origin}/` : '/';
        void signIn('google', { callbackUrl: cb });
      } finally {
        setLoading(false);
      }
    }

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setLoading(true);
      // basic client-side validation
      if (!email.trim() || !password) {
        setLoading(false);
        alert('Please enter email and password');
        return;
      }
      try {
        // Use provided email to create account; if already exists, sign in
        const emailAddr = email.trim();
        try {
          await createUserWithEmailAndPassword(auth, emailAddr, password);
          setLoading(false);
          alert(`Account created and signed in as ${emailAddr}`);
        } catch (createErr: any) {
          // If account already exists, try sign-in
          if (createErr?.code === 'auth/email-already-in-use') {
            try {
              await signInWithEmailAndPassword(auth, emailAddr, password);
              setLoading(false);
              alert(`Signed in as ${emailAddr}`);
            } catch (signInErr: any) {
              console.error('Firebase sign in failed', signInErr);
              setLoading(false);
              alert('Sign-in failed: ' + (signInErr?.message || signInErr));
            }
          } else {
              console.error('Firebase create failed', createErr);
            setLoading(false);
              alert('Failed to create account: ' + (createErr?.message || createErr));
          }
        }
      } catch (err) {
              console.error(err);
        setLoading(false);
        alert('Unexpected error during sign-up');
      }
    }

    async function initiateCheckout(plan: string) {
      try {
        // map plan to amount (INR)
        const amounts: Record<string, number> = { personal: 59, starter: 299, premium: 599 };
        const amount = amounts[plan] ?? 299;

        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, amount }),
        });

        const json = await res.json();
        // If mock, show a simple alert or redirect
        if (json?.mock) {
          alert('Mock order created. In production this would open Razorpay checkout.');
          // redirect to home after mock
          window.location.href = '/';
          return;
        }

        // Open Razorpay checkout
        const options = {
          key: (json && json.key_id) || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || (window as any).__RAZORPAY_KEY_ID || '',
          amount: json.amount,
          currency: json.currency || 'INR',
          name: 'Pivien',
          description: `${plan} plan`,
          order_id: json.id,
          handler: function (response: any) {
            // TODO: verify payment server-side; for now, redirect to success
            window.location.href = '/';
          },
          theme: { color: '#2563eb' },
        } as any;

        if (typeof (window as any).Razorpay === 'function') {
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        } else {
          // If Razorpay script not loaded, fallback
          alert('Razorpay not available - redirecting to home');
          window.location.href = '/';
        }
      } catch (err) {
        console.error('Checkout error', err);
        alert('Failed to create order');
      }
    }

    return (
      <div className="relative md:h-screen md:overflow-hidden w-full">
      <Particles
        color="#666666"
        quantity={120}
        ease={20}
        className="absolute inset-0"
      />
      <div
        aria-hidden
        className="absolute inset-0 isolate -z-10 contain-strict"
      >
        <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full" />
        <div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full" />
        <div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 rounded-full" />
      </div>
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4">
        <Button variant="ghost" className="absolute top-4 left-4" asChild>
          <a href="/">
            <ChevronLeftIcon className="me-1 size-4" />
            Home
          </a>
        </Button>

        <div className="mx-auto space-y-4 sm:w-sm">
          <div className="flex items-center gap-2">
            <Grid2x2PlusIcon className="size-6" />
            <p className="text-xl font-semibold">S-Hatch</p>
          </div>
          <div className="flex flex-col space-y-1">
            <h1 className="font-heading text-2xl font-bold tracking-wide">
              Sign In or Join Now!
            </h1>
            <p className="text-muted-foreground text-base">
              login or create your S-Hatch account.
            </p>
          </div>
          <div className="space-y-4">
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 transition-transform transform hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-lg hover:bg-white/6"
              onClick={handleGoogleSignIn}
              disabled={loading}
              aria-busy={loading}
            >
              <span className="inline-flex w-4 h-4 mr-2">
                <GoogleIcon className="w-4 h-4" />
              </span>
              <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
            </Button>
            
            <div className="relative">
              <div className="relative flex justify-center text-xs uppercase mb-2">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="w-full">
                <span className="block h-px w-full bg-white/10" aria-hidden />
              </div>
            </div>
            
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="jane@startup.com"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full transition-transform transform hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-lg">
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </div>
          <p className="text-muted-foreground mt-8 text-sm">
            By clicking continue, you agree to our{' '}
            <a
              href="/"
              className="hover:text-primary underline underline-offset-4"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="/"
              className="hover:text-primary underline underline-offset-4"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
export default MinimalAuthPage;