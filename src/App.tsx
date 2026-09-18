/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenName, UserProfile } from './types';
import {
  initialBooks,
  initialBorrowedBooks,
  initialActiveHolds,
  defaultUserProfile,
  initialRecentSearches,
} from './data/libraryData';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { HomeScreen } from './components/HomeScreen';
import { SearchScreen } from './components/SearchScreen';
import { BookDetailsScreen } from './components/BookDetailsScreen';
import { WayfindingScreen } from './components/WayfindingScreen';
import { MyLibraryScreen } from './components/MyLibraryScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AuthScreens } from './components/AuthScreens';
import { ARScannerModal } from './components/ARScannerModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('home');
  const [screenHistory, setScreenHistory] = useState<ScreenName[]>(['home']);
  const [selectedBookId, setSelectedBookId] = useState<string>('book-ds-cpp');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [books, setBooks] = useState(initialBooks);
  const [borrowedBooks, setBorrowedBooks] = useState(initialBorrowedBooks);
  const [activeHolds, setActiveHolds] = useState(initialActiveHolds);
  const [user, setUser] = useState<UserProfile>(defaultUserProfile);
  const [recentSearches, setRecentSearches] = useState<string[]>(initialRecentSearches);

  const [scannerState, setScannerState] = useState<{
    isOpen: boolean;
    mode: 'barcode-scanner' | 'ar-wayfinder';
  }>({
    isOpen: false,
    mode: 'barcode-scanner',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIcon, setToastIcon] = useState<string>('check_circle');
  const [showNotifications, setShowNotifications] = useState(false);

  const showToast = (message: string, icon = 'check_circle') => {
    setToastMessage(message);
    setToastIcon(icon);
    setTimeout(() => {
      setToastMessage((curr) => (curr === message ? null : curr));
    }, 3200);
  };

  const handleNavigate = (nextScreen: ScreenName) => {
    if (nextScreen !== currentScreen) {
      setScreenHistory((prev) => [...prev, nextScreen]);
      setCurrentScreen(nextScreen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (screenHistory.length > 1) {
      const nextHistory = [...screenHistory];
      nextHistory.pop();
      const previousScreen = nextHistory[nextHistory.length - 1] || 'home';
      setScreenHistory(nextHistory);
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen('home');
    }
  };

  const handleToggleSave = (bookId: string) => {
    setUser((prev) => {
      const isSaved = prev.savedBookIds.includes(bookId);
      const newSaved = isSaved
        ? prev.savedBookIds.filter((id) => id !== bookId)
        : [...prev.savedBookIds, bookId];
      return { ...prev, savedBookIds: newSaved };
    });
  };

  const handleHoldBook = (bookId: string) => {
    const targetBook = books.find((b) => b.id === bookId);
    if (!targetBook) return;

    // Check if already in holds
    const existing = activeHolds.find((h) => h.bookId === bookId);
    if (existing) {
      showToast('Book already reserved in Locker #14-B', 'info');
      handleNavigate('my-library');
      return;
    }

    const newHold = {
      id: `hold-${Date.now()}`,
      bookId,
      title: targetBook.title,
      author: `${targetBook.author} • Central Circulation Desk`,
      coverImage: targetBook.coverImage,
      pickupLocation: 'Locker #14-B Reserved',
      lockerNumber: '14-B',
      holdCode: `HL-${Math.floor(100 + Math.random() * 900)}-CK9`,
      expiresInText: 'Expires in 2h 00m',
      reserved: true,
    };

    setActiveHolds((prev) => [newHold, ...prev]);
    showToast('Hold Confirmed! Locker #14-B assigned for 2 hours', 'lock_clock');
    handleNavigate('my-library');
  };

  const handleRenewLoan = (loanId: string) => {
    setBorrowedBooks((prev) =>
      prev.map((loan) => {
        if (loan.id === loanId) {
          return {
            ...loan,
            dueText: 'Due Nov 18 (In 31 Days)',
            daysRemaining: 31,
            isDueSoon: false,
            loanProgressPercent: 15,
          };
        }
        return loan;
      })
    );
    showToast('Loan extended +14 days. New due date: Nov 18, 2026', 'autorenew');
  };

  const handleCancelHold = (holdId: string) => {
    setActiveHolds((prev) => prev.filter((h) => h.id !== holdId));
    showToast('Reservation cancelled. Copy returned to shelf circulation.', 'cancel');
  };

  const handleSearchQuery = (queryText: string) => {
    setSearchQuery(queryText);
    if (queryText && !recentSearches.includes(queryText)) {
      setRecentSearches((prev) => [queryText, ...prev.slice(0, 8)]);
    }
  };

  const handleOpenScanner = (mode: 'barcode-scanner' | 'ar-wayfinder' = 'barcode-scanner') => {
    setScannerState({ isOpen: true, mode });
  };

  const selectedBook = books.find((b) => b.id === selectedBookId) || books[0];

  return (
    <div className="min-h-screen bg-[#f8fbff] text-[#0b192c] font-sans antialiased selection:bg-sky-200">
      {/* Toast Notification */}
      <Toast message={toastMessage} icon={toastIcon} />

      {/* Main Top Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onBack={handleBack}
        user={user}
        title={
          currentScreen === 'book-details'
            ? selectedBook.title
            : currentScreen === 'wayfinding'
            ? `${selectedBook.location.rack} • ${selectedBook.location.shelf.split(' ')[0]}`
            : undefined
        }
        subtitle={
          currentScreen === 'book-details'
            ? selectedBook.lcCall
            : currentScreen === 'wayfinding'
            ? `${selectedBook.location.floor} • ${selectedBook.location.section}`
            : undefined
        }
        onOpenNotifications={() => setShowNotifications(true)}
      />

      {/* Main Screen Container */}
      <main className="pt-20 px-4 max-w-md mx-auto min-h-[calc(100vh-80px)]">
        {currentScreen === 'home' && (
          <HomeScreen
            books={books}
            user={user}
            onNavigate={handleNavigate}
            onSelectBook={(id) => setSelectedBookId(id)}
            onToggleSave={handleToggleSave}
            onSearchQuery={handleSearchQuery}
            onOpenScanner={handleOpenScanner}
            recentSearches={recentSearches}
            onClearRecentSearches={() => setRecentSearches([])}
            onRemoveRecentSearch={(q) =>
              setRecentSearches((prev) => prev.filter((item) => item !== q))
            }
            onToast={showToast}
          />
        )}

        {currentScreen === 'search' && (
          <SearchScreen
            books={books}
            user={user}
            initialQuery={searchQuery}
            onNavigate={handleNavigate}
            onSelectBook={(id) => setSelectedBookId(id)}
            onToggleSave={handleToggleSave}
            onOpenScanner={handleOpenScanner}
            onToast={showToast}
            onHoldBook={handleHoldBook}
          />
        )}

        {currentScreen === 'book-details' && (
          <BookDetailsScreen
            book={selectedBook}
            user={user}
            onNavigate={handleNavigate}
            onToggleSave={handleToggleSave}
            onOpenScanner={handleOpenScanner}
            onHoldBook={handleHoldBook}
            onToast={showToast}
          />
        )}

        {currentScreen === 'wayfinding' && (
          <WayfindingScreen
            book={selectedBook}
            user={user}
            onNavigate={handleNavigate}
            onOpenScanner={handleOpenScanner}
            onToast={showToast}
          />
        )}

        {currentScreen === 'my-library' && (
          <MyLibraryScreen
            user={user}
            books={books}
            borrowedBooks={borrowedBooks}
            activeHolds={activeHolds}
            onNavigate={handleNavigate}
            onSelectBook={(id) => setSelectedBookId(id)}
            onRenewLoan={handleRenewLoan}
            onCancelHold={handleCancelHold}
            onToggleSave={handleToggleSave}
            recentSearches={recentSearches}
            onClearRecentSearches={() => setRecentSearches([])}
            onRemoveRecentSearch={(q) =>
              setRecentSearches((prev) => prev.filter((item) => item !== q))
            }
            onSearchQuery={handleSearchQuery}
            onToast={showToast}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            user={user}
            onNavigate={handleNavigate}
            onLogout={() =>
              setUser((prev) => ({
                ...prev,
                isLoggedIn: false,
                isGuest: true,
                name: 'Guest Scholar',
              }))
            }
            onToast={showToast}
          />
        )}

        {(currentScreen === 'signin' ||
          currentScreen === 'signup' ||
          currentScreen === 'forgot-password') && (
          <AuthScreens
            screen={currentScreen}
            onNavigate={handleNavigate}
            onLoginSuccess={(newUserData) =>
              setUser((prev) => ({ ...prev, ...newUserData, isLoggedIn: true }))
            }
            onToast={showToast}
            onOpenScanner={() => handleOpenScanner('barcode-scanner')}
          />
        )}
      </main>

      {/* AR Viewfinder & Barcode Scanner Modal */}
      <ARScannerModal
        isOpen={scannerState.isOpen}
        onClose={() => setScannerState((prev) => ({ ...prev, isOpen: false }))}
        mode={scannerState.mode}
        targetBook={selectedBook}
        onSelectBook={(id) => {
          setSelectedBookId(id);
          handleNavigate('book-details');
        }}
        onToast={showToast}
      />

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0284c7] text-[22px]">
                  notifications
                </span>
                <h3 className="font-headline-sm text-base font-bold text-[#0b192c]">
                  Stacks Notifications
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-200/80 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#0284c7] text-[20px] mt-0.5">
                  lock_clock
                </span>
                <div className="min-w-0 flex-1 text-xs">
                  <p className="font-bold text-[#0b192c]">Hold Ready at Locker #14-B</p>
                  <p className="text-slate-600 mt-0.5">
                    Data Structures & Algorithm Analysis is secured. Enter code HL-883-CK9.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">15 minutes ago</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-600 text-[20px] mt-0.5">
                  schedule
                </span>
                <div className="min-w-0 flex-1 text-xs">
                  <p className="font-bold text-amber-950">Loan Due in 4 Days</p>
                  <p className="text-amber-900/80 mt-0.5">
                    Designing Data-Intensive Applications is due Oct 22. Tap to renew.
                  </p>
                  <span className="text-[10px] text-amber-700/60 mt-1 block">2 hours ago</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <span className="material-symbols-outlined text-slate-500 text-[20px] mt-0.5">
                  build
                </span>
                <div className="min-w-0 flex-1 text-xs">
                  <p className="font-bold text-slate-800">Stack Inventory Maintenance</p>
                  <p className="text-slate-600 mt-0.5">
                    Floor 3 Graduate Aisles G1-G4 will undergo RFID re-indexing tonight.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Yesterday</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowNotifications(false);
                showToast('All notifications cleared', 'done_all');
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
            >
              Mark All Read
            </button>
          </div>
        </div>
      )}

      {/* Glacier Bottom Navigation */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        savedCount={user.savedBookIds.length}
      />
    </div>
  );
}
