import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Caveat, Kalam, Patrick_Hand } from "next/font/google";
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

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const patrickHand = Patrick_Hand({
  variable: "--font-patrick-hand",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trywall.vercel.app"),
  title: {
    default: "Wall | Leave something behind",
    template: "%s | Wall"
  },
  description: "Wall is a beautifully curated digital space where you can anonymously or publicly leave thoughts, memories, and appreciations. Build private community boards or public digital ateliers to connect through shared experiences.",
  keywords: ["digital wall", "collaborative space", "anonymous notes", "community board", "digital atelier", "memory board", "shared experiences", "virtual guestbook", "message board"],
  authors: [{ name: "Wall" }],
  creator: "Wall",
  publisher: "Wall",
  openGraph: {
    title: "Wall | Leave something behind",
    description: "Wall is a beautifully curated digital space where you can anonymously or publicly leave thoughts, memories, and appreciations.",
    url: "https://trywall.vercel.app",
    siteName: "Wall",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Wall Logo",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wall | Leave something behind",
    description: "Wall is a beautifully curated digital space where you can anonymously or publicly leave thoughts, memories, and appreciations.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${caveat.variable} ${kalam.variable} ${patrickHand.variable} h-full antialiased`}
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
