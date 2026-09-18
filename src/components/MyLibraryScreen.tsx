import React, { useState } from 'react';
import { Book, BorrowedBook, ActiveHold, ScreenName, UserProfile } from '../types';

interface MyLibraryScreenProps {
  user: UserProfile;
  books: Book[];
  borrowedBooks: BorrowedBook[];
  activeHolds: ActiveHold[];
  onNavigate: (screen: ScreenName) => void;
  onSelectBook: (bookId: string) => void;
  onRenewLoan: (loanId: string) => void;
  onCancelHold: (holdId: string) => void;
  onToggleSave: (bookId: string) => void;
  recentSearches: string[];
  onClearRecentSearches: () => void;
  onRemoveRecentSearch: (query: string) => void;
  onSearchQuery: (query: string) => void;
  onToast: (msg: string, icon?: string) => void;
}

export const MyLibraryScreen: React.FC<MyLibraryScreenProps> = ({
  user,
  books,
  borrowedBooks,
  activeHolds,
  onNavigate,
  onSelectBook,
  onRenewLoan,
  onCancelHold,
  onToggleSave,
  recentSearches,
  onClearRecentSearches,
  onRemoveRecentSearch,
  onSearchQuery,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'loans' | 'saved' | 'history' | 'searches'>('loans');
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);

  const savedBooks = books.filter((b) => user.savedBookIds.includes(b.id));

  return (
    <div className="flex flex-col w-full space-y-4 pb-28 max-w-md mx-auto">
      {/* Student Digital ID Card (Image 8 & 4) */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b192c] via-[#0f2744] to-[#0b192c] p-4 text-white shadow-[0_10px_30px_rgba(11,28,48,0.2)] border border-sky-900/60">
        {/* Subtle decorative security watermarks */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-xl overflow-hidden ring-2 ring-cyan-400/50 shadow-md shrink-0">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-headline-sm text-base font-bold text-white leading-tight">
                  {user.name}
                </h2>
                <span className="material-symbols-outlined text-cyan-400 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
              <p className="font-caption text-xs text-slate-300 mt-0.5">
                {user.idNumber} • {user.division}
              </p>
              <p className="font-mono text-[10px] text-cyan-400 font-semibold tracking-wider mt-0.5">
                CARD: {user.kioskCardNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowBarcodeModal(true)}
            className="flex flex-col items-center justify-center px-2.5 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 hover:bg-cyan-500/30 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-cyan-300 text-[20px]">qr_code_2</span>
            <span className="font-label-telemetry text-[9px] text-cyan-300 font-bold uppercase tracking-wider mt-0.5">
              PASS
            </span>
          </button>
        </div>

        {/* Card bottom telemetry */}
        <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-300 relative z-10">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Turnstile Access Active</span>
          </div>
          <span className="font-caption text-slate-400">
            Fall 2026 Validation
          </span>
        </div>
      </section>

      {/* Primary Tabs Navigation (Image 8) */}
      <section className="flex border-b border-blue-100 bg-white/80 backdrop-blur-md rounded-xl p-1 shadow-xs">
        {[
          { id: 'loans' as const, label: 'Active Loans', count: borrowedBooks.length },
          { id: 'saved' as const, label: 'Saved', count: savedBooks.length },
          { id: 'history' as const, label: 'History', count: 14 },
          { id: 'searches' as const, label: 'Recent', count: recentSearches.length },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all relative flex items-center justify-center gap-1 ${
                isActive
                  ? 'bg-[#006194] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0b192c] hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </section>

      {/* TAB 1: ACTIVE LOANS */}
      {activeTab === 'loans' && (
        <div className="space-y-4">
          {/* Active Holds & Reservations Shelf (Image 8) */}
          {activeHolds.length > 0 && (
            <section className="rounded-2xl bg-white p-4 border border-blue-100 shadow-[0_4px_16px_rgba(7,36,70,0.05)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0284c7] text-[20px]">
                    lock_clock
                  </span>
                  <h3 className="font-headline-sm text-sm font-bold text-[#0b192c]">
                    Active Holds & Reservations ({activeHolds.length})
                  </h3>
                </div>
                <span className="text-[10px] text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full animate-pulse">
                  Ready at Kiosk
                </span>
              </div>

              {activeHolds.map((hold) => (
                <div
                  key={hold.id}
                  className="p-3 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200/80 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={hold.coverImage}
                      alt={hold.title}
                      className="w-10 h-14 object-cover rounded shadow-sm shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0">
                      <h4 className="font-headline-sm text-xs font-bold text-[#0b192c] truncate">
                        {hold.title}
                      </h4>
                      <p className="font-caption text-[11px] text-slate-500 truncate">
                        {hold.author}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] font-bold text-[#0284c7] bg-white px-1.5 py-0.5 rounded border border-sky-200">
                          {hold.pickupLocation}
                        </span>
                        <span className="font-caption text-[10px] text-amber-700 font-semibold">
                          {hold.expiresInText}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-1 rounded shadow-xs border border-slate-200">
                      {hold.holdCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => onCancelHold(hold.id)}
                      className="text-[10px] text-slate-400 hover:text-red-500 font-medium"
                    >
                      Cancel Hold
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Currently Borrowed Books Section (Image 8) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-headline-sm text-sm font-bold text-[#0b192c]">
                Currently Borrowed Books ({borrowedBooks.length})
              </h3>
              <span className="font-caption text-xs text-slate-500">2 of 5 Max Borrowed</span>
            </div>

            {borrowedBooks.map((borrowed) => (
              <div
                key={borrowed.id}
                className="rounded-2xl bg-white p-4 border border-blue-100 shadow-[0_4px_16px_rgba(7,36,70,0.05)] space-y-3"
              >
                <div className="flex gap-3 items-start">
                  <img
                    src={borrowed.coverImage}
                    alt={borrowed.title}
                    className="w-16 h-22 object-cover rounded-lg shadow-sm border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[10px] font-bold text-[#0284c7] uppercase">
                      {borrowed.dewey}
                    </span>
                    <h4 className="font-headline-sm text-sm font-bold text-[#0b192c] truncate mt-0.5">
                      {borrowed.title}
                    </h4>
                    <p className="font-caption text-xs text-slate-600 truncate">
                      {borrowed.author}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          borrowed.isDueSoon ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      ></span>
                      <span
                        className={`font-title-md text-xs font-bold ${
                          borrowed.isDueSoon ? 'text-amber-700' : 'text-emerald-700'
                        }`}
                      >
                        {borrowed.dueText}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                    <span>Borrow Timeline</span>
                    <span>{borrowed.daysRemaining} days remaining</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        borrowed.isDueSoon ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${borrowed.loanProgressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onRenewLoan(borrowed.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-sky-50 border border-sky-200 text-[#0284c7] font-caption text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-sky-100 active:scale-98 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">autorenew</span>
                    <span>Renew (+14 Days)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectBook(borrowed.bookId);
                      onNavigate('book-details');
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-100 text-slate-700 font-caption text-xs font-semibold hover:bg-slate-200 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* Reading Goal Progress Card (Image 8) */}
          <section className="rounded-2xl bg-gradient-to-r from-sky-50 via-white to-blue-50 p-4 border border-sky-200/70 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0284c7] text-[20px]">
                  flag_circle
                </span>
                <h4 className="font-headline-sm text-xs font-bold text-[#0b192c]">
                  Fall Semester Reading Goal
                </h4>
              </div>
              <span className="font-mono text-xs font-bold text-[#0284c7]">
                {user.readingGoal.completed} / {user.readingGoal.total} Books (66%)
              </span>
            </div>

            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#006194] to-[#0284c7] rounded-full"
                style={{ width: `${(user.readingGoal.completed / user.readingGoal.total) * 100}%` }}
              ></div>
            </div>
            <p className="font-caption text-[11px] text-slate-500">
              4 more academic volumes to achieve Dean's Research Honors.
            </p>
          </section>
        </div>
      )}

      {/* TAB 2: SAVED & SHELF REMINDERS */}
      {activeTab === 'saved' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-headline-sm text-sm font-bold text-[#0b192c]">
              Saved Books & Shelf Reminders ({savedBooks.length})
            </h3>
            <span className="font-caption text-xs text-slate-500">Syncs to campus app</span>
          </div>

          {savedBooks.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-sky-100 p-4">
              <span className="material-symbols-outlined text-[40px] text-slate-300">
                bookmark_border
              </span>
              <p className="font-headline-sm text-xs font-bold text-slate-700 mt-2">
                No books saved yet
              </p>
              <p className="font-caption text-xs text-slate-500 mt-1">
                Tap the heart or bookmark icon on any book to add it here.
              </p>
            </div>
          ) : (
            savedBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => {
                  onSelectBook(book.id);
                  onNavigate('book-details');
                }}
                className="rounded-2xl bg-white p-3.5 border border-blue-100 shadow-[0_3px_14px_rgba(7,36,70,0.04)] flex items-center justify-between gap-3 cursor-pointer hover:border-cyan-300 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded-lg shadow-sm border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="font-call-number text-[10px] font-bold text-[#0284c7]">
                      {book.lcCall}
                    </span>
                    <h4 className="font-headline-sm text-xs font-bold text-[#0b192c] truncate mt-0.5">
                      {book.title}
                    </h4>
                    <p className="font-caption text-[11px] text-slate-500 truncate">
                      {book.author}
                    </p>
                    <p className="font-caption text-[10px] text-emerald-600 font-bold mt-1">
                      {book.location.floor} • {book.location.rack} • {book.location.shelf.split(' ')[0]}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBook(book.id);
                      onNavigate('wayfinding');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#006194] to-[#0284c7] text-white font-caption text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[14px]">turn_right</span>
                    <span>Route</span>
                  </button>

                  <button
                    type="button"
                    aria-label="Remove from saved"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(book.id);
                      onToast('Removed from saved list', 'bookmark_remove');
                    }}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-headline-sm text-sm font-bold text-[#0b192c]">
              Past Semester Checkouts
            </h3>
            <span className="font-caption text-xs text-slate-500">14 Items Total</span>
          </div>

          {[
            {
              title: 'Database Management Systems',
              author: 'Raghu Ramakrishnan',
              returnedOn: 'Sept 14, 2026',
              ratingGiven: 5,
            },
            {
              title: 'Computer Networks: A Systems Approach',
              author: 'Larry L. Peterson',
              returnedOn: 'August 28, 2026',
              ratingGiven: 4,
            },
            {
              title: 'Structure and Interpretation of Computer Programs (SICP)',
              author: 'Harold Abelson, Gerald Jay Sussman',
              returnedOn: 'July 15, 2026',
              ratingGiven: 5,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-3.5 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <h4 className="font-bold text-[#0b192c]">{item.title}</h4>
                <p className="text-slate-500 text-[11px]">{item.author}</p>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Returned on {item.returnedOn}
                </span>
              </div>
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">
                Returned On-Time
              </span>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: RECENT SEARCHES */}
      {activeTab === 'searches' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-headline-sm text-sm font-bold text-[#0b192c]">
              Recent Stack Queries
            </h3>
            <button
              onClick={onClearRecentSearches}
              className="text-[#0284c7] font-bold text-xs hover:underline"
              type="button"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-1.5">
            {recentSearches.map((query) => (
              <div
                key={query}
                onClick={() => {
                  onSearchQuery(query);
                  onNavigate('search');
                }}
                className="p-3 rounded-xl bg-white border border-slate-100 flex items-center justify-between gap-2 cursor-pointer hover:bg-sky-50/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0284c7] text-[18px]">
                    history
                  </span>
                  <span className="font-title-md text-xs font-semibold text-[#0b192c]">
                    {query}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label="Remove search"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveRecentSearch(query);
                  }}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Barcode / Student Digital Turnstile Modal */}
      {showBarcodeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0284c7] text-[22px]">badge</span>
                <span className="font-headline-sm text-sm font-bold text-[#0b192c]">
                  Campus Circulation Pass
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowBarcodeModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="font-caption text-xs text-slate-500">
              Hold screen against turnstile barcode reader or circulation scanner.
            </p>

            {/* High Contrast Digital Barcode */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center">
              <svg viewBox="0 0 240 80" className="w-full h-20">
                <rect width="100%" height="100%" fill="#ffffff" />
                {/* Simulated Real Barcode Stripes */}
                {[
                  8, 12, 18, 22, 28, 30, 34, 40, 48, 52, 58, 64, 70, 74, 80, 84, 90, 96, 102, 108, 114,
                  120, 126, 132, 138, 142, 148, 154, 160, 166, 172, 180, 186, 192, 198, 204, 210, 216,
                  222, 228,
                ].map((x, i) => (
                  <rect
                    key={x}
                    x={x}
                    y={10}
                    width={i % 3 === 0 ? 3.5 : i % 2 === 0 ? 2 : 1}
                    height={55}
                    fill="#000000"
                  />
                ))}
              </svg>
              <span className="font-mono text-xs font-bold tracking-widest text-[#0b192c] mt-2">
                * {user.kioskCardNumber} *
              </span>
            </div>

            <div className="text-xs text-slate-600 font-medium">
              <span>{user.name} • {user.division}</span>
              <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
                Active Undergrad Privileges
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowBarcodeModal(false);
                onToast('Turnstile scan validated. Gates open.', 'door_front');
              }}
              className="w-full py-2.5 rounded-xl bg-[#006194] text-white font-bold text-xs shadow-md"
            >
              Simulate Gate Tap
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
