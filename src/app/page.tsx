"use client";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ParticlesBG from "@/components/ParticlesBG";
import PricingCard from "@/components/PricingCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Toggle from "@/components/Toggle";
import PricingLoader from "@/components/PricingLoader";
import CosmicTitle from "@/components/CosmicTitle";

export default function Home() {
  const [annual, setAnnual] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();
  // Price type removed (unused)

  // Guaranteed splash on initial load / reload
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 900);
    return () => clearTimeout(t);
  }, []);

  if (showSplash) {
    return <PricingLoader />;
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
  <Navbar hideLinks />
      <div className="absolute inset-0 star-gradient -z-10" />
      <div className="absolute inset-0 grid-overlay -z-10 opacity-40" />
      <ParticlesBG />

      <main className="pt-28 pb-20">
        <section className="container-1200 px-6 text-center">
          <CosmicTitle text="Cosmic - Tiers" orbit={false} />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-white/70"
          >
            Unlock the AI Reality Check agent and elevate your journey with cosmic-level tools and guidance.
          </motion.p>

          <div className="mt-6 flex items-center justify-center gap-8 text-sm text-white/70">
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-white/50" />Open source</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-white/50" />No-logs policy</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-white/50" />24/7 Live support</div>
          </div>

          <div className="mt-10 flex items-center justify-center">
            <Toggle left="Monthly" right="Annually" valueRight={annual} onChange={setAnnual} />
          </div>
        </section>

        <section id="pricing" className="container-1200 px-6 mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <PricingCard
            tier="personal"
            title="Basic"
            price={`₹59`}
            description="Get a quick, simple AI-generated report for one scenario."
            features={[
              { text: "Simple AI Report", included: true },
              { text: "1 Scenario Analysis", included: true },
              { text: "No HR/Burnout/Runway", included: false },
              { text: "No Compliance Check", included: false },
              { text: "No Mentoring", included: false },
            ]}
            cta={session?.user ? "Buy Now" : "Sign up"}
            onClick={async () => {
              if (session?.user) {
                // user is signed in -> create order and open Razorpay
                await (async function initiateCheckout(plan: string) {
                  try {
                    const amounts: Record<string, number> = { personal: 59, starter: 299, premium: 599 };
                    const amount = amounts[plan] ?? 299;
                    const res = await fetch('/api/checkout', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ plan, amount }),
                    });
                    const json = await res.json();
                    if (json?.mock) {
                      alert('Mock order created. In production this would open Razorpay checkout.');
                      router.push('/');
                      return;
                    }
                    const keyVal = (json && json.key_id) || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || (window as any).__RAZORPAY_KEY_ID || '';
                    if (!keyVal) {
                      alert('Payment configuration missing. Ask the admin to set RAZORPAY keys.');
                      router.push('/');
                      return;
                    }
                    const options = {
                      key: keyVal,
                      amount: json.amount,
                      currency: json.currency || 'INR',
                      name: 'Pivien',
                      description: `${plan} plan`,
                      order_id: json.id,
                      handler: function (response: any) {
                        window.location.href = '/';
                      },
                      theme: { color: '#2563eb' },
                    } as any;
                    if (typeof (window as any).Razorpay === 'function') {
                      const rzp = new (window as any).Razorpay(options);
                      rzp.open();
                    } else {
                      alert('Razorpay not available - redirecting to home');
                      router.push('/');
                    }
                  } catch (err) {
                    console.error('Checkout error', err);
                    alert('Failed to create order');
                  }
                })('personal');
              } else {
                router.push('/signup?plan=personal');
              }
            }}
            outline="silver"
            buttonHalo="blue"
            titleAccent="purple"
          />
          <PricingCard
            tier="starter"
            title="Standard"
            price={`₹299`}
            description="Detailed analysis including HR, burnout, and runway for up to 3 scenarios."
            features={[
              { text: "Detailed AI Report", included: true },
              { text: "HR + Burnout/Runway Analysis", included: true },
              { text: "Up to 3 Scenarios", included: true },
              { text: "No Compliance Check", included: false },
              { text: "No Mentoring", included: false },
            ]}
            cta={session?.user ? "Buy Now" : "Sign up"}
            highlight
            badge="Best Deal"
            onClick={async () => {
              if (session?.user) {
                await (async function initiateCheckout(plan: string) {
                  try {
                    const amounts: Record<string, number> = { personal: 59, starter: 299, premium: 599 };
                    const amount = amounts[plan] ?? 299;
                    const res = await fetch('/api/checkout', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ plan, amount }),
                    });
                    const json = await res.json();
                    if (json?.mock) {
                      alert('Mock order created. In production this would open Razorpay checkout.');
                      router.push('/');
                      return;
                    }
                    const keyVal = (json && json.key_id) || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || (window as any).__RAZORPAY_KEY_ID || '';
                    if (!keyVal) {
                      alert('Payment configuration missing. Ask the admin to set RAZORPAY keys.');
                      router.push('/');
                      return;
                    }
                    const options = {
                      key: keyVal,
                      amount: json.amount,
                      currency: json.currency || 'INR',
                      name: 'Pivien',
                      description: `${plan} plan`,
                      order_id: json.id,
                      handler: function (response: any) {
                        window.location.href = '/';
                      },
                      theme: { color: '#2563eb' },
                    } as any;
                    if (typeof (window as any).Razorpay === 'function') {
                      const rzp = new (window as any).Razorpay(options);
                      rzp.open();
                    } else {
                      alert('Razorpay not available - redirecting to home');
                      router.push('/');
                    }
                  } catch (err) {
                    console.error('Checkout error', err);
                    alert('Failed to create order');
                  }
                })('starter');
              } else {
                router.push('/signup?plan=starter');
              }
            }}
            outline="silver"
            buttonHalo="blue"
            titleAccent="blue"
            priceClassName="price-blue"
          />
          <PricingCard
            tier="premium"
            title="Premium"
            price={`₹599`}
            description="Full report, compliance check, unlimited scenarios, and priority mentoring."
            features={[
              { text: "Full AI Report", included: true },
              { text: "Compliance Check", included: true },
              { text: "Unlimited Scenarios", included: true },
              { text: "Priority Mentoring", included: true },
            ]}
            cta={session?.user ? "Buy Now" : "Sign up"}
            onClick={async () => {
              if (session?.user) {
                await (async function initiateCheckout(plan: string) {
                  try {
                    const amounts: Record<string, number> = { personal: 59, starter: 299, premium: 599 };
                    const amount = amounts[plan] ?? 299;
                    const res = await fetch('/api/checkout', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ plan, amount }),
                    });
                    const json = await res.json();
                    if (json?.mock) {
                      alert('Mock order created. In production this would open Razorpay checkout.');
                      router.push('/');
                      return;
                    }
                    const keyVal = (json && json.key_id) || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || (window as any).__RAZORPAY_KEY_ID || '';
                    if (!keyVal) {
                      alert('Payment configuration missing. Ask the admin to set RAZORPAY keys.');
                      router.push('/');
                      return;
                    }
                    const options = {
                      key: keyVal,
                      amount: json.amount,
                      currency: json.currency || 'INR',
                      name: 'Pivien',
                      description: `${plan} plan`,
                      order_id: json.id,
                      handler: function (response: any) {
                        window.location.href = '/';
                      },
                      theme: { color: '#2563eb' },
                    } as any;
                    if (typeof (window as any).Razorpay === 'function') {
                      const rzp = new (window as any).Razorpay(options);
                      rzp.open();
                    } else {
                      alert('Razorpay not available - redirecting to home');
                      router.push('/');
                    }
                  } catch (err) {
                    console.error('Checkout error', err);
                    alert('Failed to create order');
                  }
                })('premium');
              } else {
                router.push('/signup?plan=premium');
              }
            }}
            outline="gold"
            buttonHalo="yellow"
            titleAccent="gold"
            priceClassName="price-yellow"
          />
        </section>

        <footer className="container-1200 px-6 mt-20 border-t border-white/10 pt-8 text-center text-white/60">
          © 2025 Pivien. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
