import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { GoogleOAuthProvider } from '@react-oauth/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wall",
  description: "A digital collaborative wall",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF9F6] text-slate-900 font-sans relative overflow-x-hidden">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          {/* Dreamy background gradients */}
          <div className="fixed inset-0 z-[-1] pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#F0F2ED] rounded-full blur-[120px] opacity-60" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#F9F3EA] rounded-full blur-[150px] opacity-70" />
          </div>
          
          <Header />
          <main className="flex-1 flex flex-col z-0">{children}</main>
          <Footer />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
