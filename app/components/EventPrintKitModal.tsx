"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { 
  Printer, 
  Download, 
  QrCode, 
  Sparkles, 
  Crown, 
  X, 
  Check, 
  Scissors, 
  Smartphone, 
  PenTool, 
  Heart,
  Palette,
  FileSpreadsheet,
  Maximize2
} from "lucide-react";

export type PrintFormat = "poster" | "tent" | "cards";
export type PrintTheme = "atelier" | "blush" | "gala";

interface EventPrintKitModalProps {
  wall: {
    title: string;
    description: string;
    slug: string;
  };
  wallUrl: string;
  userPlan: string;
  isOpen: boolean;
  onClose: () => void;
}

export function EventPrintKitModal({
  wall,
  wallUrl,
  userPlan,
  isOpen,
  onClose
}: EventPrintKitModalProps) {
  const [format, setFormat] = useState<PrintFormat>("poster");
  const [theme, setTheme] = useState<PrintTheme>("atelier");
  const [tentMode, setTentMode] = useState<"folded" | "frame">("folded");
  
  const [customTitle, setCustomTitle] = useState(wall.title || "Welcome to Our Celebration");
  const [customSubtitle, setCustomSubtitle] = useState(
    wall.description || "Scan with your phone camera to share a thought, memory, or congratulations."
  );
  const [callToAction, setCallToAction] = useState("Scan to leave a sticky note");
  const [showSteps, setShowSteps] = useState(true);

  const [qrSvg, setQrSvg] = useState<string>("");
  const [qrPngUrl, setQrPngUrl] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);

  const isLocked = userPlan === "FREE";

  // Generate QR Code as both SVG (for print & preview) and high-res DataURL (for PNG download)
  useEffect(() => {
    if (!wallUrl) return;

    // Generate crisp SVG
    QRCode.toString(wallUrl, {
      type: "svg",
      margin: 1,
      errorCorrectionLevel: "H",
      color: {
        dark: theme === "atelier" ? "#111827" : theme === "blush" ? "#831843" : "#0f172a",
        light: "#FFFFFF"
      }
    })
      .then((svg) => setQrSvg(svg))
      .catch((err) => console.error("QR SVG Error:", err));

    // Generate high-res 1200px PNG
    QRCode.toDataURL(wallUrl, {
      width: 1200,
      margin: 1,
      errorCorrectionLevel: "H",
      color: {
        dark: theme === "atelier" ? "#111827" : theme === "blush" ? "#831843" : "#0f172a",
        light: "#FFFFFF"
      }
    })
      .then((dataUrl) => setQrPngUrl(dataUrl))
      .catch((err) => console.error("QR PNG Error:", err));
  }, [wallUrl, theme]);

  if (!isOpen) return null;

  const handlePrint = () => {
    if (isLocked) {
      window.open("/pricing", "_blank");
      return;
    }
    window.print();
  };

  const handleDownloadQrPng = () => {
    if (isLocked) {
      window.open("/pricing", "_blank");
      return;
    }
    if (!qrPngUrl) return;
    const a = document.createElement("a");
    a.href = qrPngUrl;
    a.download = `${wall.slug || "thoughtboard"}-qr-code.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadQrSvg = () => {
    if (isLocked) {
      window.open("/pricing", "_blank");
      return;
    }
    if (!qrSvg) return;
    const blob = new Blob([qrSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${wall.slug || "thoughtboard"}-qr-code.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(wallUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Theme styles
  const getThemeStyles = () => {
    switch (theme) {
      case "blush":
        return {
          paperBg: "bg-[#FFFDFB]",
          borderColor: "border-[#FBCFE8]",
          accentColor: "text-[#BE185D]",
          badgeBg: "bg-[#FDF2F8] text-[#9D174D] border-[#FCE7F3]",
          subtextColor: "text-[#701A75]/80",
          cardBorder: "border-[#F9A8D4]/60",
          frameGlow: "shadow-[0_0_0_1px_#FBCFE8,0_10px_30px_rgba(244,114,182,0.12)]"
        };
      case "gala":
        return {
          paperBg: "bg-[#FAFAF9]",
          borderColor: "border-[#E7E5E4]",
          accentColor: "text-[#B45309]",
          badgeBg: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
          subtextColor: "text-[#57534E]",
          cardBorder: "border-[#D6D3D1]",
          frameGlow: "shadow-[0_0_0_1px_#E7E5E4,0_10px_30px_rgba(217,119,6,0.1)]"
        };
      case "atelier":
      default:
        return {
          paperBg: "bg-[#FFFFFF]",
          borderColor: "border-[#111827]/15",
          accentColor: "text-[#111827]",
          badgeBg: "bg-[#F3F4F6] text-[#1F2937] border-[#E5E7EB]",
          subtextColor: "text-gray-600",
          cardBorder: "border-gray-200",
          frameGlow: "shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_10px_30px_rgba(0,0,0,0.06)]"
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto print:p-0 print:m-0 print:overflow-visible">
      {/* Print-only CSS rules */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-kit-paper, #print-kit-paper * {
            visibility: visible;
          }
          #print-kit-paper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw;
            min-height: 100vh;
            margin: 0;
            padding: 18mm 12mm;
            background: white !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: auto;
            margin: 10mm;
          }
        }
      `}</style>

      {/* Backdrop */}
      <div 
        className="no-print fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Main Dialog */}
      <div className="relative w-full max-w-6xl bg-[#F8F7F4] rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[94vh] my-auto print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Top Header Bar */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <QrCode size={19} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-playfair font-bold text-lg text-gray-900 leading-none">
                  Print-Ready Event Kit
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Vector 300+ DPI
                </span>
              </div>
              <span className="text-xs text-gray-500">
                Posters, table stands, and QR cards for physical guest celebrations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLocked ? (
              <button
                onClick={() => window.open("/pricing", "_blank")}
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-black px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Crown size={14} /> Unlock High-Res Print ($7)
              </button>
            ) : (
              <button
                onClick={handlePrint}
                className="bg-[#0A1118] hover:bg-black text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Printer size={14} />
                <span>Print / Save PDF</span>
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

        {/* Free Plan Lock Alert Banner */}
        {isLocked && (
          <div className="no-print bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-amber-600 shrink-0" />
              <span>
                <strong>Preview Mode:</strong> High-resolution vector printing, table tent folding guides, and raw QR downloads are included with the <strong>Celebration Pass ($7)</strong> or <strong>Plus</strong>.
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

        {/* Body Container: Settings Sidebar + Live Canvas Preview */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* LEFT: Controls & Customization Sidebar */}
          <div className="no-print w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white p-5 overflow-y-auto space-y-6">
            
            {/* Format Selector */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Print Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat("poster")}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    format === "poster"
                      ? "border-black bg-black text-white shadow-xs font-bold"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-sm font-semibold">Poster</div>
                  <div className="text-[10px] opacity-80">A4 / Letter</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("tent")}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    format === "tent"
                      ? "border-black bg-black text-white shadow-xs font-bold"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-sm font-semibold">Table Tent</div>
                  <div className="text-[10px] opacity-80">Foldable Stand</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("cards")}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    format === "cards"
                      ? "border-black bg-black text-white shadow-xs font-bold"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-sm font-semibold">Mini Cards</div>
                  <div className="text-[10px] opacity-80">4 per Page</div>
                </button>
              </div>
            </div>

            {/* If format is tent, allow folded vs frame */}
            {format === "tent" && (
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <label className="text-[11px] font-bold text-gray-600 block mb-1.5">
                  Stand Style
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTentMode("folded")}
                    className={`flex-1 py-1.5 px-2 text-xs rounded-lg transition-all cursor-pointer font-medium ${
                      tentMode === "folded"
                        ? "bg-white shadow-xs border border-gray-300 text-gray-900 font-bold"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Folded Tent (2-Sided)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTentMode("frame")}
                    className={`flex-1 py-1.5 px-2 text-xs rounded-lg transition-all cursor-pointer font-medium ${
                      tentMode === "frame"
                        ? "bg-white shadow-xs border border-gray-300 text-gray-900 font-bold"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Acrylic Frame (1-Sided)
                  </button>
                </div>
              </div>
            )}

            {/* Aesthetic Theme */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Aesthetic Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme("atelier")}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    theme === "atelier" ? "border-black ring-2 ring-black/10 bg-white" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-black border border-gray-300 shadow-2xs" />
                  <span className="text-[11px] font-medium text-gray-800">Atelier</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("blush")}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    theme === "blush" ? "border-pink-500 ring-2 ring-pink-500/20 bg-pink-50/40" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-pink-400 border border-pink-200 shadow-2xs" />
                  <span className="text-[11px] font-medium text-gray-800">Blush</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("gala")}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    theme === "gala" ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/40" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-amber-500 border border-amber-200 shadow-2xs" />
                  <span className="text-[11px] font-medium text-gray-800">Gala</span>
                </button>
              </div>
            </div>

            {/* Custom Content Inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Event Headline
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Welcome to Our Wedding"
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Subtitle / Invitation Message
                </label>
                <textarea
                  rows={2}
                  value={customSubtitle}
                  onChange={(e) => setCustomSubtitle(e.target.value)}
                  placeholder="e.g. Scan with your phone to leave a sticky note..."
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-black resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Call to Action Badge
                </label>
                <input
                  type="text"
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                  placeholder="e.g. Scan to leave a sticky note"
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-black"
                />
              </div>

              {format === "poster" && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-gray-700 font-medium">Show 3-Step Camera Guide</span>
                  <input
                    type="checkbox"
                    checked={showSteps}
                    onChange={(e) => setShowSteps(e.target.checked)}
                    className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Raw Assets Downloads */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Raw QR Code Exports
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadQrPng}
                  className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px] font-semibold text-gray-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Download 1200x1200px High-Res PNG"
                >
                  <Download size={13} />
                  <span>PNG (1200px)</span>
                  {isLocked && <Crown size={10} className="text-amber-500 ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadQrSvg}
                  className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px] font-semibold text-gray-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Download Vector SVG for Canva or Adobe Illustrator"
                >
                  <Download size={13} />
                  <span>Vector (SVG)</span>
                  {isLocked && <Crown size={10} className="text-amber-500 ml-0.5" />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full mt-1 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-[11px] font-medium text-gray-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {isCopied ? <Check size={13} className="text-emerald-600" /> : <QrCode size={13} />}
                <span>{isCopied ? "Link Copied to Clipboard!" : "Copy Wall URL"}</span>
              </button>
            </div>

          </div>

          {/* RIGHT: Live Interactive Print Sheet Preview */}
          <div className="flex-1 bg-stone-200/60 p-4 sm:p-8 overflow-y-auto flex items-center justify-center min-h-[600px]">
            
            {/* The Actual Printable Canvas */}
            <div
              id="print-kit-paper"
              className={`relative w-full max-w-[540px] ${themeStyles.paperBg} rounded-2xl ${themeStyles.frameGlow} p-8 sm:p-12 transition-all flex flex-col justify-between`}
              style={{
                minHeight: format === "poster" ? "740px" : format === "tent" ? "700px" : "720px"
              }}
            >
              {/* Optional Watermark for Preview if Free */}
              {isLocked && (
                <div className="no-print absolute top-3 right-3 bg-amber-500/15 text-amber-900 border border-amber-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 z-30">
                  <Crown size={11} className="text-amber-600" />
                  <span>PREVIEW MODE</span>
                </div>
              )}

              {/* FORMAT 1: EVENT WELCOME POSTER */}
              {format === "poster" && (
                <div className="h-full flex flex-col items-center justify-between text-center relative border border-black/5 rounded-xl p-6 sm:p-8">
                  {/* Decorative corner borders */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-current opacity-30" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-current opacity-30" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-current opacity-30" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-current opacity-30" />

                  {/* Header */}
                  <div className="w-full pt-2">
                    <p className={`text-[10px] uppercase font-bold tracking-[0.25em] ${themeStyles.subtextColor} mb-2`}>
                      Digital Guestbook & Notes
                    </p>
                    <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3">
                      {customTitle}
                    </h1>
                    <p className={`text-xs sm:text-sm max-w-sm mx-auto ${themeStyles.subtextColor} leading-relaxed`}>
                      {customSubtitle}
                    </p>
                  </div>

                  {/* Center QR Code Section */}
                  <div className="my-6 flex flex-col items-center">
                    <div className={`p-4 bg-white rounded-2xl border-2 ${themeStyles.borderColor} shadow-md flex items-center justify-center`}>
                      {qrSvg ? (
                        <div
                          className="w-48 h-48 sm:w-56 sm:h-56 [&>svg]:w-full [&>svg]:h-full"
                          dangerouslySetInnerHTML={{ __html: qrSvg }}
                        />
                      ) : (
                        <div className="w-48 h-48 flex items-center justify-center text-gray-400">
                          Generating QR...
                        </div>
                      )}
                    </div>
                    <div className={`mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold ${themeStyles.badgeBg} border shadow-2xs`}>
                      <Smartphone size={13} />
                      <span>{callToAction}</span>
                    </div>
                  </div>

                  {/* 3-Step Guide */}
                  {showSteps && (
                    <div className="w-full grid grid-cols-3 gap-3 border-t border-black/5 pt-5 pb-2 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-1 text-gray-700 text-xs font-bold">
                          1
                        </div>
                        <span className="text-[11px] font-semibold text-gray-900">Open Camera</span>
                        <span className="text-[10px] text-gray-500">On your phone</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-1 text-gray-700 text-xs font-bold">
                          2
                        </div>
                        <span className="text-[11px] font-semibold text-gray-900">Point at Code</span>
                        <span className="text-[10px] text-gray-500">Tap the banner</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-1 text-gray-700 text-xs font-bold">
                          3
                        </div>
                        <span className="text-[11px] font-semibold text-gray-900">Leave Note</span>
                        <span className="text-[10px] text-gray-500">Type or handwrite</span>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="w-full pt-4 border-t border-black/5 flex items-center justify-between text-[10px] text-gray-400">
                    <span>No app download required</span>
                    <span className="font-mono">{wall.slug ? `thoughtboard.me/wall/${wall.slug}` : "thoughtboard.me"}</span>
                  </div>
                </div>
              )}

              {/* FORMAT 2: TABLE TENT / FOLDABLE STAND */}
              {format === "tent" && (
                <div className="h-full flex flex-col justify-between">
                  {tentMode === "folded" ? (
                    <>
                      {/* TOP HALF (FLIPPED 180° for opposite table guests) */}
                      <div className="flex-1 rotate-180 flex flex-col items-center justify-center text-center p-4 border border-dashed border-gray-300 rounded-xl mb-4">
                        <p className={`text-[9px] uppercase font-bold tracking-widest ${themeStyles.subtextColor} mb-1`}>
                          Table Guestbook
                        </p>
                        <h3 className="font-playfair text-lg font-bold text-gray-900 mb-1 leading-tight">
                          {customTitle}
                        </h3>
                        <div className="p-2 bg-white rounded-xl border border-gray-200 shadow-2xs my-2">
                          {qrSvg && (
                            <div
                              className="w-24 h-24 [&>svg]:w-full [&>svg]:h-full"
                              dangerouslySetInnerHTML={{ __html: qrSvg }}
                            />
                          )}
                        </div>
                        <span className={`text-[10px] font-bold ${themeStyles.badgeBg} px-2.5 py-0.5 rounded-full border`}>
                          {callToAction}
                        </span>
                      </div>

                      {/* FOLD CREASE LINE */}
                      <div className="flex items-center justify-center gap-2 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest select-none">
                        <Scissors size={13} />
                        <span>Fold Here to Stand on Table</span>
                        <Scissors size={13} />
                      </div>

                      {/* BOTTOM HALF (RIGHT SIDE UP for front table guests) */}
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-gray-300 rounded-xl mt-4">
                        <p className={`text-[9px] uppercase font-bold tracking-widest ${themeStyles.subtextColor} mb-1`}>
                          Table Guestbook
                        </p>
                        <h3 className="font-playfair text-lg font-bold text-gray-900 mb-1 leading-tight">
                          {customTitle}
                        </h3>
                        <div className="p-2 bg-white rounded-xl border border-gray-200 shadow-2xs my-2">
                          {qrSvg && (
                            <div
                              className="w-24 h-24 [&>svg]:w-full [&>svg]:h-full"
                              dangerouslySetInnerHTML={{ __html: qrSvg }}
                            />
                          )}
                        </div>
                        <span className={`text-[10px] font-bold ${themeStyles.badgeBg} px-2.5 py-0.5 rounded-full border`}>
                          {callToAction}
                        </span>
                      </div>
                    </>
                  ) : (
                    /* 1-Sided Acrylic Frame Stand */
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-black/10 rounded-2xl">
                      <p className={`text-[10px] uppercase font-bold tracking-widest ${themeStyles.subtextColor} mb-2`}>
                        Table Thoughtboard
                      </p>
                      <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        {customTitle}
                      </h2>
                      <p className={`text-xs max-w-xs ${themeStyles.subtextColor} mb-6`}>
                        {customSubtitle}
                      </p>
                      <div className={`p-4 bg-white rounded-2xl border-2 ${themeStyles.borderColor} shadow-md mb-4`}>
                        {qrSvg && (
                          <div
                            className="w-40 h-40 [&>svg]:w-full [&>svg]:h-full"
                            dangerouslySetInnerHTML={{ __html: qrSvg }}
                          />
                        )}
                      </div>
                      <span className={`text-xs font-bold ${themeStyles.badgeBg} px-3.5 py-1 rounded-full border mb-4`}>
                        {callToAction}
                      </span>
                      <p className="text-[10px] text-gray-400">
                        Scan with any smartphone camera &bull; No app needed
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* FORMAT 3: MINI PLACE CARDS (4 per Page Grid) */}
              {format === "cards" && (
                <div className="h-full grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="border border-dashed border-gray-300 rounded-xl p-3 flex flex-col items-center justify-between text-center bg-white/70"
                    >
                      <div className="w-full">
                        <span className="text-[8px] uppercase tracking-widest text-gray-400 font-bold block mb-0.5">
                          Thoughtboard
                        </span>
                        <h4 className="font-playfair text-xs font-bold text-gray-900 truncate px-1">
                          {customTitle}
                        </h4>
                      </div>

                      <div className="p-1.5 bg-white rounded-lg border border-gray-200 shadow-2xs my-1">
                        {qrSvg && (
                          <div
                            className="w-20 h-20 [&>svg]:w-full [&>svg]:h-full"
                            dangerouslySetInnerHTML={{ __html: qrSvg }}
                          />
                        )}
                      </div>

                      <div className="w-full">
                        <span className={`text-[9px] font-bold ${themeStyles.badgeBg} px-2 py-0.5 rounded-full border inline-block`}>
                          Scan with Camera
                        </span>
                        <p className="text-[8px] text-gray-400 mt-1 truncate">
                          Leave your note
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Modal Bottom Bar */}
        <div className="no-print px-6 py-4 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Encodes direct public link: <strong className="text-gray-700">{wallUrl}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
            >
              Close
            </button>
            {isLocked ? (
              <button
                onClick={() => window.open("/pricing", "_blank")}
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-black px-5 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Crown size={15} /> Unlock Printing & Vector Exports ($7)
              </button>
            ) : (
              <button
                onClick={handlePrint}
                className="bg-[#0A1118] hover:bg-black text-white px-5 py-2.5 rounded-full font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Printer size={15} /> Print / Save as PDF
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}