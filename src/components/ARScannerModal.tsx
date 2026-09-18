import React, { useState, useEffect } from 'react';
import { Book } from '../types';

interface ARScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'ar-wayfinder' | 'barcode-scanner';
  targetBook?: Book;
  onSelectBook?: (bookId: string) => void;
  onToast: (msg: string, icon?: string) => void;
}

export const ARScannerModal: React.FC<ARScannerModalProps> = ({
  isOpen,
  onClose,
  mode,
  targetBook,
  onSelectBook,
  onToast,
}) => {
  const [distance, setDistance] = useState(35);
  const [step, setStep] = useState(1);
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'ar-wayfinder') {
      // Simulate walking closer to rack
      setDistance(35);
      setStep(1);
      const timer1 = setTimeout(() => {
        setDistance(18);
        setStep(2);
      }, 2000);
      const timer2 = setTimeout(() => {
        setDistance(4.5);
        setStep(3);
      }, 4000);
      const timer3 = setTimeout(() => {
        setDistance(0.4);
        setStep(4);
        onToast('Target reached: Rack B3, Shelf 4 (Eye Level)', 'check_circle');
      }, 6500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      // Barcode simulation
      setScannedCode(null);
      const scanTimer = setTimeout(() => {
        setScannedCode('978-0132847377 [005.73 W43]');
        onToast('Catalog match: Data Structures in C++', 'qr_code_scanner');
      }, 2200);

      return () => clearTimeout(scanTimer);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col text-white animate-in fade-in duration-200">
      {/* Top Camera HUD */}
      <div className="p-4 pt-safe flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
          </span>
          <div className="flex flex-col">
            <span className="font-label-telemetry text-xs text-cyan-300 font-bold uppercase tracking-wider">
              {mode === 'ar-wayfinder' ? 'AR Waypoint Telemetry' : 'Camera Scanner Active'}
            </span>
            <span className="text-[10px] text-slate-400">
              {mode === 'ar-wayfinder' ? 'Beacon #B3-04 Synced' : 'Auto-focusing reticle'}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform"
          aria-label="Close scanner"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Main Viewfinder Simulation Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Simulated Camera Lens Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-[#0a1829] to-slate-950 flex items-center justify-center opacity-90">
          <div className="w-full h-full opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>

        {/* Viewfinder Reticle */}
        <div className="relative w-72 h-72 border-2 border-dashed border-cyan-400/40 rounded-3xl flex items-center justify-center p-4 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
          {/* Corner Guides */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl -mt-1 -ml-1"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl -mt-1 -mr-1"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl -mb-1 -ml-1"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-xl -mb-1 -mr-1"></div>

          {mode === 'barcode-scanner' ? (
            <div className="flex flex-col items-center gap-3">
              {/* Laser Scanning Line */}
              <div className="absolute inset-x-4 h-0.5 bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-pulse"></div>

              <span className="material-symbols-outlined text-[48px] text-cyan-300 opacity-60">
                barcode_scanner
              </span>
              <p className="text-xs font-label-telemetry text-center text-slate-300">
                Align barcode or shelf RFID tag within frame
              </p>

              {scannedCode && (
                <div className="mt-2 bg-cyan-950/80 border border-cyan-400 p-2.5 rounded-xl text-center animate-in zoom-in-95 duration-200">
                  <div className="text-[10px] text-cyan-300 font-bold uppercase">Barcode Matched</div>
                  <div className="font-mono text-xs font-bold text-white mt-0.5">{scannedCode}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center gap-2 relative">
              {/* Augmented Reality Directional Compass & Target Box */}
              <div className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center text-cyan-300 animate-pulse">
                <span className="material-symbols-outlined text-[36px]">
                  {step >= 4 ? 'task_alt' : 'navigation'}
                </span>
              </div>

              <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/50 mt-2">
                <span className="font-label-telemetry text-sm font-bold text-cyan-200">
                  {step >= 4 ? 'RACK B3 • SHELF 4 REACHED' : `WALK FORWARD • ${distance.toFixed(1)}m`}
                </span>
              </div>
              <span className="text-[11px] text-slate-300">
                {step >= 4
                  ? 'Left Bay • Eye-level stack'
                  : 'Follow the cyan augmented floor waypoints'}
              </span>
            </div>
          )}
        </div>

        {/* Floor waypoint chevron animation */}
        {mode === 'ar-wayfinder' && step < 4 && (
          <div className="absolute bottom-24 flex flex-col items-center gap-1 text-cyan-400/80 animate-bounce">
            <span className="material-symbols-outlined text-[28px]">keyboard_double_arrow_up</span>
            <span className="font-label-telemetry text-[10px] tracking-wider uppercase font-semibold">
              Approach Rack B3
            </span>
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="p-4 pb-safe bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2 max-w-md mx-auto w-full">
        {mode === 'barcode-scanner' && scannedCode && (
          <button
            onClick={() => {
              if (onSelectBook) onSelectBook('book-ds-cpp');
              onClose();
            }}
            className="w-full py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-sm text-white shadow-lg active:scale-95 transition-transform"
          >
            Open Book Details
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 font-label-md text-xs font-semibold text-white transition-colors"
        >
          Exit Camera View
        </button>
      </div>
    </div>
  );
};
