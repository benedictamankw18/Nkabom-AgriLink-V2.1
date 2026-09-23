import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export interface CropDemandForecast {
  id: string;
  name: string;
  twiName: string;
  cropType: 'roma' | 'round' | 'pepper' | 'onion' | 'cassava';
  category: string;
  demandIndex: number; // 0 - 100
  demandTrend: 'up' | 'stable' | 'down';
  projectedDeficitPercent: number; // e.g. +38% supply shortfall
  currentPrice: number;
  projectedPriceAtHarvest: string; // e.g. "GH₵ 180 - 210"
  growthDurationDays: number;
  recommendedPlantingWindow: string;
  projectedHarvestMonth: string;
  estimatedRoiPercent: number;
  offtakerCommitmentCount: number;
  recommendationTag: 'Top Pick' | 'High Margin' | 'Stable Yield' | 'Watch Supply';
  tagColor: string;
  icon: string;
  image: string;
  whyPlantNow: string;
  twiSpeech: string;
}

export interface RegionalDemandData {
  regionId: string;
  regionName: string;
  subText: string;
  activeBuyerCount: number;
  forecastWindow: string;
  marketDeficitSummary: string;
  topCrops: CropDemandForecast[];
}

const REGIONAL_DEMAND_FORECASTS: RegionalDemandData[] = [
  {
    regionId: 'central',
    regionName: 'Central Region (Pilot Zone)',
    subText: 'Mankessim • Assin Fosu • Awutu Senya / Kasoa',
    activeBuyerCount: 84,
    forecastWindow: 'Q4 2026 / Major Season Harvest',
    marketDeficitSummary:
      'High wholesale demand projected in Makola and Kasoa depots. Tomatoes and Hot Peppers face severe supply shortages ahead of the festive season.',
    topCrops: [
      {
        id: 'roma-tomato',
        name: 'Bontanga Roma Tomatoes',
        twiName: 'Pepere Ntɔs (Bontanga)',
        cropType: 'roma',
        category: 'Vegetables',
        demandIndex: 96,
        demandTrend: 'up',
        projectedDeficitPercent: 42,
        currentPrice: 150,
        projectedPriceAtHarvest: 'GH₵ 185 – 220 / crate',
        growthDurationDays: 75,
        recommendedPlantingWindow: 'Plant this week (Sep 25 – Oct 5)',
        projectedHarvestMonth: 'Early December',
        estimatedRoiPercent: 68,
        offtakerCommitmentCount: 38,
        recommendationTag: 'Top Pick',
        tagColor: 'bg-[#aeeecb] text-[#002114]',
        icon: '🍅',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuACIu7RQGXHe15akJLYKvTk3wecz7Lne9pnyFhKjk4ZgB1xuo9T_O_NxvJuEZ89j6q0tbN7UYKpbLpu1KH-uKomuDNUN3ymsZjmm1W1hXTHV4hCPGvwzOmYiHtYTcinC7xeb7xcEirURy8JqWh9tC2sdj2i7BuVHzTXMB6y4FYCVJv-2F4kZVsyj5mAk-sZBOoJH108Gwhxig9W2P3YbiTuK3C04L4X7h2fnUtJba9CzvkO0XzX8JAbVg',
        whyPlantNow:
          'Accra wholesale markets forecast a 42% supply deficit in December. Planting now guarantees peak pricing with 38 pre-verified aggregators ready to commit.',
        twiSpeech:
          'Central Region ahiafoɔ nhyehyɛe: Roma Ntɔs na ɛwɔ soro paa! Dodoɔ a atɔfoɔ hia boro deɛ afuo mu mpaninfoɔ bɛtumi atwa no so ɔha nkyekyɛm 42. Sɛ wodua seesei a, wobɛtwa December mu a boɔ no yɛ GH₵ 185 kɔsi 220.',
      },
      {
        id: 'scotch-pepper',
        name: 'Scotch Bonnet & Shito Pepper',
        twiName: 'Mako Kɔkɔɔ / Shito',
        cropType: 'pepper',
        category: 'Spices & Peppers',
        demandIndex: 91,
        demandTrend: 'up',
        projectedDeficitPercent: 35,
        currentPrice: 120,
        projectedPriceAtHarvest: 'GH₵ 150 – 180 / basket',
        growthDurationDays: 85,
        recommendedPlantingWindow: 'Plant by Oct 10',
        projectedHarvestMonth: 'Mid December',
        estimatedRoiPercent: 62,
        offtakerCommitmentCount: 26,
        recommendationTag: 'High Margin',
        tagColor: 'bg-[#ffdbcf] text-[#380d00]',
        icon: '🌶️',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuB0i5X6QkeKci4w4n2-WWM-p3Yyx8tPaat_Bui54dVm6tjF_EuVaYdUXZT-Id-kVh8O_DHf2DRAFZw_1Fscc5FkJkinf340ieK9uj_dPpbzsjptpRc7sieADS6JYENiTsS8w5GNQNCT2GGUll3JYFoPZiubbwCReGtRAHZIuOe2qI9s2LaqFyjQzPYZN1bQxSKGvF9aYC7OC6REOSL011TE9fFlhrHhOTqfFrcPFdDJFktKC_X4m5fmJg',
        whyPlantNow:
          'Local sauce factories and catering chains in Kasoa are placing forward purchase orders with a 35% margin premium over standard vegetable crops.',
        twiSpeech:
          'Mako kɔkɔɔ nso ho hia paa. Atɔfoɔ 26 ayɛ krado sɛ wɔbɛtɔ. Boɔ no bɛkɔ soro abɛyɛ GH₵ 150 kɔsi 180 wɔ basket baako biara ho.',
      },
      {
        id: 'red-onion',
        name: 'Bawku Red Onions',
        twiName: 'Gyeene Kɔkɔɔ',
        cropType: 'onion',
        category: 'Alliums',
        demandIndex: 82,
        demandTrend: 'up',
        projectedDeficitPercent: 28,
        currentPrice: 195,
        projectedPriceAtHarvest: 'GH₵ 230 – 260 / maxi bag',
        growthDurationDays: 105,
        recommendedPlantingWindow: 'Plant by Oct 15',
        projectedHarvestMonth: 'January 2027',
        estimatedRoiPercent: 54,
        offtakerCommitmentCount: 19,
        recommendationTag: 'Stable Yield',
        tagColor: 'bg-[#e1e3dd] text-[#191c19]',
        icon: '🧅',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDFbK9gO2Kj5i9Yq2e-w_x-P_x-mK2-wK4-x_k-mK4-mK2-wK4-mK2-wK4-mK2-wK4-mK2-wK4-mK2-wK4-mK2-wK4-mK2-wK4',
        whyPlantNow:
          'High storability and resistance to heat transit. Post-festive January prices traditionally spike as Northern supply winds down.',
        twiSpeech:
          'Gyeene kɔkɔɔ: Ɛporɔ ntɛm nti sɛ wodua seesei a wobɛtwa no January a boɔ no bɛforo akɔ GH₵ 260 ma bag baako.',
      },
      {
        id: 'apem-plantain',
        name: 'Apem Cooking Plantain',
        twiName: 'Brɔdeɛ Apem Monoo',
        cropType: 'cassava',
        category: 'Staples & Fruits',
        demandIndex: 74,
        demandTrend: 'stable',
        projectedDeficitPercent: 15,
        currentPrice: 110,
        projectedPriceAtHarvest: 'GH₵ 130 – 145 / bunch',
        growthDurationDays: 270,
        recommendedPlantingWindow: 'Early minor rains planting',
        projectedHarvestMonth: 'Continuous / Long term',
        estimatedRoiPercent: 45,
        offtakerCommitmentCount: 14,
        recommendationTag: 'Stable Yield',
        tagColor: 'bg-[#e1e3dd] text-[#191c19]',
        icon: '🍌',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAAbLKLQxuVwfdV9I49m2xrRsMJZpB2-VpkWgbHIFr1h-xYXXm4wWLEgTu_SSLg067WtOGrxkD_rol077coisAoXt3PdatyIQpTaad-qVWBOBsjCFxG9_o3I__Ey5-HUiWwc9mwPygQ7WQqKeY5ID0ji1P--Rj6WJaFHFGJPxHn6PDMGn1GOmTOc6CE2DpxyDlG6hWsb6Lsoiwb4AVlb2GBltTYyV5iRzdwMpTpXkWKAIKFyQ6qP7hg9Q',
        whyPlantNow:
          'Consistent baseline chop-bar and food vendor demand across Cape Coast and Mankessim. Low input cost after establishment.',
        twiSpeech:
          'Brɔdeɛ apem monoo: Gua so hia daa. Ɛnyɛ na na mfasoɔ nso bɛba bere a wotwa no.',
      },
    ],
  },
  {
    regionId: 'bono_east',
    regionName: 'Bono East (Techiman Hub)',
    subText: 'Techiman • Wenchi • Nkoranza',
    activeBuyerCount: 112,
    forecastWindow: 'Q4 2026 Exchange Flow',
    marketDeficitSummary:
      'Regional grain aggregators and tomato processors are actively seeking forward contracts. High demand for long-shelf-life varieties.',
    topCrops: [
      {
        id: 'derma-plum',
        name: 'Derma Plum Processing Tomatoes',
        twiName: 'Derma Ntɔs Kɛseɛ',
        cropType: 'roma',
        category: 'Vegetables',
        demandIndex: 94,
        demandTrend: 'up',
        projectedDeficitPercent: 38,
        currentPrice: 140,
        projectedPriceAtHarvest: 'GH₵ 175 – 205 / crate',
        growthDurationDays: 78,
        recommendedPlantingWindow: 'Plant immediately',
        projectedHarvestMonth: 'Late November',
        estimatedRoiPercent: 65,
        offtakerCommitmentCount: 42,
        recommendationTag: 'Top Pick',
        tagColor: 'bg-[#aeeecb] text-[#002114]',
        icon: '🍅',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuACIu7RQGXHe15akJLYKvTk3wecz7Lne9pnyFhKjk4ZgB1xuo9T_O_NxvJuEZ89j6q0tbN7UYKpbLpu1KH-uKomuDNUN3ymsZjmm1W1hXTHV4hCPGvwzOmYiHtYTcinC7xeb7xcEirURy8JqWh9tC2sdj2i7BuVHzTXMB6y4FYCVJv-2F4kZVsyj5mAk-sZBOoJH108Gwhxig9W2P3YbiTuK3C04L4X7h2fnUtJba9CzvkO0XzX8JAbVg',
        whyPlantNow:
          'Techiman aggregation depots have locked in bulk buyer contracts for industrial tomato paste processors requiring firm plum fruit.',
        twiSpeech:
          'Bono East Techiman: Derma Ntɔs na agye din. Nnuane yɛ adwumakuo no pɛ sɛ wɔgye crates 10,000 wɔ November.',
      },
      {
        id: 'white-yam',
        name: 'Pona Export White Yam',
        twiName: 'Bayere Pona',
        cropType: 'cassava',
        category: 'Tubers',
        demandIndex: 88,
        demandTrend: 'up',
        projectedDeficitPercent: 30,
        currentPrice: 280,
        projectedPriceAtHarvest: 'GH₵ 340 – 380 / 100 tubers',
        growthDurationDays: 180,
        recommendedPlantingWindow: 'Early mound planting',
        projectedHarvestMonth: 'January 2027',
        estimatedRoiPercent: 58,
        offtakerCommitmentCount: 22,
        recommendationTag: 'High Margin',
        tagColor: 'bg-[#ffdbcf] text-[#380d00]',
        icon: '🥔',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAHp3_-xISIy4CHvrwjnRtU1j2rbk8Ao-geo01tJ1-qrar4DhwFtuXyPBwhhXuKWU9QgxjrffX-4lummvVVIr2251o1vUurCdSqOkepYFnxiyImRbM2GjHV2k_mN1GekWEQR-N3YnxI2KyeXHwGu_2MzKoJzAQirUJz6dsI50QjDb6yyXswmHuB52pLHLwYbzgL6D_1NcTf-TDGcKtMQeCY5khV7oo1Dabxsv0r5NGkrOh3Lr557wR_fQ',
        whyPlantNow:
          'Export aggregators through Tema Harbour pay premium dollar-pegged cash rates for unblemished Pona yams.',
        twiSpeech:
          'Pona bayere: Export atɔfoɔ pɛ bayere pa. Mfasoɔ a ɛwɔ mu no yɛ kɛseɛ paa.',
      },
    ],
  },
  {
    regionId: 'ashanti',
    regionName: 'Ashanti Region (Kejetia Hub)',
    subText: 'Kumasi • Ejura • Offinso',
    activeBuyerCount: 95,
    forecastWindow: 'Q4 2026 Urban Demand',
    marketDeficitSummary:
      'Urban Kumasi hospitality and catering demand is expanding. Vegetables with fast 60-75 day cycles show highest liquidity.',
    topCrops: [
      {
        id: 'round-tomato',
        name: 'Petome Round Salad Tomatoes',
        twiName: 'Ntrowa Kɔkɔɔ (Petome)',
        cropType: 'round',
        category: 'Vegetables',
        demandIndex: 90,
        demandTrend: 'up',
        projectedDeficitPercent: 36,
        currentPrice: 145,
        projectedPriceAtHarvest: 'GH₵ 175 – 210 / crate',
        growthDurationDays: 70,
        recommendedPlantingWindow: 'Plant by Sep 30',
        projectedHarvestMonth: 'Late November',
        estimatedRoiPercent: 60,
        offtakerCommitmentCount: 31,
        recommendationTag: 'Top Pick',
        tagColor: 'bg-[#aeeecb] text-[#002114]',
        icon: '🍅',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA716typTYoQbNuhLutDCJbmdbA3dbb4GJCmeam_FmnD0ccutHlzJXVnpB1ZQzoc3-svuht_0YV4FpuDkvJBU1tA3BFC_BITa4QHiGcenq6m4J9yS3z8mRfoCvLLHZZxeKIXYrVaGxDkd8RpIWKlkvaaAb3GCn-FftcGn9eRQseJoHjbFUTz-kqF4Ezw68R7d2ETlJFYlHGO4ckgNLyZFl-8Q27gQiNXwTYvoa_PFE-iYHiocp0gcV_Zw',
        whyPlantNow:
          'Kumasi hotels and chop bars prefer round Petome tomatoes for fresh salads and quick-cooking gravies. 31 buyer commitments logged.',
        twiSpeech:
          'Ashanti Kejetia: Petome ntɔs na ɛrekɔ nkoaa. Hotels ne adidibea akɛseɛ no rehwehwɛ crates bebree.',
      },
    ],
  },
];

export const DemandAnalytics: React.FC = () => {
  const { playSpeech, setActiveTab, showToast } = useApp();

  const [selectedRegionId, setSelectedRegionId] = useState<string>('central');
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState<'60_days' | '90_days' | 'full_season'>(
    '60_days'
  );
  const [selectedCropId, setSelectedCropId] = useState<string>('roma-tomato');

  const currentRegion =
    REGIONAL_DEMAND_FORECASTS.find((r) => r.regionId === selectedRegionId) ||
    REGIONAL_DEMAND_FORECASTS[0];

  const selectedCrop =
    currentRegion.topCrops.find((c) => c.id === selectedCropId) || currentRegion.topCrops[0];

  const handlePlayVoiceAnalytics = () => {
    playSpeech(
      selectedCrop.twiSpeech,
      `Demand Analytics: ${selectedCrop.name}`
    );
  };

  const handlePlanThisCrop = () => {
    showToast(`Added ${selectedCrop.name} to planting calendar & pre-harvest queue!`);
    setActiveTab('sell');
    playSpeech(
      `Great decision! Scheduling ${selectedCrop.name} for planting. Let's pre-list your expected harvest to attract advance buyer commitments.`,
      'Planting Planner'
    );
  };

  return (
    <div className="w-full bg-white rounded-3xl p-5 shadow-xs border border-[#edefe9] space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#013a13] text-[#b1f0ce] flex items-center justify-center shadow-xs">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              insights
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-black text-[#191c19] leading-tight">
                Crop Demand Analytics
              </h2>
              <span className="px-1.5 py-0.5 rounded-full bg-[#ffdbcf] text-[#380d00] text-[9px] font-black uppercase">
                Forecast AI
              </span>
            </div>
            <p className="text-xs text-[#2c694e] font-semibold">
              Dua Deɛ Ɛbɛtɔn • What to Plant Next
            </p>
          </div>
        </div>

        <button
          onClick={handlePlayVoiceAnalytics}
          className="w-10 h-10 rounded-full bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#013a13] flex items-center justify-center active:scale-95 transition-transform cursor-pointer shadow-2xs"
          title="Listen in Twi"
          type="button"
          aria-label="Listen to demand forecast in Akan Twi"
        >
          <span className="material-symbols-outlined text-[20px]">volume_up</span>
        </button>
      </div>

      {/* Region Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {REGIONAL_DEMAND_FORECASTS.map((reg) => {
          const isSelected = reg.regionId === currentRegion.regionId;
          return (
            <button
              key={reg.regionId}
              type="button"
              onClick={() => {
                setSelectedRegionId(reg.regionId);
                setSelectedCropId(reg.topCrops[0]?.id || '');
              }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#013a13] text-white shadow-xs'
                  : 'bg-[#f2f4ee] text-[#414940] hover:bg-[#e7e9e3]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">
                {isSelected ? 'location_on' : 'explore'}
              </span>
              <span>{reg.regionName.split('(')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Planning Time Horizon Bar */}
      <div className="grid grid-cols-3 p-1 bg-[#f2f4ee] rounded-2xl gap-1 text-[11px] font-bold">
        <button
          type="button"
          onClick={() => setSelectedTimeHorizon('60_days')}
          className={`py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer ${
            selectedTimeHorizon === '60_days'
              ? 'bg-white text-[#013a13] shadow-xs'
              : 'text-[#71796f] hover:text-[#191c19]'
          }`}
        >
          60-75 Days (Quick)
        </button>
        <button
          type="button"
          onClick={() => setSelectedTimeHorizon('90_days')}
          className={`py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer ${
            selectedTimeHorizon === '90_days'
              ? 'bg-white text-[#013a13] shadow-xs'
              : 'text-[#71796f] hover:text-[#191c19]'
          }`}
        >
          90-120 Days
        </button>
        <button
          type="button"
          onClick={() => setSelectedTimeHorizon('full_season')}
          className={`py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer ${
            selectedTimeHorizon === 'full_season'
              ? 'bg-white text-[#013a13] shadow-xs'
              : 'text-[#71796f] hover:text-[#191c19]'
          }`}
        >
          Full Season (Tubers)
        </button>
      </div>

      {/* Market Deficit Alert Banner */}
      <div className="p-3 bg-[#aeeecb]/40 rounded-2xl border border-[#2c694e]/30 flex items-start gap-2.5">
        <span
          className="material-symbols-outlined text-[20px] text-[#2c694e] flex-shrink-0 mt-0.5"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          trending_up
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-[#013a13] uppercase tracking-wide">
              {currentRegion.regionName} Forecast
            </span>
            <span className="text-[10px] font-bold text-[#2c694e] bg-white px-2 py-0.5 rounded-full">
              {currentRegion.activeBuyerCount} Buyers Active
            </span>
          </div>
          <p className="text-xs text-[#191c19] mt-0.5 leading-snug font-medium">
            {currentRegion.marketDeficitSummary}
          </p>
        </div>
      </div>

      {/* Visual Chart: Forecasted Demand Index & Supply Deficit Comparison */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-[#191c19] uppercase tracking-wider">
            Comparative Demand Ranking
          </span>
          <span className="text-[11px] text-[#71796f] font-semibold">
            Tap crop to inspect
          </span>
        </div>

        <div className="space-y-2.5">
          {currentRegion.topCrops.map((crop) => {
            const isSelected = selectedCrop?.id === crop.id;
            return (
              <div
                key={crop.id}
                onClick={() => setSelectedCropId(crop.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#013a13] bg-[#f8faf4] ring-2 ring-[#013a13]/20 shadow-xs'
                    : 'border-[#edefe9] bg-white hover:bg-[#f8faf4]'
                }`}
              >
                {/* Crop Name & Badges */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg flex-shrink-0">{crop.icon}</span>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-[#191c19] block truncate">
                        {crop.name}
                      </span>
                      <span className="text-[10px] text-[#2c694e] font-semibold block truncate">
                        {crop.twiName} • {crop.growthDurationDays} days cycle
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${crop.tagColor}`}
                    >
                      {crop.recommendationTag}
                    </span>
                    <span className="text-xs font-black text-[#013a13]">
                      {crop.demandIndex}/100
                    </span>
                  </div>
                </div>

                {/* Animated Comparative Progress Bar */}
                <div className="w-full bg-[#e7e9e3] h-2.5 rounded-full overflow-hidden flex items-center relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      crop.demandIndex >= 90
                        ? 'bg-[#013a13]'
                        : crop.demandIndex >= 80
                        ? 'bg-[#2c694e]'
                        : 'bg-[#5b1b00]'
                    }`}
                    style={{ width: `${crop.demandIndex}%` }}
                  ></div>
                </div>

                {/* Metric Summary Strip */}
                <div className="flex items-center justify-between text-[11px] text-[#414940] mt-2 pt-1 border-t border-[#edefe9]">
                  <span className="font-bold text-[#2c694e] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">arrow_upward</span>
                    <span>+{crop.projectedDeficitPercent}% Supply Deficit</span>
                  </span>

                  <span className="font-extrabold text-[#191c19]">
                    Est: {crop.projectedPriceAtHarvest}
                  </span>

                  <span className="text-[10px] text-[#71796f] font-semibold">
                    {crop.offtakerCommitmentCount} Buyers
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Crop Deep-Dive Recommendation Card */}
      {selectedCrop && (
        <div className="p-4 bg-gradient-to-br from-[#013a13] to-[#1e5128] text-white rounded-3xl shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={selectedCrop.image}
                alt={selectedCrop.name}
                className="w-14 h-14 rounded-2xl object-cover border border-white/20 flex-shrink-0 shadow-xs"
              />
              <div className="min-w-0">
                <span className="text-[10px] text-[#b1f0ce] uppercase font-bold tracking-wider block">
                  Planting Recommendation
                </span>
                <h3 className="text-base font-black text-white truncate">
                  {selectedCrop.name}
                </h3>
                <span className="text-xs text-[#aeeecb] font-medium block">
                  {selectedCrop.twiName}
                </span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="text-xs text-white/70 block uppercase font-medium">Est. Margin</span>
              <span className="text-lg font-black text-[#b1f0ce]">
                +{selectedCrop.estimatedRoiPercent}% ROI
              </span>
            </div>
          </div>

          <p className="text-xs text-white/90 leading-relaxed bg-white/10 p-3 rounded-2xl border border-white/15">
            "{selectedCrop.whyPlantNow}"
          </p>

          {/* Quick Schedule Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-white/10 border border-white/10">
              <span className="text-[10px] text-white/70 block uppercase">Planting Window</span>
              <span className="text-[11px] font-bold text-white block mt-0.5">
                🌱 {selectedCrop.recommendedPlantingWindow}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-white/10 border border-white/10">
              <span className="text-[10px] text-white/70 block uppercase">Projected Harvest</span>
              <span className="text-[11px] font-bold text-[#b1f0ce] block mt-0.5">
                📅 {selectedCrop.projectedHarvestMonth}
              </span>
            </div>
          </div>

          {/* Action Button: Schedule / Pre-Commit */}
          <button
            type="button"
            onClick={handlePlanThisCrop}
            className="w-full h-12 bg-white hover:bg-[#f2f4ee] text-[#013a13] rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
            <span>Plan &amp; Pre-Commit {selectedCrop.name}</span>
          </button>
        </div>
      )}
    </div>
  );
};
