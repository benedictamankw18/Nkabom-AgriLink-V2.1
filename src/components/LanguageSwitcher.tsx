import React from 'react';
import { useApp } from '../context/AppContext';
import { AppLanguage } from '../types';

interface LanguageSwitcherProps {
  variant?: 'header' | 'compact' | 'dropdown';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { language, setLanguage, playSpeech, showToast, t } = useApp();

  const handleSelectLanguage = (newLang: AppLanguage) => {
    if (newLang === language) return;

    setLanguage(newLang);

    if (newLang === 'tw') {
      showToast('Kasa no asesa akɔ Akan Twi mu 🇬🇭');
      playSpeech(
        'Akwaaba! Woasesa kasa no akɔ Akan Twi mu. Seesei mmoa ne nkratoɔ nyinaa bɛba Twi mu.',
        'Kasa Sesa • Akan Twi'
      );
    } else {
      showToast('Language switched to English 🇬🇧');
      playSpeech(
        'Language switched to English. App menus, notifications, and voice assistance are now in English.',
        'Language Updated • English'
      );
    }
  };

  const handleToggle = () => {
    const nextLang: AppLanguage = language === 'en' ? 'tw' : 'en';
    handleSelectLanguage(nextLang);
  };

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer border ${
          language === 'tw'
            ? 'bg-[#013a13] text-white border-[#013a13]'
            : 'bg-[#f2f4ee] text-[#013a13] border-[#c1c9bd]/70'
        } ${className}`}
        title={language === 'tw' ? 'Sesa kɔ Borɔfo mu (Switch to English)' : 'Switch to Akan Twi (Sesa kɔ Twi mu)'}
        aria-label="Toggle language between English and Twi"
      >
        <span className="text-[12px]">🇬🇭</span>
        <span>{language === 'tw' ? 'TWI' : 'EN'}</span>
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-full bg-[#f2f4ee] border border-[#c1c9bd]/80 shadow-2xs ${className}`}
      role="group"
      aria-label="Language selector"
    >
      {/* English button */}
      <button
        type="button"
        onClick={() => handleSelectLanguage('en')}
        className={`px-2 py-0.5 rounded-full text-[11px] font-black tracking-tight transition-all active:scale-95 cursor-pointer flex items-center gap-1 ${
          language === 'en'
            ? 'bg-[#013a13] text-white shadow-xs'
            : 'text-[#566053] hover:text-[#191c19]'
        }`}
        title="Switch to English"
        aria-pressed={language === 'en'}
      >
        <span>EN</span>
      </button>

      {/* Twi button with Ghana flag badge */}
      <button
        type="button"
        onClick={() => handleSelectLanguage('tw')}
        className={`px-2 py-0.5 rounded-full text-[11px] font-black tracking-tight transition-all active:scale-95 cursor-pointer flex items-center gap-1 ${
          language === 'tw'
            ? 'bg-[#013a13] text-white shadow-xs'
            : 'text-[#566053] hover:text-[#191c19]'
        }`}
        title="Sesa kɔ Akan Twi mu"
        aria-pressed={language === 'tw'}
      >
        <span>TWI</span>
      </button>
    </div>
  );
};
