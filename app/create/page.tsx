"use client";

import { useState, useEffect } from "react";
import { Globe, Lock, ArrowRight, Crown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateWallPage() {
  const router = useRouter();
  const [wallName, setWallName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<"anyone" | "private">("private");
  const [anonymousNotes, setAnonymousNotes] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [publicWallsLeft, setPublicWallsLeft] = useState<number | null>(null);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    // Fetch user to check Pro status
    fetch('/api/users/me')
      .then(res => res.json())
      .then(data => {
        if (data.user?.plan === 'PRO') {
          setIsPro(true);
        } else {
          // If Free, fetch walls to count PUBLIC ones
          fetch('/api/walls')
            .then(res => res.json())
            .then(wallData => {
              if (wallData.walls) {
                const publicCount = wallData.walls.filter((w: any) => w.type === 'PUBLIC').length;
                setPublicWallsLeft(Math.max(0, 3 - publicCount));
              }
            });
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallName.trim()) return;

    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/walls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: wallName,
          description,
          privacy: privacy === "private" ? "PRIVATE" : "PUBLIC",
          allowAnonymous: anonymousNotes
        })
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/wall/${data.wall.slug}`);
      } else if (res.status === 401) {
        router.push("/login");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to create wall");
      }
    } catch (error) {
      console.error("Failed to create wall", error);
      setErrorMsg("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-12 md:py-24">
      {/* Mobile Title Header - visible only on small screens */}
      <div className="md:hidden w-full max-w-xl flex items-center justify-between mb-8">
         {/* Since mobile header in design has back button, let's just make the title centered */}
      </div>

      <div className="text-center mb-12">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4 tracking-tight">Create your wall</h1>
        <p className="text-gray-600 text-lg md:text-xl">Give people a place to leave something behind.</p>
      </div>

      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/40 backdrop-blur-sm p-6 md:p-10 rounded-3xl border border-white/50 shadow-sm"
      >
        <div className="space-y-8">
          <div className="space-y-2">
            <label htmlFor="wallName" className="block text-xs font-semibold text-gray-500 tracking-wider uppercase">
              Wall Name
            </label>
            <input
              id="wallName"
              type="text"
              value={wallName}
              onChange={(e) => setWallName(e.target.value)}
              placeholder="Things We Never Said"
              className="w-full bg-[#F3F2EE] border-none rounded-xl px-5 py-4 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#0A1118] outline-none transition-shadow"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-xs font-semibold text-gray-500 tracking-wider uppercase">
              Short Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="The things you wanted to say but never did."
              rows={3}
              className="w-full bg-[#F3F2EE] border-none rounded-xl px-5 py-4 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#0A1118] outline-none transition-shadow resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 tracking-wider uppercase">
              Privacy
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => setPrivacy("anyone")}
                className={`relative flex flex-col gap-2 p-5 rounded-xl cursor-pointer transition-colors border ${
                  privacy === "anyone" 
                    ? "bg-[#2A313C] border-transparent text-white" 
                    : "bg-[#F3F2EE] border-transparent text-gray-900 hover:bg-[#EAE9E4]"
                }`}
              >
                {!isPro && (
                  <div className="group/crown absolute -top-2 -right-2 z-10">
                    <span className="flex text-amber-500 bg-white rounded-full p-1 shadow-sm border border-gray-100 cursor-help">
                      <Crown size={14} strokeWidth={3} />
                    </span>
                    <div className="absolute bottom-full right-0 mb-2 w-48 p-2.5 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 group-hover/crown:opacity-100 transition-opacity pointer-events-none text-center">
                      Free plan: 3 Public Walls max.<br/>
                      {publicWallsLeft !== null ? `You have ${publicWallsLeft} left.` : ''}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 font-semibold">
                  <Globe size={18} />
                  <span>Anyone (Public)</span>
                </div>
                <p className={`text-sm ${privacy === "anyone" ? "text-gray-400" : "text-gray-500"}`}>
                  Anyone with the link can leave something behind.
                </p>
              </div>

              <div 
                onClick={() => setPrivacy("private")}
                className={`flex flex-col gap-2 p-5 rounded-xl cursor-pointer transition-colors border ${
                  privacy === "private" 
                    ? "bg-[#2A313C] border-transparent text-white" 
                    : "bg-[#F3F2EE] border-transparent text-gray-900 hover:bg-[#EAE9E4]"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Lock size={18} />
                  <span>Private</span>
                </div>
                <p className={`text-sm ${privacy === "private" ? "text-gray-400" : "text-gray-500"}`}>
                  Only invited people can access.
                </p>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-8 p-4 bg-red-50 text-red-700 text-sm font-medium rounded-2xl border border-red-100 flex flex-col gap-2">
              <p>{errorMsg}</p>
              {errorMsg.includes("upgrade to Pro") && (
                <a href="/pro" className="text-red-800 underline font-bold mt-1 inline-block">View Pro Plan</a>
              )}
            </div>
          )}

          <div className="flex items-center justify-between p-5 bg-[#F3F2EE] rounded-xl">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 text-sm md:text-base">Anonymous Notes</span>
              <span className="text-gray-500 text-sm">Allow people to post without names</span>
            </div>
            
            <button
              type="button"
              onClick={() => setAnonymousNotes(!anonymousNotes)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                anonymousNotes ? "bg-[#0A1118]" : "bg-gray-300"
              }`}
            >
              <span className="sr-only">Enable anonymous notes</span>
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  anonymousNotes ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <button 
            type="submit"
            disabled={isLoading || !wallName.trim()}
            className="w-full bg-[#0A1118] text-white py-4 md:py-5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Create wall <ArrowRight size={18} /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
