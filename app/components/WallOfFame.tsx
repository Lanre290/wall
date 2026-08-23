"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const NOTES_DATA = [
  { text: "I still look for your car in every parking lot.", color: "bg-[#DFE4F2]", font: "font-caveat text-xl", size: "w-[280px]", author: "Anonymous", hearts: 12 },
  { text: "I got the job!!! I wish I could tell you first.", color: "bg-[#EAEAC2]", font: "font-kalam text-lg", size: "w-[320px]", author: "S.", hearts: 45 },
  { text: "I dropped out of college today. Don't tell my parents yet.", color: "bg-[#F3CAD9]", font: "font-patrick text-lg", size: "w-[260px]", author: "Anonymous", hearts: 3 },
  { text: "Thank you for being my peace.", color: "bg-[#E6E4E6]", font: "font-caveat text-2xl", size: "w-[360px]", author: "M.", hearts: 89 },
  { text: "You have the best laugh I've ever heard.", color: "bg-[#EAEAC2]", font: "font-kalam text-lg", size: "w-[280px]", hiddenMobile: true, author: "Anonymous", hearts: 21 },
  { text: "I lied when I said I was busy last weekend.", color: "bg-[#DFE4F2]", font: "font-kalam text-sm", size: "w-[240px]", hiddenMobile: true, author: "Anonymous", hearts: 0 },
  { text: "Sometimes I wonder if you still think about that summer.", color: "bg-[#F3CAD9]", font: "font-patrick text-base", size: "w-[300px]", hiddenMobile: true, author: "J.", hearts: 7 },
];

export function WallOfFame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [randomizedNotes, setRandomizedNotes] = useState<any[]>([]);

  useEffect(() => {
    // Generate random positions and rotations only on client to avoid hydration mismatch
    const randomized = NOTES_DATA.map((note) => {
      // Random rotation between -15 and 15 degrees
      const rotation = Math.random() * 30 - 15;
      
      // Random translate (x and y) between -40px and 40px
      const tx = Math.random() * 80 - 40;
      const ty = Math.random() * 80 - 40;

      return {
        ...note,
        rotation,
        tx,
        ty
      };
    });
    setRandomizedNotes(randomized);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 pb-32 relative z-10 overflow-visible" ref={containerRef}>
      <div className="text-center mb-20 md:mb-32">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-[#111]">What people are leaving behind</h2>
        <p className="text-gray-600 text-lg">A glimpse into public walls from around the world. Grab a note!</p>
      </div>

      <div className="flex flex-wrap justify-center items-center max-w-5xl mx-auto gap-6 md:gap-0 relative">
        {randomizedNotes.map((note, idx) => (
          <motion.div
            key={idx}
            drag
            dragConstraints={containerRef}
            dragElastic={0.2}
            whileDrag={{ scale: 1.05, zIndex: 100, rotate: 0 }}
            whileHover={{ scale: 1.05, zIndex: 50, rotate: 0 }}
            initial={{ rotate: note.rotation, x: note.tx, y: note.ty }}
            animate={{ rotate: note.rotation, x: note.tx, y: note.ty }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`
              ${note.color} p-5 rounded-lg shadow-sm w-full text-left
              cursor-grab active:cursor-grabbing flex flex-col justify-between
              sm:${note.size} shrink-0 min-h-[160px]
              ${note.hiddenMobile ? 'hidden md:flex' : 'flex'}
              z-10 relative md:-ml-8
            `}
          >
            <p className={`text-gray-900 mb-4 leading-relaxed ${note.font}`}>{note.text}</p>
            
            <div className="flex items-center justify-between mt-auto">
              <p className="text-gray-500 text-xs flex items-center gap-1">
                — {note.author}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-gray-500">
                  <svg viewBox="0 0 24 24" fill={note.hearts > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-red-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-[10px] font-medium">{note.hearts}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
