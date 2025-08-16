"use client";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ParticlesBG from "@/components/ParticlesBG";
import PricingCard from "@/components/PricingCard";
import { useState } from "react";
import Toggle from "@/components/Toggle";

export default function Home() {
  const [annual, setAnnual] = useState(true);
  // Price type removed (unused)

  async function checkout(plan: "starter" | "premium") {
    const amount = plan === "starter" ? (annual ? 299 : 699) : annual ? 699 : 1299; // rupees
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, amount }),
    });
    const order = await res.json();
    if (order?.mock) {
      alert(`Mock checkout for ${plan} (₹${amount}). Set RAZORPAY_KEY_ID/SECRET to enable real payments.`);
      return;
    }
    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const opts: RazorpayOptions = {
      key,
      amount: order.amount,
      currency: order.currency,
      name: "Pivien",
      description: `${plan} plan`,
      order_id: order.id,
      handler: function (response) {
        console.log("Payment success", response);
        alert("Payment successful!");
      },
      prefill: {},
      theme: { color: "#6366F1" },
    };
    if (typeof window !== "undefined" && window.Razorpay) {
      const rz = new window.Razorpay(opts);
      rz.open();
    } else {
      alert("Razorpay script not loaded.");
    }
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <Navbar />
      <div className="absolute inset-0 star-gradient -z-10" />
      <div className="absolute inset-0 grid-overlay -z-10 opacity-40" />
      <ParticlesBG />

      <main className="pt-28 pb-20">
        <section className="container-1200 px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight"
          >
            Security. Privacy. Freedom.
            <br />
            for Everyone.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-white/70"
          >
            Select a VPN plan to access your favorite content with lightning speed and unlimited data.
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
            cta="★  BUY plan"
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
            cta="★  BUY plan"
            highlight
            badge="Best Deal"
            onClick={() => checkout("starter")}
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
            cta="★  BUY plan"
            onClick={() => checkout("premium")}
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
