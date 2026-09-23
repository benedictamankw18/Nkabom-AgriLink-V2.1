import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AgroWeatherForecast } from '../components/AgroWeatherForecast';
import { YieldOptimization } from '../components/YieldOptimization';
import { DemandAnalytics } from '../components/DemandAnalytics';
import { FarmingTips } from '../components/FarmingTips';

export const HomeScreen: React.FC = () => {
  const {
    setActiveTab,
    offers,
    acceptOffer,
    playSpeech,
    setSelectedProduce,
    produceList,
    setShowUssdModal,
    setShowRoleModal,
    role,
    language,
    t,
  } = useApp();
  const [acceptedDeals, setAcceptedDeals] = useState<Record<string, boolean>>({});

  const mainCrop = produceList[0];

  const handleAccept = (e: React.MouseEvent, offerId: string, buyerName: string) => {
    e.stopPropagation();
    setAcceptedDeals((prev) => ({ ...prev, [offerId]: true }));
    acceptOffer(offerId);
    playSpeech(
      `Deal accepted for ${buyerName}! Produce locked for today's pickup. SMS confirmation sent.`,
      'Deal Accepted • Apam Asie',
      `Woagye ${buyerName} apam no atom! Woato nnuane no mu ma nnɛ fa. SMS nkratoɔ nso akɔ.`
    );
  };

  const handleListenDashboard = () => {
    playSpeech(
      'Welcome Kwame Mensah! Techiman Yam and Tomato belt. High tomato demand in Kasoa and Makola selling up to 180 Cedis. You have 2 pending buyer offers: Ama Serwaa wants 30 crates at 160 Cedis, and David Osei wants 15 crates at 155 Cedis.',
      'Dashboard Audio Summary',
      'Akwaaba Kwame Mensah! Techiman ne Assin Fosu ntɔs kuo. Dodoɔ kɛseɛ wɔ Kasoa ne Makola gua so, kɛntɛn boɔ duru GHS 180 nnɛ. Woanya atɔfoɔ apam mmienu: Ama Serwaa pɛ nkɛntɛn aduasa, na David Osei pɛ nkɛntɛn dunum. Sika no bɛba wo MoMo so.'
    );
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto px-4 pt-16 pb-28 gap-5 bg-[#f8faf4] min-h-screen">
      {/* Top Greeting & Location Bar */}
      <div className="flex flex-col gap-1 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#aeeecb] text-[#316e52]">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                waving_hand
              </span>
            </span>
            <span className="text-xs text-[#2c694e] uppercase tracking-wider font-extrabold">
              Akwaaba
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b1f0ce] text-[#002114] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#2c694e] animate-ping"></span>
            <span className="text-xs font-bold">Online • Sync Active</span>
          </div>
        </div>

        <h1 className="text-[26px] font-black text-[#013a13] tracking-tight leading-tight">
          Kwame Mensah!
        </h1>

        <div className="flex items-center gap-1.5 text-[#414940] text-xs font-medium">
          <span className="material-symbols-outlined text-[#812a00] text-[18px]">
            location_on
          </span>
          <span>Central Region Pilot Hub • Mankessim &amp; Assin Fosu</span>
          <span className="text-[#c1c9bd]">•</span>
          <span className="text-[#013a13] font-bold">Tomato Loss Reduction</span>
        </div>
      </div>

      {/* Central Pilot & USSD Offline Bar */}
      <div className="p-3.5 bg-white rounded-3xl border border-[#edefe9] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#013a13] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">psychology</span>
            </span>
            <div>
              <span className="text-xs font-black text-[#191c19] block">
                Central Region Tomato Pilot
              </span>
              <span className="text-[11px] text-[#2c694e] font-semibold">
                Post-Harvest Loss Target: &lt;10%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowUssdModal(true)}
              className="px-2.5 py-1 rounded-full bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#013a13] text-xs font-mono font-bold flex items-center gap-1 border border-[#c1c9bd] cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[14px]">dialpad</span>
              <span>*920#</span>
            </button>
            <button
              onClick={() => setShowRoleModal(true)}
              className="px-2.5 py-1 rounded-full bg-[#013a13] text-white text-xs font-bold flex items-center gap-1 capitalize cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[14px]">badge</span>
              <span>{role}</span>
            </button>
          </div>
        </div>

        {/* Real-Time Pilot Impact Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="p-2.5 bg-[#f8faf4] rounded-2xl border border-[#e1e3dd]">
            <span className="text-[10px] text-[#71796f] uppercase font-bold block">
              Spoilage Loss Rate
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-black text-[#013a13]">9.4%</span>
              <span className="text-[10px] text-[#2c694e] font-bold">(-28.6% vs Nat'l)</span>
            </div>
            <span className="text-[10px] text-[#414940] block mt-0.5">
              Target: Reduce tomato wastage
            </span>
          </div>

          <div className="p-2.5 bg-[#f8faf4] rounded-2xl border border-[#e1e3dd]">
            <span className="text-[10px] text-[#71796f] uppercase font-bold block">
              Pre-Commitment Ratio
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-black text-[#013a13]">84%</span>
              <span className="text-[10px] text-[#2c694e] font-bold">Sold pre-harvest</span>
            </div>
            <span className="text-[10px] text-[#414940] block mt-0.5">
              Logistics matched prior to cutting
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Demand Alert Banner */}
      <div
        onClick={() => setActiveTab('prices')}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#5b1b00] to-[#812a00] text-white shadow-xl active:scale-[0.99] transition-transform cursor-pointer border border-[#812a00]/50"
      >
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none"></div>

        <div className="p-5 flex flex-col gap-3 relative z-10">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdbcf] text-[#380d00] text-xs font-black uppercase tracking-wide">
              <span
                className="material-symbols-outlined text-[16px] text-[#5b1b00]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
              High Demand • Dodoɔ Kɛseɛ
            </span>
            <span className="text-[#ffb59a] text-[11px] font-semibold">
              Updated 14m ago
            </span>
          </div>

          <div className="flex gap-3.5 items-start">
            <div className="w-12 h-12 rounded-xl bg-[#ffdbcf] text-[#380d00] flex items-center justify-center flex-shrink-0 shadow-inner">
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                trending_up
              </span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-[19px] text-white font-bold leading-snug">
                High Tomato Demand in Kasoa &amp; Makola!
              </h2>
              <p className="text-xs text-[#ffdbcf] pt-1 leading-relaxed">
                Fresh crates selling up to{' '}
                <strong className="text-white font-black underline decoration-[#b1f0ce]">
                  GHS 180
                </strong>{' '}
                today. High vehicle dispatch in Techiman hub.
              </p>
            </div>
          </div>

          <div className="mt-1 pt-3 flex items-center justify-between border-t border-white/15">
            <span className="text-xs text-[#ffb59a] flex items-center gap-1 font-semibold">
              Tap to view 18 active bulk buyers
            </span>
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[20px]">
                arrow_forward
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Weather Forecast & Agro Logistics Hubs in Ghana */}
      <AgroWeatherForecast />

      {/* Weather-Calibrated Yield Optimization (Fertilizers & Pest Control) */}
      <YieldOptimization />

      {/* Forecasted Demand Analytics for Planting Decisions */}
      <DemandAnalytics />

      {/* Large Quick Action Touch Targets */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[19px] text-[#191c19] font-bold">Quick Actions</h3>
          <span className="text-xs text-[#414940] font-medium">Dwumadie Ntsɛntsɛm</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Action 1: List Harvest */}
          <button
            onClick={() => setActiveTab('sell')}
            className="group flex flex-col items-center text-center p-3.5 rounded-2xl bg-white shadow-xs hover:shadow-md active:scale-95 transition-all min-h-[140px] justify-between border border-[#edefe9] cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#1e5128] text-[#8cc38f] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                add_circle
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-[#013a13] font-black leading-tight">
                List Harvest
              </span>
              <span className="text-[11px] text-[#414940] mt-0.5 font-medium">
                Tɔn Nnuane
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#aeeecb] text-[#316e52] text-[10px] font-bold">
              + Add
            </span>
          </button>

          {/* Action 2: Today's Prices */}
          <button
            onClick={() => setActiveTab('prices')}
            className="group flex flex-col items-center text-center p-3.5 rounded-2xl bg-white shadow-xs hover:shadow-md active:scale-95 transition-all min-h-[140px] justify-between border border-[#edefe9] cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#b1f0ce] text-[#002114] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                sell
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-[#013a13] font-black leading-tight">
                Market Rates
              </span>
              <span className="text-[11px] text-[#414940] mt-0.5 font-medium">
                Nnɛ Boɔ
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#e7e9e3] text-[#191c19] text-[10px] font-bold">
              Live Rates
            </span>
          </button>

          {/* Action 3: My Deals */}
          <button
            onClick={() => setActiveTab('notifications')}
            className="group flex flex-col items-center text-center p-3.5 rounded-2xl bg-white shadow-xs hover:shadow-md active:scale-95 transition-all min-h-[140px] justify-between border border-[#edefe9] cursor-pointer"
          >
            <div className="relative w-12 h-12 rounded-2xl bg-[#ffdbcf] text-[#380d00] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                handshake
              </span>
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#5b1b00] text-white text-[11px] flex items-center justify-center font-bold">
                3
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-[#013a13] font-black leading-tight">
                My Deals
              </span>
              <span className="text-[11px] text-[#414940] mt-0.5 font-medium">
                Apam Horow
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#ffdbcf] text-[#380d00] text-[10px] font-bold">
              3 Active
            </span>
          </button>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[19px] text-[#191c19] font-bold">Farm Overview</h3>
          <span className="text-xs text-[#013a13] font-bold">April 2025</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Active Listings */}
          <div className="flex flex-col p-3 rounded-2xl bg-[#f2f4ee] shadow-xs justify-between border border-[#edefe9]">
            <div className="flex items-center justify-between">
              <span className="text-[#414940] text-[11px] font-semibold">Listings</span>
              <span className="w-2 h-2 rounded-full bg-[#2c694e]"></span>
            </div>
            <div className="my-1.5">
              <span className="text-[22px] text-[#013a13] font-extrabold leading-tight">
                4
              </span>
              <span className="text-xs text-[#414940] block font-medium">Crates</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#b1f0ce] text-[#002114] text-[10px] font-bold w-fit">
              Active
            </span>
          </div>

          {/* Pending Deals */}
          <div className="flex flex-col p-3 rounded-2xl bg-[#f2f4ee] shadow-xs justify-between border border-[#edefe9]">
            <div className="flex items-center justify-between">
              <span className="text-[#414940] text-[11px] font-semibold">Pending</span>
              <span className="w-2 h-2 rounded-full bg-[#5b1b00] animate-pulse"></span>
            </div>
            <div className="my-1.5">
              <span className="text-[22px] text-[#5b1b00] font-extrabold leading-tight">
                2
              </span>
              <span className="text-xs text-[#414940] block font-medium">Orders</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#ffdbcf] text-[#380d00] text-[10px] font-bold w-fit">
              Pickup soon
            </span>
          </div>

          {/* This Month's Income */}
          <div className="flex flex-col p-3 rounded-2xl bg-[#f2f4ee] shadow-xs justify-between border border-[#edefe9]">
            <div className="flex items-center justify-between">
              <span className="text-[#414940] text-[11px] font-semibold">Income</span>
              <span className="material-symbols-outlined text-[16px] text-[#2c694e]">
                payments
              </span>
            </div>
            <div className="my-1">
              <span className="text-[17px] leading-tight text-[#013a13] font-black block">
                GHS 4.8k
              </span>
              <span className="text-[10px] text-[#2c694e] font-bold inline-flex items-center">
                ▲ 18% mo
              </span>
            </div>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#e1e3dd] text-[#414940] text-[10px] font-medium w-fit">
              MoMo sent
            </span>
          </div>
        </div>
      </div>

      {/* Produce Visual Highlight Bar */}
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white shadow-xs border border-[#edefe9]">
        <img
          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
          alt="Derma Plum Tomatoes"
          src={mainCrop?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCr7GNS1Co3ygBZKP07O26LcR_azAiizAx2NlOQGWn4xXOTnWNVGMYOtDQfvHvh_IUpkcFzP4MbYTYHJrx8egH5MBFhoVBGWdfPHyBpC6YGhl_f7PDo50k6EPy6FfnYcb26RPacboxrni0J-zMI8LbGEMikR06UMsq_4cHrTWaJUfUeECjoEczBbQ5GEFREI2NNtM0Pugv6BaLtEZyPIq3k6Ras8RYAKRELSaYiLoRapZXzUoD-7uaJeQ'}
        />
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#013a13] font-bold">Your Main Crop</span>
            <span className="px-1.5 py-0.5 rounded bg-[#e1e3dd] text-[#414940] text-[10px] font-semibold">
              Bono Grade A
            </span>
          </div>
          <span className="text-base text-[#191c19] font-black truncate">
            Derma Plum Tomatoes
          </span>
          <span className="text-xs text-[#414940] truncate">
            42 Crates ready for loading at Techiman Station
          </span>
        </div>
        <button
          onClick={() => {
            if (mainCrop) {
              setSelectedProduce(mainCrop);
            }
          }}
          className="w-10 h-10 rounded-full bg-[#e7e9e3] flex items-center justify-center text-[#013a13] active:scale-95 flex-shrink-0 cursor-pointer"
          title="Inspect produce"
        >
          <span className="material-symbols-outlined text-[20px]">edit</span>
        </button>
      </div>

      {/* Personalized Seasonal Farming Tips */}
      <FarmingTips />

      {/* Recent Buyer Offers Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[19px] text-[#191c19] font-bold">
              Recent Buyer Offers
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-[#ffdbcf] text-[#380d00] text-xs font-bold">
              2 New
            </span>
          </div>
          <button
            onClick={() => setActiveTab('notifications')}
            className="text-sm text-[#013a13] font-bold hover:underline cursor-pointer"
          >
            See All
          </button>
        </div>

        {/* Buyer Card 1: Ama Serwaa (High Intent) */}
        {offers.find((o) => o.id === 'offer-1') && (
          <div className="p-4 rounded-2xl bg-white shadow-md border border-[#edefe9] flex flex-col gap-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0 shadow-xs"
                  alt="Ama Serwaa"
                  src={offers.find((o) => o.id === 'offer-1')?.buyerAvatar}
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-base text-[#191c19] font-extrabold truncate">
                      Ama Serwaa
                    </span>
                    <span
                      className="material-symbols-outlined text-[18px] text-[#2c694e]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                      title="Verified Trader"
                    >
                      verified
                    </span>
                  </div>
                  <span className="text-xs text-[#414940] truncate">
                    Agric Trading Kumasi
                  </span>
                  <span className="text-[11px] text-[#2c694e] font-bold">
                    ★ 4.9 (42 completed hauls)
                  </span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-[19px] text-[#013a13] font-black">
                  GHS 160
                </span>
                <span className="text-[#414940] text-xs block font-medium">
                  per crate
                </span>
              </div>
            </div>

            {/* Demand Metric details */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f2f4ee] text-[#191c19]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2c694e] text-[20px]">
                  inventory_2
                </span>
                <span className="text-sm font-semibold">
                  Wants: <strong>30 Crates</strong>
                </span>
              </div>
              <span className="text-xs text-[#812a00] font-black">
                Total: GHS 4,800
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#414940] text-[16px]">
                local_shipping
              </span>
              <span className="text-xs text-[#414940] font-medium">
                Pickup: Today, 3:30 PM • Own Truck
              </span>
            </div>

            {/* Action Row */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                className="h-14 rounded-2xl bg-[#aeeecb] text-[#316e52] flex items-center justify-center gap-2 text-sm font-bold active:scale-95 transition-transform"
                href="tel:0244123456"
              >
                <span className="material-symbols-outlined text-[22px]">call</span>
                <span>Call Ama</span>
              </a>

              <button
                onClick={(e) => handleAccept(e, 'offer-1', 'Ama Serwaa')}
                disabled={acceptedDeals['offer-1']}
                className={`h-14 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer ${
                  acceptedDeals['offer-1']
                    ? 'bg-[#aeeecb] text-[#316e52]'
                    : 'bg-[#013a13] text-white hover:bg-[#1e5128]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {acceptedDeals['offer-1'] ? 'done_all' : 'check_circle'}
                </span>
                <span>
                  {acceptedDeals['offer-1'] ? 'Accepted! Deal Locked' : 'Accept Offer'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Buyer Card 2: David Osei */}
        {offers.find((o) => o.id === 'offer-2') && (
          <div className="p-4 rounded-2xl bg-white shadow-xs border border-[#edefe9] flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0 shadow-xs"
                  alt="David Osei"
                  src={offers.find((o) => o.id === 'offer-2')?.buyerAvatar}
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-base text-[#191c19] font-extrabold truncate">
                      David Osei
                    </span>
                    <span
                      className="material-symbols-outlined text-[18px] text-[#2c694e]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                  </div>
                  <span className="text-xs text-[#414940] truncate">
                    Kaneshie Market Aggregator
                  </span>
                  <span className="text-[11px] text-[#2c694e] font-bold">
                    ★ 4.7 (18 hauls)
                  </span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-[19px] text-[#013a13] font-black">
                  GHS 155
                </span>
                <span className="text-[#414940] text-xs block font-medium">
                  per crate
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f2f4ee] text-[#191c19]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2c694e] text-[20px]">
                  inventory_2
                </span>
                <span className="text-sm font-semibold">
                  Wants: <strong>15 Crates</strong>
                </span>
              </div>
              <span className="text-xs text-[#013a13] font-black">
                Total: GHS 2,325
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[#414940] text-xs flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                Ready tomorrow morning
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (mainCrop) {
                      setSelectedProduce(mainCrop);
                    }
                  }}
                  className="h-11 px-4 rounded-xl bg-[#e1e3dd] text-[#191c19] text-xs font-bold active:scale-95 cursor-pointer"
                >
                  Review
                </button>
                <a
                  className="h-11 px-4 rounded-xl bg-[#1e5128] text-[#b8f1b9] flex items-center gap-1 text-xs font-bold active:scale-95"
                  href="tel:0209988776"
                >
                  <span className="material-symbols-outlined text-[18px]">phone</span>
                  Call
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Offline & Field Tips Micro Pod */}
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#e7e9e3] text-[#191c19]">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#013a13] flex-shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-[22px]">cloud_sync</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold">SMS Backup Active</span>
          <span className="text-xs text-[#414940]">
            All buyer acceptances confirm instantly even if internet drops.
          </span>
        </div>
      </div>

      {/* Floating Audio Assist Capsule for Non-Literate / Field Navigation */}
      <aside className="fixed bottom-24 right-4 z-40">
        <button
          onClick={handleListenDashboard}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#2c694e] text-white shadow-2xl active:scale-90 transition-all focus:outline-none cursor-pointer border border-[#b1f0ce]/30"
          aria-label={language === 'tw' ? 'Tie Dashboard wɔ Twi mu' : 'Listen to Dashboard in English'}
        >
          <span
            className="material-symbols-outlined text-[24px] animate-bounce"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            volume_up
          </span>
          <div className="flex flex-col text-left">
            <span className="text-xs font-black leading-none">
              {language === 'tw' ? 'Tie Dashboard' : 'Audio Briefing'}
            </span>
            <span className="text-[10px] text-[#b1f0ce] leading-none mt-0.5">
              {language === 'tw' ? 'Akan Twi Mmoa' : 'Listen in English'}
            </span>
          </div>
        </button>
      </aside>
    </div>
  );
};
