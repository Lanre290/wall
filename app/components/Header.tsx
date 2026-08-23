import Link from "next/link";
import { LayoutGrid, User, Search, ChevronLeft } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 md:px-12 md:py-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="bg-[#0A1118] text-white p-1.5 rounded-md flex items-center justify-center">
            <LayoutGrid size={20} strokeWidth={2.5} />
          </div>
          <span className="font-playfair font-bold text-2xl tracking-tight">Wall</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <Link href="/my-walls" className="hover:text-black transition-colors font-medium">My Walls</Link>
        <Link href="#" className="hover:text-black transition-colors">Explore</Link>
        <Link href="/pro" className="flex items-center gap-1 font-medium text-amber-600 hover:text-amber-700 transition-colors">✨ Pro</Link>
        <Link 
          href="/create" 
          className="bg-[#0A1118] text-white px-5 py-2 rounded-full hover:bg-black transition-colors"
        >
          Create
        </Link>
        <Link href="/profile" className="bg-[#0A1118] text-white p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-black transition-colors">
          <User size={18} />
        </Link>
      </div>

      {/* Mobile Navigation */}
      <div className="flex md:hidden items-center gap-4 text-[#0A1118]">
        <button className="p-1">
          <Search size={22} />
        </button>
        <Link href="/profile" className="bg-[#0A1118] text-white p-1.5 rounded-full flex items-center justify-center cursor-pointer">
          <User size={18} />
        </Link>
      </div>
    </header>
  );
}
