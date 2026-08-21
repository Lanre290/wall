import Link from "next/link";
import { LayoutGrid, Compass, User } from "lucide-react";

export function BottomNav({ active = "my-walls" }: { active?: "my-walls" | "explore" | "account" }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#F9F9F7] border-t border-gray-200/60 z-50 flex justify-around items-center h-20 px-6">
      <Link href="/my-walls" className={`flex flex-col items-center gap-1 ${active === "my-walls" ? "text-[#0A1118]" : "text-gray-500"}`}>
        <LayoutGrid size={24} />
        <span className={`text-[10px] ${active === "my-walls" ? "font-bold" : "font-medium"}`}>My Walls</span>
      </Link>
      <Link href="#" className={`flex flex-col items-center gap-1 ${active === "explore" ? "text-[#0A1118]" : "text-gray-500"}`}>
        <Compass size={24} />
        <span className={`text-[10px] ${active === "explore" ? "font-bold" : "font-medium"}`}>Explore</span>
      </Link>
      <Link href="/profile" className={`flex flex-col items-center gap-1 ${active === "account" ? "text-[#0A1118]" : "text-gray-500"}`}>
        <User size={24} />
        <span className={`text-[10px] ${active === "account" ? "font-bold" : "font-medium"}`}>Profile</span>
      </Link>
    </div>
  );
}
