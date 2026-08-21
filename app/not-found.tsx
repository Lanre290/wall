import Link from "next/link";
import { ArrowLeft, LayoutGrid, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative px-6 py-12 md:py-24 min-h-[80vh] w-full">
      
      {/* Background subtle grid for mobile */}
      <div className="absolute inset-0 z-[-1] pointer-events-none md:hidden opacity-50" 
           style={{
             backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 12v8M12 16h8' stroke='%239ca3af' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
             backgroundSize: '32px 32px'
           }}
      />
      
      {/* Mobile 404 Layout */}
      <div className="md:hidden flex flex-col items-center text-center w-full max-w-sm mt-[-40px]">
        
        {/* Sticky Note */}
        <div className="relative w-64 h-64 bg-[#DFE4F2] shadow-sm flex flex-col items-center justify-center p-6 text-center rotate-[-3deg] mb-12">
          {/* Tape */}
          <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-16 h-5 bg-white/40 shadow-sm rotate-[2deg]" />
          
          <h1 className="text-7xl font-bold text-[#1a235c] mb-2 font-sans tracking-tighter">404</h1>
          <div className="w-16 h-px bg-[#1a235c]/30 mb-4" />
          <p className="text-[#1a235c] text-lg font-medium leading-tight">
            This page is missing from the wall.
          </p>
        </div>

        <p className="text-gray-600 text-lg mb-8">
          You've found a quiet corner.<br/> Let's get you back to the notes.
        </p>

        <div className="w-full flex flex-col gap-4">
          <Link 
            href="/"
            className="w-full bg-[#0A1118] text-white py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg"
          >
            <ArrowLeft size={18} />
            Go home
          </Link>
          <Link 
            href="/wall/things-we-never-said"
            className="w-full bg-transparent border-2 border-[#0A1118] text-[#0A1118] py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-black/5 transition-colors"
          >
            Explore walls
            <LayoutGrid size={18} />
          </Link>
        </div>
      </div>

      {/* Desktop 404 Layout */}
      <div className="hidden md:flex flex-col items-center text-center w-full max-w-2xl">
        <h1 className="font-playfair text-5xl font-bold text-[#111] mb-4">
          404 — Lost in the whitespace.
        </h1>
        <p className="text-gray-500 text-lg mb-16 max-w-lg leading-relaxed">
          It looks like you've wandered into a part of the wall that hasn't been filled yet. Don't worry, even empty spaces have their own stories.
        </p>

        {/* Sticky Note Graphic */}
        <div className="relative w-80 h-80 bg-[#DFE4F2] shadow-sm flex flex-col items-center justify-center p-8 text-center rotate-[2deg] mb-12">
          <div className="text-gray-400 mb-6">
            <SearchX size={32} strokeWidth={1.5} />
          </div>
          <p className="text-[#1a235c] text-xl font-medium leading-relaxed mb-6">
            "This note doesn't exist yet... or maybe it was never left behind."
          </p>
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="bg-[#0A1118] text-white px-10 py-3.5 rounded-full text-sm font-semibold tracking-wider flex items-center justify-center hover:bg-black transition-colors"
          >
            GO HOME
          </Link>
          <Link 
            href="/wall/things-we-never-said"
            className="bg-transparent border-2 border-[#0A1118] text-[#0A1118] px-8 py-3 rounded-full text-sm font-semibold tracking-wider flex items-center justify-center hover:bg-black/5 transition-colors"
          >
            EXPLORE WALLS
          </Link>
        </div>
      </div>

    </div>
  );
}
