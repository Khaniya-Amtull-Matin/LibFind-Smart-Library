import React, { useState } from 'react';
import { Book, ScreenName, UserProfile } from '../types';

interface HomeScreenProps {
  books: Book[];
  user: UserProfile;
  onNavigate: (screen: ScreenName) => void;
  onSelectBook: (bookId: string) => void;
  onToggleSave: (bookId: string) => void;
  onSearchQuery: (query: string) => void;
  onOpenScanner: (mode?: 'barcode-scanner' | 'ar-wayfinder') => void;
  recentSearches: string[];
  onClearRecentSearches: () => void;
  onRemoveRecentSearch: (search: string) => void;
  onToast: (msg: string, icon?: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  books,
  user,
  onNavigate,
  onSelectBook,
  onToggleSave,
  onSearchQuery,
  onOpenScanner,
  recentSearches,
  onClearRecentSearches,
  onRemoveRecentSearch,
  onToast,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { label: 'All', emoji: '📚' },
    { label: 'Computer Science', emoji: '💻' },
    { label: 'AI & Neural Nets', emoji: '🤖' },
    { label: 'Engineering', emoji: '📐' },
    { label: 'Natural Sciences', emoji: '🔬' },
    { label: 'Literature', emoji: '📖' },
    { label: 'History & Design', emoji: '🏛️' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchQuery(searchInput.trim());
    onNavigate('search');
  };

  const trendingBooks = books.filter((b) =>
    ['book-ddia', 'book-deep-learning', 'book-clean-arch', 'book-ds-cpp'].includes(b.id)
  );

  return (
    <div className="flex flex-col w-full space-y-space-lg pb-24 max-w-md mx-auto">
      {/* Ambient Glacier Light Element */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[380px] h-[240px] bg-gradient-to-b from-cyan-200/30 to-blue-200/10 blur-[100px] pointer-events-none -z-10 rounded-full"></div>

      {/* Warm Student Greeting & Status Ribbon (Image 19) */}
      <section className="flex flex-col space-y-space-xs pt-1">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-cyan-200/80 shadow-[0_2px_8px_rgba(2,132,199,0.08)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="font-label-telemetry text-label-telemetry text-primary uppercase tracking-wider">
              Beacon Wayfinding Active
            </span>
          </div>

          <div className="flex items-center gap-1 text-[#475569]">
            <span className="material-symbols-outlined text-[16px] text-tertiary">near_me</span>
            <span className="font-caption text-caption text-[#475569] font-medium">
              Central Hub • Fl 2
            </span>
          </div>
        </div>

        <div className="pt-1 flex items-baseline justify-between">
          <div>
            <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight flex items-center gap-1.5 font-semibold">
              Good afternoon, {user.name.split(' ')[0] || 'Scholar'}{' '}
              <span className="inline-block animate-pulse text-[#0284c7]">✨</span>
            </h1>
            <p className="font-body-md text-body-md text-[#475569]">
              What are you reading or researching today?
            </p>
          </div>
        </div>
      </section>

      {/* Hero Omni-Search Bar (Tactile Interactive Centerpiece) */}
      <section className="relative w-full">
        <form
          onSubmit={handleSearchSubmit}
          className="group relative rounded-xl bg-white/95 backdrop-blur-2xl p-1.5 shadow-[0_8px_24px_rgba(15,39,68,0.06)] border border-blue-100/90 transition-all duration-300 hover:border-cyan-400/60 hover:shadow-[0_8px_30px_rgba(2,132,199,0.12)]"
        >
          <div className="flex items-center gap-space-xs px-2 py-1">
            <button
              type="submit"
              aria-label="Submit search"
              className="w-9 h-9 rounded-full bg-blue-50/90 flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-105"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>

            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Title, author, Dewey code or subject..."
              className="flex-1 bg-transparent text-on-surface placeholder:text-[#8292a4] font-body-md text-body-md focus:outline-none focus:ring-0 min-w-0"
              type="text"
            />

            <div className="flex items-center gap-1">
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  aria-label="Clear input"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onToast('Listening for book title or Dewey code...', 'mic')}
                aria-label="Voice Search"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#475569] hover:text-primary hover:bg-blue-50 transition-colors active:scale-95"
              >
                <span className="material-symbols-outlined text-[19px]">mic</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenScanner('barcode-scanner')}
                aria-label="Barcode & ISBN Scanner"
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0284c7] to-[#00a8c6] text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-90 shadow-[0_3px_12px_rgba(2,132,199,0.35)]"
              >
                <span className="material-symbols-outlined text-[20px]">barcode_scanner</span>
              </button>
            </div>
          </div>
        </form>

        {/* Micro telemetry hint under search */}
        <div className="flex items-center justify-between px-2 pt-1.5 text-[#475569]">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-tertiary">bolt</span>
            <span className="font-caption text-caption text-[#475569]">
              Instant physical stack indexing
            </span>
          </div>
          <span className="font-caption text-caption text-primary font-semibold">
            Floor 1–4 Available
          </span>
        </div>
      </section>

      {/* Quick Category Chips (Horizontal Scrollable) */}
      <section className="-mx-4 px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 py-0.5 w-max">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => {
                  setActiveCategory(cat.label);
                  onSearchQuery(cat.label === 'All' ? '' : cat.label);
                  onNavigate('search');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all active:scale-95 text-xs font-semibold ${
                  isActive
                    ? 'bg-gradient-to-r from-[#006194] to-[#0284c7] text-white shadow-[0_3px_12px_rgba(0,97,148,0.25)]'
                    : 'bg-white/90 border border-blue-100/90 text-on-surface hover:text-primary hover:border-cyan-300 shadow-sm'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Stack Waypoint / Hold In Progress (Image 19) */}
      <section className="w-full">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white via-[#f4f9ff] to-[#e8f2fd] border border-blue-100 p-4 shadow-[0_6px_20px_rgba(7,36,70,0.06)]">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-[15px]">route</span>
              </span>
              <span className="font-label-telemetry text-label-telemetry text-primary tracking-wider uppercase">
                Active Waypoint Session
              </span>
            </div>
            <span className="font-caption text-caption text-[#006577] bg-[#d7f4fa] px-2.5 py-0.5 rounded-full font-semibold border border-cyan-200/50">
              Ready for pickup
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="min-w-0 flex-1">
              <h4 className="font-headline-sm text-headline-sm text-on-surface truncate font-semibold">
                Operating System Concepts
              </h4>
              <div className="flex items-center gap-1.5 mt-1 text-[#475569] font-caption text-caption">
                <span className="material-symbols-outlined text-[14px] text-tertiary">location_on</span>
                <span className="truncate">Floor 2 • Section A2 • Shelf 03</span>
              </div>
            </div>
            <button
              onClick={() => {
                onSelectBook('book-os-concepts');
                onNavigate('wayfinding');
              }}
              className="flex items-center gap-1 px-3.5 py-2 rounded-full bg-gradient-to-r from-[#006194] to-[#0284c7] text-white font-label-telemetry text-label-telemetry shadow-[0_3px_12px_rgba(2,132,199,0.3)] active:scale-95 transition-all flex-shrink-0"
              type="button"
            >
              <span>Route</span>
              <span className="material-symbols-outlined text-[16px]">turn_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* Recent Queries & Discovery Chips (Image 15) */}
      {recentSearches.length > 0 && (
        <section className="flex flex-col gap-2 bg-white/90 border border-sky-100 p-3 rounded-xl shadow-[0_2px_12px_rgba(2,132,199,0.04)] backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-caption text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#0284c7]">history</span>{' '}
              Recent Stacks Tracked
            </span>
            <button
              onClick={onClearRecentSearches}
              className="text-[#0284c7] hover:text-[#0369a1] font-caption text-xs font-bold uppercase tracking-wider"
              type="button"
            >
              Clear All
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {recentSearches.slice(0, 4).map((query) => (
              <div
                key={query}
                className="flex items-center gap-1 bg-sky-50 border border-sky-100/80 px-2.5 py-1 rounded-full text-slate-700 hover:text-[#0b192c] font-caption text-xs transition-colors cursor-pointer"
                onClick={() => {
                  onSearchQuery(query);
                  onNavigate('search');
                }}
              >
                <span className="material-symbols-outlined text-[13px] text-[#0284c7]">schedule</span>
                <span>{query}</span>
                <button
                  aria-label="Remove item"
                  className="ml-0.5 text-slate-400 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveRecentSearch(query);
                  }}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 pt-0.5 text-slate-500 font-caption text-xs">
            <span className="material-symbols-outlined text-[15px] text-[#0284c7]">lightbulb</span>
            <span>
              Tip: Search shelf code directly, e.g.{' '}
              <button
                type="button"
                onClick={() => {
                  onSearchQuery('B3-S4');
                  onNavigate('search');
                }}
                className="text-[#0284c7] font-semibold hover:underline"
              >
                B3-S4
              </button>{' '}
              or author{' '}
              <button
                type="button"
                onClick={() => {
                  onSearchQuery('Weiss');
                  onNavigate('search');
                }}
                className="text-[#0284c7] font-semibold hover:underline"
              >
                M. Weiss
              </button>
            </span>
          </div>
        </section>
      )}

      {/* Trending in the Library Carousel (Image 19) */}
      <section className="space-y-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              local_fire_department
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Trending in the Library
            </h2>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="font-caption text-caption text-primary font-semibold hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        {/* Carousel Scroll Container */}
        <div className="-mx-4 px-4 overflow-x-auto no-scrollbar flex gap-space-md py-1">
          {trendingBooks.map((book) => {
            const isBookmarked = user.savedBookIds.includes(book.id);
            return (
              <article
                key={book.id}
                onClick={() => {
                  onSelectBook(book.id);
                  onNavigate('book-details');
                }}
                className="w-[260px] flex-shrink-0 rounded-xl bg-white/95 backdrop-blur-xl p-3 flex flex-col justify-between border border-blue-100 shadow-[0_4px_16px_rgba(11,28,48,0.05)] hover:shadow-[0_8px_24px_rgba(11,28,48,0.09)] transition-all duration-300 cursor-pointer group"
              >
                <div>
                  <div className="relative w-full h-36 rounded-lg overflow-hidden bg-blue-50 mb-3 border border-blue-100/60">
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      alt={book.title}
                      src={book.coverImage}
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-cyan-100 flex items-center gap-1 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      <span className="font-caption text-caption text-primary font-bold">
                        {book.copiesOnShelf} {book.copiesOnShelf === 1 ? 'Copy' : 'Copies'}
                      </span>
                    </div>

                    <button
                      type="button"
                      aria-label="Save book"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(book.id);
                        onToast(
                          isBookmarked ? 'Removed from reading list' : 'Saved to Stacks Reading List',
                          'bookmark'
                        );
                      }}
                      className={`absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md border border-blue-100 flex items-center justify-center shadow-sm transition-transform active:scale-125 ${
                        isBookmarked ? 'text-red-500' : 'text-[#8292a4] hover:text-red-500'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        favorite
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[#475569] font-caption text-caption mb-1">
                    <span className="text-tertiary uppercase tracking-wider font-label-telemetry font-bold">
                      {book.tags[0] || 'CS'}
                    </span>
                    <span className="flex items-center gap-0.5 text-on-surface font-semibold">
                      <span className="material-symbols-outlined text-[13px] text-amber-500 fill-current">
                        star
                      </span>{' '}
                      {book.rating} ({book.reviewCount})
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-[16px] text-on-surface line-clamp-1 font-semibold group-hover:text-primary transition-colors">
                    {book.title}
                  </h3>
                  <p className="font-caption text-caption text-[#475569] mt-0.5 truncate">
                    {book.author}
                  </p>
                </div>

                <div className="mt-3 pt-2 flex items-center justify-between bg-blue-50/70 px-2.5 py-1.5 rounded-lg border border-blue-100/50">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="material-symbols-outlined text-[14px] text-primary flex-shrink-0">
                      pin_drop
                    </span>
                    <span className="font-caption text-caption text-[#475569] font-medium truncate">
                      Fl {book.location.floorNumber} • {book.location.rack} • {book.location.shelf.split(' ')[0]}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBook(book.id);
                      onNavigate('wayfinding');
                    }}
                    className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors flex-shrink-0"
                    title="Locate on Shelf"
                  >
                    <span className="material-symbols-outlined text-[14px]">navigation</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Browse Stacks by Discipline (Clean 2x2 Bento Grid from Image 19) */}
      <section className="space-y-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[20px]">lan</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Browse Stacks by Discipline
            </h2>
          </div>
          <span className="font-caption text-caption text-[#475569] font-medium">4 Quadrants</span>
        </div>

        <div className="grid grid-cols-2 gap-space-sm">
          {/* Discipline 1 */}
          <button
            onClick={() => {
              onSearchQuery('Artificial Intelligence');
              onNavigate('search');
            }}
            className="text-left group rounded-xl bg-white/95 backdrop-blur-xl p-3.5 flex flex-col justify-between border border-blue-100 hover:border-cyan-300 hover:bg-blue-50/40 transition-all active:scale-[0.98] shadow-[0_4px_16px_rgba(11,28,48,0.04)]"
          >
            <div>
              <div className="w-8 h-8 rounded-full bg-cyan-100/80 text-primary flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-xs">
                <span className="material-symbols-outlined text-[18px]">psychology</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors font-semibold leading-snug">
                Artificial Intelligence
              </h3>
              <p className="font-caption text-caption text-[#475569] mt-1">342 books available</p>
            </div>
            <div className="flex items-center justify-between pt-3 text-primary font-caption text-caption font-semibold">
              <span>Explore aisle</span>
              <span className="material-symbols-outlined text-[15px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </button>

          {/* Discipline 2 */}
          <button
            onClick={() => {
              onSearchQuery('Data Structures');
              onNavigate('search');
            }}
            className="text-left group rounded-xl bg-white/95 backdrop-blur-xl p-3.5 flex flex-col justify-between border border-blue-100 hover:border-cyan-300 hover:bg-blue-50/40 transition-all active:scale-[0.98] shadow-[0_4px_16px_rgba(11,28,48,0.04)]"
          >
            <div>
              <div className="w-8 h-8 rounded-full bg-blue-100/80 text-[#0284c7] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-xs">
                <span className="material-symbols-outlined text-[18px]">schema</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors font-semibold leading-snug">
                Data Structures
              </h3>
              <p className="font-caption text-caption text-[#475569] mt-1">218 books available</p>
            </div>
            <div className="flex items-center justify-between pt-3 text-primary font-caption text-caption font-semibold">
              <span>Explore aisle</span>
              <span className="material-symbols-outlined text-[15px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </button>

          {/* Discipline 3 */}
          <button
            onClick={() => {
              onSearchQuery('Quantum & Hardware');
              onNavigate('search');
            }}
            className="text-left group rounded-xl bg-white/95 backdrop-blur-xl p-3.5 flex flex-col justify-between border border-blue-100 hover:border-cyan-300 hover:bg-blue-50/40 transition-all active:scale-[0.98] shadow-[0_4px_16px_rgba(11,28,48,0.04)]"
          >
            <div>
              <div className="w-8 h-8 rounded-full bg-teal-100/80 text-tertiary flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-xs">
                <span className="material-symbols-outlined text-[18px]">memory</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors font-semibold leading-snug">
                Quantum & Hardware
              </h3>
              <p className="font-caption text-caption text-[#475569] mt-1">89 books available</p>
            </div>
            <div className="flex items-center justify-between pt-3 text-primary font-caption text-caption font-semibold">
              <span>Explore aisle</span>
              <span className="material-symbols-outlined text-[15px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </button>

          {/* Discipline 4 */}
          <button
            onClick={() => {
              onSearchQuery('Human Interaction');
              onNavigate('search');
            }}
            className="text-left group rounded-xl bg-white/95 backdrop-blur-xl p-3.5 flex flex-col justify-between border border-blue-100 hover:border-cyan-300 hover:bg-blue-50/40 transition-all active:scale-[0.98] shadow-[0_4px_16px_rgba(11,28,48,0.04)]"
          >
            <div>
              <div className="w-8 h-8 rounded-full bg-indigo-100/80 text-primary flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-xs">
                <span className="material-symbols-outlined text-[18px]">touch_app</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors font-semibold leading-snug">
                Human Interaction
              </h3>
              <p className="font-caption text-caption text-[#475569] mt-1">156 books available</p>
            </div>
            <div className="flex items-center justify-between pt-3 text-primary font-caption text-caption font-semibold">
              <span>Explore aisle</span>
              <span className="material-symbols-outlined text-[15px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* LiFi Beacons Synchronized Banner (Image 15) */}
      <section
        onClick={() => onOpenScanner('ar-wayfinder')}
        className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-200 shadow-sm backdrop-blur-md cursor-pointer hover:border-sky-300 active:scale-[0.99] transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white border border-sky-200 flex items-center justify-center text-[#0284c7] shadow-sm">
            <span className="material-symbols-outlined text-[20px]">wifi_tethering</span>
          </div>
          <div>
            <p className="font-headline-sm text-sm text-[#0b192c] font-bold leading-tight">
              LiFi Beacons Synchronized
            </p>
            <p className="font-caption text-xs text-slate-500">
              Tap 'Locate in Stacks' to trigger augmented reality floor arrows.
            </p>
          </div>
        </div>
        <span className="material-symbols-outlined text-[#0284c7] text-[22px]">chevron_right</span>
      </section>

      {/* Realtime Campus Library Telemetry Pulse Bar (Image 19) */}
      <section className="rounded-xl bg-white/85 backdrop-blur-md border border-cyan-200/70 p-3.5 flex items-center justify-between shadow-[0_4px_16px_rgba(2,132,199,0.06)]">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </div>
          <div>
            <p className="font-label-telemetry text-label-telemetry text-on-surface font-semibold">
              Stacks Sensor Coverage: 98.4%
            </p>
            <p className="font-caption text-caption text-[#475569]">
              Live coordinate sync every 15s
            </p>
          </div>
        </div>
        <span className="material-symbols-outlined text-primary text-[20px]">sensors</span>
      </section>
    </div>
  );
};
