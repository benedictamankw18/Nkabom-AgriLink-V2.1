import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export interface AgroWeatherHub {
  id: string;
  name: string;
  region: string;
  twiName: string;
  badge: string;
  tempC: number;
  feelsLikeC: number;
  condition: string;
  icon: string;
  humidityPercent: number;
  rainRiskPercent: number;
  windSpeedKmH: number;
  uvIndex: string;
  harvestWindow: string;
  harvestRecommendation: string;
  logisticsAdvisory: string;
  spoilageRiskRating: 'low' | 'moderate' | 'high';
  transitCorridorStatus: string;
  twiSpeech: string;
  threeDayForecast: {
    day: string;
    tempHigh: number;
    tempLow: number;
    condition: string;
    icon: string;
    rainRisk: number;
  }[];
}

const AGRO_HUBS: AgroWeatherHub[] = [
  {
    id: 'mankessim',
    name: 'Mankessim Hub',
    region: 'Central Region (Pilot Zone)',
    twiName: 'Mankessim Beae',
    badge: 'Pilot Corridor',
    tempC: 31,
    feelsLikeC: 35,
    condition: 'Partly Cloudy & Warm',
    icon: 'partly_cloudy_day',
    humidityPercent: 72,
    rainRiskPercent: 10,
    windSpeedKmH: 14,
    uvIndex: 'High (8)',
    harvestWindow: '6:00 AM – 10:30 AM',
    harvestRecommendation:
      'Harvest before 10:30 AM before ambient heat spikes. Stack produce in shaded, ventilated crates to avoid heat compression.',
    logisticsAdvisory:
      'Dry highway conditions on Mankessim – Winneba – Kasoa link. Recommended dispatch: Early afternoon before urban congestion.',
    spoilageRiskRating: 'moderate',
    transitCorridorStatus: 'Clear • 2h 15m to Makola',
    twiSpeech:
      'Mankessim wiem tebea: 31 degrees Celsius, awia bɛpue kakra. Twa wo ntɔs anɔpa ntsɛntsɛm ansa na awia ayɛ den. Kwan no so yɛ kɔsi Kasoa.',
    threeDayForecast: [
      { day: 'Today', tempHigh: 31, tempLow: 24, condition: 'Partly Cloudy', icon: 'partly_cloudy_day', rainRisk: 10 },
      { day: 'Thu (Sep 24)', tempHigh: 30, tempLow: 23, condition: 'Morning Sun', icon: 'wb_sunny', rainRisk: 20 },
      { day: 'Fri (Sep 25)', tempHigh: 29, tempLow: 23, condition: 'Light Breeze', icon: 'cloud', rainRisk: 15 },
    ],
  },
  {
    id: 'assin_fosu',
    name: 'Assin Fosu Station',
    region: 'Central Region (Forest Belt)',
    twiName: 'Assin Fosu Kwaebirentuo',
    badge: 'Rain Alert',
    tempC: 28,
    feelsLikeC: 31,
    condition: 'Afternoon Showers Expected',
    icon: 'rainy',
    humidityPercent: 84,
    rainRiskPercent: 55,
    windSpeedKmH: 10,
    uvIndex: 'Moderate (5)',
    harvestWindow: '6:30 AM – 11:30 AM',
    harvestRecommendation:
      'Afternoon showers expected at 2:00 PM. Cut early and cover trucks with waterproof tarps to prevent moisture mold and fruit split.',
    logisticsAdvisory:
      'Unpaved farmgate feeder roads will turn slick by 3:00 PM. High-clearance vehicles or Aboboyaa tricycles required.',
    spoilageRiskRating: 'high',
    transitCorridorStatus: 'Slick Feeder Lanes • Cover Crates',
    twiSpeech:
      'Assin Fosu wiem tebea: Nsuo bɛtɔ anwummerɛ yi. Twa wo nnuane anɔpa na fa tarpaulin kata kar a nnuane gu so no so yie.',
    threeDayForecast: [
      { day: 'Today', tempHigh: 28, tempLow: 22, condition: 'Showers (55%)', icon: 'rainy', rainRisk: 55 },
      { day: 'Thu (Sep 24)', tempHigh: 27, tempLow: 22, condition: 'Rain Drops', icon: 'rainy', rainRisk: 60 },
      { day: 'Fri (Sep 25)', tempHigh: 29, tempLow: 22, condition: 'Clearing Sun', icon: 'partly_cloudy_day', rainRisk: 25 },
    ],
  },
  {
    id: 'techiman',
    name: 'Techiman Market Hub',
    region: 'Bono East (Grain & Tomato Exchange)',
    twiName: 'Techiman Gua Kɛseɛ',
    badge: 'Dry & Sunny',
    tempC: 33,
    feelsLikeC: 36,
    condition: 'Hot & Clear Skies',
    icon: 'wb_sunny',
    humidityPercent: 46,
    rainRiskPercent: 0,
    windSpeedKmH: 18,
    uvIndex: 'Very High (9)',
    harvestWindow: '7:00 AM – 11:00 AM',
    harvestRecommendation:
      'Dry weather is ideal for sorting and curing yam and picking firm tomatoes. Move crates to shade immediately to prevent sunburn.',
    logisticsAdvisory:
      'Excellent transit conditions along the Kumasi corridor. High truck availability at Northern Transit Gate.',
    spoilageRiskRating: 'low',
    transitCorridorStatus: 'Optimal Transit • Road Dry',
    twiSpeech:
      'Techiman wiem tebea: Awia bɔ kɛseɛ 33 degrees. Nsuo renntɔ. Ɛyɛ berɛ pa a wobɛtwa wo nnɔbaeɛ nanso fa sie sunsuma mu ntɛm.',
    threeDayForecast: [
      { day: 'Today', tempHigh: 33, tempLow: 21, condition: 'Hot & Sunny', icon: 'wb_sunny', rainRisk: 0 },
      { day: 'Thu (Sep 24)', tempHigh: 34, tempLow: 22, condition: 'Clear Sky', icon: 'wb_sunny', rainRisk: 5 },
      { day: 'Fri (Sep 25)', tempHigh: 32, tempLow: 21, condition: 'Mild Haze', icon: 'sunny_snowing', rainRisk: 10 },
    ],
  },
  {
    id: 'kasoa',
    name: 'Kasoa Depot Gate',
    region: 'Central / Greater Accra Link',
    twiName: 'Kasoa Gua Ano',
    badge: 'High Demand Node',
    tempC: 30,
    feelsLikeC: 34,
    condition: 'Humid & Gentle Breeze',
    icon: 'wb_cloudy',
    humidityPercent: 78,
    rainRiskPercent: 15,
    windSpeedKmH: 16,
    uvIndex: 'High (7)',
    harvestWindow: 'Morning Receiving Hub',
    harvestRecommendation:
      'Heavy afternoon vehicle congestion near Budumburam. Plan dispatches from farmgate to arrive before 2:00 PM for wholesale buyers.',
    logisticsAdvisory:
      'Offloading bays active at New Market Aggregator terminal. Shared haulage trucks arriving hourly from Mankessim.',
    spoilageRiskRating: 'moderate',
    transitCorridorStatus: 'Moderate Traffic past 1:00 PM',
    twiSpeech:
      'Kasoa wiem tebea: 30 degrees, nsuo renntɔ kɛseɛ. Nanso kar kwan so bɛyɛ basabasa anwummerɛ nti fa kar no ba ntɛm.',
    threeDayForecast: [
      { day: 'Today', tempHigh: 30, tempLow: 24, condition: 'Humid Breeze', icon: 'air', rainRisk: 15 },
      { day: 'Thu (Sep 24)', tempHigh: 31, tempLow: 25, condition: 'Partly Sunny', icon: 'partly_cloudy_day', rainRisk: 15 },
      { day: 'Fri (Sep 25)', tempHigh: 30, tempLow: 24, condition: 'Scattered Clouds', icon: 'cloud', rainRisk: 20 },
    ],
  },
  {
    id: 'kumasi',
    name: 'Kumasi Kejetia Bay',
    region: 'Ashanti Regional Depot',
    twiName: 'Kejetia Gua, Kumasi',
    badge: 'Cool Transit',
    tempC: 29,
    feelsLikeC: 31,
    condition: 'Overcast & Cool Cloud Cover',
    icon: 'cloud',
    humidityPercent: 71,
    rainRiskPercent: 20,
    windSpeedKmH: 12,
    uvIndex: 'Moderate (6)',
    harvestWindow: 'All-Day Transit Window',
    harvestRecommendation:
      'Overcast weather provides ideal transit ambient temperature (26-29°C), protecting tomato firmness and halting rot in transit.',
    logisticsAdvisory:
      'Kejetia wholesale bays receiving inter-regional haulage. Quick turnaround for refrigerated and insulated box vans.',
    spoilageRiskRating: 'low',
    transitCorridorStatus: 'Smooth Flow • Low Heat Risk',
    twiSpeech:
      'Kumasi Kejetia wiem tebea: Mununkum wɔ soro, ewiem yɛ dɛ 29 degrees. Ɛyɛ mmerɛ pa papaapa a kar betumi de nnuane afiri mfikyifiri aba gua so.',
    threeDayForecast: [
      { day: 'Today', tempHigh: 29, tempLow: 22, condition: 'Overcast', icon: 'cloud', rainRisk: 20 },
      { day: 'Thu (Sep 24)', tempHigh: 28, tempLow: 22, condition: 'Light Drizzle', icon: 'rainy', rainRisk: 35 },
      { day: 'Fri (Sep 25)', tempHigh: 30, tempLow: 23, condition: 'Sunny Breaks', icon: 'partly_cloudy_day', rainRisk: 15 },
    ],
  },
];

export const AgroWeatherForecast: React.FC = () => {
  const { playSpeech, setActiveTab } = useApp();
  const [selectedHubId, setSelectedHubId] = useState<string>('mankessim');
  const [showThreeDay, setShowThreeDay] = useState<boolean>(false);

  const hub = AGRO_HUBS.find((h) => h.id === selectedHubId) || AGRO_HUBS[0];

  const handlePlayVoiceForecast = () => {
    playSpeech(hub.twiSpeech, `Weather Forecast: ${hub.name}`);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-5 shadow-xs border border-[#edefe9] space-y-4">
      {/* Header with Title and Twi Speech Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#013a13] text-[#b1f0ce] flex items-center justify-center shadow-xs">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              thermostat
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-black text-[#191c19] leading-tight">
                Agro Weather &amp; Logistics
              </h2>
              <span className="px-1.5 py-0.5 rounded-full bg-[#b1f0ce] text-[#002114] text-[9px] font-black uppercase">
                Live Radar
              </span>
            </div>
            <p className="text-xs text-[#2c694e] font-semibold">
              Wiem Tebea • Harvest Planning
            </p>
          </div>
        </div>

        <button
          onClick={handlePlayVoiceForecast}
          className="w-10 h-10 rounded-full bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#013a13] flex items-center justify-center active:scale-95 transition-transform cursor-pointer shadow-2xs"
          title="Listen in Twi"
          type="button"
          aria-label="Listen to weather forecast in Akan Twi"
        >
          <span className="material-symbols-outlined text-[20px]">volume_up</span>
        </button>
      </div>

      {/* Hub Switcher Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {AGRO_HUBS.map((h) => {
          const isSelected = h.id === hub.id;
          return (
            <button
              key={h.id}
              onClick={() => setSelectedHubId(h.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#013a13] text-white shadow-xs'
                  : 'bg-[#f2f4ee] text-[#414940] hover:bg-[#e7e9e3]'
              }`}
              type="button"
            >
              <span className="truncate">{h.name}</span>
              <span
                className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-white text-[#013a13]'
                }`}
              >
                {h.tempC}°
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Condition Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#013a13] to-[#1e5128] text-white p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#b1f0ce] font-bold uppercase tracking-wider">
                {hub.region}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-semibold">
                {hub.badge}
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-0.5">{hub.name}</h3>
            <span className="text-xs text-[#aeeecb] font-medium block">
              {hub.twiName}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <span
                className="material-symbols-outlined text-[36px] text-[#ffdbcf]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {hub.icon}
              </span>
              <span className="text-3xl font-black text-white">{hub.tempC}°C</span>
            </div>
            <span className="text-[11px] text-[#b1f0ce] font-semibold">
              Feels like {hub.feelsLikeC}°C
            </span>
          </div>
        </div>

        {/* Current Condition Name */}
        <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#b1f0ce] animate-pulse"></span>
            {hub.condition}
          </span>
          <span className="text-[#aeeecb] text-[11px] font-medium">
            Window: <strong>{hub.harvestWindow}</strong>
          </span>
        </div>

        {/* 4-Pillar Metric Strip */}
        <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-white/10 text-center">
          <div className="p-1.5 rounded-xl bg-white/10">
            <span className="material-symbols-outlined text-[16px] text-[#b1f0ce] block mx-auto">
              water_drop
            </span>
            <span className="text-[10px] text-white/70 block uppercase">Humidity</span>
            <span className="text-xs font-black text-white">{hub.humidityPercent}%</span>
          </div>

          <div className="p-1.5 rounded-xl bg-white/10">
            <span className="material-symbols-outlined text-[16px] text-[#b1f0ce] block mx-auto">
              rainy
            </span>
            <span className="text-[10px] text-white/70 block uppercase">Rain Risk</span>
            <span className="text-xs font-black text-white">{hub.rainRiskPercent}%</span>
          </div>

          <div className="p-1.5 rounded-xl bg-white/10">
            <span className="material-symbols-outlined text-[16px] text-[#b1f0ce] block mx-auto">
              air
            </span>
            <span className="text-[10px] text-white/70 block uppercase">Wind</span>
            <span className="text-xs font-black text-white">{hub.windSpeedKmH} km/h</span>
          </div>

          <div className="p-1.5 rounded-xl bg-white/10">
            <span className="material-symbols-outlined text-[16px] text-[#b1f0ce] block mx-auto">
              sunny
            </span>
            <span className="text-[10px] text-white/70 block uppercase">UV Index</span>
            <span className="text-xs font-black text-white">{hub.uvIndex}</span>
          </div>
        </div>
      </div>

      {/* Harvest Logistics & Spoilage Prevention Panel */}
      <div className="p-3.5 bg-[#f8faf4] rounded-2xl border border-[#e1e3dd] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#191c19] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#2c694e]">
              agriculture
            </span>
            <span>Harvest &amp; Picking Window:</span>
          </span>

          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
              hub.spoilageRiskRating === 'low'
                ? 'bg-[#aeeecb] text-[#002114]'
                : hub.spoilageRiskRating === 'moderate'
                ? 'bg-amber-100 text-amber-900'
                : 'bg-rose-100 text-rose-900'
            }`}
          >
            {hub.spoilageRiskRating === 'low'
              ? '🛡️ Low Spoilage Risk'
              : hub.spoilageRiskRating === 'moderate'
              ? '⚠️ Moderate Heat Risk'
              : '🚨 High Moisture Rot Risk'}
          </span>
        </div>

        <p className="text-xs text-[#414940] leading-relaxed">
          {hub.harvestRecommendation}
        </p>

        {/* Corridor Transport Advisory */}
        <div className="pt-2 border-t border-[#edefe9] flex items-start gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#013a13] mt-0.5 flex-shrink-0">
            local_shipping
          </span>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold text-[#191c19] block">
              Freight Corridor Status: {hub.transitCorridorStatus}
            </span>
            <span className="text-[11px] text-[#414940] leading-tight block mt-0.5">
              {hub.logisticsAdvisory}
            </span>
          </div>
        </div>
      </div>

      {/* 3-Day Forecast Toggle Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowThreeDay(!showThreeDay)}
            className="text-xs font-bold text-[#013a13] flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">calendar_view_week</span>
            <span>{showThreeDay ? 'Hide 3-Day Forecast' : 'View 3-Day Harvest Outlook'}</span>
            <span className="material-symbols-outlined text-[16px]">
              {showThreeDay ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sell')}
            className="text-xs font-bold text-[#2c694e] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>🚚 Coordinate Hauler</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        {showThreeDay && (
          <div className="grid grid-cols-3 gap-2 pt-1 animate-in fade-in duration-200">
            {hub.threeDayForecast.map((fc, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-[#f2f4ee] border border-[#edefe9] text-center flex flex-col items-center justify-between min-h-[90px]"
              >
                <span className="text-[10px] font-bold text-[#71796f] block truncate">
                  {fc.day}
                </span>

                <span
                  className="material-symbols-outlined text-[22px] text-[#013a13] my-1"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {fc.icon}
                </span>

                <div className="text-xs font-black text-[#191c19]">
                  {fc.tempHigh}° <span className="text-[10px] text-[#71796f] font-normal">/ {fc.tempLow}°</span>
                </div>

                <span className="text-[9px] font-semibold text-[#2c694e] mt-0.5">
                  💧 {fc.rainRisk}% Rain
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
