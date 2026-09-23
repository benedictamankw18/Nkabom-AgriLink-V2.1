import React from 'react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#2e312d] text-[#eff1eb] px-5 py-3 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2 pointer-events-none transition-all animate-in fade-in zoom-in-95 duration-200 border border-[#71796f]/40 max-w-[90vw]">
      <span
        className="material-symbols-outlined text-[18px] text-[#9cd49e]"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        check_circle
      </span>
      <span className="truncate">{toastMessage}</span>
    </div>
  );
};
