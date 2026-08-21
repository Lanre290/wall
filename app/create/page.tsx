"use client";

import { useState } from "react";
import { Globe, Lock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateWallPage() {
  const router = useRouter();
  const [wallName, setWallName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<"anyone" | "private">("anyone");
  const [anonymousNotes, setAnonymousNotes] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallName.trim()) return;

    setIsLoading(true);
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
      }
    } catch (error) {
      console.error("Failed to create wall", error);
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
                className={`flex flex-col gap-2 p-5 rounded-xl cursor-pointer transition-colors border ${
                  privacy === "anyone" 
                    ? "bg-[#2A313C] border-transparent text-white" 
                    : "bg-[#F3F2EE] border-transparent text-gray-900 hover:bg-[#EAE9E4]"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Globe size={18} />
                  <span>Anyone</span>
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

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#0A1118] text-white px-8 py-3.5 rounded-full font-medium flex items-center gap-2 hover:bg-black transition-colors w-full md:w-auto justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Create wall"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
