import React from 'react';
import { useApp } from '../context/AppContext';
import { APP_LOGO, KWAME_AVATAR } from '../data/mockData';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  currentTitle?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTitle, showBack, onBack }) => {
  const {
    activeTab,
    setActiveTab,
    unreadCount,
    role,
    setShowUssdModal,
    setShowRoleModal,
    t,
    language,
  } = useApp();

  const getScreenName = () => {
    if (currentTitle) return currentTitle;
    switch (activeTab) {
      case 'home':
        return t('nav.home', 'Home');
      case 'market':
        return t('nav.market', 'Market');
      case 'sell':
        return t('nav.sell', 'List Produce');
      case 'prices':
        return t('nav.prices', 'Market Rates');
      case 'profile':
        return t('nav.profile', 'Profile');
      case 'notifications':
        return t('nav.notifications', 'Notifications');
      default:
        return t('nav.home', 'Home');
    }
  };

  const getRoleDisplayName = () => {
    switch (role) {
      case 'farmer':
        return t('role.farmer', 'Farmer');
      case 'buyer':
        return t('role.buyer', 'Buyer');
      case 'transporter':
        return t('role.transporter', 'Hauler');
      case 'processor':
        return t('role.processor', 'Processor');
      case 'admin':
        return t('role.admin', 'Admin');
      default:
        return role;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 pt-safe bg-[#f8faf4]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#edefe9]/60">
      <div className="h-16 max-w-lg mx-auto px-3 sm:px-4 flex items-center justify-between gap-1.5">
        {/* Left: Back button (if modal/subpage) or Logo & App Name */}
        <div className="flex items-center gap-2 min-w-0 flex-shrink">
          {showBack ? (
            <button
              onClick={onBack || (() => setActiveTab('home'))}
              aria-label="Go back"
              className="w-9 h-9 -ml-1 flex items-center justify-center text-[#013a13] rounded-full hover:bg-[#edefe9] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : (
            <img
              alt="Nkabom AgriLink Logo"
              className="h-8 w-8 object-contain rounded-full flex-shrink-0 shadow-2xs"
              src={APP_LOGO}
              referrerPolicy="no-referrer"
            />
          )}

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[16px] sm:text-[18px] text-[#013a13] truncate leading-tight">
                Nkabom
              </span>
              <span className="hidden xs:inline text-[#414940] text-xs font-semibold truncate">
                • {getScreenName()}
              </span>
            </div>
            <span className="xs:hidden text-[#414940] text-[11px] font-semibold truncate leading-tight">
              {getScreenName()}
            </span>
          </div>
        </div>

        {/* Right Action Icons: Language Switcher, USSD Dialer, Role Switcher, Notifications Bell, Profile Avatar */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {/* Language Switcher Toggle */}
          <LanguageSwitcher />

          {/* USSD Gateway Simulator Button (*920*44#) */}
          <button
            onClick={() => setShowUssdModal(true)}
            className="px-1.5 sm:px-2 py-1 rounded-full bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#013a13] text-[10px] sm:text-[11px] font-mono font-bold flex items-center gap-0.5 border border-[#c1c9bd]/70 active:scale-95 transition-transform cursor-pointer"
            title={language === 'tw' ? 'Bɔ *920*44# USSD' : 'Dial *920*44# USSD Gateway'}
          >
            <span className="material-symbols-outlined text-[13px] sm:text-[14px]">dialpad</span>
            <span className="hidden xxs:inline">*920#</span>
          </button>

          {/* Role Persona Switcher Button */}
          <button
            onClick={() => setShowRoleModal(true)}
            className="px-1.5 sm:px-2 py-1 rounded-full bg-[#013a13] hover:bg-[#1e5128] text-white text-[10px] sm:text-[11px] font-bold flex items-center gap-0.5 active:scale-95 transition-transform cursor-pointer capitalize shadow-xs"
            title={language === 'tw' ? 'Sesa Wo Dwuma' : 'Switch User Role Persona'}
          >
            <span className="material-symbols-outlined text-[13px] sm:text-[14px]">badge</span>
            <span className="hidden md:inline">{getRoleDisplayName()}</span>
          </button>

          {/* Notifications shortcut with unread badge */}
          <button
            onClick={() => setActiveTab('notifications')}
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#013a13] hover:bg-[#edefe9] active:scale-90 transition-all"
            aria-label={language === 'tw' ? 'Hwɛ nkratoɔ' : 'View notifications'}
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[22px]">
              {unreadCount > 0 ? 'notifications_active' : 'notifications'}
            </span>
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#812a00] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-[#f8faf4]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Kwame Avatar Profile Shortcut */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden ring-2 transition-transform active:scale-95 ${
              activeTab === 'profile' ? 'ring-[#013a13]' : 'ring-transparent hover:ring-[#2c694e]/40'
            }`}
            aria-label={language === 'tw' ? 'Kɔ Wo Ho Nsɛm' : 'Go to Profile'}
          >
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src={KWAME_AVATAR}
            />
          </button>
        </div>
      </div>
    </header>
  );
};

