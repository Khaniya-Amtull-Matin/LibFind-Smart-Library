import React from 'react';
import { ScreenName } from '../types';

interface BottomNavProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  savedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  savedCount,
}) => {
  // Hide bottom navigation on auth screens to match Stitch designs
  const isAuthScreen = ['signin', 'signup', 'forgot-password'].includes(currentScreen);
  if (isAuthScreen) return null;

  const navItems = [
    {
      id: 'home' as ScreenName,
      label: 'Home',
      icon: 'auto_stories',
      isActive: currentScreen === 'home',
    },
    {
      id: 'search' as ScreenName,
      label: 'Search',
      icon: 'explore',
      isActive: currentScreen === 'search',
    },
    {
      id: 'my-library' as ScreenName,
      label: 'My Library',
      icon: 'local_library',
      isActive: currentScreen === 'my-library',
      badge: savedCount && savedCount > 0 ? savedCount : undefined,
    },
    {
      id: 'profile' as ScreenName,
      label: 'Profile',
      icon: 'badge',
      isActive: currentScreen === 'profile',
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe px-4 pointer-events-none">
      <div className="pointer-events-auto mx-auto mb-2 max-w-md h-16 rounded-2xl bg-white/95 backdrop-blur-2xl border border-sky-200/80 px-2 flex items-center justify-around shadow-[0_8px_30px_rgba(2,132,199,0.12)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            aria-current={item.isActive ? 'page' : undefined}
            onClick={() => onNavigate(item.id)}
            className={`relative flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all duration-200 ${
              item.isActive
                ? 'text-[#0284c7] font-bold'
                : 'text-slate-500 hover:text-[#0b192c]'
            }`}
            type="button"
          >
            {item.isActive ? (
              <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-[#0284c7] shadow-xs animate-in zoom-in-95 duration-150">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {item.icon}
                </span>
              </div>
            ) : (
              <span className="material-symbols-outlined text-[22px]">
                {item.icon}
              </span>
            )}
            <span
              className={`font-caption text-[11px] tracking-tight mt-0.5 ${
                item.isActive ? 'font-semibold text-[#0284c7]' : 'font-medium'
              }`}
            >
              {item.label}
            </span>

            {item.badge && !item.isActive && (
              <span className="absolute top-1 right-2.5 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};
