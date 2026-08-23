"use client";

import { useState } from "react";
import { BottomNav } from "../components/BottomNav";
import { Bell, LayoutGrid, PenSquare, X } from "lucide-react";
import Link from "next/link";
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
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
          </div>

          <p className="mt-8 text-xs text-gray-500 max-w-[250px] leading-relaxed">
            By continuing, you agree to our <Link href="/terms" target="_blank" className="underline hover:text-gray-800">Terms of Service</Link> and <Link href="/privacy" target="_blank" className="underline hover:text-gray-800">Privacy Policy</Link>.
          </p>
        </div>
      </div>



      <BottomNav active="account" />
    </div>
  );
}
