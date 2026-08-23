"use client";

import { Check, Sparkles, Lock, Type, Paintbrush, ShieldQuestion, UserCog } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

// Dynamically import PaystackButton with SSR disabled to prevent 'window is not defined' error
const PaystackButton = dynamic(() => import('./PaystackButton'), { ssr: false });

export default function ProPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/users/me')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not logged in');
      })
      .then(data => {
        setUser(data.user);
        setIsLoaded(true);
      })
      .catch(() => {
        setIsLoaded(true);
      });
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-12 md:py-24 bg-[#FAF9F6] min-h-screen">
      <div className="text-center mb-16 mt-8">
        <div className="inline-flex items-center gap-2 bg-[#EBE9E2] px-4 py-1.5 rounded-full text-xs font-bold text-gray-600 tracking-widest uppercase mb-6">
          <Sparkles size={14} /> Wall Pro
        </div>
        <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-6 tracking-tight text-[#111]">
          Unlock everything.
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
          One dollar. Lifetime access. Upgrade to support the atelier and express yourself without limits.
        </p>
      </div>

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 mb-24 px-2 md:px-4">
        {/* Free Tier Card */}
        <div className="bg-white/40 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-white/50 shadow-sm flex flex-col">
          <h2 className="font-playfair text-2xl font-bold text-[#111] mb-2">Basic</h2>
          <p className="text-gray-500 mb-8">For casual curators.</p>
          <div className="text-4xl font-bold font-sans tracking-tight mb-8 text-[#111]">$0</div>
          
          <ul className="flex flex-col gap-5 flex-1 mb-8 text-gray-600">
            <li className="flex items-center gap-3"><Check size={18} className="text-gray-400" /> 1 Private Wall</li>
            <li className="flex items-center gap-3"><Check size={18} className="text-gray-400" /> 200 character limit</li>
            <li className="flex items-center gap-3"><Check size={18} className="text-gray-400" /> 2 note colors</li>
            <li className="flex items-center gap-3"><Check size={18} className="text-gray-400" /> Standard font only</li>
            <li className="flex items-center gap-3"><Check size={18} className="text-gray-400" /> Basic profile</li>
          </ul>
          
          {user?.plan === 'PRO' ? (
            <button disabled className="w-full bg-gray-100/50 text-gray-400 py-4 rounded-full font-medium cursor-not-allowed">
              Basic Plan
            </button>
          ) : (
            <button disabled className="w-full bg-gray-100/80 text-gray-600 font-bold py-4 rounded-full cursor-default">
              Your Current Plan
            </button>
          )}
        </div>

        {/* Pro Tier Card */}
        <div className="bg-[#0A1118] text-white p-8 md:p-10 rounded-3xl shadow-2xl flex flex-col relative overflow-hidden">
          {/* Subtle gradient effect inside the dark card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none" />
          
          <h2 className="font-playfair text-2xl font-bold mb-2 relative z-10">Pro</h2>
          <p className="text-gray-400 mb-8 relative z-10">For true archivists.</p>
          <div className="text-4xl font-bold font-sans tracking-tight mb-1 relative z-10">
            $1 <span className="text-lg text-gray-400 font-normal tracking-normal">lifetime</span>
          </div>
          <div className="mb-8" />
          
          <ul className="flex flex-col gap-5 flex-1 mb-10 text-gray-300 relative z-10">
            <li className="flex items-center gap-3"><Lock size={18} className="text-[#F3CAD9]" /> <strong className="text-white font-medium">Unlimited</strong> Private Walls</li>
            <li className="flex items-center gap-3"><Type size={18} className="text-[#DFE4F2]" /> <strong className="text-white font-medium">Unlimited</strong> characters per note</li>
            <li className="flex items-center gap-3"><Paintbrush size={18} className="text-[#EAEAC2]" /> <strong className="text-white font-medium">All 4</strong> curated colors</li>
            <li className="flex items-center gap-3"><Sparkles size={18} className="text-[#C4B7D2]" /> <strong className="text-white font-medium">All 3</strong> handwriting fonts</li>
            <li className="flex items-center gap-3"><ShieldQuestion size={18} className="text-[#D6A1B6]" /> "Who sent this?" author hints</li>
            <li className="flex items-center gap-3"><UserCog size={18} className="text-[#B5C2DC]" /> Full profile customization</li>
          </ul>
          
          <PaystackButton user={user} isLoaded={isLoaded} />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
