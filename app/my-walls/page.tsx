"use client";

import { useEffect, useState } from "react";
import { BottomNav } from "../components/BottomNav";
import { Bell, Plus, MoreHorizontal, ArrowRight, PenSquare, Loader2 } from "lucide-react";
import Link from "next/link";

export default function MyWallsPage() {
  const [walls, setWalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<'recent' | 'alpha'>('recent');

  useEffect(() => {
    async function fetchWalls() {
      try {
        const res = await fetch(`/api/walls?sort=${sort}`);
        if (res.ok) {
          const data = await res.json();
          setWalls(data.walls);
        } else if (res.status === 401) {
          // Redirect to login if unauthorized
          window.location.href = '/login';
        }
      } catch (error) {
        console.error("Failed to fetch walls", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWalls();
  }, [sort]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };


  return (
    <div className="flex-1 flex flex-col min-h-screen">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex justify-between items-center p-6 pb-2">
        <h1 className="font-playfair text-xl font-bold">My Walls</h1>
        <button className="p-2">
          <Bell size={20} className="text-gray-800" />
        </button>
      </div>

      <div className="px-6 md:px-12 py-4 md:py-16 max-w-7xl mx-auto w-full flex-1">
        
        {/* Desktop Title & Toggle */}
        <div className="hidden md:flex justify-between items-end mb-12">
          <div>
            <h1 className="font-playfair text-5xl font-bold text-[#111] mb-3">Your Walls</h1>
            <p className="text-gray-600 text-lg">
              The quiet spaces where thoughts collect, unhurried and<br/> unstructured.
            </p>
            <div className="h-0.5 w-16 bg-[#D4D2C5] mt-4" />
          </div>
          
          <div className="flex bg-[#F3F2EE] rounded-full p-1 border border-gray-200">
            <button 
              onClick={() => setSort('recent')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${sort === 'recent' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
            >
              Recent
            </button>
            <button 
              onClick={() => setSort('alpha')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${sort === 'alpha' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
            >
              A-Z
            </button>
          </div>
        </div>

        {/* Mobile Title */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <div>
            <h2 className="font-playfair text-2xl font-bold text-[#111]">Your Walls</h2>
            <p className="text-gray-600 text-sm">A space for every thought.</p>
          </div>
          <Link href="/create" className="bg-[#0A1118] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
            <Plus size={16} /> New
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        ) : walls.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">You haven't created any walls yet.</p>
            <Link href="/create" className="text-[#0A1118] underline font-medium">Create your first wall</Link>
          </div>
        ) : (
          <>
            {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-4 gap-6">
          {/* Create New Wall Card */}
          <Link href="/create" className="bg-[#F3F2EE] rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#EBE9E2] transition-colors border border-transparent min-h-[320px]">
            <div className="w-12 h-12 rounded-full bg-gray-200/60 flex items-center justify-center mb-4 text-gray-600">
              <Plus size={24} />
            </div>
            <h3 className="font-playfair text-2xl font-bold text-[#111] mb-1">New Wall</h3>
            <p className="text-[10px] font-semibold text-gray-500 tracking-widest uppercase">Blank Canvas</p>
          </Link>

          {/* Wall Cards */}
          {walls.map(wall => (
            <Link href={`/wall/${wall.id}`} key={wall.id} className="bg-white rounded-2xl p-8 flex flex-col border border-gray-100 shadow-sm hover:shadow-md transition-shadow min-h-[320px]">
              <div className="flex justify-between items-center mb-6">
                <span className="bg-[#F3F2EE] text-gray-600 text-[10px] font-bold px-3 py-1 rounded-full tracking-wider">
                  {wall.type}
                </span>
                <button className="text-gray-400 hover:text-black">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              
              <h3 className="font-playfair text-3xl font-bold text-[#111] leading-tight mb-auto pt-4">
                {wall.title.split(' ').map((word: string, i: number) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h3>

              <div className="flex justify-between items-end pt-8 border-t border-gray-100 mt-8">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">Notes</span>
                  <span className="text-base font-bold text-[#111]">{wall.notesCount}</span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">Active</span>
                  <span className="text-sm font-medium text-gray-800">{formatDate(wall.lastActive)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile List */}
        <div className="md:hidden flex flex-col gap-4 pb-32">
          {walls.map(wall => (
            <Link href={`/wall/${wall.id}`} key={wall.id} className="bg-[#F6F5F2] rounded-2xl p-5 relative border border-transparent hover:border-gray-200 transition-colors">
              <button className="absolute top-5 right-5 w-8 h-8 bg-gray-200/50 rounded-full flex items-center justify-center">
                <ArrowRight size={16} className="text-gray-600" />
              </button>
              
              <h3 className="font-sans text-lg font-bold text-[#111] mb-1 pr-10">{wall.title}</h3>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-widest mb-4">{wall.notesCount} NOTES</p>
              
              <div className="flex gap-2">
                {wall.thumbnails.map((color, i) => (
                  <div key={i} className={`w-10 h-12 rounded bg-white shadow-sm flex flex-col overflow-hidden border border-gray-100`}>
                    <div className="h-1.5 w-full bg-white" />
                    <div className={`flex-1 w-full ${color} opacity-80`} />
                  </div>
                ))}
              </div>
            </Link>
          ))}

          {/* Mobile Create New Wall */}
          <Link href="/create" className="border border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center mt-2 bg-transparent hover:bg-[#F6F5F2]/50 transition-colors">
            <div className="w-12 h-12 bg-[#DFE4F2] rounded-full flex items-center justify-center mb-3">
              <Plus size={24} className="text-[#0A1118]" />
            </div>
            <p className="text-sm font-bold text-[#111] tracking-widest uppercase">Create New Wall</p>
          </Link>
        </div>
        </>
        )}
      </div>

      {/* Leave a Note FAB (only on mobile) */}
      <div className="md:hidden fixed bottom-28 right-1/2 translate-x-1/2 z-20 w-[90%] max-w-sm">
        <button className="w-full bg-[#0A1118] text-white py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg">
          <PenSquare size={18} />
          LEAVE A NOTE
        </button>
      </div>

      <BottomNav active="my-walls" />
    </div>
  );
}
