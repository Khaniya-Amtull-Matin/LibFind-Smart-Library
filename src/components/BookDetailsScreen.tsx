import React, { useState } from 'react';
import { Book, ScreenName, UserProfile } from '../types';

interface BookDetailsScreenProps {
  book: Book;
  user: UserProfile;
  onNavigate: (screen: ScreenName) => void;
  onToggleSave: (bookId: string) => void;
  onOpenScanner: (mode?: 'barcode-scanner' | 'ar-wayfinder') => void;
  onHoldBook: (bookId: string) => void;
  onToast: (msg: string, icon?: string) => void;
}

export const BookDetailsScreen: React.FC<BookDetailsScreenProps> = ({
  book,
  user,
  onNavigate,
  onToggleSave,
  onOpenScanner,
  onHoldBook,
  onToast,
}) => {
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState<number | null>(0);
  const isSaved = user.savedBookIds.includes(book.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `LibFind: ${book.title} located at ${book.location.floor}, ${book.location.rack}, ${book.location.shelf} (Call: ${book.lcCall})`
      );
    }
    onToast('Shelf coordinates copied to clipboard', 'content_copy');
  };

  return (
    <div className="flex flex-col w-full space-y-4 pb-44 max-w-md mx-auto">
      {/* Textbook Cover Presentation (Direct match to Image 3 & 21) */}
      <section className="relative w-full rounded-2xl bg-gradient-to-b from-sky-100/60 via-white to-white p-5 border border-sky-100 shadow-[0_4px_24px_rgba(2,132,199,0.06)] flex flex-col items-center text-center">
        {/* Glowing aura */}
        <div className="absolute top-8 w-44 h-56 bg-sky-300/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* 3D Textbook Cover Card */}
        <div className="relative w-44 h-60 rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(11,28,48,0.2)] border-2 border-white/80 shrink-0 group">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider">
            {book.edition}
          </div>
          <div className="absolute bottom-2 right-2 bg-emerald-950/80 backdrop-blur-md border border-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>RFID / NFC</span>
          </div>
        </div>

        {/* Category & Tags */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
          <span className="font-label-telemetry text-xs font-bold uppercase tracking-wider text-white bg-[#0284c7] px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">category</span>
            <span>Subject: {book.category}</span>
          </span>
          {book.tags.map((tag) => (
            <span
              key={tag}
              className="font-label-telemetry text-[11px] font-bold uppercase tracking-wider text-[#0284c7] bg-sky-50 border border-sky-200/80 px-2.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title and Author */}
        <h1 className="font-headline-sm text-[22px] font-bold text-[#0b192c] tracking-tight mt-2.5 leading-snug">
          {book.title}
        </h1>
        <p className="font-title-md text-sm text-slate-600 font-medium mt-1">
          {book.author}
        </p>
        <p className="font-caption text-xs text-slate-400 mt-0.5">
          {book.publisher} • {book.publishedYear}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-3 border-t border-slate-100">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
              <span className="material-symbols-outlined text-[16px] fill-current">star</span>
              <span>{book.rating}</span>
            </div>
            <span className="font-caption text-[11px] text-slate-400">
              {book.reviewCount} Reviews
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-slate-100">
            <span className="font-bold text-sm text-[#0b192c]">{book.citationCount}+</span>
            <span className="font-caption text-[11px] text-slate-400">Academic Citations</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="font-bold text-sm text-[#0b192c]">{book.pages}</span>
            <span className="font-caption text-[11px] text-slate-400">{book.language}</span>
          </div>
        </div>
      </section>

      {/* Live Physical Availability & Shelf Telemetry Card (Image 3) */}
      <section className="rounded-2xl bg-white p-4 border border-blue-100 shadow-[0_4px_18px_rgba(7,36,70,0.05)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  book.statusType === 'issued'
                    ? 'bg-rose-400'
                    : book.statusType === 'limited'
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  book.statusType === 'issued'
                    ? 'bg-rose-500'
                    : book.statusType === 'limited'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              ></span>
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  book.statusType === 'issued'
                    ? 'bg-rose-100 text-rose-800'
                    : book.statusType === 'limited'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {book.statusType === 'issued' ? 'Issued' : 'Available'}
              </span>
              <span className="font-headline-sm text-sm font-bold text-[#0b192c]">
                {book.statusText}
              </span>
            </div>
          </div>
          <span className="font-label-telemetry text-xs font-bold text-[#0284c7] uppercase bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
            {book.location.beaconId}
          </span>
        </div>

        {/* Shelf Step-down Hierarchy with Explicit Floor, Section, Rack, Shelf */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#0284c7] text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[20px]">shelves</span>
              </div>
              <div className="min-w-0">
                <p className="font-caption text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  Physical Stacks Coordinates
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-1 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block text-[10px] uppercase">Floor</span>
                    <span className="font-bold text-[#0b192c]">{book.location.floor}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[10px] uppercase">Section</span>
                    <span className="font-bold text-[#0b192c]">{book.location.section}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[10px] uppercase">Rack</span>
                    <span className="font-bold text-[#0284c7]">{book.location.rack}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[10px] uppercase">Shelf</span>
                    <span className="font-bold text-[#0284c7]">{book.location.shelf}</span>
                  </div>
                </div>
                <p className="font-caption text-[11px] text-slate-500 mt-1.5">
                  Bay: {book.location.bayTier || 'Standard Eye Level'} • Position: {book.location.position || 'Aisle Center'}
                </p>
              </div>
            </div>

            {/* Instant Route Button */}
            <button
              type="button"
              onClick={() => onNavigate('wayfinding')}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#006194] to-[#0284c7] text-white font-title-md text-xs font-bold flex items-center gap-1 shadow-md active:scale-95 transition-all shrink-0 hover:brightness-105"
            >
              <span className="material-symbols-outlined text-[16px]">turn_right</span>
              <span>Route</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
            <span className="font-call-number text-[#0284c7] font-bold">
              Call No: {book.lcCall}
            </span>
            <span className="font-caption text-slate-500">
              Dewey: {book.dewey}
            </span>
          </div>
        </div>

        {/* Copies Registry Table */}
        <div>
          <span className="font-caption text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Copies Registry ({book.copiesTotal} Total)
          </span>
          <div className="space-y-1.5">
            {book.copies.map((copy) => (
              <div
                key={copy.id}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-700">{copy.code}</span>
                  <span className="text-slate-500">{copy.location}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    copy.status === 'available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : copy.status === 'hold'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {copy.statusLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Floorplan & Wayfinding Trigger (Image 21 & 23) */}
      <section className="rounded-2xl bg-white p-4 border border-blue-100 shadow-[0_4px_18px_rgba(7,36,70,0.05)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0284c7] text-[20px]">map</span>
            <h3 className="font-headline-sm text-sm font-bold text-[#0b192c]">
              Interactive Floorplan ({book.location.floor})
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            ~{book.location.distanceWalkMeters}m walk from Hub
          </span>
        </div>

        {/* Animated Floorplan Map Card */}
        <div
          onClick={() => onNavigate('wayfinding')}
          className="relative w-full h-48 rounded-xl bg-[#0b192c] overflow-hidden border border-slate-700 cursor-pointer group shadow-inner"
        >
          {/* Schematic SVG Map */}
          <svg viewBox="0 0 400 200" className="w-full h-full">
            {/* Grid Pattern */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Wing Outlines */}
            <rect x="20" y="20" width="160" height="160" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <rect x="220" y="20" width="160" height="160" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />

            {/* Stacks Aisles Rack Columns */}
            <g stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.4">
              <line x1="40" y1="40" x2="40" y2="160" />
              <line x1="65" y1="40" x2="65" y2="160" />
              <line x1="90" y1="40" x2="90" y2="160" />
              <line x1="115" y1="40" x2="115" y2="160" />
              <line x1="140" y1="40" x2="140" y2="160" />

              <line x1="240" y1="40" x2="240" y2="160" />
              <line x1="265" y1="40" x2="265" y2="160" />
              <line x1="290" y1="40" x2="290" y2="160" />
              <line x1="315" y1="40" x2="315" y2="160" />
              <line x1="340" y1="40" x2="340" y2="160" />
            </g>

            {/* Waypoint Path from Hub to Rack B3 */}
            <path
              d="M 200 180 L 200 100 L 90 100"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeDasharray="4 4"
              className="animate-pulse"
            />

            {/* Start Pin: Central Elevator / Hub */}
            <circle cx="200" cy="180" r="6" fill="#38bdf8" />
            <text x="200" y="195" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="sans-serif">
              You are here (Fl {book.location.floorNumber} Hub)
            </text>

            {/* Target Book Beacon */}
            <circle cx="90" cy="100" r="14" fill="#38bdf8" fillOpacity="0.2" className="animate-ping" />
            <circle cx="90" cy="100" r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
            <rect x="40" y="65" width="100" height="20" rx="4" fill="#0284c7" />
            <text x="90" y="78" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {book.location.rack.toUpperCase()} • {book.location.shelf.split(' ')[0].toUpperCase()}
            </text>
          </svg>

          {/* Hover / Tap Overlay Hint */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors flex items-center justify-center pointer-events-none">
            <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#0b192c] font-caption text-xs font-bold shadow-md">
              Tap to Open Live Step-by-Step Wayfinding
            </span>
          </div>
        </div>

        {/* Wayfinding Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onNavigate('wayfinding')}
            className="py-3 px-3 rounded-xl bg-gradient-to-r from-[#006194] to-[#0284c7] text-white font-title-md text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">turn_right</span>
            <span>Step-by-Step Wayfinder</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenScanner('ar-wayfinder')}
            className="py-3 px-3 rounded-xl bg-sky-50 border border-sky-200 text-[#0284c7] font-title-md text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-sky-100 active:scale-98 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
            <span>AR Shelf Scanner</span>
          </button>
        </div>
      </section>

      {/* Synopsis Section */}
      <section className="rounded-2xl bg-white p-4 border border-blue-100 shadow-[0_4px_18px_rgba(7,36,70,0.05)]">
        <h3 className="font-headline-sm text-sm font-bold text-[#0b192c] mb-2">
          Academic Synopsis
        </h3>
        <p className="font-body-md text-sm text-slate-600 leading-relaxed">
          {book.synopsisSummary}
        </p>

        {showFullSynopsis && (
          <p className="font-body-md text-sm text-slate-600 leading-relaxed mt-2 animate-in fade-in">
            {book.synopsisExtended}
          </p>
        )}

        <button
          type="button"
          onClick={() => setShowFullSynopsis(!showFullSynopsis)}
          className="text-[#0284c7] font-semibold text-xs mt-2 hover:underline inline-flex items-center gap-0.5"
        >
          <span>{showFullSynopsis ? 'Show less' : 'Read more'}</span>
          <span className="material-symbols-outlined text-[14px]">
            {showFullSynopsis ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      </section>

      {/* Curated Topics Accordion (Matching Image 3) */}
      {book.topics.length > 0 && (
        <section className="rounded-2xl bg-white p-4 border border-blue-100 shadow-[0_4px_18px_rgba(7,36,70,0.05)] space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-sm font-bold text-[#0b192c]">
              Key Chapters & Curated Topics
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">
              {book.topics.length} Sections
            </span>
          </div>

          <div className="space-y-2">
            {book.topics.map((topic, index) => {
              const isExpanded = expandedTopic === index;
              return (
                <div
                  key={topic.title}
                  className="rounded-xl border border-slate-200/80 overflow-hidden bg-slate-50/50"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedTopic(isExpanded ? null : index)}
                    className="w-full p-3 text-left flex items-center justify-between gap-2 hover:bg-slate-100/60 transition-colors"
                  >
                    <div>
                      <span className="font-title-md text-xs font-bold text-[#0b192c] block">
                        {topic.title}
                      </span>
                      <span className="font-caption text-[11px] text-[#0284c7] font-semibold">
                        {topic.chapterInfo}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">
                      {isExpanded ? 'remove' : 'add'}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="p-3 pt-0 border-t border-slate-200/50 text-xs text-slate-600 space-y-2">
                      <p>{topic.description}</p>
                      <span className="inline-block px-2 py-0.5 rounded bg-sky-100 text-[#0284c7] font-bold text-[10px]">
                        {topic.badge}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Book Metadata Sheet */}
      <section className="rounded-2xl bg-white p-4 border border-blue-100 shadow-[0_4px_18px_rgba(7,36,70,0.05)] space-y-2">
        <h3 className="font-headline-sm text-sm font-bold text-[#0b192c]">
          Book Information
        </h3>
        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-2 flex justify-between">
            <span className="text-slate-500 font-medium">Subject / Category</span>
            <span className="font-bold text-[#0284c7]">{book.category}</span>
          </div>
          <div className="py-2 flex justify-between">
            <span className="text-slate-500 font-medium">ISBN-13</span>
            <span className="font-mono text-slate-800 font-bold">{book.isbn}</span>
          </div>
          <div className="py-2 flex justify-between">
            <span className="text-slate-500 font-medium">Dewey Decimal</span>
            <span className="font-mono text-[#0284c7] font-bold">{book.dewey}</span>
          </div>
          <div className="py-2 flex justify-between">
            <span className="text-slate-500 font-medium">LC Call Number</span>
            <span className="font-mono text-[#0284c7] font-bold">{book.lcCall}</span>
          </div>
          <div className="py-2 flex justify-between">
            <span className="text-slate-500 font-medium">Stack Location</span>
            <span className="font-bold text-slate-800 text-right">{book.location.floor} • {book.location.section} • {book.location.rack}</span>
          </div>
          <div className="py-2 flex justify-between">
            <span className="text-slate-500 font-medium">Standard Undergrad Loan</span>
            <span className="font-bold text-slate-800">28 Days (Renewable 2x)</span>
          </div>
          <div className="py-2 flex justify-between">
            <span className="text-slate-500 font-medium">Library Wing</span>
            <span className="text-slate-800 font-medium">{book.location.wing}</span>
          </div>
        </div>
      </section>

      {/* Sticky Floating Action Bar (Positioned above Bottom Navigation) */}
      <div className="fixed bottom-[68px] inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-sky-100 p-2.5 shadow-[0_-6px_20px_rgba(2,132,199,0.08)]">
        <div className="max-w-md mx-auto flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            type="button"
            aria-label="Save to Reading List"
            onClick={() => {
              onToggleSave(book.id);
              onToast(
                isSaved ? 'Removed from saved books' : 'Saved to Reading List',
                'bookmark'
              );
            }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all active:scale-95 shrink-0 ${
              isSaved
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>

          {/* Route Button */}
          <button
            type="button"
            onClick={() => onNavigate('wayfinding')}
            className="h-11 px-3 rounded-xl bg-sky-50 border border-sky-200 text-[#0284c7] font-title-md text-xs font-bold flex items-center gap-1 hover:bg-sky-100 active:scale-95 transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">turn_right</span>
            <span>Route</span>
          </button>

          {/* Primary Action Button: Hold or Instant Reservation */}
          <button
            type="button"
            onClick={() => onHoldBook(book.id)}
            className={`flex-1 h-11 rounded-xl font-title-md text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-transform text-white ${
              book.isAvailable
                ? 'bg-gradient-to-r from-[#006194] to-[#0284c7]'
                : 'bg-gradient-to-r from-slate-700 to-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {book.isAvailable ? 'lock_clock' : 'notifications_active'}
            </span>
            <span>{book.isAvailable ? 'Hold for 2h' : 'Join Waitlist / Queue'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
