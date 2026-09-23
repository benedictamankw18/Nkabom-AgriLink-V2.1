import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, NavigationTab } from '../types';

export const RoleSwitcherModal: React.FC = () => {
  const { showRoleModal, setShowRoleModal, role, setRole, showToast, playSpeech, setActiveTab } = useApp();

  if (!showRoleModal) return null;

  const roles: {
    id: UserRole;
    title: string;
    persona: string;
    location: string;
    description: string;
    badge: string;
    icon: string;
    primaryActionTab: NavigationTab;
  }[] = [
    {
      id: 'farmer',
      title: 'Farmer (Producer)',
      persona: 'Kwame Mensah',
      location: 'Mankessim, Central Region',
      description: 'Lists expected/ready tomato harvests, monitors farmgate vs wholesale prices, and receives buyer pre-commitments.',
      badge: 'Primary Beneficiary',
      icon: 'agriculture',
      primaryActionTab: 'home',
    },
    {
      id: 'buyer',
      title: 'Buyer / Market Seller',
      persona: 'Ama Serwaa',
      location: 'Makola Market & Kasoa Hub',
      description: 'Browses fresh produce, submits pre-harvest commitments to secure supply before harvest, and coordinates shared freight.',
      badge: 'Aggregator / Trader',
      icon: 'storefront',
      primaryActionTab: 'market',
    },
    {
      id: 'processor',
      title: 'Food Processor',
      persona: 'Ghana Agro Foods Ltd',
      location: 'Awutu Senya Industrial Park',
      description: 'Off-takes bulk industrial crates of Roma & Petome tomatoes for puree and paste processing under firm pre-harvest contracts.',
      badge: 'Bulk Off-taker',
      icon: 'factory',
      primaryActionTab: 'market',
    },
    {
      id: 'transporter',
      title: 'Transport Provider',
      persona: 'Kofi Haulage Logistics',
      location: 'Mankessim - Kasoa - Accra Corridor',
      description: 'Coordinates 3-ton trucks and tricycles, combines smallholder loads into shared haulage trips, and updates route tracking.',
      badge: 'Logistics Partner',
      icon: 'local_shipping',
      primaryActionTab: 'home',
    },
    {
      id: 'admin',
      title: 'System Administrator',
      persona: 'Central AgriLink Command',
      location: 'Cape Coast Regional HQ',
      description: 'Monitors market transactions, post-harvest loss avoidance statistics, price transparency, and user verification.',
      badge: 'Platform Oversight',
      icon: 'admin_panel_settings',
      primaryActionTab: 'profile',
    },
  ];

  const handleSelectRole = (r: typeof roles[0]) => {
    setRole(r.id);
    setShowRoleModal(false);
    showToast(`Switched perspective to ${r.title} (${r.persona})`);
    playSpeech(
      `Switched to ${r.title}: ${r.persona} in ${r.location}.`,
      'Role Perspective Changed'
    );
    setActiveTab(r.primaryActionTab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] p-5 shadow-2xl border border-[#edefe9] max-h-[90vh] overflow-y-auto flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#edefe9]">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-2xl bg-[#013a13] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">badge</span>
            </span>
            <div>
              <h2 className="text-base font-black text-[#013a13]">
                Switch Stakeholder Perspective
              </h2>
              <p className="text-[11px] text-[#414940]">
                SRS Section 8: User Roles &amp; Permissions Simulation
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowRoleModal(false)}
            className="w-8 h-8 rounded-full bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#414940] flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Roles List */}
        <div className="flex flex-col gap-2.5">
          {roles.map((item) => {
            const isSelected = role === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectRole(item)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative ${
                  isSelected
                    ? 'bg-[#eaf2e4] border-[#013a13] shadow-xs'
                    : 'bg-[#fcfdfa] hover:bg-[#f4f7ee] border-[#e1e3dd]'
                }`}
              >
                <span
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    isSelected
                      ? 'bg-[#013a13] text-white'
                      : 'bg-[#edefe9] text-[#2c694e]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs font-black text-[#191c19] truncate">
                      {item.title}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#2c694e] border border-[#cbe0c5] flex-shrink-0">
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold text-[#013a13] flex items-center gap-1 mt-0.5">
                    <span>{item.persona}</span>
                    <span className="text-[#c1c9bd]">•</span>
                    <span className="text-[#71796f] font-normal">{item.location}</span>
                  </p>

                  <p className="text-[11px] text-[#414940] mt-1 leading-snug line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {isSelected && (
                  <span className="material-symbols-outlined text-[#013a13] text-[20px] self-center">
                    check_circle
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-[#f2f4ee] rounded-2xl border border-[#edefe9] text-[11px] text-[#414940] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#013a13] text-[18px] flex-shrink-0">
            info
          </span>
          <span>
            Nkabom AgriLink pilot enables mutual transparency across smallholder farmers, aggregators, processors, and haulage drivers.
          </span>
        </div>
      </div>
    </div>
  );
};
