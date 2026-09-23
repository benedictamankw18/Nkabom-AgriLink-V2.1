import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProduceListing } from '../types';
import { KWAME_AVATAR } from '../data/mockData';

interface ProduceDetailsModalProps {
  produce?: ProduceListing | null;
  onClose: () => void;
}

export const ProduceDetailsModal: React.FC<ProduceDetailsModalProps> = ({
  produce: customProduce,
  onClose,
}) => {
  const { selectedProduce, playSpeech, showToast, submitPreCommitment, role } = useApp();
  const produce = customProduce || selectedProduce;

  const [crateCount, setCrateCount] = useState(30);
  const [pricePerCrate, setPricePerCrate] = useState(
    produce ? produce.spotPrice - 5 : 145
  );
  const [logisticsMethod, setLogisticsMethod] = useState<'collect' | 'transporter'>('transporter');
  const [deliveryDestination, setDeliveryDestination] = useState('Makola Wholesale Market, Accra');
  const [loadingTime, setLoadingTime] = useState('Today, 4:00 PM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSafeguardModal, setShowSafeguardModal] = useState(false);

  if (!produce) return null;

  const maxCrates = produce.cratesAvailable || 50;
  const totalCommitment = crateCount * pricePerCrate;
  const priceDiff = produce.spotPrice - pricePerCrate;

  const handleOpenSafeguard = () => {
    setShowSafeguardModal(true);
    playSpeech(
      `Confirming commitment: ${crateCount} crates of ${produce.title} at ${pricePerCrate} Cedis per crate. Total ${totalCommitment} Cedis to ${produce.farmerName}.`,
      'Pre-Commitment Safeguard Verification'
    );
  };

  const handleFinalConfirm = () => {
    setShowSafeguardModal(false);
    setIsSubmitting(true);

    const buyerName =
      role === 'processor'
        ? 'Ghana Agro Foods (Processor)'
        : role === 'buyer'
        ? 'Ama Serwaa (Makola Trader)'
        : 'Registered Produce Buyer';

    setTimeout(() => {
      submitPreCommitment(produce.id, crateCount, pricePerCrate, buyerName);
      setIsSubmitting(false);
      setIsSubmitted(true);
      playSpeech(
        `Pre-commitment of ${crateCount} crates at ${pricePerCrate} Cedis sent to ${produce.farmerName}. Farmer notified immediately by SMS.`,
        'Pre-Commitment Confirmed'
      );
    }, 900);
  };

  const handleAudioExplain = () => {
    playSpeech(
      `Produce Details for ${produce.title}: Offered by ${produce.farmerName} in ${produce.location}. ${produce.cratesAvailable} crates available at ${produce.spotPrice} Cedis per crate. You can make an offer below and your payment is held in escrow until pickup inspection.`,
      'Produce Details Audio'
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f8faf4] overflow-y-auto pt-safe pb-safe">
      {/* Top Bar Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 pt-safe bg-[#f8faf4]/90 backdrop-blur-xl shadow-xs border-b border-[#edefe9]">
        <div className="h-16 max-w-lg mx-auto px-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              aria-label="Go back"
              className="w-10 h-10 -ml-1 flex items-center justify-center text-[#013a13] rounded-full hover:bg-[#edefe9] active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[26px]">arrow_back</span>
            </button>
            <h1 className="text-[19px] font-bold text-[#191c19] truncate">
              Produce Details
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#aeeecb] text-[#316e52]">
              <span className="w-2 h-2 rounded-full bg-[#2c694e]"></span>
              <span className="text-xs font-bold">Online</span>
            </div>
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-[#013a13]/20"
              src={KWAME_AVATAR}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-lg mx-auto px-4 pt-20 pb-16 space-y-4">
        {/* Have Questions First Bar */}
        <div className="flex items-center justify-between p-3 bg-[#f2f4ee] rounded-2xl shadow-xs border border-[#edefe9]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#aeeecb] text-[#316e52] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">
                support_agent
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-xs font-bold text-[#191c19] truncate">
                Have Questions First?
              </p>
              <p className="text-[11px] text-[#414940] truncate">
                Bisa {produce.farmerName} / Speak directly
              </p>
            </div>
          </div>

          <a
            className="h-11 px-4 rounded-xl bg-[#013a13] text-white flex items-center gap-1.5 flex-shrink-0 active:scale-95 transition-transform shadow-xs text-xs font-bold"
            href="tel:+233244000123"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span>Call Farmer</span>
          </a>
        </div>

        {/* Produce Showcase Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xs border border-[#edefe9] flex flex-col">
          {/* Produce Hero Image */}
          <div className="relative w-full h-56 bg-[#f2f4ee]">
            <img
              className="w-full h-full object-cover"
              alt={produce.title}
              src={produce.image}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <div className="px-3 py-1 rounded-full bg-[#812a00] text-white text-xs font-bold shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ffdbcf] animate-pulse"></span>
                <span>{produce.readyStatus}</span>
              </div>
            </div>

            <div className="absolute top-3 right-3">
              <button
                onClick={handleAudioExplain}
                aria-label="Listen to produce summary"
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur text-[#013a13] flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">volume_up</span>
              </button>
            </div>

            {/* Overlaid Valuation Pill on Hero */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
              <div>
                <span className="text-[10px] opacity-90 uppercase tracking-wider block font-bold">
                  Lot Valuation
                </span>
                <span className="text-[22px] text-white font-black">
                  GHS {(produce.cratesAvailable * produce.spotPrice).toLocaleString()}
                </span>
              </div>

              <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-[#013a13] shadow-xs flex items-center gap-1">
                <span className="text-xs text-[#414940] font-medium">Per Unit:</span>
                <span className="text-sm font-black">GHS {produce.spotPrice}</span>
              </div>
            </div>
          </div>

          {/* Produce Details Content */}
          <div className="p-4 flex flex-col space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h2 className="text-[20px] font-black text-[#191c19] leading-tight">
                  {produce.title}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#aeeecb] text-[#316e52] text-xs font-bold flex-shrink-0">
                  {produce.gradeTag}
                </span>
              </div>
              <p className="text-xs text-[#414940] flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[16px] text-[#013a13]">
                  verified
                </span>
                Techiman Regional Market Hub Verified Stock
              </p>
            </div>

            {/* Quantitative Metric Pods */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-[#f2f4ee] rounded-2xl border border-[#edefe9]">
                <span className="text-xs text-[#414940] flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-[#2c694e]">
                    inventory_2
                  </span>
                  Available Lot
                </span>
                <p className="text-[18px] font-black text-[#191c19] mt-1">
                  {produce.cratesAvailable} Crates
                </p>
                <p className="text-[11px] text-[#414940]">{produce.weightPerCrate}</p>
              </div>

              <div className="p-3 bg-[#f2f4ee] rounded-2xl border border-[#edefe9]">
                <span className="text-xs text-[#414940] flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-[#2c694e]">
                    schedule
                  </span>
                  Ready Status
                </span>
                <p className="text-[16px] font-black text-[#191c19] mt-1 truncate">
                  {produce.isPreHarvest ? 'Pre-Harvest' : 'Ready Now'}
                </p>
                <p className="text-[11px] text-[#414940] truncate">
                  {produce.expectedHarvestDate || 'Inspected on field'}
                </p>
              </div>
            </div>

            {/* Pre-Harvest Commitment Progress (FR-13) */}
            {produce.isPreHarvest && (
              <div className="p-3 bg-[#f2f4ee] rounded-2xl border border-[#edefe9] space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#013a13] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">psychology</span>
                    Pre-Commitment Target
                  </span>
                  <span className="font-mono font-bold text-[#2c694e]">
                    {produce.preCommitmentCount || 0} / {produce.cratesAvailable} Crates (
                    {Math.round(((produce.preCommitmentCount || 0) / produce.cratesAvailable) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-[#c1c9bd]/40 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#013a13] h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(((produce.preCommitmentCount || 0) / produce.cratesAvailable) * 100)
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className="text-[11px] text-[#414940]">
                  Pledged by verified buyers before harvest cut date ({produce.expectedHarvestDate || 'Upcoming'}).
                </p>
              </div>
            )}

            {/* AI Spoilage Risk Indicator (FR-26) */}
            <div
              className={`p-3 rounded-2xl border flex items-start gap-2.5 ${
                produce.spoilageRisk === 'low'
                  ? 'bg-[#eaf2e4] border-[#cbe0c5] text-[#013a13]'
                  : produce.spoilageRisk === 'high'
                  ? 'bg-[#fdeeed] border-[#f8c8c5] text-[#8c1d18]'
                  : 'bg-[#fff5ee] border-[#ffd6ba] text-[#812a00]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] flex-shrink-0 mt-0.5">
                {produce.spoilageRisk === 'low' ? 'verified_user' : 'warning'}
              </span>
              <div className="flex-1 min-w-0 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-[11px]">
                    Spoilage Risk: {produce.spoilageRisk?.toUpperCase() || 'MODERATE'}
                  </span>
                  <span className="text-[10px] font-semibold opacity-80">Central 31°C</span>
                </div>
                <p className="text-[11px] mt-0.5 opacity-90 leading-snug">
                  {produce.spoilageReason ||
                    'Highly perishable crop. Rapid logistics or pre-harvest contract saves quality.'}
                </p>
              </div>
            </div>

            {/* Shared Transport Eligibility (FR-35) */}
            {produce.sharedTransportEligible && (
              <div className="p-2.5 bg-[#b8f1b9]/30 rounded-xl border border-[#9cd49e]/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#013a13] text-[18px]">
                    local_shipping
                  </span>
                  <span className="text-xs font-bold text-[#013a13]">
                    Shared Transport Eligible
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#2c694e]">
                  Save ~40% Freight
                </span>
              </div>
            )}

            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#edefe9] border border-[#c1c9bd]/40">
              <span className="material-symbols-outlined text-[20px] text-[#013a13] flex-shrink-0 mt-0.5">
                location_on
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#191c19]">
                  {produce.location}
                </p>
                <p className="text-[11px] text-[#414940]">
                  Direct truck loading dock access with weighing scales on site.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Farmer Information Card */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-[#edefe9] flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71796f] uppercase tracking-wider font-bold">
              Producer &amp; Aggregator
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#b8f1b9] text-[#002108] text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              Verified Smallholder
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[#f2f4ee] flex-shrink-0 shadow-inner ring-1 ring-[#013a13]/20">
              <img
                alt={produce.farmerName}
                className="w-full h-full object-cover"
                src={produce.farmerAvatar}
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <h3 className="text-base font-black text-[#191c19] truncate">
                {produce.farmerName}
              </h3>
              <p className="text-xs text-[#414940] truncate font-medium">
                {produce.cooperative}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-0.5 text-amber-500">
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-xs font-black text-[#191c19]">4.9</span>
                </div>
                <span className="text-[#c1c9bd]">•</span>
                <span className="text-xs text-[#414940]">42 completed trades</span>
              </div>
            </div>

            <a
              href="tel:+233244000123"
              className="w-11 h-11 rounded-full bg-[#aeeecb] text-[#316e52] flex items-center justify-center shadow-xs active:scale-90 transition-transform"
              aria-label={`Call ${produce.farmerName}`}
            >
              <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
            </a>
          </div>
        </div>

        {/* Interactive 'Send Commitment to Farmer' Card */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-[#edefe9] flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h3 className="text-[19px] font-black text-[#191c19]">
                Send Commitment to Farmer
              </h3>
              <p className="text-xs text-[#414940] font-medium">
                Fa wo nkrataa kɔma okuafoɔ no
              </p>
            </div>
            <button
              onClick={() =>
                playSpeech(
                  'Fa wo nkrataa kɔma okuafoɔ no. Use this sheet to specify the number of crates and your proposed price.',
                  'Commitment Sheet Audio Guide'
                )
              }
              aria-label="Audio assist for commitment form"
              className="p-2 rounded-full bg-[#f2f4ee] text-[#013a13] active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">volume_up</span>
            </button>
          </div>

          {/* Stepper: Quantity Wanted */}
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#191c19]">
                Quantity Wanted (Crates)
              </label>
              <span className="text-xs text-[#414940]">Max {maxCrates} available</span>
            </div>

            <div className="flex items-center justify-between bg-[#f2f4ee] rounded-2xl p-2 border border-[#edefe9]">
              <button
                onClick={() => setCrateCount((c) => Math.max(1, c - 5))}
                className="w-12 h-12 rounded-xl bg-white text-[#191c19] flex items-center justify-center active:scale-95 shadow-xs transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">remove</span>
              </button>

              <div className="text-center px-4">
                <span className="text-[26px] font-black text-[#013a13]">
                  {crateCount}
                </span>
                <span className="text-xs text-[#414940] block uppercase tracking-wide font-semibold">
                  Wooden Crates (~{crateCount * 25} kg)
                </span>
              </div>

              <button
                onClick={() => setCrateCount((c) => Math.min(maxCrates, c + 5))}
                className="w-12 h-12 rounded-xl bg-[#013a13] text-white flex items-center justify-center active:scale-95 shadow-xs transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">add</span>
              </button>
            </div>

            {/* Quick Quantity Selectors */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setCrateCount(10)}
                className={`flex-1 h-9 rounded-full text-xs font-bold active:scale-95 transition-all cursor-pointer ${
                  crateCount === 10
                    ? 'bg-[#013a13] text-white'
                    : 'bg-[#f2f4ee] text-[#414940] hover:bg-[#e7e9e3]'
                }`}
              >
                10 Crates
              </button>
              <button
                onClick={() => setCrateCount(25)}
                className={`flex-1 h-9 rounded-full text-xs font-bold active:scale-95 transition-all cursor-pointer ${
                  crateCount === 25
                    ? 'bg-[#013a13] text-white'
                    : 'bg-[#f2f4ee] text-[#414940] hover:bg-[#e7e9e3]'
                }`}
              >
                25 Crates
              </button>
              <button
                onClick={() => setCrateCount(maxCrates)}
                className={`flex-1 h-9 rounded-full text-xs font-bold active:scale-95 transition-all cursor-pointer ${
                  crateCount === maxCrates
                    ? 'bg-[#013a13] text-white'
                    : 'bg-[#aeeecb] text-[#316e52]'
                }`}
              >
                All {maxCrates}
              </button>
            </div>
          </div>

          {/* Proposed Price per Crate */}
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#191c19]">
                Proposed Price Per Crate
              </label>
              <span className="text-xs text-[#2c694e] font-bold">
                Asking: GHS {produce.spotPrice}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#f2f4ee] rounded-2xl border border-[#edefe9]">
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-bold text-[#414940]">GHS</span>
                <span className="text-[24px] font-black text-[#191c19]">
                  {pricePerCrate}
                </span>
                <span className="text-xs text-[#414940]">/ crate</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPricePerCrate((p) => Math.max(50, p - 5))}
                  className="w-9 h-9 rounded-lg bg-white text-[#191c19] flex items-center justify-center shadow-xs active:scale-90 transition-transform cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <button
                  onClick={() => setPricePerCrate((p) => p + 5)}
                  className="w-9 h-9 rounded-lg bg-white text-[#191c19] flex items-center justify-center shadow-xs active:scale-90 transition-transform cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-[#414940] px-1 flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[14px] text-[#2c694e]">
                trending_down
              </span>
              {priceDiff > 0
                ? `Your proposal is GHS ${priceDiff} below asking price (acceptable range).`
                : priceDiff === 0
                ? 'Your proposal matches the asking price perfectly!'
                : `Your proposal is GHS ${Math.abs(priceDiff)} above asking price (priority buyer).`}
            </p>
          </div>

          {/* Logistics Method Toggle */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold text-[#191c19]">
              Pickup &amp; Logistics Method
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#f2f4ee] p-1.5 rounded-2xl border border-[#edefe9]">
              <button
                onClick={() => setLogisticsMethod('collect')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl transition-all text-center cursor-pointer ${
                  logisticsMethod === 'collect'
                    ? 'bg-white text-[#013a13] shadow-xs font-bold'
                    : 'text-[#414940]'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px] mb-0.5">
                  local_shipping
                </span>
                <span className="text-xs font-bold">Collect with My Truck</span>
                <span className="text-[11px] text-[#71796f]">Techiman Hub Gate 4</span>
              </button>

              <button
                onClick={() => setLogisticsMethod('transporter')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl transition-all text-center cursor-pointer ${
                  logisticsMethod === 'transporter'
                    ? 'bg-white text-[#013a13] shadow-xs font-bold'
                    : 'text-[#414940]'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px] mb-0.5">group</span>
                <span className="text-xs font-bold">Require Transporter</span>
                <span className="text-[11px] text-[#71796f]">AgriLink Fleet Match</span>
              </button>
            </div>
          </div>

          {/* Target Pickup Window */}
          <div className="flex items-center justify-between p-3 bg-[#f2f4ee] rounded-2xl border border-[#edefe9]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#013a13]">
                event_available
              </span>
              <div>
                <span className="text-[11px] text-[#414940] block font-medium">
                  Target Loading Time
                </span>
                <span className="text-xs font-bold text-[#191c19]">
                  {loadingTime}
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                setLoadingTime(
                  loadingTime === 'Today, 4:00 PM' ? 'Tomorrow, 7:00 AM' : 'Today, 4:00 PM'
                )
              }
              className="px-3 py-1 rounded-lg bg-[#edefe9] text-[#191c19] text-xs font-bold active:bg-[#e7e9e3] cursor-pointer"
            >
              Change
            </button>
          </div>

          {/* Clear Escrow Box */}
          <div className="p-3 bg-[#aeeecb]/40 rounded-2xl space-y-1.5 border border-[#2c694e]/20">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[22px] text-[#2c694e] flex-shrink-0 mt-0.5">
                lock_clock
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#191c19]">
                  Total Commitment:{' '}
                  <span className="text-[#013a13] font-black">
                    GHS {totalCommitment.toLocaleString()}
                  </span>{' '}
                  for {crateCount} crates
                </p>
                <p className="text-[11px] text-[#414940] mt-0.5 leading-relaxed">
                  Escrow held securely until produce inspected on site. Funds released
                  only upon your physical inspection approval code.
                </p>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-1">
            <button
              onClick={handleOpenSafeguard}
              disabled={isSubmitting || isSubmitted}
              className={`w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer ${
                isSubmitted
                  ? 'bg-[#2c694e] text-white'
                  : 'bg-[#013a13] hover:bg-[#1e5128] text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">
                {isSubmitting ? 'sync' : isSubmitted ? 'check_circle' : 'handshake'}
              </span>
              <span>
                {isSubmitting
                  ? 'Transmitting Offer...'
                  : isSubmitted
                  ? `Offer Sent to ${produce.farmerName}!`
                  : produce.isPreHarvest
                  ? 'Submit Pre-Commitment'
                  : 'Submit Commitment Offer'}
              </span>
            </button>

            <p className="text-xs text-center text-[#414940] mt-2 font-medium">
              Instant SMS dispatch sent to {produce.farmerName} • Escrow Protected
            </p>
          </div>
        </div>

        {/* Micro Voice Assist Pill */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() =>
              playSpeech(
                `You are offering to buy ${crateCount} crates of ${produce.title} at ${pricePerCrate} Ghana Cedis each. Your escrow of ${totalCommitment.toLocaleString()} Ghana Cedis will be kept safe until you inspect them.`,
                'Spoken Offer Confirmation'
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#edefe9] text-[#414940] text-xs font-bold shadow-xs active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#013a13]">
              headphones
            </span>
            <span>Tie nkyerɛkyerɛmu (Listen to Instructions)</span>
          </button>
        </div>
      </div>

      {/* Confirmation Safeguard Dialog (FR-17, BR-08, PR-10) */}
      {showSafeguardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-[#edefe9] space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-[#edefe9]">
              <div className="w-10 h-10 rounded-2xl bg-[#013a13] text-white flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[22px]">verified_user</span>
              </div>
              <div>
                <h3 className="text-base font-black text-[#191c19]">
                  Review &amp; Confirm Commitment
                </h3>
                <p className="text-xs text-[#414940]">
                  SRS Safeguard Verification (FR-17)
                </p>
              </div>
            </div>

            <div className="bg-[#f2f4ee] rounded-2xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#414940]">Produce:</span>
                <span className="font-bold text-[#191c19]">{produce.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#414940]">Farmer / Hub:</span>
                <span className="font-bold text-[#191c19]">
                  {produce.farmerName} • {produce.location}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#414940]">Quantity:</span>
                <span className="font-bold text-[#013a13]">{crateCount} Crates</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#414940]">Proposed Price:</span>
                <span className="font-bold text-[#013a13]">GH₵ {pricePerCrate} / Crate</span>
              </div>
              <div className="flex justify-between border-t border-[#dce0d9] pt-1.5 text-sm">
                <span className="font-bold text-[#191c19]">Total Escrow Value:</span>
                <span className="font-black text-[#013a13]">
                  GH₵ {totalCommitment.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#414940]">Destination:</span>
                <span className="font-bold text-[#191c19]">{deliveryDestination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#414940]">Freight Type:</span>
                <span className="font-bold text-[#2c694e]">
                  {logisticsMethod === 'transporter'
                    ? 'AgriLink Shared Fleet Match'
                    : 'Buyer Collects at Farm'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#eaf2e4] rounded-xl text-[11px] text-[#2c694e] flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] flex-shrink-0 mt-0.5">
                lock
              </span>
              <span>
                Funds will be held in safe escrow. Farmer cannot cancel after harvest cutting has commenced.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowSafeguardModal(false)}
                className="py-3 rounded-xl bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#414940] font-bold text-xs cursor-pointer transition-colors"
              >
                Modify Details
              </button>
              <button
                type="button"
                onClick={handleFinalConfirm}
                className="py-3 rounded-xl bg-[#013a13] hover:bg-[#1e5128] text-white font-bold text-xs shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Lock Commitment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
