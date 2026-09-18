import React, { useState, useMemo, useEffect } from 'react';
import { Book, FilterState, ScreenName, UserProfile } from '../types';

interface SearchScreenProps {
  books: Book[];
  user: UserProfile;
  initialQuery?: string;
  onNavigate: (screen: ScreenName) => void;
  onSelectBook: (bookId: string) => void;
  onToggleSave: (bookId: string) => void;
  onOpenScanner: (mode?: 'barcode-scanner' | 'ar-wayfinder') => void;
  onToast: (msg: string, icon?: string) => void;
  onHoldBook: (bookId: string) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  books,
  user,
  initialQuery = '',
  onNavigate,
  onSelectBook,
  onToggleSave,
  onOpenScanner,
  onToast,
  onHoldBook,
}) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [activePills, setActivePills] = useState<string[]>([]);

  useEffect(() => {
    if (initialQuery !== undefined) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const [filters, setFilters] = useState<FilterState>({
    genre: [],
    availability: 'all',
    floors: [],
    minRating: 0,
    sortBy: 'relevance',
  });

  const togglePill = (pill: string) => {
    setActivePills((prev) =>
      prev.includes(pill) ? prev.filter((p) => p !== pill) : [...prev, pill]
    );
  };

  const disciplineCategories = [
    'All',
    'Computer Science',
    'AI & Machine Learning',
    'Mathematics',
    'Physics & Quantum',
    'Engineering',
    'Literature',
  ];

  const quickFilterPills = [
    'Available Now',
    'Issued',
    'Floor 2 Stacks',
    'Floor 3 Stacks',
    '4.5+ Rating',
    'Core Syllabus',
  ];

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // 1. Text Query Filter (Title, Author, Subject, Dewey code, LC Call, Shelf, Keywords)
      if (query.trim()) {
        const rawQ = query.toLowerCase().trim();
        const cleanQ = rawQ
          .replace(/^dewey:\s*/i, '')
          .replace(/^dewey\s+/i, '')
          .replace(/^call:\s*/i, '')
          .replace(/^author:\s*/i, '')
          .replace(/^subject:\s*/i, '')
          .replace(/^title:\s*/i, '');

        const searchTerms = cleanQ.split(/\s+/).filter(Boolean);

        const matchesQuery = searchTerms.every((term) => {
          return (
            book.title.toLowerCase().includes(term) ||
            book.author.toLowerCase().includes(term) ||
            book.category.toLowerCase().includes(term) ||
            book.dewey.toLowerCase().includes(term) ||
            book.lcCall.toLowerCase().includes(term) ||
            book.isbn.toLowerCase().includes(term) ||
            book.location.floor.toLowerCase().includes(term) ||
            book.location.section.toLowerCase().includes(term) ||
            book.location.rack.toLowerCase().includes(term) ||
            book.location.shelf.toLowerCase().includes(term) ||
            book.synopsisSummary.toLowerCase().includes(term) ||
            book.tags.some((t) => t.toLowerCase().includes(term)) ||
            (term === 'ai' && (book.category.toLowerCase().includes('ai') || book.tags.some((t) => t.toLowerCase().includes('ai')))) ||
            (term === 'cs' && book.category.toLowerCase().includes('computer')) ||
            (term === 'math' && book.category.toLowerCase().includes('math')) ||
            (term === 'physics' && book.category.toLowerCase().includes('physic'))
          );
        });

        if (!matchesQuery) return false;
      }

      // 2. Category Filter Chip
      if (selectedCategory !== 'All') {
        const cat = selectedCategory.toLowerCase();
        const matchesCategory =
          book.category.toLowerCase().includes(cat) ||
          book.tags.some((t) => t.toLowerCase().includes(cat)) ||
          (cat.includes('ai') && (book.category.toLowerCase().includes('ai') || book.tags.some((t) => t.toLowerCase().includes('ai')))) ||
          (cat.includes('math') && book.category.toLowerCase().includes('math')) ||
          (cat.includes('physics') && book.category.toLowerCase().includes('physic')) ||
          (cat.includes('computer') && book.category.toLowerCase().includes('computer'));

        if (!matchesCategory) return false;
      }

      // 3. Quick Pills
      if (activePills.includes('Available Now') && !book.isAvailable) {
        return false;
      }
      if (activePills.includes('Issued') && book.isAvailable) {
        return false;
      }
      if (activePills.includes('Floor 2 Stacks') && book.location.floorNumber !== 2) {
        return false;
      }
      if (activePills.includes('Floor 3 Stacks') && book.location.floorNumber !== 3) {
        return false;
      }
      if (activePills.includes('4.5+ Rating') && book.rating < 4.5) {
        return false;
      }
      if (activePills.includes('Core Syllabus') && !book.tags.includes('Core Curriculum')) {
        return false;
      }

      // 4. Filter Drawer checks
      if (filters.availability === 'available' && !book.isAvailable) {
        return false;
      }
      if (filters.minRating > 0 && book.rating < filters.minRating) {
        return false;
      }
      if (filters.floors.length > 0 && !filters.floors.includes(book.location.floorNumber.toString())) {
        return false;
      }

      return true;
    });
  }, [books, query, selectedCategory, activePills, filters]);

  return (
    <div className="flex flex-col w-full space-y-space-md pb-24 max-w-md mx-auto">
      {/* Search Header Form (Image 11) */}
      <section className="sticky top-16 z-30 pt-1 -mx-4 px-4 bg-white/95 backdrop-blur-xl border-b border-blue-100/60 pb-3 space-y-2">
        <div className="relative rounded-xl bg-white p-1.5 shadow-[0_4px_20px_rgba(2,132,199,0.08)] border border-blue-100">
          <div className="flex items-center gap-2 px-2">
            <span className="material-symbols-outlined text-[#0284c7] text-[20px]">search</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, author, subject, Dewey code..."
              className="flex-1 bg-transparent text-on-surface placeholder:text-slate-400 font-body-md text-sm outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[16px]">cancel</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onToast('Voice search ready: say author, subject, or Dewey code', 'mic')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-[#0284c7]"
            >
              <span className="material-symbols-outlined text-[18px]">mic</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenScanner('barcode-scanner')}
              className="w-8 h-8 rounded-full bg-sky-100 text-[#0284c7] flex items-center justify-center shadow-xs"
              title="Barcode Scanner"
            >
              <span className="material-symbols-outlined text-[18px]">barcode_scanner</span>
            </button>
          </div>
        </div>

        {/* Category Filter Horizontal Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
          {disciplineCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 flex items-center gap-1 ${
                  isSelected
                    ? 'bg-[#006194] text-white shadow-xs'
                    : 'bg-sky-50 text-[#0284c7] hover:bg-sky-100 border border-sky-100'
                }`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Filter Horizontal Status / Stack Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickFilterPills.map((pill) => {
            const isSelected = activePills.includes(pill);
            return (
              <button
                key={pill}
                type="button"
                onClick={() => togglePill(pill)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all active:scale-95 flex items-center gap-1 ${
                  isSelected
                    ? 'bg-[#0284c7] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isSelected && (
                  <span className="material-symbols-outlined text-[13px]">check</span>
                )}
                <span>{pill}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Results Telemetry & Filter Trigger Bar */}
      <section className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="font-headline-sm text-sm font-bold text-[#0b192c]">
            {filteredBooks.length} {filteredBooks.length === 1 ? 'Book' : 'Books'} Found
          </span>
          {query && (
            <span className="font-caption text-xs text-slate-500">
              for "{query}"
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilterDrawer(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-sky-200 text-[#0284c7] font-caption text-xs font-bold shadow-xs hover:bg-sky-50 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Filter</span>
            {activePills.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#0284c7] text-white text-[10px] flex items-center justify-center font-bold">
                {activePills.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              const sorts: Array<FilterState['sortBy']> = ['relevance', 'rating', 'title'];
              const currentIndex = sorts.indexOf(filters.sortBy);
              const nextSort = sorts[(currentIndex + 1) % sorts.length];
              setFilters((prev) => ({ ...prev, sortBy: nextSort }));
              onToast(`Sorted by: ${nextSort.toUpperCase()}`, 'sort');
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-100 text-slate-700 font-caption text-xs font-semibold hover:bg-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">swap_vert</span>
            <span className="capitalize">{filters.sortBy}</span>
          </button>
        </div>
      </section>

      {/* Book Result Cards List (Direct match to Image 11) */}
      <section className="space-y-3.5">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white/90 rounded-2xl border border-sky-100 shadow-sm">
            <span className="material-symbols-outlined text-[48px] text-slate-300">menu_book</span>
            <h3 className="font-headline-sm text-base text-[#0b192c] font-bold mt-2">
              No matching stacks found
            </h3>
            <p className="font-caption text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Try searching by generic keywords like "Algorithms", "Systems", or clear active filters.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setActivePills([]);
              }}
              className="mt-4 px-4 py-2 rounded-full bg-[#0284c7] text-white font-caption text-xs font-bold shadow-sm"
              type="button"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          filteredBooks.map((book) => {
            const isSaved = user.savedBookIds.includes(book.id);

            return (
              <article
                key={book.id}
                onClick={() => {
                  onSelectBook(book.id);
                  onNavigate('book-details');
                }}
                className="group relative rounded-2xl bg-white/95 backdrop-blur-xl p-4 border border-blue-100/90 shadow-[0_4px_20px_rgba(7,36,70,0.05)] hover:border-cyan-300 hover:shadow-[0_8px_28px_rgba(2,132,199,0.1)] transition-all duration-300 cursor-pointer flex flex-col gap-3"
              >
                {/* Top Section: Cover + Book Info */}
                <div className="flex gap-3.5 items-start">
                  {/* Textbook Cover Thumbnail */}
                  <div className="relative w-20 h-28 rounded-xl overflow-hidden bg-slate-100 shadow-md shrink-0 border border-slate-200">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  </div>

                  {/* Title & Metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="font-label-telemetry text-[10px] font-bold uppercase tracking-wider text-white bg-[#0284c7] px-2 py-0.5 rounded-full">
                          {book.category}
                        </span>
                        <span
                          className={`font-label-telemetry text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            book.statusType === 'issued'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : book.statusType === 'limited'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {book.statusType === 'issued' ? 'Issued' : 'Available'}
                        </span>
                      </div>

                      <button
                        type="button"
                        aria-label="Bookmark"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(book.id);
                          onToast(
                            isSaved ? 'Removed from saved items' : 'Saved to Reading List',
                            'bookmark'
                          );
                        }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                          isSaved ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          favorite
                        </span>
                      </button>
                    </div>

                    <h3 className="font-headline-sm text-[16px] text-[#0b192c] font-bold group-hover:text-[#0284c7] transition-colors line-clamp-2 leading-snug">
                      {book.title}
                    </h3>
                    <p className="font-caption text-xs text-slate-600 font-medium truncate mt-0.5">
                      {book.author}
                    </p>

                    <div className="flex items-center flex-wrap gap-2 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-0.5 font-bold text-slate-800">
                        <span className="material-symbols-outlined text-[14px] text-amber-500 fill-current">
                          star
                        </span>
                        {book.rating}
                      </span>
                      <span>•</span>
                      <span className="font-call-number text-[11px] text-[#0284c7] font-semibold">
                        Call: {book.lcCall}
                      </span>
                      <span>•</span>
                      <span className="font-caption text-[11px] text-slate-500">
                        Dewey: {book.dewey}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle Telemetry: Status & Floorplan Coordinate Bar */}
                <div className="rounded-xl bg-slate-50/80 border border-slate-200/70 p-2.5 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          book.statusType === 'available'
                            ? 'bg-emerald-500'
                            : book.statusType === 'limited'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      ></span>
                      <span
                        className={
                          book.statusType === 'available'
                            ? 'text-emerald-700'
                            : book.statusType === 'limited'
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }
                      >
                        {book.statusText}
                      </span>
                    </div>

                    <span className="font-label-telemetry text-[11px] font-bold text-slate-600 uppercase">
                      {book.location.beaconId}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-0.5 border-t border-slate-200/50">
                    <div className="flex items-center gap-1 truncate font-medium">
                      <span className="material-symbols-outlined text-[15px] text-[#0284c7]">
                        place
                      </span>
                      <span className="truncate">
                        {book.location.floor} • {book.location.rack} • {book.location.shelf}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-semibold shrink-0 ml-1">
                      ~{book.location.distanceWalkMeters}m walk
                    </span>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBook(book.id);
                      onNavigate('wayfinding');
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#006194] to-[#0284c7] text-white font-title-md text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md active:scale-98 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">turn_right</span>
                    <span>Route</span>
                  </button>

                  {book.isAvailable ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onHoldBook(book.id);
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-[#0284c7] font-caption text-xs font-bold flex items-center gap-1 hover:bg-sky-100 active:scale-95 transition-colors shrink-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">lock_clock</span>
                      <span>Hold for 2h</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToast('Alert set: You will receive an SMS when returned', 'notifications_active');
                      }}
                      className="px-3 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-caption text-xs font-semibold flex items-center gap-1 hover:bg-slate-200 shrink-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">notifications</span>
                      <span>Alert on Return</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* Filter Sheet / Bottom Drawer */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-2"></div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-headline-sm text-lg font-bold text-[#0b192c]">Filter Catalog</h3>
              <button
                type="button"
                onClick={() => setShowFilterDrawer(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Filter by Floor */}
            <div>
              <label className="font-title-md text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Floor Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['1', '2', '3', '4'].map((fl) => {
                  const isSelected = filters.floors.includes(fl);
                  return (
                    <button
                      key={fl}
                      type="button"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          floors: isSelected
                            ? prev.floors.filter((f) => f !== fl)
                            : [...prev.floors, fl],
                        }))
                      }
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-between ${
                        isSelected
                          ? 'bg-sky-50 border-[#0284c7] text-[#0284c7]'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <span>
                        Floor {fl} {fl === '2' ? '(Sci-Tech)' : fl === '3' ? '(Graduate)' : ''}
                      </span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter by Availability */}
            <div>
              <label className="font-title-md text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Availability Status
              </label>
              <div className="flex gap-2">
                {(['all', 'available', 'limited'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, availability: opt }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize border ${
                      filters.availability === opt
                        ? 'bg-[#006194] text-white border-[#006194]'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {opt === 'all' ? 'All Stacks' : opt === 'available' ? 'Available' : 'Limited'}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setFilters({
                    genre: [],
                    availability: 'all',
                    floors: [],
                    minRating: 0,
                    sortBy: 'relevance',
                  });
                  setActivePills([]);
                  setShowFilterDrawer(false);
                  onToast('All filters cleared', 'restart_alt');
                }}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setShowFilterDrawer(false)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#006194] to-[#0284c7] text-white font-bold text-xs shadow-md active:scale-98 transition-transform"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
