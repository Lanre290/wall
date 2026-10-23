"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { 
  Check, 
  Sparkles, 
  Crown, 
  Calendar, 
  Building2, 
  QrCode, 
  ShieldCheck, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Send, 
  ArrowRight,
  Heart,
  HelpCircle,
  Loader2
} from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { PRICING_TIERS } from "../../lib/pricing";

const PricingPaystackButton = dynamic(() => import('./PricingPaystackButton'), { ssr: false });

interface UserState {
  id?: number;
  email?: string;
  plan?: string;
  name?: string;
}

export default function PricingPage() {
  const [user, setUser] = useState<UserState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  
  // Background currency conversion state (UI displays USD, Paystack processes in background)
  const [celebrationNgn, setCelebrationNgn] = useState<number>(10850);
  const [plusNgn, setPlusNgn] = useState<number>(9300);
  
  // Inquiry form state
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquiryError, setInquiryError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orgName: "",
    eventType: "Graduation",
    attendees: "100-500",
    notes: ""
  });

  useEffect(() => {
    // Fetch live currency exchange rate silently in the background for Paystack processing
    fetch('/api/currency/rate')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.celebrationNgn) setCelebrationNgn(data.celebrationNgn);
          if (data.plusNgn) setPlusNgn(data.plusNgn);
        }
      })
      .catch(() => {});

    fetch('/api/users/me')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not logged in');
      })
      .then(data => {
        setUser(data.user);
        setIsLoaded(true);
        if (data.user?.email) {
          setFormData(prev => ({
            ...prev,
            name: data.user.name || "",
            email: data.user.email || ""
          }));
        }
      })
      .catch(() => {
        setIsLoaded(true);
      });
  }, []);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingInquiry(true);
    setInquiryError(null);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setInquirySubmitted(true);
    } catch (err: any) {
      setInquiryError(err.message || "An error occurred while submitting. Please try again.");
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  const faqs = [
    {
      q: "What is the Celebration Pass and how does it work?",
      a: "The Celebration Pass is a one-time purchase ($7) crafted specifically for single milestone moments like birthdays, graduations, anniversaries, or farewells. It unlocks every premium aesthetic feature—authentic handwriting fonts, pastel & seasonal themes, animated accents, and a downloadable memory book keepsake—for that specific board, with zero recurring subscriptions."
    },
    {
      q: "Can I start with a Free board and upgrade later?",
      a: "Yes! You can create your board for free, begin gathering messages from friends and family, and upgrade to a Celebration Pass anytime you're ready to customize the board or export your memories."
    },
    {
      q: "What makes the Plus plan different from the Celebration Pass?",
      a: "The Celebration Pass is a one-time payment for one specific board. The Plus plan ($6/month) is built for power curators and avid archivists who create and manage multiple boards over time, need unlimited storage, and want all current and future customization perks permanently unlocked across their entire account."
    },
    {
      q: "How does the Organization & Events tier work?",
      a: "For universities, large student groups, galas, and wedding planners, this tier provides high-resolution, print-ready QR codes for physical table displays, custom brand colors/logos, and a pre-moderation approval queue so organizers can review all submitted notes before they appear publicly on screens."
    },
    {
      q: "Can I pay with my regular local bank card?",
      a: "Yes, 100%! Even though prices are displayed in USD, checkout is powered by Paystack. All standard local debit cards (Verve, Mastercard, Visa), mobile transfers, Apple Pay, and foreign cards work seamlessly without needing a domiciliary account."
    },
    {
      q: "What payment methods are supported?",
      a: "We accept all major debit and credit cards (Visa, Mastercard, Verve), Apple Pay, and secure bank transfers powered by Paystack."
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-12 md:py-20 bg-[#FAF9F6] min-h-screen text-[#111]">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 mt-4">
        <div className="inline-flex items-center gap-2 bg-[#EBE9E2] px-4 py-1.5 rounded-full text-xs font-bold text-gray-700 tracking-widest uppercase mb-5">
          <Sparkles size={14} className="text-amber-600" /> Thoughtboard Pricing
        </div>
        <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#111] mb-6 leading-[1.15]">
          A cozy canvas for words that matter.
        </h1>
        <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          Whether you are collecting graduation wishes, commemorating a birthday, or coordinating a campus milestone, choose the plan that honors your occasion.
        </p>
      </div>

      {/* Payment Reassurance Pill */}
      <div className="mb-10 inline-flex flex-wrap items-center justify-center gap-2 bg-white/90 border border-gray-200/90 px-4 py-2 rounded-full text-xs text-gray-600 shadow-2xs">
        <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
        <span>Local cards (<strong>Verve</strong>, <strong>Mastercard</strong>, <strong>Visa</strong>) & international cards accepted</span>
        <span className="text-gray-300 hidden sm:inline">•</span>
        <span className="text-gray-500">Auto-cleared at checkout</span>
      </div>

      {/* Main 3-Column Cards Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-14 px-2">
        
        {/* Tier 1: Free */}
        <div className="bg-white/60 backdrop-blur-md p-8 md:p-9 rounded-3xl border border-gray-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Essential</div>
            <h2 className="font-playfair text-3xl font-bold text-[#111] mb-2">Free</h2>
            <p className="text-gray-500 text-sm mb-6 min-h-[40px]">
              For casual memory keeping and everyday notes.
            </p>
            
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-extrabold font-sans tracking-tight text-[#111]">$0</span>
              <span className="text-gray-400 text-sm font-medium">forever</span>
            </div>

            <div className="border-t border-gray-100 pt-6 mb-8">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Included in Free:</p>
              <ul className="flex flex-col gap-4 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-gray-400 shrink-0 mt-0.5" />
                  <span>1 active basic board</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-gray-400 shrink-0 mt-0.5" />
                  <span>Standard classic themes & 2 note colors</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-gray-400 shrink-0 mt-0.5" />
                  <span>Standard sharing link</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-gray-400 shrink-0 mt-0.5" />
                  <span>200 character limit per note</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-gray-400 shrink-0 mt-0.5" />
                  <span>Standard digital font</span>
                </li>
              </ul>
            </div>
          </div>

          <Link
            href="/create"
            className="w-full bg-[#EFEFEA] hover:bg-[#E5E5DE] text-gray-800 text-center py-3.5 rounded-full font-semibold text-sm transition-colors"
          >
            Create Free Board
          </Link>
        </div>

        {/* Tier 2: Celebration Pass (Featured) */}
        <div className="bg-[#0A1118] text-white p-8 md:p-9 rounded-3xl shadow-2xl flex flex-col justify-between relative overflow-hidden ring-2 ring-amber-400/30">
          {/* Subtle warm glow background accent */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-300 to-amber-500 text-black px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-3 shadow-sm">
              <Crown size={13} /> Most Popular for Occasions
            </div>
            <h2 className="font-playfair text-3xl font-bold text-white mb-2">Celebration Pass</h2>
            <p className="text-gray-300 text-sm mb-6 min-h-[40px]">
              For graduations, birthdays, farewells & milestone moments.
            </p>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-extrabold font-sans tracking-tight text-white">
                $7
              </span>
              <span className="text-amber-200/80 text-sm font-medium">one-time pass</span>
            </div>
            <p className="text-[11px] text-gray-300/80 mb-6 flex flex-wrap items-center gap-1.5">
              <span>💳 Local & foreign cards accepted</span>
              <span>•</span>
              <span>No recurring subscription</span>
            </p>

            <div className="border-t border-white/10 pt-6 mb-8">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-300/90 mb-4">Everything in Free, plus:</p>
              <ul className="flex flex-col gap-4 text-sm text-gray-200">
                <li className="flex items-start gap-3">
                  <Sparkles size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>All premium themes</strong> & pastel palettes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Authentic handwriting fonts</strong> & stickers</span>
                </li>
                <li className="flex items-start gap-3">
                  <Download size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Downloadable memory book</strong> export (PDF / Keepsake)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Heart size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>Animated decorative accents & reactions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>Unlimited character length per note</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>Extended archive & permanent preservation</span>
                </li>
              </ul>
            </div>
          </div>

          <PricingPaystackButton
            user={user}
            isLoaded={isLoaded}
            tier="celebration"
            amountInUsd={7}
            amountInNgn={celebrationNgn}
            label={
              user?.plan === 'PRO' 
                ? "Pass Active — Add Another" 
                : "Get Celebration Pass — $7"
            }
            className="relative z-10 w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#0A1118] text-center py-4 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] cursor-pointer disabled:opacity-50"
          />
        </div>

        {/* Tier 3: Plus */}
        <div className="bg-white/60 backdrop-blur-md p-8 md:p-9 rounded-3xl border border-gray-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Curator Membership</div>
            <h2 className="font-playfair text-3xl font-bold text-[#111] mb-2">Plus</h2>
            <p className="text-gray-500 text-sm mb-6 min-h-[40px]">
              For passionate curators, friend circles & continuous journaling.
            </p>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-extrabold font-sans tracking-tight text-[#111]">
                $6
              </span>
              <span className="text-gray-400 text-sm font-medium">/ month</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-6 flex flex-wrap items-center gap-1.5">
              <span>💳 Local & foreign cards accepted</span>
              <span>•</span>
              <span>Cancel anytime</span>
            </p>

            <div className="border-t border-gray-100 pt-6 mb-8">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Curator privileges:</p>
              <ul className="flex flex-col gap-4 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-gray-800 shrink-0 mt-0.5" />
                  <span><strong>Unlimited boards</strong> & archives</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-gray-800 shrink-0 mt-0.5" />
                  <span>Expanded storage for notes & media</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-gray-800 shrink-0 mt-0.5" />
                  <span>All present & upcoming handwriting fonts</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-gray-800 shrink-0 mt-0.5" />
                  <span>Custom author tags & privacy controls</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-gray-800 shrink-0 mt-0.5" />
                  <span>Early access to experimental features</span>
                </li>
              </ul>
            </div>
          </div>

          <PricingPaystackButton
            user={user}
            isLoaded={isLoaded}
            tier="plus"
            amountInUsd={6}
            amountInNgn={plusNgn}
            label={
              user?.plan === 'PRO' 
                ? "Your Current Plan (Active)" 
                : "Subscribe to Plus — $6/mo"
            }
            className="w-full bg-[#0A1118] hover:bg-black text-white text-center py-3.5 rounded-full font-semibold text-sm transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          />
        </div>

      </div>

      {/* Tier 4: Organization & Large Events Banner */}
      <div className="w-full max-w-6xl mb-24 px-2">
        <div className="bg-[#151D24] text-white p-8 md:p-12 rounded-3xl shadow-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-blue-200 mb-4">
              <Building2 size={14} /> Universities, Weddings & Campus Cohorts
            </div>
            <h3 className="font-playfair text-3xl md:text-4xl font-bold mb-3">
              Organization & Live Events
            </h3>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
              Empower graduating classes, wedding receptions, galas, and creator communities with customized, high-capacity boards equipped with real-time moderation and physical-to-digital tools.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-200">
              <div className="flex items-center gap-2.5">
                <QrCode size={18} className="text-blue-400 shrink-0" />
                <span>Print-ready high-res QR codes</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-blue-400 shrink-0" />
                <span>Pre-moderation approval queue</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Building2 size={18} className="text-blue-400 shrink-0" />
                <span>Custom branding & department logos</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Crown size={18} className="text-blue-400 shrink-0" />
                <span>Multi-admin team management</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end w-full md:w-auto relative z-10">
            <div className="text-2xl font-bold font-sans mb-1 text-white">Custom Pricing</div>
            <div className="text-xs text-gray-400 mb-5">Single event package or campus license</div>
            <button
              onClick={() => setIsInquiryModalOpen(true)}
              className="w-full sm:w-auto bg-white hover:bg-gray-100 text-[#0A1118] font-bold px-8 py-3.5 rounded-full text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Inquire for Your Event</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="w-full max-w-4xl mb-24 px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            <HelpCircle size={15} /> Frequently Asked Questions
          </div>
          <h3 className="font-playfair text-3xl font-bold text-[#111]">
            Everything you need to know
          </h3>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className="bg-white/80 rounded-2xl border border-gray-200/60 overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-semibold text-gray-900 cursor-pointer"
                >
                  <span className="text-base md:text-lg">{faq.q}</span>
                  {isOpen ? <ChevronUp size={20} className="text-gray-500 shrink-0" /> : <ChevronDown size={20} className="text-gray-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm md:text-base text-gray-600 leading-relaxed border-t border-gray-100/80 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Organization Inquiry Modal */}
      {isInquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#FAF9F6] border border-gray-200 text-[#111] max-w-lg w-full rounded-3xl p-6 md:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => {
                setIsInquiryModalOpen(false);
                setInquirySubmitted(false);
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors p-1"
            >
              <X size={20} />
            </button>

            {!inquirySubmitted ? (
              <>
                <div className="flex items-center gap-2 text-amber-600 mb-2 font-bold text-xs uppercase tracking-wider">
                  <Building2 size={16} /> Organization Consultation
                </div>
                <h3 className="font-playfair text-2xl font-bold mb-2">
                  Plan your event with Thoughtboard
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Tell us about your upcoming event, graduating class, or community. We'll set you up with custom branding, moderation controls, and high-res QR codes.
                </p>

                <form onSubmit={handleInquirySubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">Your Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Alex Morgan"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="alex@university.edu"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">Organization / Event</label>
                      <input 
                        type="text" 
                        required
                        value={formData.orgName}
                        onChange={e => setFormData({...formData, orgName: e.target.value})}
                        placeholder="e.g. Class of 2026 / Gala"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">Event Type</label>
                      <select
                        value={formData.eventType}
                        onChange={e => setFormData({...formData, eventType: e.target.value})}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black transition-colors"
                      >
                        <option value="Graduation">Graduation / Commencement</option>
                        <option value="Wedding">Wedding / Reception</option>
                        <option value="Birthday">Milestone Birthday / Jubilee</option>
                        <option value="Campus">Student Club / Society</option>
                        <option value="Corporate">Corporate / Farewell</option>
                        <option value="Other">Other Community Gathering</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">Estimated Contributors / Attendees</label>
                    <select
                      value={formData.attendees}
                      onChange={e => setFormData({...formData, attendees: e.target.value})}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black transition-colors"
                    >
                      <option value="Under 50">Under 50 people</option>
                      <option value="50-200">50 – 200 people</option>
                      <option value="200-1000">200 – 1,000 people</option>
                      <option value="1000+">1,000+ people (Large Campus / Multi-Hall)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">Special Requirements / Notes</label>
                    <textarea 
                      rows={3}
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                      placeholder="e.g. Need physical poster QR codes printed by Friday, require live moderation screen..."
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black transition-colors resize-none"
                    />
                  </div>

                  {inquiryError && (
                    <div className="bg-red-50 text-red-700 border border-red-200 text-xs p-3 rounded-xl font-medium">
                      {inquiryError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingInquiry}
                    className="mt-2 w-full bg-[#0A1118] hover:bg-black text-white font-bold py-3.5 rounded-full text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingInquiry ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Sending Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <Check size={28} />
                </div>
                <h4 className="font-playfair text-2xl font-bold mb-2">Inquiry Received!</h4>
                <p className="text-sm text-gray-600 max-w-sm mb-6 leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Our events team has received your details for <strong>{formData.orgName}</strong> and will reach out to <strong>{formData.email}</strong> with custom setup details and quote.
                </p>
                <button
                  onClick={() => {
                    setIsInquiryModalOpen(false);
                    setInquirySubmitted(false);
                  }}
                  className="bg-[#0A1118] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-black transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNav active="explore" />
    </div>
  );
}
