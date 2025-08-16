"use client";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBG() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  const options = useMemo(
    () => ({
      background: { color: "transparent" },
      fpsLimit: 60,
      particles: {
        number: { value: 60, density: { enable: true, area: 800 } },
        color: { value: ["#c4b5fd", "#93c5fd", "#ffffff"] },
        opacity: { value: { min: 0.2, max: 0.8 } },
        size: { value: { min: 1, max: 2 } },
        move: { enable: true, speed: 0.2 },
      },
      detectRetina: true,
    }) as unknown,
    []
  );

  if (!ready) return null;
  // @ts-expect-error complex generic type from tsparticles
  return <Particles id="tsparticles" options={options} className="absolute inset-0 -z-10" />;
}
