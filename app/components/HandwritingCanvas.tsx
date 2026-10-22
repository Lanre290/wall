"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { RotateCcw, Trash2, PenLine, Sparkles } from "lucide-react";

interface HandwritingCanvasProps {
  onStrokeChange?: (dataUrl: string | null) => void;
  bgClass?: string;
  className?: string;
}

export function HandwritingCanvas({ onStrokeChange, className = "" }: HandwritingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [inkColor, setInkColor] = useState("#0F172A");
  const [lineWidth, setLineWidth] = useState(3);
  const [hasDrawn, setHasDrawn] = useState(false);
  
  // Undo history (stores image data)
  const historyRef = useRef<ImageData[]>([]);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Setup Canvas with Retina / High-DPI scaling
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set display size
    const width = rect.width;
    const height = Math.max(220, Math.min(rect.height, 300));

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Set actual canvas buffer size
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  }, []);

  useEffect(() => {
    setupCanvas();
    window.addEventListener("resize", setupCanvas);
    return () => window.removeEventListener("resize", setupCanvas);
  }, [setupCanvas]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      historyRef.current.push(imageData);
      if (historyRef.current.length > 20) historyRef.current.shift();
    } catch (e) {
      // Ignore security errors
    }
  };

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    saveState();
    setIsDrawing(true);
    const pos = getPos(e);
    lastPointRef.current = pos;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = inkColor;
    ctx.fillStyle = inkColor;
    ctx.lineWidth = lineWidth;

    // Draw single dot on tap
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();

    setHasDrawn(true);
    if (onStrokeChange) {
      onStrokeChange(canvas.toDataURL("image/png"));
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !lastPointRef.current) return;

    const currentPos = getPos(e);
    const lastPos = lastPointRef.current;

    ctx.strokeStyle = inkColor;
    ctx.lineWidth = lineWidth;

    // Smooth quadratic curve interpolation between points
    const midPoint = {
      x: (lastPos.x + currentPos.x) / 2,
      y: (lastPos.y + currentPos.y) / 2
    };

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.quadraticCurveTo(lastPos.x, lastPos.y, midPoint.x, midPoint.y);
    ctx.stroke();

    lastPointRef.current = currentPos;

    if (onStrokeChange) {
      onStrokeChange(canvas.toDataURL("image/png"));
    }
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {
      // Ignore
    }
    setIsDrawing(false);
    lastPointRef.current = null;
    const canvas = canvasRef.current;
    if (canvas && onStrokeChange) {
      onStrokeChange(canvas.toDataURL("image/png"));
    }
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (historyRef.current.length > 0) {
      const prev = historyRef.current.pop();
      if (prev) {
        ctx.putImageData(prev, 0, 0);
        if (historyRef.current.length === 0) {
          setHasDrawn(false);
          if (onStrokeChange) onStrokeChange(null);
        } else if (onStrokeChange) {
          onStrokeChange(canvas.toDataURL("image/png"));
        }
      }
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    saveState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    if (onStrokeChange) onStrokeChange(null);
  };

  const inkColors = [
    { name: "Slate", hex: "#0F172A" },
    { name: "Fountain Navy", hex: "#1E3A8A" },
    { name: "Warm Sepia", hex: "#78350F" },
    { name: "Wine Red", hex: "#881337" }
  ];

  const strokeSizes = [
    { label: "Fine", size: 2 },
    { label: "Medium", size: 3.5 },
    { label: "Fountain", size: 5.5 }
  ];

  return (
    <div className={`flex flex-col w-full h-full relative select-none ${className}`}>
      {/* Canvas Drawing Area */}
      <div className="relative flex-1 w-full min-h-[220px] rounded-lg overflow-hidden border border-dashed border-gray-400/40 bg-transparent cursor-crosshair">
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          style={{ touchAction: "none" }}
          className="w-full h-full block"
        />

        {!hasDrawn && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-gray-400/70 p-4 text-center">
            <PenLine size={28} className="mb-2 opacity-50 stroke-[1.5]" />
            <p className="text-xs font-medium tracking-wide">
              Draw or sign with your stylus, finger, or mouse
            </p>
          </div>
        )}
      </div>

      {/* Toolbar: Ink Color, Stroke Size, Undo, Clear */}
      <div className="flex items-center justify-between gap-2 pt-3 mt-1 border-t border-black/5">
        
        {/* Ink Colors */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mr-1">Ink</span>
          {inkColors.map(c => (
            <button
              key={c.hex}
              type="button"
              onClick={() => setInkColor(c.hex)}
              className={`w-4 h-4 rounded-full transition-transform ${inkColor === c.hex ? "scale-125 ring-2 ring-black/40 ring-offset-1" : "opacity-75 hover:opacity-100"}`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>

        {/* Pen Thickness */}
        <div className="flex items-center gap-1">
          {strokeSizes.map(s => (
            <button
              key={s.size}
              type="button"
              onClick={() => setLineWidth(s.size)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${lineWidth === s.size ? "bg-black/15 text-black" : "text-gray-500 hover:bg-black/5"}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleUndo}
            disabled={!hasDrawn}
            className="p-1 rounded text-gray-600 hover:text-black hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Undo stroke"
          >
            <RotateCcw size={14} />
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={!hasDrawn}
            className="p-1 rounded text-gray-600 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Clear canvas"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
