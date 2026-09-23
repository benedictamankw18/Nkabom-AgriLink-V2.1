import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export interface SeasonalTip {
  id: string;
  title: string;
  twiTitle: string;
  category: 'pest_defense' | 'spoilage_prevention' | 'soil_water' | 'harvest_timing';
  urgency: 'high' | 'recommended' | 'best_practice';
  targetCrops: string[];
  summary: string;
  actionSteps: string[];
  impactBenefit: string;
  timingWindow: string;
  twiSpeech: string;
  icon: string;
}

export interface MonthSeasonalProfile {
  monthName: string;
  seasonName: string;
  twiSeason: string;
  agroClimateSummary: string;
  temperatureRange: string;
  rainfallStatus: string;
  tips: SeasonalTip[];
}

const REGIONS = [
  { id: 'central', name: 'Central Region (Pilot Zone)', agroZone: 'Coastal Savanna / Semi-Deciduous' },
  { id: 'bono_east', name: 'Bono East (Techiman)', agroZone: 'Transition Zone' },
  { id: 'ashanti', name: 'Ashanti (Kumasi / Ejura)', agroZone: 'Deciduous Forest' },
  { id: 'greater_accra', name: 'Greater Accra / Kasoa', agroZone: 'Coastal Plains' },
];

const MONTHLY_PROFILES: Record<string, MonthSeasonalProfile> = {
  September: {
    monthName: 'September',
    seasonName: 'Minor Rainy Season (Second Crop Cycle)',
    twiSeason: 'Nsuo Ketewa Bere • Nnɔbae Foforɔ Dua',
    agroClimateSummary:
      'Frequent morning mist followed by hot sunny afternoons (28–31°C). High relative humidity (75–85%) accelerates fungal spores on tomatoes and peppers.',
    temperatureRange: '24°C – 31°C',
    rainfallStatus: 'Moderate Intermittent Showers (50–90mm)',
    tips: [
      {
        id: 'sep-1',
        title: 'Blight & Wilt Defense: Afternoon Row Aeration',
        twiTitle: 'Blight ne Nsuo Porɔ Kwan Sio',
        category: 'pest_defense',
        urgency: 'high',
        targetCrops: ['Roma Tomatoes', 'Pepper', 'Garden Eggs'],
        summary:
          'Warm humidity in September creates ideal breeding grounds for Early Blight and Bacterial Wilt. Proper staking and lower-leaf pruning prevent ground-splash infection.',
        actionSteps: [
          'Prune lower yellowing leaves within 15cm of soil surface to stop soil-splash pathogens.',
          'Stake tomato vines using bamboo or sturdy sticks to maximize breeze flow.',
          'Spray organic neem seed oil extract or copper oxychloride in early morning (not afternoon sun).',
        ],
        impactBenefit: 'Reduces fungal vine dieback by 40% and keeps fruit clean for Grade A sorting.',
        timingWindow: 'Apply every 7–10 days during cloudy spells',
        twiSpeech:
          'September mprɛprɛ wiem tebea: Nsuo ne awia bɔ a ɛde ntɔs yareɛ ba. Twitwa nhaban a aborɔ firi aseɛ no na bɔ dua no kyekyere dua so na mframa atumi abɔ mu yie.',
        icon: 'pest_control',
      },
      {
        id: 'sep-2',
        title: 'Morning Picking Window: Stop Solar Heat Trap',
        twiTitle: 'Anɔpa Twa: Si Awia Hyehyeɛ Kwan',
        category: 'harvest_timing',
        urgency: 'high',
        targetCrops: ['Roma Tomatoes', 'Round Tomatoes', 'Leafy Greens'],
        summary:
          'Picking ripe tomatoes after 10:30 AM raises internal fruit pulp temperature to 35°C, triggering rapid ethylene gas release and softness before reaching Makola.',
        actionSteps: [
          'Begin field harvesting strictly between 6:00 AM and 10:00 AM.',
          'Transfer picked produce into shaded holding stations within 20 minutes.',
          'Never leave harvested crates uncovered under direct coastal sunlight.',
        ],
        impactBenefit: 'Adds 48 hours of firmness and shelf life during feeder truck transit.',
        timingWindow: 'Strict daily picking rule (6:00 AM – 10:00 AM)',
        twiSpeech:
          'Twa wo nnuane anɔpa ntsɛm ansa na awia ahyɛden. Sɛ awia bɔ ntɔs no a, ɛbɛyɛ mmrɔkrɔ ntɛm wɔ kar kwan so.',
        icon: 'wb_twilight',
      },
      {
        id: 'sep-3',
        title: 'Replace Overfilled Baskets with Ventilated Wooden Crates',
        twiTitle: 'Fa Crates a Mframa Duru Mu Si Kɛntɛn Ananmu',
        category: 'spoilage_prevention',
        urgency: 'recommended',
        targetCrops: ['Tomatoes', 'Peppers'],
        summary:
          'Traditional cane baskets (kɛntɛn) flex under road vibrations, squashing 20–30% of tomatoes at the bottom. Standardized 25kg crates support stacking without pressure on the fruit.',
        actionSteps: [
          'Use 25kg rigid wooden or plastic agro-crates with side ventilation slots.',
          'Line the bottom of crates with clean dried grass or recycled corrugated paper.',
          'Stack crates no more than 5 levels high in transport canters with tied cross-straps.',
        ],
        impactBenefit: 'Prevents crate-crush loss, saving up to 8 crates per 100 loaded.',
        timingWindow: 'At every harvest sorting depot',
        twiSpeech:
          'Kɛntɛn kɛseɛ no mia ntɔs no ase ma ɛporɔ. Fa crates a ɛmu dwo na fa sie sunsuma mu na kar no rekɔ a emu biara remmia.',
        icon: 'inventory_2',
      },
      {
        id: 'sep-4',
        title: 'Minor Season Mulching & Soil Moisture Retention',
        twiTitle: 'Fa Nwura Sie Asase No So Ma Nsuo Ntumi Nka Mu',
        category: 'soil_water',
        urgency: 'best_practice',
        targetCrops: ['Peppers', 'Onions', 'Plantain'],
        summary:
          'Dry spells between September showers can cause flower drop and blossom-end rot. Organic mulch preserves topsoil moisture and moderates root temperature.',
        actionSteps: [
          'Spread a 5cm layer of dry elephant grass or corn stalks around plant root zones.',
          'Keep mulch 5cm away from the main stem to avoid collar rot.',
          'Top-dress with compost or decomposed poultry manure before laying mulch.',
        ],
        impactBenefit: 'Conserves 50% more irrigation water and prevents fruit blossom-end rot.',
        timingWindow: 'Apply immediately after weeding',
        twiSpeech:
          'Fa nwura wura asase no so na nsuo anworo ntɛm. Ɛbɛma mako ne gyeene no anyin kɛseɛ na nhwiren no antoto.',
        icon: 'eco',
      },
    ],
  },
  October: {
    monthName: 'October',
    seasonName: 'Peak Minor Season Flowering & Fruit Set',
    twiSeason: 'Nhwiren Pa Bere • Afuo Ahosiesie',
    agroClimateSummary:
      'Decreasing rainfall and increasing daytime temperatures. High pollinator activity; timely pest scouting is crucial before fruit sizing.',
    temperatureRange: '25°C – 32°C',
    rainfallStatus: 'Tapering Showers (30–60mm)',
    tips: [
      {
        id: 'oct-1',
        title: 'Fruit Borer & Whitefly Scouting at Dawn',
        twiTitle: 'Mmoawa Nhwehwɛmu Wɔ Anɔpahema',
        category: 'pest_defense',
        urgency: 'high',
        targetCrops: ['Tomatoes', 'Peppers'],
        summary:
          'Helicoverpa caterpillars bore into green tomatoes when small. Inspect leaf undersides early morning and introduce yellow sticky traps.',
        actionSteps: [
          'Install yellow sticky card traps at canopy height every 15 meters.',
          'Spray Bacillus thuringiensis (Bt) or bio-neem extract once first instars appear.',
          'Hand-pick and destroy visibly punctured green fruit to break pest cycle.',
        ],
        impactBenefit: 'Stops fruit puncture rot before harvest maturity.',
        timingWindow: 'Twice-weekly scouting at 6:30 AM',
        twiSpeech:
          'Hwɛ mmoawa a wɔbɔ ntɔs no tokuro. Fa akoraa anɔpa kɔhwɛ nhaban ase na bɔ neem extract ansa na mmoawa no adɔ.',
        icon: 'bug_report',
      },
      {
        id: 'oct-2',
        title: 'Potassium Top-Dressing for Fruit Firmness',
        twiTitle: 'Aduane a Ɛhyɛ Ntɔs No Den',
        category: 'soil_water',
        urgency: 'recommended',
        targetCrops: ['Roma Tomatoes', 'Bawku Onions'],
        summary:
          'Application of potassium sulfate or wood ash increases cell wall thickness, preventing skin splitting during unexpected late October storms.',
        actionSteps: [
          'Side-dress plants with potassium fertilizer (MOP or SOP) at 5g per plant.',
          'Alternatively, dust sifted wood ash around plant drip lines.',
          'Water immediately after fertilizer placement.',
        ],
        impactBenefit: 'Produces deep red, firm fruit that withstands 3-hour transit to Accra.',
        timingWindow: 'At 50% flowering stage',
        twiSpeech:
          'Gu potassium fertilizer ma ntɔs no ho nyɛ den na sɛ wotwa kɔ Makola a antoto anaa anporɔ ntɛm.',
        icon: 'compost',
      },
      {
        id: 'oct-3',
        title: 'Pre-Harvest Buyer Coordination 3 Weeks Ahead',
        twiTitle: 'Hyia Atɔfoɔ Mprɛprɛ Ansa Na Woatwa',
        category: 'harvest_timing',
        urgency: 'high',
        targetCrops: ['All Produce'],
        summary:
          'Lining up wholesale commitments 20 days prior to cutting eliminates distress selling at farmgate and locks in stable depot pricing.',
        actionSteps: [
          'List your estimated harvest date and crate quantity on Nkabom AgriLink.',
          'Request shared haulage to coordinate vehicle space with neighboring farmers.',
          'Agree on Grade A inspection benchmarks with verified buyers in advance.',
        ],
        impactBenefit: 'Zero roadside rotting; locks guaranteed minimum price.',
        timingWindow: '2–3 weeks before first harvest pick',
        twiSpeech:
          'Fa wo nnuane dodoɔ to app no so seesei na atɔfoɔ ahyɛ bɔ ansa na woatwa. Ɛno si loss kwan.',
        icon: 'handshake',
      },
    ],
  },
  November: {
    monthName: 'November',
    seasonName: 'Maturation, Pre-Harvest & Early Harvest Window',
    twiSeason: 'Nnuane Twa Mmere • Ahosiesie Kɛseɛ',
    agroClimateSummary:
      'Dry sunny weather dominant across Central and Southern corridors. High road travel efficiency; critical to prevent harvest sun-scald.',
    temperatureRange: '26°C – 33°C',
    rainfallStatus: 'Dry Season Onset (<20mm)',
    tips: [
      {
        id: 'nov-1',
        title: 'Sun-Scald Prevention on Exposed Fruit Clusters',
        twiTitle: 'Si Awia Hyehyeɛ Kwan Wɔ Ntɔs No So',
        category: 'harvest_timing',
        urgency: 'high',
        targetCrops: ['Tomatoes', 'Peppers'],
        summary:
          'Direct harsh sunlight on unshaded fruit causes white sun-scald patches that rot within 24 hours. Maintain canopy cover during final maturation.',
        actionSteps: [
          'Avoid severe pruning in November to retain natural foliage shading.',
          'Harvest fruit at the breaker (pink blush) stage rather than full-red in the field.',
          'Allow pink fruit to ripen naturally in cool, ventilated depot rooms.',
        ],
        impactBenefit: 'Eliminates 90% of field sun-scald blemishes.',
        timingWindow: 'Harvest at breaker/pink stage',
        twiSpeech:
          'Mma awia nnhye ntɔs no. Twa no bere a ayɛ pink kakra, na ma no nyin wɔ sunsuma mu wɔ depot.',
        icon: 'wb_sunny',
      },
      {
        id: 'nov-2',
        title: 'Depot Pre-Cooling & Tarpaulin Airflow in Transit',
        twiTitle: 'Depot Nhyehyɛe ne Kar Mu Mframa',
        category: 'spoilage_prevention',
        urgency: 'recommended',
        targetCrops: ['All Vegetables'],
        summary:
          'Covering cargo trucks with tight black plastic traps heat inside. Use breathable canvas or insulated tarpaulins with a 10cm air gap above crates.',
        actionSteps: [
          'Allow crates to rest in cool aggregation depots for 2 hours before vehicle loading.',
          'Use light-colored breathable tarpaulins.',
          'Schedule truck departure during late afternoon (3:00 PM) or night for arrival at Makola dawn.',
        ],
        impactBenefit: 'Maintains fresh crate appearance and prevents interior heat sweating.',
        timingWindow: 'Pre-transit loading',
        twiSpeech:
          'Fa tarpaulin a mframa tumi fa mu kata kar no so. Mfa black plastic nkata so efisɛ ɛbɛhye nnuane no.',
        icon: 'local_shipping',
      },
    ],
  },
  December: {
    monthName: 'December',
    seasonName: 'Peak Festive Harvest & Harmattan Onset',
    twiSeason: 'Buronya Bere • Harmattan Mmere',
    agroClimateSummary:
      'Dry Harmattan winds from the north. High evaporative moisture loss. Highest market spot prices of the entire year.',
    temperatureRange: '22°C – 33°C (Cool nights, dry days)',
    rainfallStatus: 'Dry Season (<10mm)',
    tips: [
      {
        id: 'dec-1',
        title: 'Capitalize on Festive Price Surges with Gradual Staggered Harvest',
        twiTitle: 'Twa Ntɔs No Nkakra Nkakra Wɔ Buronya Yi',
        category: 'harvest_timing',
        urgency: 'high',
        targetCrops: ['Tomatoes', 'Peppers', 'Onions', 'Plantain'],
        summary:
          'Wholesale prices in Makola and Kejetia peak between Dec 18 and Dec 24. Harvest in 3-day waves to capture maximum festive margins.',
        actionSteps: [
          'Sort into Grade A (firm, uniform) for premium wholesale buyers.',
          'Consolidate transport trips via shared logistics to reduce festive haulage premiums.',
          'Keep harvested crates in shaded, humidified depot rooms.',
        ],
        impactBenefit: 'Maximizes farm revenue by up to 45% compared to lump-sum bulk selling.',
        timingWindow: 'Dec 10 – Dec 24',
        twiSpeech:
          'Buronya bere yi boɔ no kɔ soro paa. Twa no nkakra nkakra na fa kɔ gua so na woanya sika pii.',
        icon: 'payments',
      },
      {
        id: 'dec-2',
        title: 'Harmattan Desiccation Defense: Light Depot Spritzing',
        twiTitle: 'Harmattan Wiem Tebea: Mma Ntɔs No Mmmrɔntɔ',
        category: 'spoilage_prevention',
        urgency: 'recommended',
        targetCrops: ['Vegetables', 'Tubers'],
        summary:
          'Harmattan dry air causes leafy vegetables and tomatoes to shrivel and lose weight. Lightly wet the depot floor to maintain room humidity.',
        actionSteps: [
          'Sprinkle clean water on the concrete depot floor (not directly on fruit skin).',
          'Keep storage room windows screened to block dry dust while allowing airflow.',
        ],
        impactBenefit: 'Retains 98% of fresh crate weight during holding.',
        timingWindow: 'Daily during Harmattan dry winds',
        twiSpeech:
          'Harmattan mframa no twa nsuo firi nnuane no mu. Petepete nsuo wɔ depot fam no na ewiem ayɛ nwunu.',
        icon: 'water_drop',
      },
    ],
  },
};

export const FarmingTips: React.FC = () => {
  const { playSpeech, showToast, setActiveTab } = useApp();

  const [selectedMonth, setSelectedMonth] = useState<string>('September');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('central');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTipId, setExpandedTipId] = useState<string | null>('sep-1');
  const [appliedTips, setAppliedTips] = useState<Record<string, boolean>>({});

  const currentProfile = MONTHLY_PROFILES[selectedMonth] || MONTHLY_PROFILES['September'];
  const currentRegion = REGIONS.find((r) => r.id === selectedRegionId) || REGIONS[0];

  const filteredTips = currentProfile.tips.filter((tip) => {
    if (selectedCategory === 'all') return true;
    return tip.category === selectedCategory;
  });

  const handleToggleApply = (tipId: string, tipTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !appliedTips[tipId];
    setAppliedTips((prev) => ({ ...prev, [tipId]: nextState }));
    if (nextState) {
      showToast(`Marked as applied: ${tipTitle}`);
    }
  };

  const handlePlayVoice = (tip: SeasonalTip, e: React.MouseEvent) => {
    e.stopPropagation();
    playSpeech(tip.twiSpeech, `Farming Tip: ${tip.title}`);
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
              lightbulb
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-black text-[#191c19] leading-tight">
                Seasonal Farming Tips
              </h2>
              <span className="px-1.5 py-0.5 rounded-full bg-[#b1f0ce] text-[#002114] text-[9px] font-black uppercase">
                {selectedMonth} Advice
              </span>
            </div>
            <p className="text-xs text-[#2c694e] font-semibold">
              Afuo mu Nyansapɛ • Personalized for Your Hub
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            playSpeech(
              `${currentProfile.seasonName} wɔ ${currentRegion.name}. ${currentProfile.agroClimateSummary}`,
              `Seasonal Guide: ${selectedMonth}`
            )
          }
          className="w-10 h-10 rounded-full bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#013a13] flex items-center justify-center active:scale-95 transition-transform cursor-pointer shadow-2xs"
          title="Listen in Twi"
          type="button"
          aria-label="Listen to seasonal advice in Akan Twi"
        >
          <span className="material-symbols-outlined text-[20px]">volume_up</span>
        </button>
      </div>

      {/* Selectors Bar: Month & Region */}
      <div className="space-y-2 pt-0.5">
        {/* Month Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          {Object.keys(MONTHLY_PROFILES).map((month) => {
            const isSelected = selectedMonth === month;
            return (
              <button
                key={month}
                type="button"
                onClick={() => setSelectedMonth(month)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#013a13] text-white shadow-xs'
                    : 'bg-[#f2f4ee] text-[#414940] hover:bg-[#e7e9e3]'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {isSelected ? 'calendar_month' : 'today'}
                </span>
                <span>{month}</span>
              </button>
            );
          })}
        </div>

        {/* Region Selector Dropdown / Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          {REGIONS.map((reg) => {
            const isSelected = selectedRegionId === reg.id;
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => setSelectedRegionId(reg.id)}
                className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#aeeecb] text-[#002114] border-[#2c694e]/40 font-bold'
                    : 'bg-white text-[#414940] border-[#edefe9] hover:bg-[#f8faf4]'
                }`}
              >
                📍 {reg.name.split('(')[0].trim()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Seasonal Profile Context Card */}
      <div className="p-3.5 bg-gradient-to-r from-[#013a13] to-[#1e5128] text-white rounded-2xl shadow-xs space-y-2 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] text-[#b1f0ce] uppercase font-bold tracking-wider block">
              {currentRegion.name} • {currentRegion.agroZone}
            </span>
            <h3 className="text-sm font-black text-white mt-0.5">
              {currentProfile.seasonName}
            </h3>
            <span className="text-[11px] text-[#aeeecb] font-medium block">
              {currentProfile.twiSeason}
            </span>
          </div>

          <div className="text-right flex-shrink-0">
            <span className="text-[10px] text-white/70 block uppercase font-medium">Temp Range</span>
            <span className="text-xs font-black text-[#b1f0ce]">
              {currentProfile.temperatureRange}
            </span>
          </div>
        </div>

        <p className="text-xs text-white/90 leading-relaxed pt-1 border-t border-white/15">
          {currentProfile.agroClimateSummary}
        </p>

        <div className="flex items-center justify-between text-[10px] text-white/80 pt-0.5">
          <span>🌧️ {currentProfile.rainfallStatus}</span>
          <span className="text-[#aeeecb] font-bold">
            {Object.values(appliedTips).filter(Boolean).length} of {currentProfile.tips.length} Applied
          </span>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1 text-xs font-semibold">
        {[
          { id: 'all', label: 'All Tips' },
          { id: 'pest_defense', label: 'Pest & Blight' },
          { id: 'spoilage_prevention', label: 'Post-Harvest Loss' },
          { id: 'harvest_timing', label: 'Picking Timing' },
          { id: 'soil_water', label: 'Soil & Moisture' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex-shrink-0 px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#013a13] text-white font-bold shadow-2xs'
                : 'bg-[#f2f4ee] text-[#414940] hover:bg-[#e7e9e3]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tips List */}
      <div className="space-y-3 pt-1">
        {filteredTips.map((tip) => {
          const isExpanded = expandedTipId === tip.id;
          const isApplied = !!appliedTips[tip.id];

          return (
            <div
              key={tip.id}
              onClick={() => setExpandedTipId(isExpanded ? null : tip.id)}
              className={`rounded-2xl border transition-all cursor-pointer p-3.5 space-y-2.5 ${
                isApplied
                  ? 'border-[#2c694e] bg-[#f8faf4]'
                  : isExpanded
                  ? 'border-[#013a13] bg-white ring-2 ring-[#013a13]/15 shadow-xs'
                  : 'border-[#edefe9] bg-white hover:bg-[#f8faf4]'
              }`}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      tip.urgency === 'high'
                        ? 'bg-[#ffdbcf] text-[#5b1b00]'
                        : 'bg-[#aeeecb] text-[#002114]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {tip.icon}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-black text-[#191c19] truncate">
                        {tip.title}
                      </span>
                      {tip.urgency === 'high' && (
                        <span className="px-1.5 py-0.2 rounded-full bg-[#ffdbcf] text-[#380d00] text-[9px] font-black uppercase">
                          Priority
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#2c694e] font-semibold block truncate">
                      {tip.twiTitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handlePlayVoice(tip, e)}
                    className="p-1 rounded-lg bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#2c694e] transition-transform active:scale-95"
                    title="Listen in Twi"
                  >
                    <span className="material-symbols-outlined text-[16px]">volume_up</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleToggleApply(tip.id, tip.title, e)}
                    className={`p-1 rounded-lg transition-transform active:scale-95 ${
                      isApplied
                        ? 'bg-[#013a13] text-white'
                        : 'bg-[#f2f4ee] text-[#71796f] hover:text-[#191c19]'
                    }`}
                    title={isApplied ? 'Applied to field' : 'Mark as applied'}
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={isApplied ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      check_circle
                    </span>
                  </button>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-[#414940] leading-snug">
                {tip.summary}
              </p>

              {/* Target crops badges */}
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#edefe9]">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[10px] text-[#71796f]">Crops:</span>
                  {tip.targetCrops.map((c) => (
                    <span
                      key={c}
                      className="px-1.5 py-0.2 rounded-md bg-[#f2f4ee] text-[#191c19] text-[9px] font-bold"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <span className="text-[10px] text-[#013a13] font-bold flex items-center gap-0.5">
                  <span>{isExpanded ? 'Less' : 'Steps'}</span>
                  <span className="material-symbols-outlined text-[14px]">
                    {isExpanded ? 'expand_less' : 'expand_more'}
                  </span>
                </span>
              </div>

              {/* Expanded Action Steps */}
              {isExpanded && (
                <div className="pt-2 border-t border-[#edefe9] space-y-2 text-xs animate-in fade-in duration-150">
                  <div className="p-2.5 bg-[#f8faf4] rounded-xl border border-[#e1e3dd] space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-[#013a13] block">
                      Recommended Action Steps:
                    </span>
                    <ul className="space-y-1 text-[11px] text-[#414940]">
                      {tip.actionSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-[#013a13] text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Impact Benefit Box */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#aeeecb]/30 border border-[#2c694e]/20 text-[11px]">
                    <span className="font-bold text-[#013a13] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#2c694e]">
                        verified
                      </span>
                      <span>Impact: {tip.impactBenefit}</span>
                    </span>
                    <span className="text-[10px] text-[#2c694e] font-semibold">
                      {tip.timingWindow}
                    </span>
                  </div>

                  {/* Bottom Action Shortcut */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('sell');
                      }}
                      className="text-[11px] font-bold text-[#013a13] hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">add_circle</span>
                      <span>List Harvest Using This Tip</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleToggleApply(tip.id, tip.title, e)}
                      className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-xl transition-all ${
                        isApplied
                          ? 'bg-[#013a13] text-white'
                          : 'bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#013a13]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {isApplied ? 'done_all' : 'check'}
                      </span>
                      <span>{isApplied ? 'Applied to Farm' : 'Mark as Applied'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
