import React, { useState } from 'react';
import { Book, ScreenName, UserProfile } from '../types';

interface WayfindingScreenProps {
  book: Book;
  user: UserProfile;
  onNavigate: (screen: ScreenName) => void;
  onOpenScanner: (mode?: 'barcode-scanner' | 'ar-wayfinder') => void;
  onToast: (msg: string, icon?: string) => void;
}

export const WayfindingScreen: React.FC<WayfindingScreenProps> = ({
  book,
  onNavigate,
  onOpenScanner,
  onToast,
}) => {
  const [mapMode, setMapMode] = useState<'schematic' | 'satellite'>('schematic');
  const [currentStepIndex, setCurrentStepIndex] = useState(3); // On Floor 2 approaching Rack B3
  const [isNavigating, setIsNavigating] = useState(false);

  const steps = [
    {
      label: 'Central Campus Library',
      subtext: 'Main Library Hub • Entrance',
      icon: 'apartment',
      isComplete: true,
    },
    {
      label: `Floor ${book.location.floorNumber} (${book.location.floor})`,
      subtext: `Take Central Elevator or Stairs to Floor ${book.location.floorNumber}`,
      icon: 'stairs',
      isComplete: true,
    },
    {
      label: `${book.location.wing}`,
      subtext: `Section: ${book.location.section}`,
      icon: 'door_sliding',
      isComplete: true,
    },
    {
      label: `${book.location.rack} (${book.location.beaconId})`,
      subtext: `Proceed to ${book.location.rack} • ~${book.location.distanceWalkMeters}m ahead`,
      icon: 'signpost',
      isCurrent: true,
    },
    {
      label: `${book.location.shelf} (${book.location.bayTier || 'Eye Level'})`,
      subtext: `Call No. ${book.lcCall} • Dewey ${book.dewey}`,
      icon: 'shelves',
      isTarget: true,
    },
  ];

  const handleStartTurnByTurn = () => {
    setIsNavigating(true);
    onToast(`Turn-by-turn guidance active: Walk toward ${book.location.rack}`, 'navigation');
    setTimeout(() => {
      setCurrentStepIndex(4);
      onToast(`Arrived at ${book.location.rack}. Look at ${book.location.shelf}.`, 'task_alt');
    }, 3500);
  };

  return (
    <div className="flex flex-col w-full space-y-4 pb-36 max-w-md mx-auto">
      {/* Beacon Sync Status Header (Image 23) */}
      <section className="flex items-center justify-between p-3 rounded-2xl bg-white border border-sky-100 shadow-[0_2px_12px_rgba(2,132,199,0.06)]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div className="flex flex-col">
            <span className="font-label-telemetry text-xs font-bold text-[#0b192c]">
              Beacon Sync: ±0.3m Precision
            </span>
            <span className="font-caption text-[11px] text-slate-500">
              LiFi Grid Synced • {book.location.beaconId}
            </span>
          </div>
        </div>

        <button
          onClick={() => onOpenScanner('ar-wayfinder')}
          className="px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-[#0284c7] font-caption text-xs font-bold flex items-center gap-1 hover:bg-sky-100 transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
          <span>AR Cam</span>
        </button>
      </section>

      {/* Target Book Summary Mini Card */}
      <section
        onClick={() => onNavigate('book-details')}
        className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-blue-100 shadow-[0_4px_16px_rgba(7,36,70,0.05)] cursor-pointer hover:border-cyan-300 transition-colors"
      >
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-12 h-16 object-cover rounded-lg shadow-sm border border-slate-200 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <span className="font-label-telemetry text-[10px] font-bold text-[#0284c7] uppercase">
            Target Destination
          </span>
          <h2 className="font-headline-sm text-sm font-bold text-[#0b192c] truncate">
            {book.title}
          </h2>
          <p className="font-caption text-xs text-slate-600 truncate">{book.author}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-call-number text-[11px] font-bold text-[#0284c7]">
              {book.lcCall}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
              {book.copiesOnShelf} Available
            </span>
          </div>
        </div>
        <span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span>
      </section>

      {/* Floor 2 Interactive Indoor Schematic Map (Image 23) */}
      <section className="rounded-2xl bg-[#0b192c] p-4 border border-slate-700 shadow-xl text-white space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-telemetry text-[11px] text-cyan-400 font-bold uppercase tracking-wider block">
              Floor {book.location.floorNumber} Indoor Schematic
            </span>
            <span className="font-caption text-xs text-slate-400">
              {book.location.wing}
            </span>
          </div>

          <div className="flex items-center bg-slate-800 rounded-full p-0.5 border border-slate-700">
            <button
              type="button"
              onClick={() => setMapMode('schematic')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                mapMode === 'schematic' ? 'bg-[#0284c7] text-white shadow-xs' : 'text-slate-400'
              }`}
            >
              Schematic
            </button>
            <button
              type="button"
              onClick={() => onOpenScanner('ar-wayfinder')}
              className="px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[13px]">view_in_ar</span>
              <span>AR</span>
            </button>
          </div>
        </div>

        {/* Dynamic Architectural Schematic SVG */}
        <div className="relative w-full h-64 rounded-xl bg-[#071321] border border-slate-800 overflow-hidden">
          {/* Compass Rose */}
          <div className="absolute top-2 right-2 flex flex-col items-center bg-black/40 backdrop-blur-md px-1.5 py-1 rounded border border-slate-700 pointer-events-none">
            <span className="font-mono text-[9px] font-bold text-cyan-400">N</span>
            <span className="material-symbols-outlined text-[14px] text-slate-400">north</span>
          </div>

          <svg viewBox="0 0 400 260" className="w-full h-full">
            {/* Grid */}
            <defs>
              <pattern id="wayGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#132338" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wayGrid)" />

            {/* Perimeter Walls */}
            <rect x="20" y="20" width="360" height="220" rx="12" fill="none" stroke="#1e3a5f" strokeWidth="2" />

            {/* Zone Dividers */}
            <line x1="200" y1="20" x2="200" y2="240" stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1.5" />
            <text x="110" y="38" fill="#475569" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {book.location.section.toUpperCase()}
            </text>
            <text x="290" y="38" fill="#475569" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              EAST STACKS (RESERVE)
            </text>

            {/* Aisle Racks: Rack B1, B2, B3, B4 */}
            <g fill="#162c46" stroke="#2563eb" strokeWidth="1">
              {/* Rack B1 */}
              <rect x="50" y="55" width="24" height="130" rx="3" />
              <text x="62" y="125" fill="#60a5fa" fontSize="8" fontWeight="bold" textAnchor="middle">A1</text>

              {/* Rack B2 */}
              <rect x="90" y="55" width="24" height="130" rx="3" />
              <text x="102" y="125" fill="#60a5fa" fontSize="8" fontWeight="bold" textAnchor="middle">B2</text>

              {/* Target Rack (Highlighted with Amber/Cyan border) */}
              <rect x="130" y="55" width="26" height="130" rx="3" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="2" />
              <text x="143" y="125" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                {book.location.rack.replace('Rack ', '')}
              </text>

              {/* Rack B4 */}
              <rect x="170" y="55" width="24" height="130" rx="3" />
              <text x="182" y="125" fill="#60a5fa" fontSize="8" fontWeight="bold" textAnchor="middle">C4</text>

              {/* East Aisles */}
              <rect x="230" y="55" width="24" height="130" rx="3" />
              <rect x="270" y="55" width="24" height="130" rx="3" />
              <rect x="310" y="55" width="24" height="130" rx="3" />
            </g>

            {/* Walking Trail (Yellow/Cyan Glowing Dashed Line) */}
            <path
              d="M 200 230 L 200 200 L 143 200 L 143 145"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3.5"
              strokeDasharray="6 4"
              className="animate-pulse"
            />

            {/* Current Position Pin (User walking) */}
            <circle cx={isNavigating ? 143 : 200} cy={isNavigating ? 180 : 230} r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
            <circle cx={isNavigating ? 143 : 200} cy={isNavigating ? 180 : 230} r="14" fill="#38bdf8" fillOpacity="0.25" className="animate-ping" />
            <text x={isNavigating ? 143 : 200} y={isNavigating ? 170 : 246} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
              You
            </text>

            {/* Target Book Badge on Shelf */}
            <circle cx="143" cy="95" r="16" fill="#f59e0b" fillOpacity="0.3" className="animate-ping" />
            <circle cx="143" cy="95" r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />

            {/* Floating Speech Banner pointing to Selected Book's Rack & Shelf */}
            <g transform="translate(145, 75)">
              <rect x="0" y="0" width="130" height="24" rx="6" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
              <text x="65" y="16" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                🎯 {book.location.rack.toUpperCase()} • {book.location.shelf.split(' ')[0].toUpperCase()}
              </text>
            </g>
          </svg>
        </div>

        {/* Target Shelf Spec Banner */}
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400 text-[18px]">shelves</span>
            <div>
              <p className="font-bold text-white">{book.location.shelf} ({book.location.bayTier || 'Eye Level'})</p>
              <p className="text-slate-400 text-[11px]">{book.location.beaconId} pulses blue LED when in range</p>
            </div>
          </div>
          <span className="font-mono text-cyan-300 font-bold bg-cyan-950 px-2 py-1 rounded border border-cyan-800">
            ~{book.location.distanceWalkMeters}m walk
          </span>
        </div>
      </section>

      {/* 5-Step Location Hierarchy Stepper (Image 23) */}
      <section className="rounded-2xl bg-white p-4 border border-blue-100 shadow-[0_4px_18px_rgba(7,36,70,0.05)] space-y-3">
        <h3 className="font-headline-sm text-sm font-bold text-[#0b192c]">
          Stack Location Route Hierarchy
        </h3>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {steps.map((s, idx) => (
            <div key={s.label} className="relative flex items-start gap-3 text-xs">
              {/* Stepper Dot */}
              <div
                className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-white ${
                  s.isTarget
                    ? 'bg-amber-500 ring-4 ring-amber-100'
                    : s.isCurrent
                    ? 'bg-[#0284c7] ring-4 ring-sky-100'
                    : 'bg-emerald-500'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">
                  {s.isTarget ? 'flag' : s.isCurrent ? 'navigation' : 'check'}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <span className="font-title-md font-bold text-[#0b192c] block">
                  {s.label}
                </span>
                <span className="font-caption text-slate-500 font-medium">
                  {s.subtext}
                </span>
              </div>

              {s.isCurrent && (
                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-[#0284c7] font-bold text-[10px]">
                  APPROACHING
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Guidance Action Controls */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={handleStartTurnByTurn}
          disabled={isNavigating}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#006194] to-[#0284c7] text-white font-title-md text-sm font-bold flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isNavigating ? 'explore' : 'turn_right'}
          </span>
          <span>{isNavigating ? `Navigating to ${book.location.rack}...` : `Start Route to ${book.location.rack}`}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onOpenScanner('ar-wayfinder')}
            className="py-2.5 px-3 rounded-xl bg-sky-50 border border-sky-200 text-[#0284c7] font-title-md text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-sky-100 active:scale-95 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
            <span>AR Stacks Cam</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('book-details')}
            className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-title-md text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-95 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            <span>Book Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};
