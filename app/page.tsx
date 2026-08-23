import Link from "next/link";
import { ArrowRight } from "lucide-react";
// import { WallOfFame } from "./components/WallOfFame";

export default function LandingPage() {
  return (
    <div className="relative w-full overflow-hidden flex-1 flex flex-col">
      
      {/* Global Background Dotted Grid */}
      <div 
        className="absolute inset-0 z-[-2] opacity-30" 
        style={{ 
          backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} 
      />

      {/* Global Background Doodles, Notes & Text */}
      <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden">
        
        {/* --- SCATTERED DOODLES & TEXT (0% - 100%) --- */}
        <div className="absolute top-[8%] left-[25%] md:left-[35%] rotate-[-25deg] font-kalam text-xl md:text-2xl font-bold opacity-70 text-gray-800 tracking-wider">
          LOVE
        </div>

        <div className="absolute top-[12%] left-[30%] md:left-[45%] rotate-[-15deg] opacity-70 text-gray-800">
          <svg width="42" height="32" viewBox="0 0 100 70" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 8 8 L 92 6 L 90 64 L 6 62 Z" />
            <path d="M 8 8 L 48 38 L 92 6" />
            <path d="M 48 38 L 47 63" />
          </svg>
        </div>

        <div className="absolute top-[22%] right-[5%] md:right-[8%] rotate-[20deg] opacity-70 text-gray-800">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 35 60 C 20 75, 10 50, 30 35 L 40 25 C 55 10, 75 30, 60 45" />
            <path d="M 65 40 C 80 25, 90 50, 70 65 L 60 75 C 45 90, 25 70, 40 55" />
            <path d="M 15 15 L 25 25" />
            <path d="M 85 85 L 75 75" />
            <path d="M 85 15 L 75 25" />
            <path d="M 15 85 L 25 75" />
          </svg>
        </div>

        <div className="absolute top-[32%] right-[8%] md:right-[10%] rotate-[15deg] font-caveat text-3xl font-bold opacity-70 text-gray-800">
          memories
        </div>

        <div className="absolute top-[42%] left-[5%] md:left-[8%] rotate-[10deg] font-patrick text-2xl opacity-70 text-gray-800">
          psst...
        </div>

        <div className="absolute top-[52%] right-[25%] md:right-[35%] rotate-[-10deg] opacity-70 text-gray-800">
          <svg width="32" height="32" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 50 88 C 50 88 12 55 15 28 C 18 12 40 12 50 32 C 60 12 82 12 85 28 C 88 55 50 88 50 88 Z" />
          </svg>
        </div>

        <div className="absolute top-[62%] left-[25%] md:left-[40%] rotate-[15deg] opacity-70 text-gray-800">
          <svg width="50" height="30" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 10 25 Q 30 5, 50 25 T 85 25" />
            <path d="M 70 10 L 85 25 L 70 40" />
          </svg>
        </div>

        <div className="absolute top-[72%] left-[15%] md:left-[25%] rotate-[-20deg] opacity-60 text-gray-800">
          <svg width="35" height="35" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 50 10 L 60 40 L 90 50 L 60 60 L 50 90 L 40 60 L 10 50 L 40 40 Z" />
          </svg>
        </div>

        <div className="absolute top-[82%] right-[5%] md:right-[40%] rotate-[10deg] font-patrick text-xl opacity-60 text-gray-800">
          so easy...
        </div>

        <div className="absolute top-[88%] right-[10%] md:right-[15%] rotate-[15deg] opacity-60 text-gray-800">
          <svg width="45" height="45" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="50" cy="50" r="40" />
            <path d="M 35 40 L 35 40.1 M 65 40 L 65 40.1 M 35 65 C 45 75, 55 75, 65 65" />
          </svg>
        </div>

        <div className="absolute top-[92%] left-[5%] md:left-[12%] rotate-[-15deg] font-kalam text-2xl font-bold opacity-60 text-gray-800 tracking-wider">
          BEA
        </div>
        
        <div className="absolute top-[96%] right-[5%] md:right-[35%] rotate-[-25deg] font-caveat text-2xl font-bold opacity-60 text-gray-800">
          shh...
        </div>

        {/* --- SCATTERED COLORED STICKY NOTES --- */}
        <div className="absolute top-[5%] left-[-5%] md:left-[10%] w-[200px] h-[200px] bg-[#EAEAC2] opacity-70 rotate-[-5deg] rounded-lg shadow-sm blur-[1px] p-4 flex">
           <p className="text-gray-800 font-medium text-sm">You're doing better than you think.</p>
        </div>
        
        <div className="absolute top-[28%] right-[-10%] md:right-[20%] w-[180px] h-[180px] bg-[#DFE4F2] opacity-60 rotate-[8deg] rounded-lg shadow-sm blur-[1px] p-5 flex items-center justify-center">
           <p className="text-gray-800 font-medium text-md font-kalam text-center leading-tight">i miss our late night talks.</p>
        </div>
        
        <div className="absolute top-[58%] left-[5%] md:left-[15%] w-[220px] h-[220px] bg-[#F3CAD9] opacity-60 rotate-[-12deg] rounded-lg shadow-sm blur-[2px] p-6 flex items-center justify-center">
           <p className="text-gray-800 font-bold text-lg font-caveat text-center leading-tight">I lied when I said I didn't care.</p>
        </div>
        
        <div className="absolute top-[85%] right-[5%] md:right-[15%] w-[190px] h-[190px] bg-[#E6E4E6] opacity-70 rotate-[5deg] rounded-lg shadow-sm blur-[1px] p-5 flex items-center justify-center">
           <p className="text-gray-800 font-medium text-md text-center font-patrick leading-tight">I still listen to that playlist you made me.</p>
        </div>
      </div>

      {/* Hero Content Wrapper */}
      <div className="flex flex-col items-center justify-center px-6 py-12 md:py-24 min-h-[80vh] relative z-10">
        <div className="max-w-3xl w-full flex flex-col items-center text-center bg-white/10 backdrop-blur-[2px] rounded-3xl p-6 md:p-12">
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

      {/* How it works Section Content */}
      <div className="w-full max-w-7xl mx-auto px-6 py-24 md:py-32 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-[#111]">How it works</h2>
          <p className="text-gray-600 text-lg">Five simple steps to start collecting memories.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-4 relative">
          {/* Subtle connecting dashed line (desktop only) */}
          <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[2px] z-0 border-t-2 border-dashed border-gray-300/60" />

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center relative z-10 group">
            <div className="w-20 h-20 bg-[#EAEAC2] rounded-2xl flex items-center justify-center text-2xl font-bold text-gray-800 shadow-sm border-4 border-white mb-6 rotate-[-5deg] transition-transform group-hover:rotate-0">1</div>
            <h3 className="text-xl font-bold mb-3 text-[#111]">Create a wall</h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-[200px]">Set up your digital space in seconds with a custom name and description.</p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center relative z-10 group">
            <div className="w-20 h-20 bg-[#DFE4F2] rounded-2xl flex items-center justify-center text-2xl font-bold text-gray-800 shadow-sm border-4 border-white mb-6 rotate-[5deg] transition-transform group-hover:rotate-0">2</div>
            <h3 className="text-xl font-bold mb-3 text-[#111]">Share the link</h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-[200px]">Put it in your bio, drop it in a group chat, or send it to friends privately.</p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center relative z-10 group">
            <div className="w-20 h-20 bg-[#F3CAD9] rounded-2xl flex items-center justify-center text-2xl font-bold text-gray-800 shadow-sm border-4 border-white mb-6 rotate-[-8deg] transition-transform group-hover:rotate-0">3</div>
            <h3 className="text-xl font-bold mb-3 text-[#111]">Set Privacy</h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-[210px]">Make it public for everyone to read, or keep it private so people can drop notes that only you can see.</p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center relative z-10 group">
            <div className="w-20 h-20 bg-[#E6E4E6] rounded-2xl flex items-center justify-center text-2xl font-bold text-gray-800 shadow-sm border-4 border-white mb-6 rotate-[8deg] transition-transform group-hover:rotate-0">4</div>
            <h3 className="text-xl font-bold mb-3 text-[#111]">Collect notes</h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-[200px]">People drop in and leave anonymous confessions, jokes, and memories.</p>
          </div>

          {/* Step 5 */}
          <div className="flex flex-col items-center text-center relative z-10 group">
            <div className="w-20 h-20 bg-[#0A1118] rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-sm border-4 border-white mb-6 rotate-[-5deg] transition-transform group-hover:rotate-0">5</div>
            <h3 className="text-xl font-bold mb-3 text-[#111]">Read & enjoy</h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-[200px]">Check your wall anytime, heart your favorites, and discover who sent them.</p>
          </div>
        </div>
      </div>

      {/* Wall of Fame (Note Showcase) - Interactive Client Component */}
      {/* <WallOfFame /> */}
    </div>
  );
}
