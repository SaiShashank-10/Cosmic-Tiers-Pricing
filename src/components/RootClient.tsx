"use client";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import SplashLoader from "./SplashLoader";

type Props = { children: React.ReactNode; session?: any };

// Shows the splash loader once per session for at least minDuration ms
export default function RootClient({ children, session }: Props) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const sessionKey = "splashShown";
    const already = typeof sessionStorage !== "undefined" && sessionStorage.getItem(sessionKey) === "1";
    const minDuration = 900; // ms
    const start = Date.now();

    if (already) {
      setShowSplash(false);
      return;
    }

    const t = setTimeout(() => {
      setShowSplash(false);
      try { sessionStorage.setItem(sessionKey, "1"); } catch {}
    }, Math.max(0, minDuration - (Date.now() - start)));

    return () => clearTimeout(t);
  }, []);

  const content = showSplash ? <SplashLoader /> : children;

  // Wrap everything in SessionProvider so client components (useSession) work
  return <SessionProvider session={session}>{content}</SessionProvider>;
}
