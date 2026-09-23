import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MarketFilterState, OrganicCertificationStatus, ProduceListing } from '../types';

interface MarketFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: MarketFilterState;
  onApplyFilters: (newFilters: MarketFilterState) => void;
  onResetFilters: () => void;
  allProduce: ProduceListing[];
}

export const MarketFilterDrawer: React.FC<MarketFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
  allProduce,
}) => {
  const { t, language } = useApp();

  // Local draft state while tweaking in drawer
  const [draftFilters, setDraftFilters] = useState<MarketFilterState>(filters);

  // Sync draft filters whenever drawer opens or active filters change
  useEffect(() => {
    if (isOpen) {
      setDraftFilters(filters);
    }
  }, [isOpen, filters]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Calculate live matching count with current draft filters
  const liveMatchCount = useMemo(() => {
    return allProduce.filter((item) => {
      // 1. Distance filter
      if (draftFilters.maxDistanceKm < 100 && item.distanceKm > draftFilters.maxDistanceKm) {
        return false;
      }

      // 2. Harvest date filter
      const itemDate = item.harvestDate || (item.isReadyToday ? '2026-09-23' : '');
      if (draftFilters.harvestDateStart && itemDate && itemDate < draftFilters.harvestDateStart) {
        return false;
      }
      if (draftFilters.harvestDateEnd && itemDate && itemDate > draftFilters.harvestDateEnd) {
        return false;
      }
      if (draftFilters.harvestDatePreset === 'pre_harvest' && !item.isPreHarvest && itemDate <= '2026-09-24') {
        return false;
      }

      // 3. Organic status filter
      if (draftFilters.organicStatus !== 'all') {
        const itemStatus = item.organicStatus || (item.cropType === 'onion' ? 'conventional' : 'conventional');
        if (itemStatus !== draftFilters.organicStatus) {
          return false;
        }
      }

      return true;
    }).length;
  }, [allProduce, draftFilters]);

  // Quick preset helper for harvest dates
  const handleDatePresetSelect = (preset: MarketFilterState['harvestDatePreset']) => {
    if (preset === 'all') {
      setDraftFilters((prev) => ({
        ...prev,
        harvestDatePreset: 'all',
        harvestDateStart: '',
        harvestDateEnd: '',
      }));
    } else if (preset === 'today') {
      setDraftFilters((prev) => ({
        ...prev,
        harvestDatePreset: 'today',
        harvestDateStart: '2026-09-23',
        harvestDateEnd: '2026-09-23',
      }));
    } else if (preset === 'next3days') {
      setDraftFilters((prev) => ({
        ...prev,
        harvestDatePreset: 'next3days',
        harvestDateStart: '2026-09-23',
        harvestDateEnd: '2026-09-26',
      }));
    } else if (preset === 'pre_harvest') {
      setDraftFilters((prev) => ({
        ...prev,
        harvestDatePreset: 'pre_harvest',
        harvestDateStart: '2026-09-24',
        harvestDateEnd: '',
      }));
    } else {
      setDraftFilters((prev) => ({
        ...prev,
        harvestDatePreset: 'custom',
      }));
    }
  };

  const handleApply = () => {
    onApplyFilters(draftFilters);
    onClose();
  };

  const handleReset = () => {
    const defaultState: MarketFilterState = {
      maxDistanceKm: 100,
      harvestDateStart: '',
      harvestDateEnd: '',
      harvestDatePreset: 'all',
      organicStatus: 'all',
    };
    setDraftFilters(defaultState);
    onResetFilters();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn cursor-pointer"
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-drawer-title"
        className="relative z-10 w-full max-w-md bg-[#f8faf4] h-full shadow-2xl flex flex-col overflow-hidden animate-slideInRight border-l border-[#edefe9]"
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 bg-white border-b border-[#edefe9] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#013a13] text-[#b1f0ce] flex items-center justify-center flex-shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </div>
            <div>
              <h2 id="filter-drawer-title" className="text-base font-extrabold text-[#013a13] leading-tight">
                {t('market.filterTitle', 'Refine Produce')}
              </h2>
              <p className="text-[11px] text-[#414940] leading-tight mt-0.5">
                {t('market.filterSubtitle', 'Filter by farm distance, harvest freshness, and organic certification')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close filter drawer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#414940] hover:text-[#191c19] hover:bg-[#edefe9] active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Filter Form Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          
          {/* SECTION 1: DISTANCE TO FARM */}
          <section className="bg-white rounded-2xl p-4 border border-[#edefe9] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#013a13] text-[20px]">near_me</span>
                <label htmlFor="distance-slider" className="text-sm font-bold text-[#191c19]">
                  {t('market.distanceToFarm', 'Distance to Farm')}
                </label>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-[#b1f0ce]/40 text-[#013a13]">
                {draftFilters.maxDistanceKm >= 100
                  ? t('market.anyDistance', 'Any Distance')
                  : `< ${draftFilters.maxDistanceKm} km`}
              </span>
            </div>

            {/* Range Slider */}
            <div className="space-y-2">
              <input
                id="distance-slider"
                type="range"
                min="5"
                max="100"
                step="5"
                value={draftFilters.maxDistanceKm}
                onChange={(e) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    maxDistanceKm: Number(e.target.value),
                  }))
                }
                className="w-full h-2 bg-[#edefe9] rounded-lg appearance-none cursor-pointer accent-[#013a13]"
              />
              <div className="flex justify-between text-[11px] font-semibold text-[#71796f]">
                <span>5 km</span>
                <span>20 km</span>
                <span>35 km</span>
                <span>50+ km ({t('market.anyDistance', 'Any')})</span>
              </div>
            </div>

            {/* Quick Distance Presets */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[
                { label: '< 10 km', val: 10 },
                { label: '< 20 km', val: 20 },
                { label: '< 35 km', val: 35 },
                { label: t('market.anyDistance', 'Any'), val: 100 },
              ].map((preset) => {
                const isActive = draftFilters.maxDistanceKm === preset.val;
                return (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        maxDistanceKm: preset.val,
                      }))
                    }
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                      isActive
                        ? 'bg-[#013a13] text-white border-[#013a13] shadow-xs'
                        : 'bg-[#f8faf4] text-[#414940] border-[#edefe9] hover:bg-[#edefe9]'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 2: HARVEST DATE RANGE */}
          <section className="bg-white rounded-2xl p-4 border border-[#edefe9] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#013a13] text-[20px]">calendar_month</span>
                <span className="text-sm font-bold text-[#191c19]">
                  {t('market.harvestDateRange', 'Harvest Date Range')}
                </span>
              </div>
              <span className="text-[11px] text-[#414940] font-medium">
                {language === 'tw' ? 'Nnɛ yɛ 23 Sep' : 'Today: Sep 23, 2026'}
              </span>
            </div>

            {/* Quick Harvest Presets */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all' as const, label: t('market.allDates', 'All Dates'), icon: 'event_available' },
                { id: 'today' as const, label: t('market.harvestToday', 'Harvested Today (Sep 23)'), icon: 'bolt' },
                { id: 'next3days' as const, label: t('market.next3Days', 'Next 3 Days (Sep 23 - 26)'), icon: 'date_range' },
                { id: 'pre_harvest' as const, label: t('market.preHarvestOnly', 'Pre-Harvest Lots'), icon: 'psychology' },
              ].map((p) => {
                const isActive = draftFilters.harvestDatePreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleDatePresetSelect(p.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                      isActive
                        ? 'bg-[#013a13] text-white border-[#013a13] shadow-xs'
                        : 'bg-[#f8faf4] text-[#191c19] border-[#edefe9] hover:bg-[#edefe9]'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-[#b1f0ce]' : 'text-[#2c694e]'}`}>
                      {p.icon}
                    </span>
                    <span className="text-xs font-bold leading-tight">{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Date Range Toggle & Pickers */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleDatePresetSelect('custom')}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-between border transition-all cursor-pointer ${
                  draftFilters.harvestDatePreset === 'custom'
                    ? 'bg-[#edefe9] text-[#013a13] border-[#013a13]/30'
                    : 'bg-[#f8faf4] text-[#414940] border-[#edefe9] hover:bg-[#edefe9]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  <span>{t('market.customRange', 'Custom Date Range')}</span>
                </div>
                <span className="material-symbols-outlined text-[16px]">
                  {draftFilters.harvestDatePreset === 'custom' ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {draftFilters.harvestDatePreset === 'custom' && (
                <div className="grid grid-cols-2 gap-2.5 mt-2.5 p-3 rounded-xl bg-[#f8faf4] border border-[#edefe9] animate-fadeIn">
                  <div>
                    <label className="block text-[11px] font-bold text-[#414940] mb-1">
                      {t('market.startDate', 'From Date')}
                    </label>
                    <input
                      type="date"
                      value={draftFilters.harvestDateStart}
                      onChange={(e) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          harvestDateStart: e.target.value,
                        }))
                      }
                      className="w-full text-xs font-semibold px-2.5 py-2 rounded-lg bg-white border border-[#edefe9] text-[#191c19] focus:outline-none focus:ring-1 focus:ring-[#013a13]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#414940] mb-1">
                      {t('market.endDate', 'To Date')}
                    </label>
                    <input
                      type="date"
                      value={draftFilters.harvestDateEnd}
                      onChange={(e) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          harvestDateEnd: e.target.value,
                        }))
                      }
                      className="w-full text-xs font-semibold px-2.5 py-2 rounded-lg bg-white border border-[#edefe9] text-[#191c19] focus:outline-none focus:ring-1 focus:ring-[#013a13]"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* SECTION 3: ORGANIC CERTIFICATION STATUS */}
          <section className="bg-white rounded-2xl p-4 border border-[#edefe9] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#013a13] text-[20px]">verified</span>
                <label className="text-sm font-bold text-[#191c19]">
                  {t('market.organicStatus', 'Organic Certification Status')}
                </label>
              </div>
            </div>

            <div className="space-y-2">
              {[
                {
                  id: 'all' as OrganicCertificationStatus,
                  title: t('market.allMethods', 'All Methods'),
                  desc: 'All verified listings across Ghana',
                  icon: 'public',
                  badge: 'Any',
                  color: 'text-[#414940]',
                },
                {
                  id: 'certified_organic' as OrganicCertificationStatus,
                  title: t('market.certifiedOrganic', 'Certified Organic'),
                  desc: t('market.certifiedOrganicDesc', 'Verified Green Label / Ecocert / CERES'),
                  icon: 'eco',
                  badge: '🌿 Green Label / Ecocert',
                  color: 'text-[#013a13]',
                },
                {
                  id: 'in_transition' as OrganicCertificationStatus,
                  title: t('market.inTransition', 'In-Transition / Natural'),
                  desc: t('market.inTransitionDesc', 'Participatory Guarantee (PGS) - No synthetics'),
                  icon: 'spa',
                  badge: '🌱 PGS Ghana',
                  color: 'text-[#2c694e]',
                },
                {
                  id: 'conventional' as OrganicCertificationStatus,
                  title: t('market.conventional', 'Conventional'),
                  desc: t('market.conventionalDesc', 'Standard commercial farming practices'),
                  icon: 'agriculture',
                  badge: '🚜 Commercial',
                  color: 'text-[#71796f]',
                },
              ].map((method) => {
                const isSelected = draftFilters.organicStatus === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        organicStatus: method.id,
                      }))
                    }
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#b1f0ce]/20 border-[#013a13] ring-1 ring-[#013a13]/20 shadow-xs'
                        : 'bg-[#f8faf4] border-[#edefe9] hover:bg-[#edefe9]'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isSelected ? 'bg-[#013a13] text-[#b1f0ce]' : 'bg-white text-[#414940] border border-[#edefe9]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{method.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#191c19]">{method.title}</span>
                        <span className="text-[10px] font-semibold text-[#2c694e]">{method.badge}</span>
                      </div>
                      <p className="text-[11px] text-[#414940] mt-0.5 leading-tight">{method.desc}</p>
                    </div>

                    <div className="flex items-center self-center pl-1">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          isSelected ? 'border-[#013a13] bg-[#013a13] text-white' : 'border-[#b8bcad] bg-white'
                        }`}
                      >
                        {isSelected && <span className="material-symbols-outlined text-[14px]">check</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Quick Summary Pill Banner */}
          <div className="p-3 bg-[#e8eae4] rounded-xl flex items-center justify-between text-xs text-[#414940]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#013a13]">insights</span>
              <span>Available Lots Matching:</span>
            </div>
            <span className="font-extrabold text-[#013a13] text-sm">{liveMatchCount} lots</span>
          </div>

        </div>

        {/* Sticky Drawer Footer */}
        <div className="p-4 bg-white border-t border-[#edefe9] flex items-center gap-3 flex-shrink-0 shadow-lg">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-3 px-4 rounded-xl border border-[#edefe9] bg-white text-[#414940] font-bold text-xs hover:bg-[#edefe9] active:scale-95 transition-all text-center cursor-pointer"
          >
            {t('market.resetAll', 'Reset All')}
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-[2] py-3 px-4 rounded-xl bg-[#013a13] text-white font-extrabold text-xs shadow-md hover:bg-[#002b0e] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">filter_alt</span>
            <span>
              {t('market.applyFilters', 'Apply Filters')} ({liveMatchCount})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
