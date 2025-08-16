import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// Ensure this route runs on the Node.js runtime (required for Razorpay SDK)
export const runtime = "nodejs";

type Body = {
  plan: "starter" | "premium" | string;
  amount: number; // amount in INR (rupees) for display; we'll convert to paise
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Partial<Body>;
  const plan = (body?.plan as Body["plan"]) ?? "starter";
  const displayAmount = typeof body?.amount === "number" ? body.amount : plan === "starter" ? 299 : 599; // rupees

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  // If keys are missing, fall back to mock to avoid crashes in preview
  if (!key_id || !key_secret) {
    return NextResponse.json(
      {
        id: `order_${Math.random().toString(36).slice(2)}`,
        plan,
        amount: displayAmount * 100,
        currency: "INR",
        mock: true,
        message: "Razorpay keys not set. Returning mock order. Set RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET to enable real payments.",
      },
      { status: 200 }
    );
  }

  try {
    const instance = new Razorpay({ key_id, key_secret });
    const order = await instance.orders.create({
      amount: Math.round(displayAmount * 100), // in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${plan}`,
      notes: { plan },
    });

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error("Razorpay order error", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
