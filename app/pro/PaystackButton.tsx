"use client";

import { usePaystackPayment } from "react-paystack";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PaystackButton({ user, isLoaded }: { user: any, isLoaded: boolean }) {
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(false);

  const config = {
    reference: (new Date()).getTime().toString(),
    email: user?.email || "guest@example.com",
    amount: 1500 * 100, // 1500 NGN in kobo (roughly equivalent to $1)
    currency: "NGN",
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_placeholder",
    metadata: {
      userId: user?.id,
      custom_fields: []
    }
  };

  const initializePayment = usePaystackPayment(config);

  const handlePaystack = () => {
    if (!user) {
      router.push('/login?redirect=/pro');
      return;
    }
    
    setIsInitializing(true);
    initializePayment({
      onSuccess: (reference: any) => {
        setIsInitializing(false);
        alert("Payment successful! Your account has been upgraded to Pro.");
        router.push('/profile');
      },
      onClose: () => {
        setIsInitializing(false);
      }
    });
  };

  if (user?.plan === 'PRO') {
    return (
      <button 
        disabled
        className="relative z-10 w-full bg-white/20 text-white py-4 rounded-full font-bold cursor-default flex justify-center items-center border border-white/20"
      >
        Your Current Plan
      </button>
    );
  }

  return (
    <button 
      onClick={handlePaystack}
      disabled={!isLoaded || isInitializing}
      className="relative z-10 w-full bg-white text-[#0A1118] py-4 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg active:scale-[0.98] disabled:opacity-50 flex justify-center items-center"
    >
      {isInitializing ? "Preparing..." : "Upgrade to Pro — $1"}
    </button>
  );
}
