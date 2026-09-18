import React from 'react';
import { ScreenName, UserProfile } from '../types';
import { LibFindLogo } from './LibFindLogo';

interface HeaderProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  onBack?: () => void;
  user: UserProfile;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onOpenNotifications?: () => void;
  unreadNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onBack,
  user,
  title,
  subtitle,
  actions,
  onOpenNotifications,
  unreadNotifications = true,
}) => {
  const isRootTab = ['home', 'search', 'my-library', 'profile'].includes(currentScreen);
  const isAuthScreen = ['signin', 'signup', 'forgot-password'].includes(currentScreen);

  const getScreenTitle = () => {
    if (title) return title;
    switch (currentScreen) {
      case 'home':
        return 'Home';
      case 'search':
        return 'Search & Stacks';
      case 'my-library':
        return 'My Library';
      case 'profile':
        return 'Student Profile';
      case 'signin':
        return 'Sign In';
      case 'signup':
        return 'Create Account';
      case 'forgot-password':
        return 'Forgot Password';
      case 'wayfinding':
        return 'Precise Wayfinding';
      case 'book-details':
        return 'Book Details';
      default:
        return 'LibFind';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/85 backdrop-blur-xl border-b border-blue-100/70 shadow-[0_2px_12px_rgba(7,36,70,0.04)] pt-safe">
      <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-md mx-auto w-full">
        {/* Left section: Back button or Logo */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!isRootTab && (
            <button
              aria-label="Go back"
              onClick={onBack ? onBack : () => onNavigate('home')}
              className="w-10 h-10 -ml-1.5 rounded-full flex items-center justify-center text-slate-700 hover:text-primary hover:bg-surface-container active:scale-90 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">
                arrow_back_ios_new
              </span>
            </button>
          )}

          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <LibFindLogo size="md" />
            <div className="flex flex-col">
              <span className="font-headline-sm text-lg text-[#0b192c] font-bold tracking-tight leading-none">
                LibFind
              </span>
              {isRootTab && (
                <span className="font-caption text-[11px] font-semibold text-primary tracking-wider uppercase">
                  {currentScreen === 'home'
                    ? 'Home'
                    : currentScreen === 'search'
                    ? 'Catalog'
                    : currentScreen === 'my-library'
                    ? 'My Library'
                    : 'Profile'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center section: only on subpages */}
        {!isRootTab && (
          <div className="flex-1 text-center truncate px-1">
            <span className="font-title-md text-[15px] text-[#0b192c] font-semibold truncate block">
              {getScreenTitle()}
            </span>
            {subtitle && (
              <span className="text-[11px] font-caption text-slate-500 font-medium truncate block">
                {subtitle}
              </span>
            )}
          </div>
        )}

        {/* Right Section: Actions or Notification + Profile */}
        <div className="flex items-center justify-end gap-1.5 shrink-0">
          {actions ? (
            actions
          ) : (
            <>
              {isRootTab && (
                <button
                  aria-label="Notifications"
                  onClick={onOpenNotifications}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-primary hover:bg-blue-50/80 transition-colors relative"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[22px]">notifications</span>
                  {unreadNotifications && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary ring-2 ring-white"></span>
                  )}
                </button>
              )}

              {user.isLoggedIn ? (
                <button
                  aria-label="Student Profile"
                  onClick={() => onNavigate('profile')}
                  className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-primary/30 hover:ring-primary transition-all ml-0.5 active:scale-95"
                >
                  <img
                    alt={user.name}
                    className="w-full h-full object-cover"
                    src={user.avatarUrl}
                  />
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('signin')}
                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm text-white hover:bg-primary-container transition-all"
                  title="Sign In"
                >
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
