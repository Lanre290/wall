import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-6 py-12 md:py-24 min-h-[80vh]">
      
      {/* Background blurred notes */}
      <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden">
        {/* Top left yellow */}
        <div className="absolute top-[10%] left-[-5%] md:left-[10%] w-[200px] h-[200px] bg-[#EAEAC2] opacity-70 rotate-[-5deg] rounded-lg shadow-sm blur-[1px] p-4 flex">
           <p className="text-gray-800 font-medium text-sm">You're doing better than you think.</p>
        </div>
        
        {/* Top right blue */}
        <div className="absolute top-[5%] right-[-10%] md:right-[20%] w-[180px] h-[180px] bg-[#DFE4F2] opacity-60 rotate-[8deg] rounded-lg shadow-sm blur-[1px] p-4 flex">
           <p className="text-gray-800 font-medium text-sm">Call your mum.</p>
        </div>
        
        {/* Bottom left pink */}
        <div className="absolute bottom-[5%] left-[5%] md:left-[15%] w-[220px] h-[220px] bg-[#F3CAD9] opacity-60 rotate-[-12deg] rounded-lg shadow-sm blur-[2px]" />
        
        {/* Bottom right grey */}
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
