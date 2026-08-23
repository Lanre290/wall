"use client";

import { useState, useRef } from "react";
import { BottomNav } from "../../components/BottomNav";
import { Share, PenSquare, X, Copy, Download, Loader2 } from "lucide-react";
import Link from "next/link";

type Note = {
  id: number;
  text: string;
  color: string;
  font: string;
  x: number;
  y: number;
  rotate: number;
  isAnonymous: boolean;
  heartsCount: number;
};

const DEMO_NOTES: Note[] = [
  { id: 1,  text: "I never told you how proud I was when you got that job. I just couldn't find the words.", color: "bg-[#EAEAC2]", font: "font-kalam", x: 5,  y: 8,  rotate: -3, isAnonymous: true,  heartsCount: 47 },
  { id: 2,  text: "I still think about that summer every single time it rains.",                             color: "bg-[#DFE4F2]", font: "font-caveat", x: 32, y: 4,  rotate: 2,  isAnonymous: true,  heartsCount: 83 },
  { id: 3,  text: "I forgave you years ago. I just didn't know how to tell you.",                         color: "bg-[#F3CAD9]", font: "font-sans", x: 59, y: 6,  rotate: -1, isAnonymous: false, heartsCount: 112 },
  { id: 4,  text: "You were the first person who made me feel like I wasn't too much.",                   color: "bg-[#E6E4E6]", font: "font-patrick", x: 72, y: 3,  rotate: 3,  isAnonymous: true,  heartsCount: 29 },
  { id: 5,  text: "I practiced that conversation in my head a thousand times and then never had it.",     color: "bg-[#F3CAD9]", font: "font-caveat", x: 12, y: 45, rotate: -4, isAnonymous: true,  heartsCount: 61 },
  { id: 6,  text: "Thank you for sitting with me in the silence. I needed that more than words.",         color: "bg-[#EAEAC2]", font: "font-sans", x: 40, y: 50, rotate: 1,  isAnonymous: false, heartsCount: 95 },
  { id: 7,  text: "I kept the voicemail because I was afraid I'd forget what you sounded like.",          color: "bg-[#DFE4F2]", font: "font-kalam", x: 70, y: 45, rotate: -2, isAnonymous: true,  heartsCount: 201 },
  { id: 8,  text: "I wish I had hugged you one last time.",                                               color: "bg-[#E6E4E6]", font: "font-patrick", x: 8,  y: 75, rotate: 4,  isAnonymous: false, heartsCount: 310 },
  { id: 9,  text: "I saw someone today who looked exactly like you from behind. My heart stopped.",       color: "bg-[#F3CAD9]", font: "font-caveat", x: 38, y: 80, rotate: -1, isAnonymous: true,  heartsCount: 45 },
  { id: 10, text: "I'm doing okay now. I thought you should know.",                                       color: "bg-[#EAEAC2]", font: "font-kalam", x: 68, y: 82, rotate: 2,  isAnonymous: true,  heartsCount: 89 },
];

export default function ThingsWeNeverSaidPage() {
  const [notes, setNotes] = useState<Note[]>(DEMO_NOTES);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newText, setNewText] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedFont, setSelectedFont] = useState(0);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  const fontOptions = ['font-sans', 'font-caveat', 'font-kalam', 'font-patrick'];

  const getHandwritingClass = (font: string, baseSize: 'lg' | 'sm' | 'xl' = 'lg') => {
    switch(font) {
      case 'font-caveat': return `font-caveat ${baseSize === 'lg' ? 'text-3xl leading-8' : baseSize === 'xl' ? 'text-4xl leading-10' : 'text-2xl leading-6'}`;
      case 'font-kalam': return `font-kalam ${baseSize === 'lg' ? 'text-xl' : baseSize === 'xl' ? 'text-3xl' : 'text-[17px]'}`;
      case 'font-patrick': return `font-patrick ${baseSize === 'lg' ? 'text-2xl leading-7' : baseSize === 'xl' ? 'text-3xl leading-9' : 'text-xl leading-6'}`;
      case 'font-sans':
      default: return `font-sans ${baseSize === 'lg' ? 'text-lg font-medium' : baseSize === 'xl' ? 'text-2xl font-medium' : 'text-[15px] font-medium'}`;
    }
  };

  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragInfo, setDragInfo] = useState<{ id: number; startX: number; startY: number; initX: number; initY: number } | null>(null);

  const colors = [
    { bg: "bg-[#EAEAC2]" },
    { bg: "bg-[#DFE4F2]" },
    { bg: "bg-[#F3CAD9]" },
    { bg: "bg-[#E6E4E6]" },
  ];

  const handlePointerDown = (e: React.PointerEvent, note: Note) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    setDragInfo({ id: note.id, startX: e.clientX, startY: e.clientY, initX: note.x, initY: note.y });
  };

  const handlePointerMove = (e: React.PointerEvent, note: Note) => {
    if (!dragInfo || dragInfo.id !== note.id || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragInfo.startX) / rect.width) * 100;
    const deltaY = ((e.clientY - dragInfo.startY) / rect.height) * 100;
    setNotes(prev => prev.map(n =>
      n.id === note.id ? { ...n, x: dragInfo.initX + deltaX, y: dragInfo.initY + deltaY } : n
    ));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragInfo) return;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    setDragInfo(null);
  };

  const handleHeart = (noteId: number) => {
    setNotes(prev => prev.map(n =>
      n.id === noteId ? { ...n, heartsCount: n.heartsCount + 1 } : n
    ));
  };

  const handleAddNote = () => {
    if (!newText.trim()) return;

    const newNote: Note = {
      id: Date.now(),
      text: newText,
      color: colors[selectedColor].bg,
      font: fontOptions[selectedFont],
      x: Math.floor(Math.random() * 70) + 10,
      y: Math.floor(Math.random() * 70) + 10,
      rotate: Math.floor(Math.random() * 10) - 5,
      isAnonymous: true,
      heartsCount: 0,
    };
    setNotes(prev => [newNote, ...prev]);
    setNewText("");
    setSelectedColor(0);
    setSelectedFont(0);
    setIsModalOpen(false);
  };

  const wallUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(wallUrl);
    alert('Link copied!');
  };

  const handleShareLink = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'Things We Never Said', url: wallUrl });
    } else {
      handleCopyLink();
    }
  };

  const handleSaveQR = async () => {
    setIsGeneratingQR(true);
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(wallUrl)}&margin=10`;
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `wall-qr-things-we-never-said.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const leftColumnNotes = notes.filter((_, i) => i % 2 === 0);
  const rightColumnNotes = notes.filter((_, i) => i % 2 !== 0);

  return (
    <div className="flex-1 flex flex-col relative min-h-screen pb-20 md:pb-0">

      {/* Demo Banner */}
      <div className="bg-[#0A1118] text-white text-xs text-center py-2 px-4 flex items-center justify-center gap-3">
        <span className="opacity-70">✦ This is a demo wall.</span>
        <Link href="/create" className="underline font-semibold hover:opacity-80 transition-opacity">
          Create your own →
        </Link>
      </div>

      {/* Wall Header */}
      <div className="px-4 md:px-12 py-8 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center md:items-start justify-between text-center md:text-left gap-4">
        <div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-2 tracking-tight text-[#111]">
            Things We Never Said.
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mb-4">
            A quiet place for the words that never made it out.
          </p>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-widest">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {notes.length} notes
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="w-12 h-12 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Share size={20} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Desktop Canvas */}
      <div
        ref={canvasRef}
        className="hidden md:flex flex-1 relative overflow-hidden min-h-[600px] w-full"
      >
        {notes.map((note) => (
          <div
            key={note.id}
            onPointerDown={(e) => handlePointerDown(e, note)}
            onPointerMove={(e) => handlePointerMove(e, note)}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`absolute p-8 rounded-lg shadow-sm w-[300px] cursor-grab active:cursor-grabbing ${note.color} ${dragInfo?.id === note.id ? 'z-50 scale-105' : 'hover:z-10 hover:scale-105'} transition-transform`}
            style={{
              left: `${note.x}%`,
              top: `${note.y}%`,
              transform: `rotate(${dragInfo?.id === note.id ? 0 : note.rotate}deg)`,
              touchAction: 'none',
            }}
          >
            <p className={`text-gray-900 mb-6 leading-relaxed select-none ${getHandwritingClass(note.font, 'lg')}`}>
              {note.text}
            </p>
            <div className="flex items-center justify-between select-none">
              <span className="text-gray-500 text-sm">— {note.isAnonymous ? "Anonymous" : "Someone"}</span>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => handleHeart(note.id)}
                className="flex items-center gap-1 text-gray-500 hover:text-red-400 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" className="w-4 h-4 text-red-400/60 hover:text-red-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-xs font-medium">{note.heartsCount}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Masonry Grid */}
      <div className="md:hidden flex-1 w-full px-4 pt-4 pb-28">
        <div className="flex gap-4 items-start">
          <div className="flex flex-col gap-4 flex-1">
            {leftColumnNotes.map(note => (
              <button
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`p-5 rounded-lg shadow-sm w-full text-left ${note.color} active:scale-[0.97] transition-transform`}
              >
                <p className={`text-gray-900 mb-4 leading-relaxed line-clamp-4 ${getHandwritingClass(note.font, 'sm')}`}>{note.text}</p>
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 text-xs">— Anonymous</p>
                  <div className="flex items-center gap-1 text-red-400/70 hover:text-red-400 transition-colors">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-[10px] font-medium">{note.heartsCount}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-4 flex-1">
            {rightColumnNotes.map(note => (
              <button
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`p-5 rounded-lg shadow-sm w-full text-left ${note.color} active:scale-[0.97] transition-transform`}
              >
                <p className={`text-gray-900 mb-4 leading-relaxed line-clamp-4 ${getHandwritingClass(note.font, 'sm')}`}>{note.text}</p>
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 text-xs">— Anonymous</p>
                  <div className="flex items-center gap-1 text-red-400/70 hover:text-red-400 transition-colors">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-[10px] font-medium">{note.heartsCount}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Fullscreen Note View */}
      {selectedNote && (
        <div className="md:hidden fixed inset-0 z-[60] flex flex-col" style={{ backgroundColor: selectedNote.color.replace('bg-', '') }}>
          {/* Use inline style trick — extract actual hex from tailwind class */}
          <div className={`fixed inset-0 z-[60] flex flex-col ${selectedNote.color}`}>
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 pt-12 pb-4">
              <button
                onClick={() => setSelectedNote(null)}
                className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center"
              >
                <X size={20} className="text-gray-800" />
              </button>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Note</span>
              <div className="w-10" />
            </div>

            {/* Note content */}
            <div className="flex-1 flex flex-col justify-center px-8 pb-8">
              <p className={`text-gray-900 leading-relaxed mb-10 ${getHandwritingClass(selectedNote.font, 'xl')}`}>
                {selectedNote.text}
              </p>
              <p className="text-gray-600 text-base font-sans">
                — {selectedNote.isAnonymous ? "Anonymous" : "Someone"}
              </p>
            </div>

            {/* Heart button at bottom */}
            <div className="px-8 pb-32">
              <button
                onClick={() => {
                  handleHeart(selectedNote.id);
                  setSelectedNote(prev => prev ? { ...prev, heartsCount: (prev.heartsCount || 0) + 1 } : prev);
                }}
                className="w-full py-4 rounded-full bg-black/10 flex items-center justify-center gap-3 text-gray-800 font-semibold text-base active:scale-95 transition-transform"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {selectedNote.heartsCount || 0} appreciations
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Leave a Note FAB */}
      <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-20">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0A1118] text-white px-5 py-3.5 rounded-full font-medium flex items-center gap-2 hover:bg-black transition-colors shadow-lg"
        >
          <PenSquare size={18} />
          Leave a note
        </button>
      </div>

      <BottomNav />

      {/* Leave a Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-transparent z-10 flex flex-col h-[90vh] md:h-auto">
            <div className="text-center mb-6 pt-10 md:pt-0">
              <h2 className="font-playfair text-2xl font-bold text-white mb-1">Leave something behind.</h2>
              <p className="text-gray-200 text-sm">Your words join this collective wall.</p>
            </div>

            <div className={`${colors[selectedColor].bg} rounded-sm p-6 shadow-xl w-full min-h-[300px] flex flex-col`}>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value.slice(0, 300))}
                placeholder="Write anything..."
                className={`w-full h-full flex-1 bg-transparent border-none outline-none resize-none text-gray-900 placeholder-gray-500/70 ${getHandwritingClass(fontOptions[selectedFont], 'lg')}`}
                autoFocus
              />
              
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold w-12">Font</span>
                  <div className="flex gap-2">
                    {fontOptions.map((font, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedFont(idx)}
                        className={`w-6 h-6 rounded-sm flex items-center justify-center text-sm transition-all ${
                          selectedFont === idx ? "bg-black/10 text-black shadow-inner" : "text-gray-500 hover:bg-black/5"
                        } ${getHandwritingClass(font, 'sm')}`}
                        aria-label={`Select font ${idx}`}
                      >
                        Ag
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold w-12">Color</span>
                    <div className="flex gap-2">
                      {colors.map((color, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedColor(idx)}
                          className={`w-5 h-5 rounded-full ${color.bg} border-2 ${
                            selectedColor === idx ? "border-gray-400 scale-110" : "border-transparent"
                          } shadow-sm transition-all`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-gray-500/70 text-sm font-medium">
                    {newText.length}/300
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddNote}
              disabled={!newText.trim()}
              className="mt-4 bg-[#0A1118] text-white py-4 rounded-full font-medium w-full flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-50 shadow-lg"
            >
              Stick it to the wall
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
            <button onClick={() => setIsModalOpen(false)} className="mt-4 text-white/80 font-medium py-2 hover:text-white">Cancel</button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#E6E6E3] md:bg-black/40">
          <div className="md:hidden flex items-center justify-between px-4 py-4">
            <button onClick={() => setIsShareModalOpen(false)} className="p-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <h2 className="font-playfair text-lg font-bold">Share Wall</h2>
            <div className="w-8" />
          </div>

          <div className="hidden md:block absolute inset-0 backdrop-blur-sm" onClick={() => setIsShareModalOpen(false)} />

          <div className="mt-auto bg-white rounded-t-3xl md:rounded-3xl p-6 md:p-8 w-full md:max-w-md mx-auto md:mb-auto md:mt-24 shadow-2xl flex flex-col gap-6 relative z-10 min-h-[60vh] md:min-h-0">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto md:hidden" />
            <div className="hidden md:flex justify-between items-center">
              <h2 className="font-playfair text-2xl font-bold">Share Wall</h2>
              <button onClick={() => setIsShareModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>

            <div>
              <h3 className="font-playfair text-xl font-bold text-[#111] mb-1">Things We Never Said</h3>
              <p className="text-gray-600 text-sm">Share this wall with someone who needs to read these words.</p>
            </div>

            <div className="flex items-center justify-between bg-[#F6F5F2] p-2 pl-4 rounded-xl">
              <span className="text-gray-700 text-sm font-medium truncate pr-2">{typeof window !== 'undefined' ? window.location.host + window.location.pathname : ''}</span>
              <button onClick={handleCopyLink} className="bg-[#0A1118] text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-black transition-colors shrink-0">
                <Copy size={16} />Copy
              </button>
            </div>

            <div className="flex gap-3">
              <button onClick={handleShareLink} className="flex-1 bg-[#EAE9E4] text-gray-700 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#DFDED9] transition-colors">
                <Share size={16} />Share Link
              </button>
              <button onClick={handleSaveQR} disabled={isGeneratingQR} className="flex-1 bg-[#EAE9E4] text-gray-700 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#DFDED9] transition-colors disabled:opacity-50">
                {isGeneratingQR ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}Save QR
              </button>
            </div>

            <div className="mt-auto text-center">
              <Link href="/create" className="text-sm font-semibold text-[#0A1118] underline hover:opacity-70 transition-opacity">
                Create your own wall →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
