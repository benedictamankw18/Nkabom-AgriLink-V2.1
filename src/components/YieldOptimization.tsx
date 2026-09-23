import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export interface CropInfo {
  id: string;
  name: string;
  twiName: string;
  icon: string;
  category: string;
}

export interface WeatherHubContext {
  id: string;
  name: string;
  region: string;
  tempC: number;
  humidityPercent: number;
  rainRiskPercent: number;
  condition: string;
  icon: string;
}

export interface FertilizerRecommendation {
  id: string;
  title: string;
  formulation: string;
  purpose: string;
  targetBenefit: string;
  weatherReason: string;
  dosageAcre: string;
  dosageKnapsack: string;
  method: 'Foliar Spray' | 'Basal Soil Ring' | 'Side-Dressing' | 'Soil Drench';
  timingWindow: string;
  twiSpeech: string;
  badge: string;
}

export interface PestControlRecommendation {
  id: string;
  targetPest: string;
  twiPest: string;
  threatLevel: 'critical' | 'high' | 'moderate';
  weatherCatalyst: string;
  bioTechnique: string;
  chemicalAlt: string;
  culturalPractice: string;
  safetyInterval: string;
  twiSpeech: string;
  icon: string;
}

const CROPS: CropInfo[] = [
  { id: 'tomatoes', name: 'Roma Tomatoes', twiName: 'Pepere Ntɔs', icon: '🍅', category: 'Solanaceae' },
  { id: 'peppers', name: 'Scotch Bonnet Pepper', twiName: 'Kpakpo Shito', icon: '🌶️', category: 'Capsicum' },
  { id: 'onions', name: 'Bawku Onions', twiName: 'Bawku Gyeene', icon: '🧅', category: 'Alliums' },
  { id: 'cassava', name: 'Bankye (Cassava)', twiName: 'Bankye Pa', icon: '🥔', category: 'Tubers' },
  { id: 'yam', name: 'Pona / White Yam', twiName: 'Pona Bayere', icon: '🍠', category: 'Tubers' },
  { id: 'maize', name: 'Maize (Obatanpa)', twiName: 'Aburoo', icon: '🌽', category: 'Cereals' },
];

const WEATHER_HUBS: WeatherHubContext[] = [
  {
    id: 'assin_fosu',
    name: 'Assin Fosu Station',
    region: 'Central Region (Forest Belt)',
    tempC: 28,
    humidityPercent: 84,
    rainRiskPercent: 55,
    condition: 'Afternoon Showers (84% RH)',
    icon: 'rainy',
  },
  {
    id: 'mankessim',
    name: 'Mankessim Hub',
    region: 'Central Region (Pilot Zone)',
    tempC: 31,
    humidityPercent: 72,
    rainRiskPercent: 10,
    condition: 'Warm & Humid (72% RH)',
    icon: 'partly_cloudy_day',
  },
  {
    id: 'techiman',
    name: 'Techiman Market Hub',
    region: 'Bono East (Savanna Transition)',
    tempC: 33,
    humidityPercent: 46,
    rainRiskPercent: 0,
    condition: 'Hot & Dry (46% RH, 33°C)',
    icon: 'wb_sunny',
  },
  {
    id: 'kasoa',
    name: 'Kasoa Depot Gate',
    region: 'Central / Greater Accra Link',
    tempC: 30,
    humidityPercent: 78,
    rainRiskPercent: 15,
    condition: 'Coastal Breeze (78% RH)',
    icon: 'wb_cloudy',
  },
];

export const YieldOptimization: React.FC = () => {
  const { playSpeech, showToast, t, language } = useApp();

  const [selectedCropId, setSelectedCropId] = useState<string>('tomatoes');
  const [selectedHubId, setSelectedHubId] = useState<string>('assin_fosu');
  const [activeTab, setActiveTab] = useState<'fertilizer' | 'pest' | 'calculator'>('fertilizer');
  const [farmAcreage, setFarmAcreage] = useState<number>(1.0);
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  const activeCrop = CROPS.find((c) => c.id === selectedCropId) || CROPS[0];
  const activeHub = WEATHER_HUBS.find((h) => h.id === selectedHubId) || WEATHER_HUBS[0];

  const isHighHumidity = activeHub.humidityPercent >= 70 || activeHub.rainRiskPercent >= 40;
  const isHighHeat = activeHub.tempC >= 32;

  // Build dynamic weather-calibrated agronomic recommendations
  const getCropWeatherPrescriptions = (): {
    weatherSummary: {
      alertBadge: string;
      headline: string;
      analysis: string;
      fieldAction: string;
      twiSummary: string;
    };
    fertilizers: FertilizerRecommendation[];
    pests: PestControlRecommendation[];
  } => {
    if (activeCrop.id === 'tomatoes') {
      if (isHighHumidity) {
        return {
          weatherSummary: {
            alertBadge: 'High Fungal & Leaching Risk',
            headline: 'High Humidity (84%) & Rain Showers in Assin Fosu',
            analysis:
              'Prolonged leaf wetness combined with 28°C promotes rapid germination of Early Blight (Alternaria) and Bacterial Wilt spores. Soluble nitrogen applied on surface risks rapid leaching into subsoil.',
            fieldAction:
              'Avoid heavy surface Urea. Switch to slow-release split NPK 15-15-15 ring application. Spray foliar Calcium Nitrate with copper protector early morning before afternoon rains.',
            twiSummary:
              'Assin Fosu nsuo ne mframa kɛseɛ bɛtumi de ntɔs yareɛ ba. Mfa Urea pii ngu fam seesei na nsuo rensisi sika no mfa nkɔ. Fa NPK kakra gu ho na fa Calcium aduru gu ahaban no so anɔpa ntsɛntsɛm.',
          },
          fertilizers: [
            {
              id: 'tom-f1',
              title: 'Calcium Nitrate [Ca(NO3)2] + Boron Booster',
              formulation: '15.5% N + 26% CaO + 0.3% B',
              purpose: 'Prevents Blossom End Rot & strengthens cell walls against fungal penetration',
              targetBenefit: '+35% marketable Grade A crates, prevents fruit splitting',
              weatherReason: 'High moisture swings cause irregular calcium mobility in xylem vessels',
              dosageAcre: '1 bag (25 kg) per acre / 2 weeks',
              dosageKnapsack: '60g per 15L Knapsack sprayer tank',
              method: 'Foliar Spray',
              timingWindow: '6:30 AM – 8:30 AM (Strictly before rain)',
              twiSpeech:
                'Calcium Nitrate ne Boron aduru ma ntɔs no mu yɛ den na ano amporɔ. Gu 60g wɔ Knapsack mu anɔpa ansa na awia abɔ anaasɛ nsuo atɔ.',
              badge: 'Rain Calibrated',
            },
            {
              id: 'tom-f2',
              title: 'NPK 15-15-15 + Zinc (Split Top-Dress)',
              formulation: '15-15-15 + 1% Zn',
              purpose: 'Balanced continuous feeding without excessive succulent foliage',
              targetBenefit: 'Promotes steady flowering and firm root anchoring',
              weatherReason: 'Split application prevents nitrogen runoff during afternoon showers',
              dosageAcre: '2 bags (100 kg) per acre in 2 split bands',
              dosageKnapsack: 'Apply 1 milk tin (150g) per 3 tomato plants in ring',
              method: 'Basal Soil Ring',
              timingWindow: 'Morning or late afternoon on damp soil',
              twiSpeech:
                'NPK 15-15-15 aduru ma ntɔs nhwiren pue yie. Gu no nketenkete na nsuo annhoro no ankɔ.',
              badge: 'Split Dosage',
            },
            {
              id: 'tom-f3',
              title: 'Soluble Potassium Sulphate (K2O)',
              formulation: '0-0-50 + 17% S',
              purpose: 'Thickens fruit cuticle skin and intensifies uniform red color',
              targetBenefit: 'Prevents transit bruising and crate crushing on Makola highway',
              weatherReason: 'High humidity slows natural cuticle hardening',
              dosageAcre: '1 bag (25 kg) per acre at fruit swell',
              dosageKnapsack: '50g per 15L Knapsack tank',
              method: 'Foliar Spray',
              timingWindow: 'Late afternoon on overcast days',
              twiSpeech:
                'Potassium aduru ma ntɔs hono yɛ den na kar mu akwantu anntetew mu.',
              badge: 'Firmness Shield',
            },
          ],
          pests: [
            {
              id: 'tom-p1',
              targetPest: 'Early & Late Blight (Alternaria / Phytophthora)',
              twiPest: 'Ntɔs Ahaban Porɔ Yareɛ',
              threatLevel: 'critical',
              weatherCatalyst: 'Relative humidity > 80% with leaves remaining wet > 6 hours',
              bioTechnique: 'Neem seed oil (Azadirachtin 0.03%) + Trichoderma harzianum soil drench',
              chemicalAlt: 'Copper Oxychloride 50 WP or Mancozeb 80 WP preventive spray',
              culturalPractice: 'Prune bottom 15cm yellowing leaves and stake vines to bamboo poles',
              safetyInterval: 'Pre-harvest interval: 3 days',
              twiSpeech:
                'Ntɔs ahaban porɔ yareɛ ho aduru: Twitwa ahaban a ɛbɛn fam no na fa Neem aduru anaasɛ Copper fitaa gu so anɔpa.',
              icon: 'coronavirus',
            },
            {
              id: 'tom-p2',
              targetPest: 'Tomato Leafminer (Tuta Absoluta)',
              twiPest: 'Ntɔs Mmoawa a Wɔwe Ahaban',
              threatLevel: 'high',
              weatherCatalyst: 'Warm cloudy spells foster rapid egg incubation on leaf undersides',
              bioTechnique: 'Yellow/Delta pheromone sticky traps (8 traps/acre) + Bacillus thuringiensis (Bt)',
              chemicalAlt: 'Emamectin Benzoate 5% SG (10g per 15L tank)',
              culturalPractice: 'Remove and burn silver leaf-mines immediately; do not compost infected leaves',
              safetyInterval: 'Pre-harvest interval: 5 days',
              twiSpeech:
                'Tuta Absoluta mmoawa: Bɔ mfididua a ɛyɛ akokɔsradeɛ kyere wɔn, na fa Emamectin anaasɛ Bt aduru gu so anwummerɛ.',
              icon: 'pest_control',
            },
          ],
        };
      } else {
        // Hot & Dry (Techiman)
        return {
          weatherSummary: {
            alertBadge: 'Heat Stress & Blossom Drop Alert',
            headline: 'Hot & Sunny (33°C, 46% RH) in Techiman Market Hub',
            analysis:
              'Excessive transpiration and soil surface evaporation (>33°C) cause calcium transport failure to blossom ends, resulting in sunken black fruit rot (*Kasaa*). High heat also accelerates Red Spider Mite proliferation.',
            fieldAction:
              'Apply foliar Calcium Nitrate at dawn (6:00 AM) while stomata are open. Apply straw mulching around root zones to conserve soil moisture. Mist plants with neem oil to deter spider mites.',
            twiSummary:
              'Techiman awia kɛseɛ no ma ntɔs nhwiren gu na ano porɔ. Fa kɔmputa straw kata fam na nsuo annhye. Gu Calcium aduru anɔpa hema ansa na awia ahyɛ.',
          },
          fertilizers: [
            {
              id: 'tom-f4',
              title: 'Foliar Calcium Nitrate + Fulvic Acid',
              formulation: '15.5% N + 26% CaO',
              purpose: 'Emergency foliar rescue to stop Blossom End Rot (*Kasaa*)',
              targetBenefit: 'Saves 20–30% of developing fruits from black tip abortion',
              weatherReason: 'Root calcium uptake drops 60% when ambient soil temperatures exceed 30°C',
              dosageAcre: '25 kg per acre dissolved in irrigation or spray',
              dosageKnapsack: '75g per 15L knapsack tank',
              method: 'Foliar Spray',
              timingWindow: '6:00 AM – 7:30 AM only (stomata fully open)',
              twiSpeech:
                'Calcium aduru a yɛde si ntɔs ano porɔ kwan: Gu no anɔpa hema ansa na awia no ayɛ kɛse.',
              badge: 'Heat Defense',
            },
            {
              id: 'tom-f5',
              title: 'Enriched Well-Cured Poultry Compost (Mulch Layer)',
              formulation: 'Organic N-P-K (3-2-2) + Organic Humus',
              purpose: 'Insulates shallow roots from extreme solar heat and retains moisture',
              targetBenefit: 'Reduces irrigation water demand by 45% and improves microbial flora',
              weatherReason: 'Bare sandy-loam soils reach 42°C under direct solar radiation',
              dosageAcre: '40–50 bags (2 tonnes) per acre around root zones',
              dosageKnapsack: '1 large bowl per 2 tomato plant basins',
              method: 'Basal Soil Ring',
              timingWindow: 'Early morning application with deep watering',
              twiSpeech:
                'Nkokɔ gyae ne wura aduru a yɛde kata afum fam ma nsuo tena mu na awia anhye ntɔs nhini.',
              badge: 'Soil Insulation',
            },
          ],
          pests: [
            {
              id: 'tom-p3',
              targetPest: 'Red Spider Mites & Whiteflies',
              twiPest: 'Mmoawa Akɔkɔɔ & Mfifii Fitaa',
              threatLevel: 'high',
              weatherCatalyst: 'Dry heat (<50% RH) triggers exponential mite reproduction cycle (under 6 days)',
              bioTechnique: 'Neem oil soap emulsified wash (50ml neem + 10ml liquid soap per knapsack)',
              chemicalAlt: 'Abamectin 1.8% EC (15ml per 15L knapsack tank)',
              culturalPractice: 'Avoid stirring up dry road dust onto crops; use reflective silver row mulch',
              safetyInterval: 'Pre-harvest interval: 7 days',
              twiSpeech:
                'Mmoawa nketenkete a awia kɛseɛ de ba: Fa Neem kuro ne samina fitaa fra nsuo gu ahaban ase anɔpa.',
              icon: 'bug_report',
            },
          ],
        };
      }
    } else if (activeCrop.id === 'peppers') {
      return {
        weatherSummary: {
          alertBadge: 'Anthracnose & Flower Drop Shield',
          headline: `${activeCrop.name} • ${activeHub.condition} in ${activeHub.name}`,
          analysis:
            'Pepper blossoms drop when night temperatures fluctuate or humidity spikes. Rain splash transmits Anthracnose (*Mako kuro*) lesions that cause sunken water spots.',
          fieldAction:
            'Maintain elevated plant beds. Spray potassium silicate or copper bio-fungicide to thicken pepper pericarp wall.',
          twiSummary:
            'Mako yareɛ ne nhwiren a ɛhwe fam: Fa aduru a ɛma mako hono yɛ den gu so na ma nsuo ntumi nnyina afuo mu.',
        },
        fertilizers: [
          {
            id: 'pep-f1',
            title: 'YaraMila Winner (High Potassium NPK)',
            formulation: '15-9-20 + 2% MgO + 9% S',
            purpose: 'Stimulates heavy pungency (capsaicin), glossy sheen, and profuse flowering',
            targetBenefit: '+25% harvest pickings over 4-month continuous bearing period',
            weatherReason: 'High potassium counteracts moisture stress and prevents fruit wrinkling',
            dosageAcre: '2 bags (100 kg) per acre split-applied every 3 weeks',
            dosageKnapsack: '1 small tin (100g) ringed 10cm from base',
            method: 'Basal Soil Ring',
            timingWindow: 'Morning after soil dampening',
            twiSpeech:
              'Mako aduru pa: YaraMila Winner ma mako no yɛ hyirehyire na ɛnyini ntɛm. Gu no mako dua ase.',
            badge: 'Pungency & Gloss',
          },
          {
            id: 'pep-f2',
            title: 'Zinc-Boron Micronutrient Foliar',
            formulation: 'Zn 5% + B 2.5% Chelate',
            purpose: 'Prevents flower bud shedding during overcast or extreme heat hours',
            targetBenefit: 'Increases fruit-set retention by 40%',
            weatherReason: 'Temperature swings disrupt pollen viability',
            dosageAcre: '1 litre per acre',
            dosageKnapsack: '35ml per 15L Knapsack tank',
            method: 'Foliar Spray',
            timingWindow: 'Early morning during flowering flush',
            twiSpeech:
              'Zinc ne Boron aduru si mako nhwiren a ɛhwe fam kwan ma ɛyɛ aba pii.',
            badge: 'Flower Saver',
          },
        ],
        pests: [
          {
            id: 'pep-p1',
            targetPest: 'Anthracnose & Bacterial Spot (Colletotrichum)',
            twiPest: 'Mako Kuro & Akasanee Yareɛ',
            threatLevel: 'high',
            weatherCatalyst: 'Rain splash from bare soil transports fungal conidia onto hanging pepper pods',
            bioTechnique: 'Wood ash suspension + Garlic-Chilli extract spray + Copper bio-shield',
            chemicalAlt: 'Azoxystrobin + Difenoconazole (Amistar Top) at 15ml/tank',
            culturalPractice: 'Mulch inter-rows with clean dried grasses to suppress rain-splash onto lower pods',
            safetyInterval: 'Pre-harvest interval: 5 days',
            twiSpeech:
              'Mako kuro yareɛ: Kata fam no so na nsuo ammpitipiti fam nsonsoɔ angu aba no so.',
            icon: 'grain',
          },
        ],
      };
    } else if (activeCrop.id === 'maize') {
      return {
        weatherSummary: {
          alertBadge: 'Armyworm & Tassel Vigour',
          headline: `Maize Protocol • ${activeHub.condition} in ${activeHub.name}`,
          analysis:
            'Rapid vegetative elongation requires high nitrogen and sulfur. Intermittent heat accelerates Fall Armyworm (*Aburoo Mmoawa*) larvae feeding inside central whorls.',
          fieldAction:
            'Side-dress Urea/NPK mix in moist soil. Apply bio-insecticide directly down the leaf whorl funnels at sunset.',
          twiSummary:
            'Aburoo aduru ne mmoawa a wɔwe nsuwa no: Gu aduru no aburoo no kuru mu anwummerɛ bere a ewiem adwo.',
        },
        fertilizers: [
          {
            id: 'mz-f1',
            title: 'Urea (46% N) + Ammonium Sulphate Top-Dress',
            formulation: '46-0-0 + 24% S Blend',
            purpose: 'Boosts chlorophyll index and rapid green canopy closure',
            targetBenefit: '+40% cob weight and grain filling',
            weatherReason: 'Maize requires 80% of its nitrogen between knee-high and tasseling stages',
            dosageAcre: '2 bags (100 kg) per acre buried 5cm deep',
            dosageKnapsack: '1 soda bottle cap (25g) per plant station',
            method: 'Side-Dressing',
            timingWindow: 'At knee-high stage (V6) right after rain shower',
            twiSpeech:
              'Urea aduru ma aburoo no yɛ bruu na aso no yɛ akɛseakɛse.',
            badge: 'Cob Expander',
          },
        ],
        pests: [
          {
            id: 'mz-p1',
            targetPest: 'Fall Armyworm (Spodoptera frugiperda)',
            twiPest: 'Aburoo Kraman Mmoawa (Armyworm)',
            threatLevel: 'critical',
            weatherCatalyst: 'Dry hot afternoons accelerate caterpillar feeding inside leaf whorls',
            bioTechnique: 'Wood ash mixed with fine sand poured into whorls, or Bacillus thuringiensis (Bt)',
            chemicalAlt: 'Emamectin Benzoate 5% SG or Chlorantraniliprole (Belt Expert)',
            culturalPractice: 'Scout 20 consecutive plants in 5 field spots; treat when 10% show fresh pinholes',
            safetyInterval: 'Pre-harvest interval: 14 days',
            twiSpeech:
              'Aburoo kraman mmoawa: Gu nsonsoɔ ne anwea kakra wɔ aburoo kuru mu anwummerɛ anaasɛ fa Emamectin gu mu.',
            icon: 'pest_control',
          },
        ],
      };
    } else {
      // General Roots / Tubers / Onions
      return {
        weatherSummary: {
          alertBadge: 'Tuber Bulking & Rot Defense',
          headline: `${activeCrop.name} Protocol • ${activeHub.condition}`,
          analysis:
            'High relative humidity and warm soils require optimal phosphorus for root expansion and potassium for starch bulking without fungal root rot.',
          fieldAction:
            'Create elevated mounds or ridges for drainage. Apply high potassium side-dressing.',
          twiSummary:
            'Nnuane nhini aduru: Ma nsuo mfiri afuo mu na fa Potassium aduru ma nhini no nyini akɛse.',
        },
        fertilizers: [
          {
            id: 'gen-f1',
            title: 'Muriate of Potash (MOP) + Superphosphate',
            formulation: '0-0-60 K2O + 18% P2O5',
            purpose: 'Maximizes tuber starch conversion and root bulking density',
            targetBenefit: '+30% tuber tonnage at harvest lifting',
            weatherReason: 'Encourages root thickening while avoiding leaf rot from excess nitrogen',
            dosageAcre: '2 bags (100 kg) per acre along ridges',
            dosageKnapsack: 'Basal placement 15cm from tuber stem',
            method: 'Basal Soil Ring',
            timingWindow: 'Early morning during active bulking weeks',
            twiSpeech:
              'MOP Potassium aduru ma bankye ne bayere nhini yɛ akɛse na sika ba mu.',
            badge: 'Tuber Bulker',
          },
        ],
        pests: [
          {
            id: 'gen-p1',
            targetPest: 'Root Knot Nematodes & Stem Borers',
            twiPest: 'Nhini Mmoawa & Nkuro Yareɛ',
            threatLevel: 'moderate',
            weatherCatalyst: 'Warm moist soils accelerate microscopic nematode reproduction',
            bioTechnique: 'Neem seed cake worked into planting mounds + Marigold companion planting',
            chemicalAlt: 'Bio-nematicide (Paecilomyces lilacinus drench)',
            culturalPractice: 'Crop rotation with non-host cereals (maize/sorghum) every two cycles',
            safetyInterval: 'Pre-harvest: Organic / 0 days',
            twiSpeech:
              'Nhini mmoawa ho akwankyerɛ: Fa neem cake gu fam ansa na woato bayere anaasɛ bankye.',
            icon: 'pest_control',
          },
        ],
      };
    }
  };

  const { weatherSummary, fertilizers, pests } = getCropWeatherPrescriptions();

  // Dosage Calculator Metrics
  const calculatedBags = Math.round(farmAcreage * 2 * 10) / 10;
  const calculatedKnapsacks = Math.ceil(farmAcreage * 8);
  const calculatedWaterLitres = calculatedKnapsacks * 15;
  const estimatedCostGhs = Math.round(calculatedBags * 420);
  const estimatedYieldGainGhs = Math.round(farmAcreage * 3400);

  // Spoken Bilingual Speech Guide
  const handlePlayVoiceGuide = () => {
    const speechEnglish = `Yield Optimization advisory for ${activeCrop.name} in ${activeHub.name}. Weather conditions: ${activeHub.condition}. ${weatherSummary.headline}. ${weatherSummary.fieldAction}`;
    playSpeech(
      weatherSummary.twiSummary,
      `Yield Optimization: ${activeCrop.name}`,
      speechEnglish
    );
  };

  // SMS Dispatch Simulator
  const handleSendSmsAdvisory = () => {
    const textMsg = `🌿 Nkabom Yield Advisory for ${activeCrop.name} (${activeHub.name}):\nWeather: ${activeHub.condition}\nRule: ${weatherSummary.fieldAction}\nKey Fertilizer: ${fertilizers[0]?.title} (${fertilizers[0]?.dosageAcre})\nPest Defense: ${pests[0]?.targetPest} - ${pests[0]?.bioTechnique}\nCalculated for ${farmAcreage} Acre(s).`;
    navigator.clipboard?.writeText(textMsg);
    showToast(t('yield.sendSmsSuccess', 'Yield optimization guide dispatched via SMS!'));
    playSpeech(
      'Yield optimization guide dispatched to your linked MTN MoMo phone number via SMS.',
      'SMS Advisory Dispatched',
      'Wɔamane nnuane dodoɔ akwankyerɛ no akɔ wo MTN MoMo fon so wɔ SMS so.'
    );
  };

  // Toggle Action Completion
  const toggleAction = (id: string, name: string) => {
    setCompletedActions((prev) => {
      const next = !prev[id];
      if (next) {
        showToast(`Logged: "${name}" marked completed!`);
      }
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="w-full bg-white rounded-3xl p-5 shadow-xs border border-[#edefe9] space-y-4">
      {/* Header with Title and Twi Audio Guide */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#013a13] text-[#b1f0ce] flex items-center justify-center shadow-xs">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              psychology_alt
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-black text-[#191c19] leading-tight">
                {t('yield.title', 'Yield Optimization')}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#b1f0ce] text-[#002114] text-[9px] font-black uppercase tracking-wider">
                MoFA Calibrated
              </span>
            </div>
            <p className="text-xs text-[#2c694e] font-semibold leading-tight mt-0.5">
              {t('yield.subtitle', 'Weather-calibrated fertilizer & pest control recommendations')}
            </p>
          </div>
        </div>

        <button
          onClick={handlePlayVoiceGuide}
          className="w-10 h-10 rounded-full bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#013a13] flex items-center justify-center active:scale-95 transition-transform cursor-pointer shadow-2xs"
          title="Listen to Yield Optimization guide in Akan Twi"
          type="button"
          aria-label="Listen in Akan Twi"
        >
          <span className="material-symbols-outlined text-[20px]">volume_up</span>
        </button>
      </div>

      {/* Selectors Strip: Target Crop + Regional Weather Hub */}
      <div className="space-y-3 pt-1">
        {/* Crop Selector Chips */}
        <div>
          <label className="text-xs font-bold text-[#191c19] flex items-center justify-between mb-1.5">
            <span>{t('yield.targetCrop', 'Target Crop')}:</span>
            <span className="text-[11px] text-[#2c694e] font-semibold">
              {activeCrop.twiName} • {activeCrop.category}
            </span>
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
            {CROPS.map((crop) => {
              const isSelected = crop.id === selectedCropId;
              return (
                <button
                  key={crop.id}
                  type="button"
                  onClick={() => setSelectedCropId(crop.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#013a13] text-white shadow-xs'
                      : 'bg-[#f2f4ee] text-[#414940] hover:bg-[#e7e9e3]'
                  }`}
                >
                  <span className="text-sm">{crop.icon}</span>
                  <span>{crop.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Regional Weather Hub Selector Chips */}
        <div>
          <label className="text-xs font-bold text-[#191c19] flex items-center justify-between mb-1.5">
            <span>{t('yield.weatherHub', 'Regional Weather Hub')}:</span>
            <span className="text-[11px] font-mono text-[#013a13] font-bold">
              {activeHub.tempC}°C • {activeHub.humidityPercent}% RH
            </span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {WEATHER_HUBS.map((hub) => {
              const isSelected = hub.id === selectedHubId;
              return (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => setSelectedHubId(hub.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-[#b1f0ce]/25 border-[#013a13] ring-1 ring-[#013a13]/25 shadow-xs'
                      : 'bg-white border-[#edefe9] hover:bg-[#f2f4ee]'
                  }`}
                >
                  <div className="min-w-0">
                    <span className="text-xs font-black text-[#191c19] block truncate">
                      {hub.name}
                    </span>
                    <span className="text-[10px] text-[#414940] block truncate">
                      {hub.condition}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[#013a13] text-[20px] flex-shrink-0">
                    {hub.icon}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* DYNAMIC WEATHER IMPACT BANNER */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#f2f8f3] to-[#e6f4ea] border border-[#b1f0ce] space-y-2 relative overflow-hidden shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#013a13] text-[#b1f0ce] text-[10px] font-black uppercase tracking-wider">
            <span className="material-symbols-outlined text-[13px]">bolt</span>
            <span>{weatherSummary.alertBadge}</span>
          </span>
          <span className="text-[11px] font-semibold text-[#013a13] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">thermostat</span>
            <span>{activeHub.tempC}°C, {activeHub.humidityPercent}% RH</span>
          </span>
        </div>

        <div>
          <h3 className="text-sm font-black text-[#013a13] leading-snug">
            {weatherSummary.headline}
          </h3>
          <p className="text-xs text-[#2c694e] mt-1 leading-relaxed">
            {weatherSummary.analysis}
          </p>
        </div>

        {/* Golden Rule Action Box */}
        <div className="p-2.5 rounded-xl bg-white/90 border border-[#b1f0ce]/80 flex items-start gap-2 text-xs">
          <span className="material-symbols-outlined text-[#013a13] text-[18px] flex-shrink-0 mt-0.5">
            tips_and_updates
          </span>
          <div>
            <span className="font-extrabold text-[#013a13] block">Today's Field Rule:</span>
            <span className="text-[#191c19] leading-tight block mt-0.5">
              {weatherSummary.fieldAction}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs: Fertilizers / Pest Control / Dosage Calculator */}
      <div className="grid grid-cols-3 gap-1 bg-[#f2f4ee] p-1 rounded-2xl text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('fertilizer')}
          className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'fertilizer'
              ? 'bg-white text-[#013a13] shadow-xs'
              : 'text-[#414940] hover:text-[#191c19]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">compost</span>
          <span className="truncate">{t('yield.fertilizerTab', 'Fertilizer')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pest')}
          className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'pest'
              ? 'bg-white text-[#013a13] shadow-xs'
              : 'text-[#414940] hover:text-[#191c19]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">pest_control</span>
          <span className="truncate">{t('yield.pestTab', 'Pest Control')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('calculator')}
          className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'calculator'
              ? 'bg-white text-[#013a13] shadow-xs'
              : 'text-[#414940] hover:text-[#191c19]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">calculate</span>
          <span className="truncate">{t('yield.calculatorTab', 'Calculator')}</span>
        </button>
      </div>

      {/* TAB 1: FERTILIZER PRESCRIPTIONS */}
      {activeTab === 'fertilizer' && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs px-0.5">
            <span className="font-extrabold text-[#191c19]">
              Recommended Formulations ({fertilizers.length}):
            </span>
            <span className="text-[11px] text-[#2c694e] font-semibold">
              MoFA Ghana Approved
            </span>
          </div>

          {fertilizers.map((fert) => {
            const isDone = !!completedActions[fert.id];
            return (
              <div
                key={fert.id}
                className="p-3.5 bg-white rounded-2xl border border-[#edefe9] shadow-2xs space-y-2.5 transition-all hover:border-[#c1c9bd]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-[#013a13]">
                        {fert.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-[#f2f4ee] text-[#191c19] text-[9px] font-mono font-bold">
                        {fert.formulation}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#2c694e] font-bold block mt-0.5">
                      {fert.purpose}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-[#b1f0ce] text-[#002114] text-[9px] font-extrabold uppercase flex-shrink-0">
                    {fert.badge}
                  </span>
                </div>

                {/* Dosage & Application Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-[#f8faf4] p-2.5 rounded-xl border border-[#e1e3dd]">
                  <div>
                    <span className="text-[10px] text-[#71796f] uppercase font-bold block">
                      Per Acre Rate:
                    </span>
                    <span className="font-bold text-[#191c19] text-[11px] block mt-0.5">
                      {fert.dosageAcre}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#71796f] uppercase font-bold block">
                      Per 15L Knapsack:
                    </span>
                    <span className="font-bold text-[#191c19] text-[11px] block mt-0.5">
                      {fert.dosageKnapsack}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#71796f] uppercase font-bold block">
                      Method:
                    </span>
                    <span className="font-semibold text-[#013a13] text-[11px] flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[13px]">tune</span>
                      <span>{fert.method}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#71796f] uppercase font-bold block">
                      Timing:
                    </span>
                    <span className="font-semibold text-[#812a00] text-[11px] flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[13px]">schedule</span>
                      <span className="truncate">{fert.timingWindow}</span>
                    </span>
                  </div>
                </div>

                {/* Weather Reason Note */}
                <p className="text-[11px] text-[#414940] leading-snug">
                  <strong className="text-[#013a13]">Weather Logic: </strong>
                  {fert.weatherReason}
                </p>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-1 gap-2 border-t border-[#edefe9]">
                  <button
                    type="button"
                    onClick={() => playSpeech(fert.twiSpeech, `Fertilizer: ${fert.title}`)}
                    className="h-8 px-2.5 rounded-xl bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#013a13] text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">volume_up</span>
                    <span>Listen (Twi)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleAction(fert.id, fert.title)}
                    className={`h-8 px-3 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      isDone
                        ? 'bg-[#013a13] text-white shadow-xs'
                        : 'bg-white hover:bg-[#f2f4ee] text-[#414940] border border-[#c1c9bd]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {isDone ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>{isDone ? 'Applied Today' : 'Mark Applied'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: PEST & DISEASE DEFENSE */}
      {activeTab === 'pest' && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs px-0.5">
            <span className="font-extrabold text-[#191c19]">
              Integrated Pest Management ({pests.length}):
            </span>
            <span className="text-[11px] text-[#812a00] font-bold">
              Weather Risk Active
            </span>
          </div>

          {pests.map((pest) => {
            const isDone = !!completedActions[pest.id];
            return (
              <div
                key={pest.id}
                className="p-3.5 bg-white rounded-2xl border border-[#edefe9] shadow-2xs space-y-2.5 transition-all hover:border-[#c1c9bd]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-[#ffdbcf] text-[#5b1b00] flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[18px]">
                        {pest.icon}
                      </span>
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-[#191c19]">
                        {pest.targetPest}
                      </h4>
                      <span className="text-[10px] text-[#71796f] font-semibold">
                        {pest.twiPest}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase flex-shrink-0 ${
                      pest.threatLevel === 'critical'
                        ? 'bg-rose-100 text-rose-900 border border-rose-200'
                        : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}
                  >
                    {pest.threatLevel} Risk
                  </span>
                </div>

                {/* Weather Catalyst */}
                <div className="p-2 rounded-xl bg-[#f8faf4] border border-[#e1e3dd] text-[11px] text-[#414940]">
                  <strong className="text-[#013a13]">Weather Trigger: </strong>
                  <span>{pest.weatherCatalyst}</span>
                </div>

                {/* Bio-Technique + Cultural Practice */}
                <div className="space-y-1.5 text-xs text-[#191c19]">
                  <div className="flex items-start gap-1.5">
                    <span className="material-symbols-outlined text-[#2c694e] text-[16px] flex-shrink-0 mt-0.5">
                      eco
                    </span>
                    <div>
                      <span className="font-bold text-[#013a13]">Organic & Bio-Control: </span>
                      <span className="text-[11px] text-[#414940]">{pest.bioTechnique}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <span className="material-symbols-outlined text-[#812a00] text-[16px] flex-shrink-0 mt-0.5">
                      agriculture
                    </span>
                    <div>
                      <span className="font-bold text-[#812a00]">Cultural Barrier: </span>
                      <span className="text-[11px] text-[#414940]">{pest.culturalPractice}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#71796f] pt-1 border-t border-[#edefe9]">
                    <span>Chemical Alt: {pest.chemicalAlt}</span>
                    <span className="font-mono font-bold text-[#013a13]">{pest.safetyInterval}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1 gap-2 border-t border-[#edefe9]">
                  <button
                    type="button"
                    onClick={() => playSpeech(pest.twiSpeech, `Pest Defense: ${pest.targetPest}`)}
                    className="h-8 px-2.5 rounded-xl bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#013a13] text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">volume_up</span>
                    <span>Listen (Twi)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleAction(pest.id, pest.targetPest)}
                    className={`h-8 px-3 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      isDone
                        ? 'bg-[#013a13] text-white shadow-xs'
                        : 'bg-white hover:bg-[#f2f4ee] text-[#414940] border border-[#c1c9bd]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {isDone ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>{isDone ? 'Sprayed' : 'Mark Sprayed'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: FIELD DOSAGE CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="space-y-3.5 pt-1">
          <div className="p-4 bg-[#f8faf4] rounded-2xl border border-[#e1e3dd] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-[#191c19]">
                  Farm Acreage Dosage Scaler
                </h4>
                <p className="text-[11px] text-[#414940]">
                  Calculates exact bags &amp; knapsack tanks needed
                </p>
              </div>
              <span className="text-sm font-black text-[#013a13]">
                {farmAcreage} Acre{farmAcreage > 1 ? 's' : ''}
              </span>
            </div>

            {/* Quick Acreage Chips */}
            <div className="flex items-center gap-1.5">
              {[0.5, 1.0, 2.0, 3.0, 5.0].map((acre) => (
                <button
                  key={acre}
                  type="button"
                  onClick={() => setFarmAcreage(acre)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    farmAcreage === acre
                      ? 'bg-[#013a13] text-white shadow-xs'
                      : 'bg-white text-[#414940] border border-[#edefe9] hover:bg-[#e7e9e3]'
                  }`}
                >
                  {acre} Ac
                </button>
              ))}
            </div>

            {/* Calculated Results Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#edefe9] shadow-2xs">
                <span className="text-[10px] text-[#71796f] uppercase font-bold block">
                  Fertilizer Needed
                </span>
                <span className="text-lg font-black text-[#013a13] block mt-0.5">
                  {calculatedBags} Bags
                </span>
                <span className="text-[10px] text-[#414940]">
                  ~{calculatedBags * 50} kg total
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#edefe9] shadow-2xs">
                <span className="text-[10px] text-[#71796f] uppercase font-bold block">
                  Sprayer Tanks
                </span>
                <span className="text-lg font-black text-[#013a13] block mt-0.5">
                  {calculatedKnapsacks} Tanks
                </span>
                <span className="text-[10px] text-[#414940]">
                  {calculatedWaterLitres} Litres clean water
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#edefe9] shadow-2xs">
                <span className="text-[10px] text-[#71796f] uppercase font-bold block">
                  Est. Input Cost
                </span>
                <span className="text-base font-black text-[#5b1b00] block mt-0.5">
                  GH₵ {estimatedCostGhs.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#71796f]">Retail agro-input price</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#edefe9] shadow-2xs">
                <span className="text-[10px] text-[#71796f] uppercase font-bold block">
                  Projected Gain
                </span>
                <span className="text-base font-black text-[#2c694e] block mt-0.5">
                  +GH₵ {estimatedYieldGainGhs.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#2c694e] font-bold">Grade A sorting lift</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Quick Actions Bar: Send SMS + Direct Voice Explanation */}
      <div className="flex items-center gap-2 pt-1 border-t border-[#edefe9]">
        <button
          type="button"
          onClick={handleSendSmsAdvisory}
          className="flex-1 h-11 bg-[#013a13] hover:bg-[#1e5128] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">sms</span>
          <span>{t('yield.sendSmsAdvisory', 'Send Advisory via SMS')}</span>
        </button>

        <button
          type="button"
          onClick={handlePlayVoiceGuide}
          className="h-11 px-3.5 bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#013a13] rounded-2xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform cursor-pointer border border-[#c1c9bd]"
          title="Play full advisory audio in Twi"
        >
          <span className="material-symbols-outlined text-[18px]">volume_up</span>
          <span>Akan Twi</span>
        </button>
      </div>
    </div>
  );
};
