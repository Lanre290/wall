"use client";

import { useState } from "react";
import { BottomNav } from "../components/BottomNav";
import { Bell, LayoutGrid, PenSquare, X } from "lucide-react";
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const [modalContent, setModalContent] = useState<"terms" | "privacy" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // 1. Fetch user's profile from Google using the access token
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());

        // 2. Send the real Google data to our endpoint
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userInfo.email,
            name: userInfo.name,
            avatarUrl: userInfo.picture
          })
        });

        if (res.ok) {
          window.location.href = '/my-walls';
        } else {
          console.error('Login failed on our backend');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Network error during login', error);
        setIsLoading(false);
      }
    },
    onError: () => {
      console.error('Google Login Failed');
      setIsLoading(false);
    }
  });

  const renderModal = () => {
    if (!modalContent) return null;

    const isTerms = modalContent === "terms";
    const title = isTerms ? "Terms of Service" : "Privacy Policy";
    const content = isTerms ? (
      <>
        <h3 className="font-playfair text-xl font-bold mb-4">1. Acceptance of Terms</h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          By accessing and using Wall, you accept and agree to be bound by the terms and provision of this agreement. 
        </p>
        <h3 className="font-playfair text-xl font-bold mb-4">2. User Content</h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          You retain all your ownership rights in your content, but you are required to grant us a worldwide, non-exclusive, royalty-free, transferable license to use, reproduce, distribute, prepare derivative works of, and display that content.
        </p>
      </>
    ) : (
      <>
        <h3 className="font-playfair text-xl font-bold mb-4">1. Information Collection</h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.
        </p>
        <h3 className="font-playfair text-xl font-bold mb-4">2. Use of Information</h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          We may use the information we collect about you to provide, maintain, and improve our services, including to facilitate payments, send receipts, provide products and services you request.
        </p>
      </>
    );

    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#E6E6E3] md:bg-black/40">
        
        {/* Mobile Header */}
        <div className="md:hidden flex w-full items-center justify-between px-4 py-4 bg-transparent">
          <button onClick={() => setModalContent(null)} className="p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h2 className="font-playfair text-lg font-bold">{title}</h2>
          <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center">
            {/* Empty space for balance */}
          </div>
        </div>

        {/* Desktop Backdrop */}
        <div 
          className="hidden md:block absolute inset-0 backdrop-blur-sm z-[-1]"
          onClick={() => setModalContent(null)}
        />

        {/* Modal Container */}
        <div className="mt-auto md:mt-0 bg-white rounded-t-3xl md:rounded-3xl p-6 md:p-10 w-full md:max-w-xl mx-auto shadow-2xl flex flex-col relative z-10 min-h-[70vh] md:min-h-0 max-h-[90vh]">
          {/* Handle */}
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 md:hidden" />
          
          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <h2 className="font-playfair text-3xl font-bold">{title}</h2>
            <button onClick={() => setModalContent(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto pr-2 pb-8 flex-1">
            {content}
            <div className="mt-8 bg-[#F6F5F2] p-4 rounded-xl">
              <p className="text-xs text-gray-500 text-center">
                Last updated: August 2026. For full details, please contact our legal team.
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setModalContent(null)}
            className="md:hidden mt-auto w-full bg-[#0A1118] text-white py-4 rounded-full font-medium"
          >
            Accept & Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col relative h-[80vh] md:h-auto">
      {/* Mobile Top Header */}
      <div className="md:hidden flex justify-between items-center p-6">
        <h1 className="font-playfair text-xl font-bold">Account</h1>
        <button className="p-2">
          <Bell size={20} className="text-gray-800" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-32 md:pb-6 relative z-10">
        <div className="w-full max-w-md bg-transparent md:bg-white/40 md:backdrop-blur-sm md:border md:border-white/50 md:p-12 md:rounded-[2rem] md:shadow-sm flex flex-col items-center text-center">
          
          {/* Logo Graphic */}
          <div className="relative mb-8 mt-12 md:mt-0">
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#B5C282] rounded-md rotate-12 opacity-80" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-[#F3CAD9] rounded-md -rotate-6 opacity-80" />
            <div className="w-24 h-24 bg-[#F3F2EE] rounded-3xl flex items-center justify-center shadow-sm relative z-10">
              <LayoutGrid size={40} className="text-[#0A1118]" />
            </div>
          </div>

          <h2 className="font-playfair text-4xl font-bold text-[#111] mb-3">Join Wall.</h2>
          <p className="text-gray-600 text-lg mb-10 max-w-xs mx-auto">
            Give people a place to leave something behind.
          </p>

          <div className="w-full flex flex-col gap-4">
            <button 
              onClick={() => login()}
              disabled={isLoading}
              className="w-full bg-[#0A1118] text-white py-4 rounded-full font-medium flex items-center justify-center gap-3 hover:bg-black transition-colors shadow-lg shadow-black/5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span>Connecting...</span>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  CONTINUE WITH GOOGLE
                </>
              )}
            </button>

            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <button className="w-full bg-transparent border-2 border-[#0A1118] text-[#0A1118] py-4 rounded-full font-semibold flex items-center justify-center hover:bg-black/5 transition-colors">
              CONTINUE WITH EMAIL
            </button>
          </div>

          <p className="mt-8 text-xs text-gray-500 max-w-[250px] leading-relaxed">
            By continuing, you agree to our <button onClick={() => setModalContent("terms")} className="underline hover:text-gray-800">Terms of Service</button> and <button onClick={() => setModalContent("privacy")} className="underline hover:text-gray-800">Privacy Policy</button>.
          </p>
        </div>
      </div>

      {/* Leave a Note FAB (only on mobile) */}
      <div className="md:hidden fixed bottom-28 right-1/2 translate-x-1/2 z-20 w-[90%] max-w-sm">
        <button
          className="w-full bg-[#0A1118] text-white py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg"
        >
          <PenSquare size={18} />
          LEAVE A NOTE
        </button>
      </div>

      <BottomNav active="account" />
      {renderModal()}
    </div>
  );
}
