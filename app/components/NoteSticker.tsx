"use client";

import { Crown } from "lucide-react";

export interface StickerOption {
  id: string;
  name: string;
  isPremium: boolean;
  preview: React.ReactNode;
}

export function NoteSticker({ type, className = "" }: { type?: string | null; className?: string }) {
  if (!type || type === "none") return null;

  switch (type) {
    case "tape":
      return (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none select-none z-10 ${className}`}>
          <div className="w-20 h-5 bg-amber-100/80 border-y border-amber-200/90 shadow-2xs rotate-[-2deg] flex items-center justify-center opacity-85 backdrop-blur-[1px]">
            <div className="w-full h-full bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:6px_6px] opacity-20" />
          </div>
        </div>
      );

    case "seal":
      return (
        <div className={`absolute -top-3.5 -right-2 pointer-events-none select-none z-10 filter drop-shadow-md rotate-[12deg] ${className}`}>
          <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#991B1B" />
            <circle cx="20" cy="20" r="17" stroke="#7F1D1D" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="20" cy="20" r="14" fill="#7F1D1D" />
            {/* Wax seal heart stamp */}
            <path
              d="M20 25.5L18.8 24.4C14.8 20.8 12.2 18.4 12.2 15.5C12.2 13.1 14.1 11.2 16.5 11.2C17.9 11.2 19.2 11.8 20 12.8C20.8 11.8 22.1 11.2 23.5 11.2C25.9 11.2 27.8 13.1 27.8 15.5C27.8 18.4 25.2 20.8 21.2 24.4L20 25.5Z"
              fill="#F87171"
              opacity="0.8"
            />
          </svg>
        </div>
      );

    case "butterfly":
      return (
        <div className={`absolute -top-4 -right-3 pointer-events-none select-none z-10 filter drop-shadow-sm rotate-[8deg] ${className}`}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Left wings */}
            <ellipse cx="14" cy="14" rx="8" ry="6" transform="rotate(-30 14 14)" fill="#DDD6FE" />
            <ellipse cx="12" cy="21" rx="6" ry="4" transform="rotate(25 12 21)" fill="#C4B5FD" />
            {/* Right wings */}
            <ellipse cx="22" cy="14" rx="8" ry="6" transform="rotate(30 22 14)" fill="#DDD6FE" />
            <ellipse cx="24" cy="21" rx="6" ry="4" transform="rotate(-25 24 21)" fill="#C4B5FD" />
            {/* Body */}
            <ellipse cx="18" cy="17" rx="1.5" ry="7" fill="#4B5563" />
            {/* Antennae */}
            <path d="M17.5 11C16.5 9 14.5 8 13.5 8.5" stroke="#4B5563" strokeWidth="1" strokeLinecap="round" />
            <path d="M18.5 11C19.5 9 21.5 8 22.5 8.5" stroke="#4B5563" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>
      );

    case "flower":
      return (
        <div className={`absolute -top-4 -right-3 pointer-events-none select-none z-10 filter drop-shadow-sm rotate-[-10deg] ${className}`}>
          <svg width="38" height="38" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Stem */}
            <path d="M18 20Q19 28 21 33" stroke="#4D7C0F" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M19 26Q23 24 24 26" stroke="#4D7C0F" strokeWidth="1.5" strokeLinecap="round" />
            {/* Petals */}
            <circle cx="18" cy="11" r="4.5" fill="#FEF08A" />
            <circle cx="22" cy="14" r="4.5" fill="#FEF08A" />
            <circle cx="21" cy="19" r="4.5" fill="#FEF08A" />
            <circle cx="15" cy="19" r="4.5" fill="#FEF08A" />
            <circle cx="14" cy="14" r="4.5" fill="#FEF08A" />
            {/* Center */}
            <circle cx="18" cy="15" r="3.2" fill="#EAB308" />
          </svg>
        </div>
      );

    case "star":
      return (
        <div className={`absolute -top-3.5 -right-2 pointer-events-none select-none z-10 filter drop-shadow-sm rotate-[15deg] ${className}`}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L14.2 8.5L21 9.2L15.8 13.8L17.4 20.5L12 16.8L6.6 20.5L8.2 13.8L3 9.2L9.8 8.5L12 2Z"
              fill="#F59E0B"
              stroke="#D97706"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="1.5" fill="#FEF3C7" />
          </svg>
        </div>
      );

    case "heart":
      return (
        <div className={`absolute -top-3.5 -right-2 pointer-events-none select-none z-10 filter drop-shadow-sm rotate-[-8deg] ${className}`}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#F43F5E"
              stroke="#BE123C"
              strokeWidth="1"
            />
            <circle cx="12" cy="4" r="1.2" fill="#FFE4E6" />
          </svg>
        </div>
      );

    case "sparkle":
      return (
        <div className={`absolute -top-3 -right-2 pointer-events-none select-none z-10 filter drop-shadow-xs rotate-[10deg] ${className}`}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3C12 7.5 8 11.5 3 12C8 12.5 12 16.5 12 21C12 16.5 16 12.5 21 12C16 11.5 12 7.5 12 3Z" fill="#F59E0B" />
            <circle cx="19" cy="6" r="2" fill="#FBBF24" />
            <circle cx="6" cy="19" r="1.5" fill="#FBBF24" />
          </svg>
        </div>
      );

    default:
      return null;
  }
}

export const STICKER_OPTIONS: StickerOption[] = [
  {
    id: "none",
    name: "Clean",
    isPremium: false,
    preview: <span className="text-[11px] font-bold text-gray-400">None</span>
  },
  {
    id: "butterfly",
    name: "Butterfly",
    isPremium: true,
    preview: (
      <span role="img" aria-label="Butterfly" className="text-sm">
        🦋
      </span>
    )
  },
  {
    id: "flower",
    name: "Flower",
    isPremium: true,
    preview: (
      <span role="img" aria-label="Daisy Flower" className="text-sm">
        🌼
      </span>
    )
  },
  {
    id: "seal",
    name: "Wax Seal",
    isPremium: true,
    preview: (
      <span role="img" aria-label="Wax Seal" className="text-sm">
        💌
      </span>
    )
  },
  {
    id: "tape",
    name: "Washi Tape",
    isPremium: true,
    preview: (
      <span role="img" aria-label="Washi Tape" className="text-sm">
        🩹
      </span>
    )
  },
  {
    id: "star",
    name: "Gold Star",
    isPremium: true,
    preview: (
      <span role="img" aria-label="Gold Star" className="text-sm">
        ⭐
      </span>
    )
  },
  {
    id: "heart",
    name: "Heart Pin",
    isPremium: true,
    preview: (
      <span role="img" aria-label="Heart Pin" className="text-sm">
        ❤️
      </span>
    )
  },
  {
    id: "sparkle",
    name: "Sparkles",
    isPremium: true,
    preview: (
      <span role="img" aria-label="Sparkles" className="text-sm">
        ✨
      </span>
    )
  }
];
