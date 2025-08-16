declare global {
  interface RazorpaySuccessResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }

  interface RazorpayOptions {
    key?: string;
    amount: number; // in paise
    currency: string;
    name?: string;
    description?: string;
    order_id: string;
    handler: (response: RazorpaySuccessResponse) => void;
    prefill?: Record<string, string>;
    theme?: { color?: string };
  }

  interface RazorpayInstance {
    open(): void;
    on(event: string, cb: (response: unknown) => void): void;
  }

  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export {};
