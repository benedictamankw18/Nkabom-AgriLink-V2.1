import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KWAME_AVATAR } from '../data/mockData';
import { EscrowStatus } from '../components/EscrowStatus';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export const ProfileScreen: React.FC = () => {
  const {
    language,
    setLanguage,
    smsMode,
    setSmsMode,
    voiceGuidesEnabled,
    setVoiceGuidesEnabled,
    playSpeech,
    showToast,
    setActiveTab,
    role,
    setShowRoleModal,
    setShowUssdModal,
    t,
  } = useApp();

  const [isProfileQrOpen, setIsProfileQrOpen] = useState(false);

  const handleDownloadStatement = () => {
    showToast('Statement sent to +233 24 582 9104 via SMS & PDF!');
    playSpeech(
      'Your harvest statement for 2024 has been compiled and dispatched to your MTN Mobile Money phone number.',
      'Statement Dispatched',
      'Wo 2024 nnuane ho nkratoɔ nyinaa aboa ano na wɔde amaneɛ kɔ wo MTN MoMo nɔmba so.'
    );
  };

  const handleAudioBio = () => {
    playSpeech(
      'Kwame Mensah, level 3 verified producer at Asempa Farms, Techiman. 98 percent on-time harvest rate, with total earnings of 24,650 Cedis this season.',
      'Kwame Mensah Profile Bio',
      'Kwame Mensah, kuani a wagye atom wɔ Asempa Farms, Techiman. Bere a wode twa nnuane no yɛ ɔha nkyekyem aduokron awotwe (98%), na wanya sika GHS 24,650 wɔ saa bere yi mu.'
    );
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto px-4 pt-16 pb-28 gap-4 bg-[#f8faf4] min-h-screen">
      {/* Farmer Identity Card */}
      <div className="w-full bg-white rounded-3xl p-4 shadow-xs relative overflow-hidden border border-[#edefe9]">
        <div className="absolute -right-10 -top-10 w-36 h-36 bg-[#aeeecb]/40 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-start gap-4 relative z-10">
          {/* Large Avatar with Verified Checkmark Ring */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#2c694e] to-[#b8f1b9] flex items-center justify-center shadow-md">
              <img
                alt="Kwame Mensah Avatar"
                className="w-full h-full rounded-full object-cover bg-[#d8dbd5]"
                src={KWAME_AVATAR}
              />
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#013a13] text-white rounded-full flex items-center justify-center shadow-xs"
              title="Verified Producer"
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
          </div>

          {/* Identity Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h2 className="text-[20px] font-black text-[#191c19] truncate">
                Kwame Mensah
              </h2>
              <button
                onClick={handleAudioBio}
                aria-label="Listen to Profile Details"
                className="w-9 h-9 rounded-full bg-[#aeeecb]/60 text-[#2c694e] flex items-center justify-center hover:bg-[#aeeecb] transition-transform active:scale-90 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">volume_up</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-semibold text-[#414940] truncate">
                +233 24 582 9104
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#aeeecb] text-[#316e52] text-[10px] font-bold gap-1 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2c694e]"></span>
                MoMo Linked
              </span>
            </div>

            <p className="text-xs text-[#414940] flex items-center gap-1 mt-1 truncate font-medium">
              <span className="material-symbols-outlined text-[16px] text-[#71796f] flex-shrink-0">
                location_on
              </span>
              <span>Asempa Farms, Techiman (Bono East)</span>
            </p>
          </div>
        </div>

        {/* Farmer Verified Level Badge */}
        <div className="mt-4 pt-1">
          <div className="w-full bg-[#f2f4ee] rounded-2xl p-3 flex items-center gap-2.5 text-[#191c19] border border-[#edefe9]">
            <span
              className="text-[#812a00] material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              stars
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#013a13] leading-tight truncate">
                Level 3 Verified Producer • 98% On-Time Harvest
              </p>
              <p className="text-[11px] text-[#414940] truncate font-medium">
                Akuafoɔ Pa Da Nso • Top Rated Seller
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Income Summary Card */}
      <div className="w-full bg-white rounded-3xl p-4 shadow-xs border border-[#edefe9]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#b8f1b9] flex items-center justify-center text-[#013a13]">
              <span className="material-symbols-outlined text-[20px]">
                account_balance_wallet
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#191c19] leading-tight">
                Income Summary
              </h3>
              <p className="text-[11px] text-[#414940]">
                Sika A W'anya W'afum (This Season)
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#b8f1b9] text-[#002108] text-[11px] font-bold">
            2024 Season
          </span>
        </div>

        {/* Big Figure */}
        <div className="bg-[#f2f4ee] rounded-2xl p-4 flex flex-col justify-center my-2 relative overflow-hidden border border-[#edefe9]">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-3 translate-y-3">
            <span className="material-symbols-outlined text-[96px] text-[#013a13]">
              payments
            </span>
          </div>
          <span className="text-xs text-[#414940] uppercase tracking-wider font-bold">
            Total Earned This Season
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-[32px] font-black text-[#013a13] tracking-tight">
              GHS 24,650
            </span>
          </div>
          <p className="text-xs text-[#2c694e] flex items-center gap-1 mt-1 font-semibold">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>All settled directly via MTN Mobile Money</span>
          </p>
        </div>

        {/* Supporting Metrics */}
        <div className="grid grid-cols-2 gap-2.5 my-2">
          <div className="bg-[#e7e9e3] rounded-2xl p-3 flex flex-col">
            <span className="text-xs text-[#414940] font-medium">Produce Sold</span>
            <span className="text-[18px] font-black text-[#191c19] mt-0.5">
              168 Crates
            </span>
            <span className="text-[11px] text-[#414940] mt-0.5 font-medium">
              Tomatoes &amp; Peppers
            </span>
          </div>

          <div className="bg-[#e7e9e3] rounded-2xl p-3 flex flex-col">
            <span className="text-xs text-[#414940] font-medium">
              Average Received
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[18px] font-black text-[#013a13]">GHS 147</span>
              <span className="text-[11px] text-[#414940]">/ crate</span>
            </div>
            <span className="text-[11px] text-[#2c694e] font-bold mt-0.5 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">
                trending_up
              </span>
              +GHS 9 vs Market (GHS 138)
            </span>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          <button
            onClick={() => setIsProfileQrOpen(true)}
            className="w-full h-12 bg-[#013a13] hover:bg-[#1e5128] text-white rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 active:scale-[0.99] transition-transform shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
            <span>{t('escrow.generateQr', 'Generate QR Code')}</span>
          </button>

          <button
            onClick={handleDownloadStatement}
            className="w-full h-12 bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#013a13] rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform shadow-xs cursor-pointer border border-[#c1c9bd]/50"
          >
            <span className="material-symbols-outlined text-[20px]">sms</span>
            <span>SMS Statement</span>
          </button>
        </div>
      </div>

      {/* Escrow Status & Payment Protection Progress */}
      <EscrowStatus
        externalOpenQr={isProfileQrOpen}
        onCloseExternalQr={() => setIsProfileQrOpen(false)}
      />

      {/* Monthly Sales Bar Chart */}
      <div className="w-full bg-white rounded-3xl p-4 shadow-xs border border-[#edefe9]">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold text-[#191c19]">
              Monthly Sales Growth
            </h3>
            <p className="text-[11px] text-[#414940]">Bosome Biara Akontaabu</p>
          </div>
          <span className="material-symbols-outlined text-[#71796f] text-[20px]">
            bar_chart
          </span>
        </div>

        {/* Visual Bar Representation */}
        <div className="pt-6 pb-2 px-2">
          <div className="grid grid-cols-4 gap-3 items-end h-40">
            {/* Jan */}
            <div className="flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[11px] text-[#414940] font-semibold">4.2k</span>
              <div
                className="w-full bg-[#edefe9] rounded-t-xl relative flex items-end justify-center transition-all duration-500"
                style={{ height: '48%' }}
              >
                <div className="w-full bg-[#e1e3dd] rounded-t-xl h-full"></div>
              </div>
              <span className="text-xs text-[#414940] font-bold">Jan</span>
            </div>

            {/* Feb */}
            <div className="flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[11px] text-[#414940] font-semibold">5.8k</span>
              <div
                className="w-full bg-[#edefe9] rounded-t-xl relative flex items-end justify-center transition-all duration-500"
                style={{ height: '66%' }}
              >
                <div className="w-full bg-[#e1e3dd] rounded-t-xl h-full"></div>
              </div>
              <span className="text-xs text-[#414940] font-bold">Feb</span>
            </div>

            {/* Mar */}
            <div className="flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[11px] text-[#414940] font-semibold">6.1k</span>
              <div
                className="w-full bg-[#edefe9] rounded-t-xl relative flex items-end justify-center transition-all duration-500"
                style={{ height: '70%' }}
              >
                <div className="w-full bg-[#e1e3dd] rounded-t-xl h-full"></div>
              </div>
              <span className="text-xs text-[#414940] font-bold">Mar</span>
            </div>

            {/* Apr (Current) */}
            <div className="flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[11px] font-black text-[#013a13]">8.5k</span>
              <div
                className="w-full bg-[#013a13]/20 rounded-t-xl relative flex items-end justify-center transition-all duration-500"
                style={{ height: '100%' }}
              >
                <div className="w-full bg-[#013a13] rounded-t-xl h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/15 to-transparent"></div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#013a13]"></span>
                <span className="text-xs font-black text-[#013a13]">Apr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trend Note Callout */}
        <div className="mt-3 p-3 bg-[#aeeecb]/40 rounded-2xl flex items-center gap-3 border border-[#2c694e]/20">
          <div className="w-9 h-9 rounded-full bg-[#2c694e] text-white flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">trending_up</span>
          </div>
          <p className="text-xs text-[#002114] leading-tight">
            <strong className="text-[#2c694e] font-bold">+32% earnings increase</strong>{' '}
            using direct buyer matching without middleman cuts.
          </p>
        </div>
      </div>

      {/* Settings & Accessibility Section */}
      <div className="w-full bg-white rounded-3xl p-4 shadow-xs border border-[#edefe9]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-[#191c19]">
            Settings &amp; Accessibility
          </h3>
          <span className="text-xs text-[#71796f]">Nkabom Settings</span>
        </div>

        <div className="space-y-2.5">
          {/* Stakeholder Role Persona */}
          <div className="flex items-center justify-between p-3 bg-[#f2f4ee] rounded-2xl min-h-[56px] border border-[#edefe9]">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-full bg-[#013a13] flex items-center justify-center text-white flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">badge</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#191c19] truncate">
                  Stakeholder Persona
                </p>
                <p className="text-xs text-[#2c694e] font-bold capitalize truncate">
                  Current: {role}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowRoleModal(true)}
              className="px-3.5 h-10 rounded-full bg-[#013a13] text-white text-xs font-bold hover:bg-[#1e5128] active:scale-95 transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-xs"
            >
              <span>Switch Role</span>
              <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
            </button>
          </div>

          {/* USSD Simulator */}
          <div className="flex items-center justify-between p-3 bg-[#f2f4ee] rounded-2xl min-h-[56px] border border-[#edefe9]">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-full bg-[#e1e3dd] flex items-center justify-center text-[#013a13] flex-shrink-0 font-mono font-bold">
                <span className="material-symbols-outlined text-[20px]">dialpad</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#191c19] truncate">
                  Offline USSD Mode (*920*44#)
                </p>
                <p className="text-xs text-[#414940] truncate">
                  Simulate feature phone &amp; low-bandwidth access
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowUssdModal(true)}
              className="px-3.5 h-10 rounded-full bg-[#e1e3dd] text-[#013a13] text-xs font-mono font-bold hover:bg-[#d8dbd5] active:scale-95 transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
            >
              <span>Dial</span>
              <span className="material-symbols-outlined text-[16px]">call</span>
            </button>
          </div>

          {/* App Language */}
          <div className="flex items-center justify-between p-3 bg-[#f2f4ee] rounded-2xl min-h-[56px] border border-[#edefe9]">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-full bg-[#e1e3dd] flex items-center justify-center text-[#013a13] flex-shrink-0">
                <span className="material-symbols-outlined text-[22px]">translate</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#191c19] truncate">
                  App Language • Kasa
                </p>
                <p className="text-xs text-[#414940] truncate">
                  {language === 'en'
                    ? 'English (Ghana) active'
                    : 'Akan Twi active (Ghana)'}
                </p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>

          {/* Voice Assistance */}
          <div className="flex items-center justify-between p-3 bg-[#f2f4ee] rounded-2xl min-h-[56px] border border-[#edefe9]">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-full bg-[#e1e3dd] flex items-center justify-center text-[#2c694e] flex-shrink-0">
                <span className="material-symbols-outlined text-[22px]">
                  record_voice_over
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#191c19] truncate">
                  Voice Assistance &amp; Guides
                </p>
                <p className="text-xs text-[#414940] truncate">
                  {voiceGuidesEnabled ? 'Always Read Aloud [ON]' : 'Guides Muted [OFF]'}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={voiceGuidesEnabled}
                onChange={(e) => {
                  setVoiceGuidesEnabled(e.target.checked);
                  showToast(
                    e.target.checked
                      ? 'Voice guides enabled'
                      : 'Voice guides muted'
                  );
                }}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-[#c1c9bd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-5 after:transition-all peer-checked:bg-[#2c694e]"></div>
            </label>
          </div>

          {/* SMS Backup Mode */}
          <div className="flex items-center justify-between p-3 bg-[#f2f4ee] rounded-2xl min-h-[56px] border border-[#edefe9]">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-full bg-[#e1e3dd] flex items-center justify-center text-[#013a13] flex-shrink-0">
                <span className="material-symbols-outlined text-[22px]">
                  perm_phone_msg
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#191c19] truncate">
                  SMS Backup Mode
                </p>
                <p className="text-xs text-[#414940] truncate">
                  {smsMode ? 'Active for offline deals [ON]' : 'Disabled [OFF]'}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={smsMode}
                onChange={(e) => {
                  setSmsMode(e.target.checked);
                  showToast(
                    e.target.checked
                      ? 'SMS offline backup active'
                      : 'SMS offline backup paused'
                  );
                }}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-[#c1c9bd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-5 after:transition-all peer-checked:bg-[#013a13]"></div>
            </label>
          </div>

          {/* Hotline Free Call */}
          <a
            href="tel:0800247444"
            className="flex items-center justify-between p-3 bg-[#f2f4ee] rounded-2xl min-h-[56px] hover:bg-[#e7e9e3] transition-colors active:scale-[0.99] border border-[#edefe9]"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-full bg-[#ffdbcf] flex items-center justify-center text-[#812a00] flex-shrink-0">
                <span className="material-symbols-outlined text-[22px]">
                  support_agent
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#191c19] truncate">
                  Extension Officer Hotline
                </p>
                <p className="text-xs text-[#2c694e] font-black truncate">
                  0800-AGRI-GH (Free Call)
                </p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#aeeecb] text-[#2c694e] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">call</span>
            </div>
          </a>

          {/* Switch Role or Run Setup */}
          <button
            onClick={() => setActiveTab('onboarding')}
            className="w-full h-12 bg-[#edefe9] hover:bg-[#e7e9e3] text-[#013a13] rounded-2xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer border border-[#c1c9bd]/50"
          >
            <span className="material-symbols-outlined text-[20px]">switch_account</span>
            <span>Switch Role or Language (Kuani / Tɔfoɔ)</span>
          </button>

          {/* Log Out Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                showToast('Signed out of session safely.');
                setActiveTab('onboarding');
              }}
              className="w-full h-14 bg-[#ffdad6] hover:bg-[#ffdad6]/80 text-[#93000a] rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">logout</span>
              <span>Log Out (Gyae Mu)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
