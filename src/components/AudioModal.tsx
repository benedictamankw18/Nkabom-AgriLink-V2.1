import React from 'react';
import { useApp } from '../context/AppContext';

export const AudioModal: React.FC = () => {
  const { isPlayingAudio, audioTitle, audioScript, stopSpeech, language } = useApp();

  if (!isPlayingAudio) return null;

  return (
    <div className="fixed inset-x-4 bottom-24 z-50 max-w-md mx-auto p-4 rounded-3xl bg-[#2e312d] text-[#eff1eb] shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200 border border-[#71796f]/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#9cd49e] animate-ping"></span>
          <span className="text-sm font-bold text-[#9cd49e]">
            {audioTitle || 'Speaking Voice Summary...'}
          </span>
        </div>
        <button
          onClick={stopSpeech}
          aria-label="Close audio"
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#eff1eb] hover:bg-white/20 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <p className="text-xs text-[#eff1eb]/90 leading-relaxed font-normal">
        "{audioScript}"
      </p>

      {/* Visual Audio Equalizer Animation */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-4 bg-[#9cd49e] rounded-full animate-pulse"></span>
          <span className="w-1.5 h-7 bg-[#9cd49e] rounded-full animate-bounce [animation-delay:0.15s]"></span>
          <span className="w-1.5 h-5 bg-[#9cd49e] rounded-full animate-pulse [animation-delay:0.3s]"></span>
          <span className="w-1.5 h-8 bg-[#9cd49e] rounded-full animate-bounce [animation-delay:0.1s]"></span>
          <span className="w-1.5 h-3 bg-[#9cd49e] rounded-full animate-pulse [animation-delay:0.25s]"></span>
          <span className="text-[11px] text-[#eff1eb]/70 ml-2">
            {language === 'tw' ? 'Kasa mmoa retwe' : 'Playing audio assist'}
          </span>
        </div>

        <button
          onClick={stopSpeech}
          className="px-3 py-1.5 rounded-full bg-[#9cd49e] text-[#002108] text-xs font-bold active:scale-95 transition-transform"
        >
          {language === 'tw' ? 'Gyae • Pause' : 'Pause'}
        </button>
      </div>
    </div>
  );
};
