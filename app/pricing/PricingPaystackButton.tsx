"use client";

import { usePaystackPayment } from "react-paystack";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PricingPaystackButtonProps {
  user: any;
  isLoaded: boolean;
  tier: "celebration" | "plus";
  amountInNgn: number;
  label: string;
  className?: string;
}

export default function PricingPaystackButton({
  user,
  isLoaded,
  tier,
  amountInNgn,
  label,
  className
}: PricingPaystackButtonProps) {
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(false);

  const config = {
    reference: `${tier}_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    email: user?.email || "guest@example.com",
    amount: amountInNgn * 100, // Paystack expects amounts in kobo (NGN * 100)
    currency: "NGN",
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_placeholder",
    metadata: {
      userId: user?.id,
      tier,
      planName: tier === "celebration" ? "Celebration Pass" : "Plus Membership",
      custom_fields: [
        {
          display_name: "Tier",
          variable_name: "tier",
          value: tier
        }
      ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const handleClick = () => {
    if (!user) {
      router.push(`/login?redirect=/pricing`);
      return;
    }

    setIsInitializing(true);
    initializePayment({
      onSuccess: async (reference: any) => {
        setIsInitializing(false);
        try {
          await fetch('/api/paystack/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reference: reference.reference, tier, userId: user.id })
          });
        } catch (e) {
          console.error("Verification error:", e);
        }
        
        alert(`Payment successful! Your ${tier === "celebration" ? "Celebration Pass" : "Plus Membership"} is now active.`);
        
        if (tier === "celebration") {
          router.push("/create?pass=celebration");
        } else {
          router.push("/profile");
        }
      },
      onClose: () => {
        setIsInitializing(false);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isLoaded || isInitializing}
      className={className}
    >
      {isInitializing ? "Connecting..." : label}
    </button>
  );
}
