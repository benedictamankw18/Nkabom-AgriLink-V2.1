import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { APP_LOGO } from '../data/mockData';

interface OnboardingScreenProps {
  onComplete?: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { role, setRole, language, setLanguage, playSpeech, setActiveTab } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>(role || 'farmer');

  const roleConfigs: {
    id: UserRole;
    enTitle: string;
    twBadge: string;
    enDesc: string;
    twDesc: string;
    icon: string;
    speechText: string;
  }[] = [
    {
      id: 'farmer',
      enTitle: 'Farmer',
      twBadge: 'Kuani',
      enDesc: 'Tomato, pepper & fresh crop producers',
      twDesc: 'Ntɔs, mako ne nnɔbae foforɔ duafoɔ',
      icon: 'agriculture',
      speechText: 'Farmer role: Ntɔs, mako ne nnɔbae foforɔ duafoɔ a wɔpɛ sɛ wɔtɔn wɔn nnuane tẽẽ ma aguadifoɔ.',
    },
    {
      id: 'buyer',
      enTitle: 'Bulk Buyer',
      twBadge: 'Tɔfoɔ',
      enDesc: 'Wholesalers, hotel & institution suppliers',
      twDesc: 'Aguadifoɔ a wɔtɔ nnuane kɛseɛ',
      icon: 'shopping_cart_checkout',
      speechText: 'Bulk Buyer role: Wholesalers and hotels buying fresh produce in bulk directly from farms across Ghana.',
    },
    {
      id: 'seller',
      enTitle: 'Market Seller',
      twBadge: 'Aguadifoɔ',
      enDesc: 'Open-market retailers & crate distributors',
      twDesc: 'Dwa so aguadifoɔ ne tɔnfoɔ',
      icon: 'storefront',
      speechText: 'Market Seller role: Open-market traders and crate distributors in Makola, Kejetia, and Techiman markets.',
    },
    {
      id: 'transporter',
      enTitle: 'Transporter',
      twBadge: 'Karatani',
      enDesc: 'Truckers, pickup drivers & fleet haulers',
      twDesc: 'Lorry kafoɔ a wɔde nnuane kɔ gua so',
      icon: 'local_shipping',
      speechText: 'Transporter role: Truckers and pickup drivers hauling crates between rural farms and city wholesale stations.',
    },
  ];

  const handleContinue = () => {
    setRole(selectedRole);
    if (onComplete) {
      onComplete();
    } else {
      setActiveTab('home');
    }
  };

  const currentRoleConfig = roleConfigs.find((r) => r.id === selectedRole) || roleConfigs[0];

  return (
    <div className="min-h-screen bg-[#f8faf4] text-[#191c19] flex flex-col justify-between max-w-lg mx-auto px-4 pt-safe pb-safe pb-8">
      <div className="flex flex-col space-y-4 pt-2">
        {/* Top Audio Prompt Bar */}
        <div className="flex items-center justify-between bg-[#e7e9e3] rounded-full px-4 py-2 mt-1">
          <div className="flex items-center space-x-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2c694e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2c694e]"></span>
            </span>
            <span className="text-xs font-semibold text-[#414940]">
              Spoken Guide • Nne Nkyerɛkyerɛ
            </span>
          </div>
          <button
            onClick={() =>
              playSpeech(
                'Akwaaba to Nkabom AgriLink! Fa wo nnɔbae bata aguadifoɔ pa ho tẽẽ. Please select whether you are a farmer, bulk buyer, market seller, or transporter.',
                'Nkabom AgriLink Introduction'
              )
            }
            aria-label="Play audio introduction"
            className="flex items-center space-x-1.5 bg-[#2c694e] text-white px-3 py-1.5 rounded-full shadow-sm active:scale-95 transition-transform"
          >
            <span
              className="material-symbols-outlined text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              volume_up
            </span>
            <span className="text-xs font-bold">Listen / Tie</span>
          </button>
        </div>

        {/* Branding & Header */}
        <div className="flex flex-col items-center text-center pt-2 pb-1">
          <div className="relative w-20 h-20 mb-3 bg-white rounded-2xl shadow-md flex items-center justify-center p-2 border border-[#edefe9]">
            <img
              alt="Nkabom AgriLink Logo"
              className="w-full h-full object-contain rounded-xl"
              src={APP_LOGO}
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#aeeecb] text-[#316e52] rounded-full p-1 shadow-sm flex items-center justify-center">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                eco
              </span>
            </div>
          </div>
          <h1 className="text-[26px] font-black text-[#013a13] tracking-tight">
            Nkabom AgriLink
          </h1>
          <p className="text-sm text-[#414940] max-w-xs mt-1 font-medium">
            Connect your harvest directly to reliable buyers across Ghana.
          </p>
          <span className="text-xs text-[#2c694e] font-bold mt-0.5">
            Fa wo nnɔbae bata aguadifoɔ pa ho tẽẽ.
          </span>
        </div>

        {/* Language Switcher Pod */}
        <div className="bg-[#edefe9] rounded-2xl p-1.5 shadow-xs">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLanguage('en')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                language === 'en'
                  ? 'bg-white text-[#013a13] shadow-sm'
                  : 'text-[#414940] hover:bg-[#e7e9e3]'
              }`}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={language === 'en' ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                language
              </span>
              <span>English</span>
            </button>
            <button
              onClick={() => setLanguage('tw')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                language === 'tw'
                  ? 'bg-white text-[#013a13] shadow-sm'
                  : 'text-[#414940] hover:bg-[#e7e9e3]'
              }`}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={language === 'tw' ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                record_voice_over
              </span>
              <span>Twi (Akan)</span>
            </button>
          </div>
        </div>

        {/* Role Selection Header */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h2 className="text-[19px] font-bold text-[#191c19]">
              Select who you are
            </h2>
            <p className="text-xs text-[#414940] font-medium">
              Hwan na wo yɛ wɔ gua yi so?
            </p>
          </div>
          <div className="flex items-center space-x-1 bg-[#edefe9] px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-[#013a13] text-base">
              verified_user
            </span>
            <span className="text-xs font-bold text-[#191c19]">Step 1 of 2</span>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="flex flex-col space-y-2.5" role="radiogroup">
          {roleConfigs.map((config) => {
            const isSelected = selectedRole === config.id;
            return (
              <div
                key={config.id}
                onClick={() => setSelectedRole(config.id)}
                role="radio"
                aria-checked={isSelected}
                className={`role-card relative bg-white rounded-2xl p-4 transition-all active:scale-[0.99] cursor-pointer border ${
                  isSelected
                    ? 'shadow-md border-[#013a13] ring-1 ring-[#013a13]'
                    : 'shadow-xs border-transparent hover:border-[#c1c9bd]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`w-13 h-13 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#013a13] text-white shadow-sm'
                          : 'bg-[#e1e3dd] text-[#414940]'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-3xl"
                        style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}
                      >
                        {config.icon}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-[#191c19]">
                          {config.enTitle}
                        </h3>
                        <span className="bg-[#aeeecb] text-[#316e52] text-xs font-bold px-2 py-0.5 rounded-full">
                          {config.twBadge}
                        </span>
                      </div>
                      <p className="text-xs text-[#414940] mt-0.5">
                        {config.enDesc}
                      </p>
                      <p className="text-xs text-[#2c694e] font-semibold">
                        {config.twDesc}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#013a13] text-white shadow-sm'
                          : 'bg-[#edefe9] text-transparent'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">check</span>
                    </div>

                    <button
                      type="button"
                      aria-label={`Listen to ${config.enTitle} description`}
                      onClick={(e) => {
                        e.stopPropagation();
                        playSpeech(config.speechText, `${config.enTitle} Voice Guide`);
                      }}
                      className="w-8 h-8 rounded-full bg-[#edefe9] flex items-center justify-center text-[#013a13] hover:bg-[#e7e9e3] active:scale-90"
                    >
                      <span className="material-symbols-outlined text-base">
                        volume_up
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Value Anchor Pod: Cooperative Badge */}
        <div className="bg-[#aeeecb] rounded-2xl p-3.5 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white text-[#2c694e] flex items-center justify-center shrink-0 shadow-xs">
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              groups
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#002114] truncate">
              Over 14,200 verified farmers connected
            </p>
            <p className="text-[11px] text-[#002114]/80 truncate">
              Direct payments via MTN MoMo, Telecel Cash &amp; Banks
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Zone */}
      <div className="pt-4 space-y-3">
        <button
          onClick={handleContinue}
          className="w-full h-14 bg-[#013a13] hover:bg-[#1e5128] text-white rounded-2xl shadow-lg flex items-center justify-between px-6 active:scale-[0.98] transition-all cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <span
              className="material-symbols-outlined text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <div className="flex flex-col items-start text-left">
              <span className="text-base font-bold leading-tight">
                Continue as {currentRoleConfig.enTitle}
              </span>
              <span className="text-xs text-[#b8f1b9] font-medium leading-tight">
                Kɔ anim sɛ {currentRoleConfig.twBadge}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-2xl">arrow_forward</span>
        </button>

        {/* Toll-Free Emergency / Offline Help Pill */}
        <a
          href="tel:0800247444"
          className="w-full py-3 px-4 bg-[#edefe9] rounded-xl flex items-center justify-center space-x-2 text-[#414940] active:bg-[#e7e9e3] transition-colors"
        >
          <span className="material-symbols-outlined text-xl text-[#2c694e]">
            support_agent
          </span>
          <span className="text-xs font-medium">Need help? Free Call:</span>
          <span className="text-xs text-[#013a13] font-black">0800-AGRI-GH</span>
          <span className="text-[11px] text-[#71796f]">(Toll-Free)</span>
        </a>
      </div>
    </div>
  );
};
