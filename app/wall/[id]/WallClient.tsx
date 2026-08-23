"use client";

import { useState, useEffect, useRef } from "react";
import { BottomNav } from "../../components/BottomNav";
import { Share, MoreHorizontal, PenSquare, X, LayoutGrid, Compass, Info, Copy, Download, Loader2 } from "lucide-react";

type Note = {
  id: number;
  text: string;
  author: string | null;
  authorName: string | null;
  color: string;
  font: string;
  x: number;
  y: number;
  rotate: number;
  isAnonymous: boolean;
  heartsCount?: number;
};

type WallData = {
  id: string;
  slug: string;
  title: string;
  description: string;
  privacy: string;
  allowAnonymous: boolean;
};

function SettingsContent({ wallSettings, setWallSettings, isSavingSettings, onSave, onCancel }: {
  wallSettings: { privacy: string; allowAnonymous: boolean };
  setWallSettings: React.Dispatch<React.SetStateAction<{ privacy: string; allowAnonymous: boolean }>>;
  isSavingSettings: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      {/* Privacy Toggle */}
      <div className="mb-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Visibility</p>
        <div className="flex bg-[#F3F2EE] rounded-full p-1">
          <button
            onClick={() => setWallSettings(s => ({ ...s, privacy: 'PUBLIC' }))}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${wallSettings.privacy === 'PUBLIC' ? 'bg-white shadow-sm text-[#111]' : 'text-gray-500'}`}
          >
            🌍 Public
          </button>
          <button
            onClick={() => setWallSettings(s => ({ ...s, privacy: 'PRIVATE' }))}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${wallSettings.privacy === 'PRIVATE' ? 'bg-white shadow-sm text-[#111]' : 'text-gray-500'}`}
          >
            🔒 Private
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
          {wallSettings.privacy === 'PRIVATE'
            ? 'Visitors can drop messages but cannot read the wall. Only you see the notes.'
            : 'Anyone with the link can view and leave notes on this wall.'}
        </p>
      </div>

      {/* Anonymous Toggle */}
      <div className="mb-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Anonymous notes</p>
        <button
          onClick={() => setWallSettings(s => ({ ...s, allowAnonymous: !s.allowAnonymous }))}
          className="flex items-center justify-between w-full bg-[#F3F2EE] rounded-xl px-4 py-3"
        >
          <span className="text-sm font-medium text-[#111]">Allow anonymous posting</span>
          <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${wallSettings.allowAnonymous ? 'bg-[#0A1118]' : 'bg-gray-300'}`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${wallSettings.allowAnonymous ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-full text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={isSavingSettings}
          className="flex-1 py-3 rounded-full text-sm font-semibold bg-[#0A1118] text-white hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
        >
          {isSavingSettings ? <Loader2 size={14} className="animate-spin" /> : null}
          {isSavingSettings ? 'Saving...' : 'Save'}
        </button>
      </div>
    </>
  );
}

export default function WallClient({ slug }: { slug: string }) {
  const [wall, setWall] = useState<WallData | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const [submitted, setSubmitted] = useState(false); // for private inbox confirmation

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [displayUrl, setDisplayUrl] = useState("");
  
  // Note Form State
  const [newText, setNewText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [selectedColor, setSelectedColor] = useState(0);

  // Drag State
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragInfo, setDragInfo] = useState<{ id: number; startX: number; startY: number; initX: number; initY: number } | null>(null);

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
    const target = e.currentTarget as HTMLElement;
    target.releasePointerCapture(e.pointerId);
    setDragInfo(null);
  };

  const colors = [
    { bg: "bg-[#EAEAC2]", dot: "bg-[#D1D19C]" },
    { bg: "bg-[#DFE4F2]", dot: "bg-[#B5C2DC]" },
    { bg: "bg-[#F3CAD9]", dot: "bg-[#D6A1B6]" },
    { bg: "bg-[#E6E4E6]", dot: "bg-[#C4B7D2]" },
  ];

  const getHandwritingClass = (font: string, baseSize: 'lg' | 'sm' | 'xl' = 'lg') => {
    switch(font) {
      case 'font-caveat': return `font-caveat ${baseSize === 'lg' ? 'text-3xl leading-8' : baseSize === 'xl' ? 'text-4xl leading-10' : 'text-2xl leading-6'}`;
      case 'font-kalam': return `font-kalam ${baseSize === 'lg' ? 'text-xl' : baseSize === 'xl' ? 'text-3xl' : 'text-[17px]'}`;
      case 'font-patrick': return `font-patrick ${baseSize === 'lg' ? 'text-2xl leading-7' : baseSize === 'xl' ? 'text-3xl leading-9' : 'text-xl leading-6'}`;
      case 'font-sans':
      default: return `font-sans ${baseSize === 'lg' ? 'text-lg font-medium' : baseSize === 'xl' ? 'text-2xl font-medium' : 'text-[15px] font-medium'}`;
    }
  };

  useEffect(() => {
    setDisplayUrl(window.location.host + window.location.pathname);
    
    async function fetchData(isPolling = false) {
      try {
        if (!isPolling) {
          const wallRes = await fetch(`/api/walls/${slug}`);
          if (!wallRes.ok) throw new Error("Failed to load wall");
          const wallData = await wallRes.json();
          setWall(wallData.wall);
          setIsCreator(wallData.isCreator);

          // If private wall and not the creator, open the inbox modal immediately
          if (wallData.wall.privacy === 'PRIVATE' && !wallData.isCreator) {
            setIsModalOpen(true);
            setLoading(false);
            return; // Don't fetch notes for visitors of private walls
          }
        }

        const notesRes = await fetch(`/api/walls/${slug}/notes`);
        if (notesRes.ok) {
          const notesData = await notesRes.json();
          
          setNotes((prevNotes) => {
            const existingMap = new Map(prevNotes.map(n => [n.id, n]));
            
            return notesData.notes.map((n: any) => {
              if (existingMap.has(n.id)) {
                const existing = existingMap.get(n.id)!;
                return { ...n, x: existing.x, y: existing.y, rotate: existing.rotate };
              } else {
                return {
                  ...n,
                  x: Math.floor(Math.random() * 70) + 10,
                  y: Math.floor(Math.random() * 70) + 10,
                  rotate: Math.floor(Math.random() * 10) - 5,
                };
              }
            });
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!isPolling) setLoading(false);
      }
    }
    
    fetchData();

    const intervalId = setInterval(() => {
      fetchData(true);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [slug]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedFont, setSelectedFont] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [wallSettings, setWallSettings] = useState({ privacy: 'PUBLIC', allowAnonymous: true });

  const fontOptions = ['font-sans', 'font-caveat', 'font-kalam', 'font-patrick'];

  // Sync wallSettings when wall loads
  useEffect(() => {
    if (wall) {
      setWallSettings({ privacy: wall.privacy, allowAnonymous: wall.allowAnonymous });
    }
  }, [wall]);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const res = await fetch(`/api/walls/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wallSettings),
      });
      if (res.ok) {
        const data = await res.json();
        setWall((prev: any) => ({ ...prev, ...data.wall.dataValues ?? wallSettings }));
        setIsSettingsOpen(false);
      }
    } catch (err) {
      console.error('Failed to save settings', err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleAddNote = async () => {
    if (!newText.trim() || !wall || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/walls/${slug}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newText,
          color: colors[selectedColor].bg,
          font: fontOptions[selectedFont],
          isAnonymous
        })
      });

      if (res.ok) {
        const data = await res.json();
        const isPrivateVisitor = wall.privacy === 'PRIVATE' && !isCreator;

        if (isPrivateVisitor) {
          setSubmitted(true);
          setIsModalOpen(false);
        } else {
          const newNote = {
            ...data.note,
            x: Math.floor(Math.random() * 70) + 10,
            y: Math.floor(Math.random() * 70) + 10,
            rotate: Math.floor(Math.random() * 10) - 5,
          };
          setNotes(prev => [newNote, ...prev]);
          setIsModalOpen(false);
        }
        setNewText("");
        setIsAnonymous(true);
        setSelectedColor(0);
        setSelectedFont(0);
      }
    } catch (error) {
      console.error("Failed to post note", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHeart = async (noteId: number) => {
    // Optimistic UI update
    setNotes(prev => prev.map(n => 
      n.id === noteId ? { ...n, heartsCount: (n.heartsCount || 0) + 1 } : n
    ));

    try { 
      const res = await fetch(`/api/notes/${noteId}/heart`, { method: "POST" });
      
      if (!res.ok) {
        if (res.status === 401) {
          alert("You must be logged in to appreciate notes!");
        }
        // Revert optimistic update on failure
        setNotes(prev => prev.map(n => 
          n.id === noteId ? { ...n, heartsCount: Math.max(0, (n.heartsCount || 1) - 1) } : n
        ));
        return;
      }

      const data = await res.json();
      if (data.message === 'Already appreciated') {
        // Revert optimistic update because they already liked it in the past
        setNotes(prev => prev.map(n => 
          n.id === noteId ? { ...n, heartsCount: Math.max(0, (n.heartsCount || 1) - 1) } : n
        ));
      }
    } catch (e) { 
      console.error(e);
      // Revert on network error
      setNotes(prev => prev.map(n => 
        n.id === noteId ? { ...n, heartsCount: Math.max(0, (n.heartsCount || 1) - 1) } : n
      ));
    }
  };

  const getWallUrl = () => typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getWallUrl());
    alert('Link copied to clipboard!');
  };

  const handleShareLink = async () => {
    const url = getWallUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${wall?.title || 'this wall'}`,
          text: wall?.description || 'Leave something behind.',
          url,
        });
      } catch (err) { console.error('Share failed', err); }
    } else {
      handleCopyLink();
    }
  };

  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const handleSaveQR = async () => {
    setIsGeneratingQR(true);
    const url = getWallUrl();
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(url)}&margin=10`;
    
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `wall-qr-${wall?.slug || 'share'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Failed to download QR code", e);
      alert('Failed to generate QR code');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-gray-400" size={32} /></div>;
  }

  if (!wall) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Wall not found</div>;
  }

  // --- Private wall visitor: inbox mode ---
  const isPrivateVisitor = wall.privacy === 'PRIVATE' && !isCreator;

  if (isPrivateVisitor && submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[#EAEAC2] flex items-center justify-center mb-6 text-2xl">✦</div>
        <h2 className="font-playfair text-3xl font-bold text-[#111] mb-3">Left behind.</h2>
        <p className="text-gray-600 max-w-xs leading-relaxed">
          Your message has been tucked safely onto their wall. Only they can read it.
        </p>
        <button
          onClick={() => { setSubmitted(false); setIsModalOpen(true); }}
          className="mt-8 text-sm text-gray-500 underline hover:text-gray-800"
        >
          Leave another message
        </button>
        <BottomNav />
      </div>
    );
  }

  if (isPrivateVisitor) {
    // Show a minimal inbox prompt page — modal is already auto-opened via useEffect
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F3CAD9] flex items-center justify-center mb-6 text-2xl">✉</div>
        <h2 className="font-playfair text-3xl font-bold text-[#111] mb-3">{wall.title}</h2>
        <p className="text-gray-600 max-w-xs leading-relaxed mb-8">
          {wall.description || "Leave something behind. Only the creator will see it."}
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0A1118] text-white px-8 py-3.5 rounded-full font-medium hover:bg-black transition-colors"
        >
          Leave a message
        </button>

        <BottomNav />

        {/* Note Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-md bg-transparent z-10 flex flex-col h-[90vh] md:h-auto">
              <div className="text-center mb-6 pt-10 md:pt-0">
                <h2 className="font-playfair text-2xl font-bold text-white mb-1">Leave something behind.</h2>
                <p className="text-gray-200 text-sm">Only {wall.title} will see this.</p>
              </div>

              <div className={`${colors[selectedColor].bg} rounded-sm p-6 shadow-xl w-full min-h-[300px] flex flex-col`}>
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value.slice(0, 300))}
                  placeholder="Write anything..."
                  className={`w-full flex-1 bg-transparent border-none outline-none resize-none text-gray-900 placeholder-gray-500/70 ${getHandwritingClass(fontOptions[selectedFont], 'lg')}`}
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
                          <button key={idx} onClick={() => setSelectedColor(idx)}
                            className={`w-5 h-5 rounded-full ${color.bg} border-2 ${selectedColor === idx ? "border-gray-400 scale-110" : "border-transparent"} shadow-sm transition-all`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-gray-500/70 text-sm font-medium">{newText.length}/300</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddNote}
                disabled={!newText.trim()}
                className="mt-4 bg-[#0A1118] text-white py-4 rounded-full font-medium w-full flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-50 shadow-lg"
              >
                Send it
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
              <button onClick={() => setIsModalOpen(false)} className="mt-4 text-white/80 font-medium py-2 hover:text-white">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Split notes into two columns for mobile masonry
  const leftColumnNotes = notes.filter((_, i) => i % 2 === 0);
  const rightColumnNotes = notes.filter((_, i) => i % 2 !== 0);

  return (
    <div className="flex-1 flex flex-col relative min-h-screen pb-20 md:pb-0">
      {/* Wall Header */}
      <div className="px-4 md:px-12 py-8 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center md:items-start justify-between text-center md:text-left gap-4">
        <div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-2 tracking-tight text-[#111]">
            {wall.title}
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mb-4">{wall.description}</p>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-widest">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
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
          {isCreator && (
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(v => !v)}
                className="w-12 h-12 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <MoreHorizontal size={20} className="text-gray-700" />
              </button>

              {/* Desktop dropdown only */}
              {isSettingsOpen && (
                <div className="hidden md:block absolute right-0 top-12 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 w-72">
                  <SettingsContent
                    wallSettings={wallSettings}
                    setWallSettings={setWallSettings}
                    isSavingSettings={isSavingSettings}
                    onSave={handleSaveSettings}
                    onCancel={() => setIsSettingsOpen(false)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Click-away backdrop (desktop only) */}
      {isSettingsOpen && (
        <div className="hidden md:block fixed inset-0 z-40" onClick={() => setIsSettingsOpen(false)} />
      )}

      {/* Mobile bottom sheet */}
      {isSettingsOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)} />
          <div className="relative bg-white rounded-t-3xl p-6 pb-10 w-full z-10">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-playfair text-xl font-bold text-[#111]">Wall Settings</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            <SettingsContent
              wallSettings={wallSettings}
              setWallSettings={setWallSettings}
              isSavingSettings={isSavingSettings}
              onSave={handleSaveSettings}
              onCancel={() => setIsSettingsOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Desktop Canvas */}
      <div 
        ref={canvasRef}
        className="hidden md:flex flex-1 relative overflow-hidden min-h-[600px] w-full items-center justify-center"
      >
        {notes.length === 0 ? (
          <div className="flex flex-col items-center text-center px-4 mt-[-100px]">
            <div className="w-48 h-48 bg-gray-100/50 rounded-2xl mb-8 flex items-center justify-center border border-gray-200 shadow-sm opacity-50 rotate-[-5deg]">
              <div className="w-2/3 h-2 bg-gray-200 rounded-full mb-3" />
              <div className="w-1/2 h-2 bg-gray-200 rounded-full mb-3" />
              <div className="w-3/4 h-2 bg-gray-200 rounded-full" />
            </div>
            <h2 className="font-playfair text-3xl font-bold text-[#111] mb-3">This wall is waiting</h2>
            <p className="text-gray-500 max-w-sm">Share it with someone, or leave the first thing behind.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              onPointerDown={(e) => handlePointerDown(e, note)}
              onPointerMove={(e) => handlePointerMove(e, note)}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={`absolute p-8 rounded-lg shadow-sm w-[320px] transition-transform cursor-grab active:cursor-grabbing ${note.color} ${dragInfo?.id === note.id ? 'z-50 scale-105' : 'hover:z-10 hover:scale-105'}`}
              style={{
                left: `${note.x}%`,
                top: `${note.y}%`,
                transform: `rotate(${dragInfo?.id === note.id ? 0 : note.rotate}deg)`,
                touchAction: 'none' // Prevent scrolling while dragging on touch devices
              }}
            >
              <p className={`text-gray-900 mb-6 leading-relaxed select-none ${getHandwritingClass(note.font, 'lg')}`}>
                {note.text}
              </p>
              <div className="flex items-center justify-between select-none">
                <span className="text-gray-500">— {note.isAnonymous ? "Anonymous" : (note.authorName ?? "Someone")}</span>
                <button 
                  onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when clicking heart
                  onClick={() => handleHeart(note.id)} 
                  className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill={note.heartsCount ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-xs font-medium">{note.heartsCount || 0}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mobile Masonry Grid */}
      <div className="md:hidden flex-1 w-full px-4 pt-4 pb-24">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center text-center py-20">
            <h2 className="font-playfair text-2xl font-bold text-[#111] mb-2">This wall is waiting</h2>
            <p className="text-gray-500">Share it with someone, or leave the first thing behind.</p>
          </div>
        ) : (
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
                    <p className="text-gray-500 text-xs">— {note.isAnonymous ? "Anonymous" : (note.authorName ?? "Someone")}</p>
                    <div className="flex items-center gap-1 text-gray-500">
                      <svg viewBox="0 0 24 24" fill={note.heartsCount ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-red-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-[10px] font-medium">{note.heartsCount || 0}</span>
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
                    <p className="text-gray-500 text-xs">— {note.isAnonymous ? "Anonymous" : (note.authorName ?? "Someone")}</p>
                    <div className="flex items-center gap-1 text-gray-500">
                      <svg viewBox="0 0 24 24" fill={note.heartsCount ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-red-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-[10px] font-medium">{note.heartsCount || 0}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
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
                — {selectedNote.isAnonymous ? "Anonymous" : (selectedNote.authorName ?? "Someone")}
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

      <BottomNav active="my-walls" />

      {/* Leave a Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-transparent z-10 flex flex-col h-[90vh] md:h-auto">
            
            {/* Header / Instructions */}
            <div className="text-center mb-6 pt-10 md:pt-0">
              <h2 className="font-playfair text-2xl font-bold text-white mb-1">Leave something behind.</h2>
              <p className="text-gray-200 text-sm md:text-base">
                Your words will become part of the collective atelier.
              </p>
            </div>

            {/* Note Editor */}
            <div className={`${colors[selectedColor].bg} rounded-sm p-6 shadow-xl w-full min-h-[300px] flex flex-col relative`}>
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
                          aria-label={`Select color ${idx}`}
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

            {/* Controls */}
            <div className="mt-4 bg-white p-4 rounded-xl shadow-lg flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 text-sm">Post Anonymously</span>
                <span className="text-xs text-gray-500">Hide your identity from others.</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnonymous ? "bg-[#0A1118]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnonymous ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAddNote}
              disabled={!newText.trim() || isSubmitting}
              className="mt-4 bg-[#0A1118] text-white py-4 rounded-full font-medium w-full flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting ? (
                <><Loader2 size={18} className="animate-spin" /> Posting...</>
              ) : (
                <>Stick it to the wall <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></>
              )}
            </button>

            {/* Cancel Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 text-white/80 font-medium py-2 hover:text-white transition-colors"
            >
              Cancel
            </button>
            
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#E6E6E3] md:bg-black/40">
          
          {/* Mobile Header (only visible on small screens) */}
          <div className="md:hidden flex items-center justify-between px-4 py-4 bg-transparent">
            <button onClick={() => setIsShareModalOpen(false)} className="p-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <h2 className="font-playfair text-lg font-bold">Share Modal</h2>
            <div className="w-8 h-8 rounded-full bg-[#0A1118] text-white flex items-center justify-center">
              <span className="text-xs font-bold">U</span>
            </div>
          </div>

          {/* Desktop Backdrop (clicks close modal) */}
          <div 
            className="hidden md:block absolute inset-0 backdrop-blur-sm z-[-1]"
            onClick={() => setIsShareModalOpen(false)}
          />

          {/* Bottom Sheet Content */}
          <div className="mt-auto bg-white rounded-t-3xl md:rounded-3xl p-6 md:p-8 w-full md:max-w-md mx-auto md:mb-auto md:mt-24 shadow-2xl flex flex-col gap-6 relative z-10 min-h-[70vh] md:min-h-0">
            {/* Handle */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2 md:hidden" />
            
            <div className="flex justify-between items-start md:hidden">
              <div />
            </div>

            {/* Header in desktop */}
            <div className="hidden md:flex justify-between items-center mb-2">
              <h2 className="font-playfair text-2xl font-bold">Share Modal</h2>
              <button onClick={() => setIsShareModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div>
              <h3 className="font-playfair text-xl font-bold text-[#111] mb-2">Invite to Wall</h3>
              <p className="text-gray-600 text-sm">Anyone with this link can leave something behind.</p>
            </div>

            {/* Wall Graphic Placeholder */}
            <div className="w-full aspect-square max-h-[240px] bg-[#F6F5F2] rounded-2xl flex items-center justify-center">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <LayoutGrid size={32} className="text-[#0A1118]" />
              </div>
            </div>

            {/* Link Box */}
            <div className="flex items-center justify-between bg-[#F6F5F2] p-2 pl-4 rounded-xl">
              <span className="text-gray-700 text-sm font-medium truncate pr-2">
                {displayUrl || `wall.co/atelier/${wall.slug.slice(0,6)}`}
              </span>
              <button 
                onClick={handleCopyLink}
                className="bg-[#0A1118] text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-black transition-colors shrink-0"
              >
                <Copy size={16} />
                Copy
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={handleShareLink}
                className="flex-1 bg-[#EAE9E4] text-gray-700 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#DFDED9] transition-colors"
              >
                <Share size={16} />
                Share Link
              </button>
              <button 
                onClick={handleSaveQR}
                disabled={isGeneratingQR}
                className="flex-1 bg-[#EAE9E4] text-gray-700 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#DFDED9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingQR ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                Save QR
              </button>
            </div>

            {/* Status Footer */}
            <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-600 pb-4">
              <div className="w-2 h-2 rounded-full bg-[#B5C282]" />
              <p>Your wall currently has <span className="font-bold text-[#111]">{notes.length}</span> notes.</p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
