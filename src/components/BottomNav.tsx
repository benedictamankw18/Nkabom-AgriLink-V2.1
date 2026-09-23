import React from 'react';
import { useApp } from '../context/AppContext';
import { NavigationTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();

  const navItems: { id: NavigationTab; labelKey: string; defaultLabel: string; icon: string }[] = [
    { id: 'home', labelKey: 'nav.home', defaultLabel: 'Home', icon: 'home' },
    { id: 'market', labelKey: 'nav.market', defaultLabel: 'Market', icon: 'storefront' },
    { id: 'sell', labelKey: 'nav.sell', defaultLabel: 'Sell', icon: 'add_circle' },
    { id: 'prices', labelKey: 'nav.prices', defaultLabel: 'Prices', icon: 'trending_up' },
    { id: 'profile', labelKey: 'nav.profile', defaultLabel: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 pb-safe bg-[#ffffff]/95 backdrop-blur-xl shadow-[0_-2px_16px_rgba(30,81,40,0.08)] border-t border-[#edefe9]/80">
      <div className="flex items-center justify-around h-20 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          // Special Center elevated "Sell" button
          if (item.id === 'sell') {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab('sell')}
                className="flex flex-col items-center justify-center -mt-6 active:scale-95 transition-transform focus:outline-none cursor-pointer group"
                aria-label="List Produce to Sell"
              >
                <div className="w-14 h-14 rounded-full bg-[#812a00] shadow-[0_4px_14px_rgba(129,42,0,0.38)] flex items-center justify-center text-white group-hover:bg-[#5b1b00] transition-colors">
                  <span
                    className="material-symbols-outlined text-[28px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    add_circle
                  </span>
                </div>
                <span className="text-xs text-[#812a00] mt-1 font-bold tracking-tight">
                  {t(item.labelKey, item.defaultLabel)}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[56px] px-2 transition-all active:scale-95 focus:outline-none cursor-pointer ${
                isActive
                  ? 'text-[#013a13] font-bold'
                  : 'text-[#71796f] hover:text-[#191c19]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="text-xs mt-0.5 font-medium leading-none">
                {t(item.labelKey, item.defaultLabel)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
