"use client";

import { useState } from "react";
import { BookOpen, Download, Printer, X, Sparkles, Crown, Heart, Calendar } from "lucide-react";
import { NoteSticker } from "./NoteSticker";

interface Note {
  id: number;
  text: string;
  authorName: string | null;
  color: string;
  font: string;
  sticker?: string | null;
  isAnonymous: boolean;
  heartsCount?: number;
  createdAt?: string;
}

interface WallData {
  title: string;
  description: string;
  slug: string;
  createdAt?: string;
}

interface MemoryBookModalProps {
  wall: WallData;
  notes: Note[];
  userPlan: string;
  isOpen: boolean;
  onClose: () => void;
  getHandwritingClass: (font: string, size?: "lg" | "sm" | "xl") => string;
}

export function MemoryBookModal({
  wall,
  notes,
  userPlan,
  isOpen,
  onClose,
  getHandwritingClass
}: MemoryBookModalProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  if (!isOpen) return null;

  const isLocked = userPlan === "FREE";

  const handlePrint = () => {
    if (isLocked) {
      window.open("/pricing", "_blank");
      return;
    }
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 150);
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
      
      {/* Print-specific style injected into DOM */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #memory-book-printable, #memory-book-printable * {
            visibility: visible;
          }
          #memory-book-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
          }
          .keep-together {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
        }
      `}</style>

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#FAF9F6] rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Header / Actions */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-gray-200/80 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <BookOpen size={16} />
            </div>
            <div>
              <h3 className="font-playfair font-bold text-lg text-gray-900 leading-none">Keepsake Memory Book</h3>
              <span className="text-[11px] text-gray-500 font-medium">Digital Archive & Print Edition</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLocked ? (
              <button
                onClick={() => window.open("/pricing", "_blank")}
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-black px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Crown size={14} /> Unlock PDF Export ($7)
              </button>
            ) : (
              <button
                onClick={handlePrint}
                className="bg-[#0A1118] hover:bg-black text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Printer size={14} />
                <span>Download / Print PDF</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Lock Overlay Banner for Free Users */}
        {isLocked && (
          <div className="no-print bg-amber-50/90 border-b border-amber-200/60 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-600 shrink-0" />
              <span>
                <strong>Preview Mode:</strong> Exporting this book to high-resolution printable PDF is included with the <strong>Celebration Pass ($7)</strong> or <strong>Plus</strong>.
              </span>
            </div>
            <button
              onClick={() => window.open("/pricing", "_blank")}
              className="underline font-bold text-amber-900 hover:text-black shrink-0 cursor-pointer"
            >
              View Plans &rarr;
            </button>
          </div>
        )}

        {/* Scrollable Printable Book Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-12 bg-[#F3F2EE]/40">
          
          <div id="memory-book-printable" className="space-y-12">
            
            {/* BOOK COVER PAGE */}
            <div className="page-break bg-white rounded-2xl shadow-sm border border-gray-200/70 p-8 sm:p-14 text-center flex flex-col justify-between min-h-[460px] sm:min-h-[580px] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-200 via-[#0A1118] to-amber-200" />
              
              <div className="pt-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400 block mb-4">
                  Thoughtboard Atelier &bull; Keepsake Edition
                </span>
                <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4 max-w-xl mx-auto leading-tight">
                  {wall.title}
                </h1>
                {wall.description && (
                  <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto italic leading-relaxed">
                    &ldquo;{wall.description}&rdquo;
                  </p>
                )}
              </div>

              {/* Decorative Seal / Monogram */}
              <div className="my-8 flex justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 p-2">
                  <Heart size={20} className="text-amber-500 fill-amber-100 mb-1" />
                  <span className="text-[9px] font-bold tracking-widest uppercase">Archive</span>
                </div>
              </div>

              {/* Metadata Footer */}
              <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
                <span>{notes.length} {notes.length === 1 ? "note" : "notes"} collected</span>
                <span>Archived on {formattedDate}</span>
                <span className="font-mono text-[10px]">thoughtboard.io/wall/{wall.slug}</span>
              </div>
            </div>

            {/* NOTES CHAPTER */}
            <div className="space-y-6">
              <div className="no-print text-center pt-2">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Notes & Words Left Behind
                </span>
              </div>

              {notes.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-200">
                  <p>No notes have been added to this board yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {notes.map((note, index) => {
                    const isDrawing = note.font === "font-draw" || note.text?.startsWith("data:image/");
                    return (
                      <div
                        key={note.id || index}
                        className={`keep-together ${note.color} rounded-xl p-6 sm:p-7 shadow-xs border border-black/5 flex flex-col justify-between relative`}
                      >
                        <NoteSticker type={note.sticker} />
                        {isDrawing ? (
                          <div className="w-full mb-4 flex justify-center">
                            <img
                              src={note.text}
                              alt="Handwritten note"
                              className="w-full max-h-[220px] object-contain drop-shadow-xs"
                            />
                          </div>
                        ) : (
                          <p className={`text-gray-900 mb-6 leading-relaxed select-text ${getHandwritingClass(note.font, "lg")}`}>
                            {note.text}
                          </p>
                        )}

                        <div className="flex items-center justify-between border-t border-black/5 pt-3 mt-auto text-xs text-gray-500">
                          <span className="font-medium">
                            &mdash; {note.isAnonymous ? "Anonymous" : (note.authorName || "Someone")}
                          </span>
                          {note.heartsCount && note.heartsCount > 0 ? (
                            <span className="flex items-center gap-1 text-[11px] text-red-500 font-semibold">
                              <Heart size={12} className="fill-red-400" /> {note.heartsCount}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CLOSING PAGE */}
            <div className="page-break bg-white rounded-2xl border border-gray-200/70 p-10 text-center flex flex-col items-center justify-center min-h-[260px]">
              <Heart size={24} className="text-amber-500 fill-amber-100 mb-4" />
              <h4 className="font-playfair text-2xl font-bold text-gray-900 mb-2">
                Words left behind, forever preserved.
              </h4>
              <p className="text-gray-500 text-xs max-w-md">
                Every thought and appreciation written here remains part of your permanent story.
              </p>
            </div>

          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="no-print px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-between text-xs text-gray-500">
          <span>{notes.length} total messages in this book</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Close
            </button>
            {isLocked ? (
              <button
                onClick={() => window.open("/pricing", "_blank")}
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-5 py-2 rounded-full transition-all shadow-sm cursor-pointer"
              >
                Unlock Keepsake ($7)
              </button>
            ) : (
              <button
                onClick={handlePrint}
                className="bg-[#0A1118] hover:bg-black text-white font-semibold px-5 py-2 rounded-full transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Printer size={14} /> Print / Save as PDF
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
