import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-6 py-12 md:py-24 min-h-[80vh]">
      
      {/* Background Dotted Grid */}
      <div 
        className="absolute inset-0 z-[-2] opacity-30" 
        style={{ 
          backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} 
      />

      {/* Background Hand-drawn Doodles, Notes & Text */}
      <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden">
        
        {/* Doodle: Envelope */}
        <div className="absolute top-[25%] left-[30%] md:left-[45%] rotate-[-15deg] opacity-70 text-gray-800">
          <svg width="42" height="32" viewBox="0 0 100 70" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 8 8 L 92 6 L 90 64 L 6 62 Z" />
            <path d="M 8 8 L 48 38 L 92 6" />
            <path d="M 48 38 L 47 63" />
          </svg>
        </div>

        {/* Doodle: Link */}
        <div className="absolute top-[35%] right-[5%] md:right-[8%] rotate-[20deg] opacity-70 text-gray-800">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 35 60 C 20 75, 10 50, 30 35 L 40 25 C 55 10, 75 30, 60 45" />
            <path d="M 65 40 C 80 25, 90 50, 70 65 L 60 75 C 45 90, 25 70, 40 55" />
            <path d="M 15 15 L 25 25" />
            <path d="M 85 85 L 75 75" />
            <path d="M 85 15 L 75 25" />
            <path d="M 15 85 L 25 75" />
          </svg>
        </div>

        {/* Doodle: Heart */}
        <div className="absolute bottom-[40%] right-[25%] md:right-[35%] rotate-[-10deg] opacity-70 text-gray-800">
          <svg width="32" height="32" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 50 88 C 50 88 12 55 15 28 C 18 12 40 12 50 32 C 60 12 82 12 85 28 C 88 55 50 88 50 88 Z" />
          </svg>
        </div>
        
        {/* Doodle: Squiggle Arrow */}
        <div className="absolute bottom-[35%] left-[25%] md:left-[40%] rotate-[15deg] opacity-70 text-gray-800">
          <svg width="50" height="30" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 10 25 Q 30 5, 50 25 T 85 25" />
            <path d="M 70 10 L 85 25 L 70 40" />
          </svg>
        </div>

        {/* Text Doodles */}
        <div className="absolute top-[5%] left-[25%] md:left-[35%] rotate-[-25deg] font-kalam text-xl md:text-2xl font-bold opacity-70 text-gray-800 tracking-wider">
          LOVE
        </div>
        <div className="absolute top-[45%] right-[8%] md:right-[10%] rotate-[15deg] font-caveat text-3xl font-bold opacity-70 text-gray-800">
          memories
        </div>
        <div className="absolute bottom-[45%] left-[5%] md:left-[8%] rotate-[10deg] font-patrick text-2xl opacity-70 text-gray-800">
          psst...
        </div>
        <div className="absolute bottom-[5%] right-[30%] md:right-[40%] rotate-[-15deg] font-kalam text-xl font-bold opacity-70 text-gray-800 uppercase tracking-widest">
          secret
        </div>

        {/* Existing Note Divs (Original Opacity) */}
        <div className="absolute top-[10%] left-[-5%] md:left-[10%] w-[200px] h-[200px] bg-[#EAEAC2] opacity-70 rotate-[-5deg] rounded-lg shadow-sm blur-[1px] p-4 flex">
           <p className="text-gray-800 font-medium text-sm">You're doing better than you think.</p>
        </div>
        
        <div className="absolute top-[5%] right-[-10%] md:right-[20%] w-[180px] h-[180px] bg-[#DFE4F2] opacity-60 rotate-[8deg] rounded-lg shadow-sm blur-[1px] p-4 flex">
           <p className="text-gray-800 font-medium text-sm">Call your mum.</p>
        </div>
        
        <div className="absolute bottom-[5%] left-[5%] md:left-[15%] w-[220px] h-[220px] bg-[#F3CAD9] opacity-60 rotate-[-12deg] rounded-lg shadow-sm blur-[2px]" />
        
        <div className="absolute bottom-[15%] right-[5%] md:right-[15%] w-[190px] h-[190px] bg-[#E6E4E6] opacity-70 rotate-[5deg] rounded-lg shadow-sm blur-[1px] p-6 flex items-center justify-center">
           <p className="text-gray-800 font-medium text-lg text-center">Don't forget the milk.</p>
        </div>
      </div>

      <div className="max-w-3xl w-full flex flex-col items-center text-center z-10 bg-white/10 backdrop-blur-[2px] rounded-3xl p-6 md:p-12">
        <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 text-[#111] leading-[1.1] tracking-tight">
          Leave<br className="hidden md:block" /> something<br className="hidden md:block" /> behind.
        </h1>
        
        <p className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Create a wall, share the link, and let people fill it with thoughts, memories, jokes, confessions, and anything else worth leaving behind.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
            href="/create"
            className="w-full sm:w-auto bg-[#0A1118] text-white px-8 py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-black transition-colors"
          >
            Create a wall
            <ArrowRight size={18} />
          </Link>
          <Link 
            href="/wall/things-we-never-said"
            className="w-full sm:w-auto bg-transparent border-2 border-[#0A1118] text-[#0A1118] px-8 py-3.5 rounded-full font-medium flex items-center justify-center hover:bg-black/5 transition-colors"
          >
            Explore a wall
          </Link>
        </div>
      </div>
    </div>
  );
}
