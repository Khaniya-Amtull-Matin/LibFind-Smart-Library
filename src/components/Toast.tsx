import React from 'react';

interface ToastProps {
  message: string | null;
  icon?: string;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, icon = 'check_circle' }) => {
  if (!message) return null;

  return (
    <div className="fixed top-20 inset-x-4 z-[9999] pointer-events-none flex justify-center animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-[#0b192c] text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 font-label-telemetry text-[12px] border border-sky-900/70 max-w-sm">
        <span className="material-symbols-outlined text-cyan-300 text-[18px]">
          {icon}
        </span>
        <span className="truncate">{message}</span>
      </div>
    </div>
  );
};
