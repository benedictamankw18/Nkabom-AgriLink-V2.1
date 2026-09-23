import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface LocalHauler {
  id: string;
  name: string;
  driverName: string;
  phone: string;
  vehicleType: string;
  vehicleReg: string;
  capacityCrates: number;
  remainingCrates: number;
  route: string;
  departureWindow: string;
  departureTime: string;
  rating: number;
  completedTrips: number;
  baseRatePerCrate: number;
  sharedDiscountPercent: number;
  features: string[];
  coldChain: boolean;
  avatar: string;
}

const LOCAL_HAULERS: LocalHauler[] = [
  {
    id: 'hauler-1',
    name: 'Kofi Mensah Logistics',
    driverName: 'Kofi Mensah',
    phone: '024 411 9022',
    vehicleType: '3-Ton Insulated Canter',
    vehicleReg: 'GW-4192-20',
    capacityCrates: 120,
    remainingCrates: 45,
    route: 'Mankessim ➔ Winneba ➔ Kasoa ➔ Makola (Accra)',
    departureWindow: 'Today, 2:30 PM Express',
    departureTime: '2:30 PM',
    rating: 4.9,
    completedTrips: 142,
    baseRatePerCrate: 10,
    sharedDiscountPercent: 40,
    features: ['Insulated Tarp', 'Vibration Dampening', 'GPS Tracked'],
    coldChain: false,
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDVb9Cb6JPD90kJqR2EtxmAorul1Xt9oa9WvzudwanI6-i6lbPNnM0yNdfFOSpNQuiD_0lozusojQMI0nnLSlffwXvMPuBwpSDmKiIiTWqOBrGobuoK7ljWWY8mwlXPK6PqhbyN4GiWoBnaGnjGjpGoBUMphUYx9vi6OlMZ9fa5fWmjmQ3EARprjzJihdQErbxbQteh3TgJ4f-JO3Yv8Ehf_wChCm-p_Z61knsVk3r9R5OwOjZSEIhomg',
  },
  {
    id: 'hauler-2',
    name: 'Assin Express Haulage',
    driverName: 'Kwabena Darko',
    phone: '055 319 8841',
    vehicleType: '1.5-Ton Motor Tricycle / Aboboyaa Van',
    vehicleReg: 'CR-8831-23',
    capacityCrates: 50,
    remainingCrates: 25,
    route: 'Assin Fosu ➔ Cape Coast Depot & Mankessim',
    departureWindow: 'Today, 4:00 PM Feeder Run',
    departureTime: '4:00 PM',
    rating: 4.8,
    completedTrips: 89,
    baseRatePerCrate: 8,
    sharedDiscountPercent: 35,
    features: ['Direct Farmgate Access', 'Same-Day Local Delivery', 'Low Clearance'],
    coldChain: false,
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCUEMaSW5o-zBK9C3cIhxC8uXUU0dJqDqxtQ612jLfZ4kvklXb3wuuzjD25ALm0VJcCvNpnvaCJu5kfsxHzouqNC6qWYv0tx8Okw2el3UlpdDBxlfiZ7UZoaeArMrn2S57C77ASLvszS8EEd9_uzz5tTUJ5nicbDRPdxqn2_6F1FvoMz4wei4vVnLaruLJ9dwFKGp9pMCkG_odmrNxq45yaYx_6hNSr7IfLUkKqzgLEnm62RiaFrRUX2Q',
  },
  {
    id: 'hauler-3',
    name: 'Central Agri-Cold Transit',
    driverName: 'Nana Yaw Boadi',
    phone: '024 992 4431',
    vehicleType: '5-Ton Refrigerated Box Truck',
    vehicleReg: 'GT-5501-19',
    capacityCrates: 220,
    remainingCrates: 80,
    route: 'Mankessim / Techiman ➔ Accra Tema Wholesale Hub',
    departureWindow: 'Tonight, 8:00 PM Night Run',
    departureTime: '8:00 PM',
    rating: 4.95,
    completedTrips: 310,
    baseRatePerCrate: 12,
    sharedDiscountPercent: 40,
    features: ['18°C Active Cooling', '0% Heat Damage', 'Bulk Pallets'],
    coldChain: true,
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAgLvEmvuwsEgoQioq_5fPd2iybtnlKBKP4uuje6DGNqLTuxDh4vbhy44JU__Ldje5iGkI1Cp7byK94dlyqX2jrympQbSA7MtoMS8KZL4yz9P-XfnQvgBE5Fj3-EKFJ1E30Bkic6B8bGUWSo93TJuwwhHyU2S7SCjUaujwPquT9U9BWs0u2xAawzNbC0nb4k-w1-2rvDlN7QX7PkeM0tgNbob0rCKl8Z91d9skiYGDGWb-fv7vAv0CK4Q',
  },
  {
    id: 'hauler-4',
    name: 'Kasoa Green Cargo Shuttle',
    driverName: 'Ibrahim Salifu',
    phone: '020 882 1199',
    vehicleType: '2.5-Ton Hyundai Porter',
    vehicleReg: 'AS-3012-21',
    capacityCrates: 90,
    remainingCrates: 35,
    route: 'Awutu Senya ➔ Kasoa New Market & Agbogbloshie',
    departureWindow: 'Tomorrow, 6:00 AM Dawn Wholesale',
    departureTime: '6:00 AM',
    rating: 4.75,
    completedTrips: 78,
    baseRatePerCrate: 9,
    sharedDiscountPercent: 35,
    features: ['Cooperative Pool', 'Wholesale Bay Dropoff', 'Fast Unload'],
    coldChain: false,
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAHp3_-xISIy4CHvrwjnRtU1j2rbk8Ao-geo01tJ1-qrar4DhwFtuXyPBwhhXuKWU9QgxjrffX-4lummvVVIr2251o1vUurCdSqOkepYFnxiyImRbM2GjHV2k_mN1GekWEQR-N3YnxI2KyeXHwGu_2MzKoJzAQirUJz6dsI50QjDb6yyXswmHuB52pLHLwYbzgL6D_1NcTf-TDGcKtMQeCY5khV7oo1Dabxsv0r5NGkrOh3Lr557wR_fQ',
  },
];

const DESTINATION_MARKETS = [
  {
    id: 'makola',
    name: 'Makola Wholesale Market, Accra',
    subText: 'Bay 4 Agricultural Terminal • High Volume',
    distanceKm: 78,
    transitTime: '2h 15m',
    demandBadge: 'Very High Demand (GH₵ 175-180)',
    hubFeeGhs: 15,
  },
  {
    id: 'kasoa',
    name: 'Kasoa New Market Aggregator Depot',
    subText: 'Central Region Agro Logistics Hub',
    distanceKm: 46,
    transitTime: '1h 10m',
    demandBadge: 'High Demand (GH₵ 160)',
    hubFeeGhs: 10,
  },
  {
    id: 'cape_coast',
    name: 'Cape Coast Central Market Depot',
    subText: 'Kotokuraba Agro Wholesale Gate',
    distanceKm: 32,
    transitTime: '45m',
    demandBadge: 'Steady Demand (GH₵ 150)',
    hubFeeGhs: 10,
  },
  {
    id: 'techiman',
    name: 'Techiman Northern Central Market',
    subText: 'Bono East Inter-Regional Transit',
    distanceKm: 185,
    transitTime: '4h 30m',
    demandBadge: 'Bulk Exchange Hub',
    hubFeeGhs: 25,
  },
  {
    id: 'kumasi',
    name: 'Kejetia Wholesale Market, Kumasi',
    subText: 'Ashanti Regional Distribution Bay',
    distanceKm: 140,
    transitTime: '3h 20m',
    demandBadge: 'High Demand (GH₵ 165-170)',
    hubFeeGhs: 20,
  },
];

const CROP_SUGGESTIONS = [
  {
    name: 'Roma Tomatoes (Bontanga)',
    twiName: 'Pepere Ntɔs',
    cropType: 'roma' as const,
    defaultUnit: 'Wooden Crates (~25kg)',
    defaultPrice: 150,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuACIu7RQGXHe15akJLYKvTk3wecz7Lne9pnyFhKjk4ZgB1xuo9T_O_NxvJuEZ89j6q0tbN7UYKpbLpu1KH-uKomuDNUN3ymsZjmm1W1hXTHV4hCPGvwzOmYiHtYTcinC7xeb7xcEirURy8JqWh9tC2sdj2i7BuVHzTXMB6y4FYCVJv-2F4kZVsyj5mAk-sZBOoJH108Gwhxig9W2P3YbiTuK3C04L4X7h2fnUtJba9CzvkO0XzX8JAbVg',
    icon: '🍅',
    description: 'Oblong, firm fruit; favored by Makola wholesale aggregators.',
  },
  {
    name: 'Petome & Round Tomatoes',
    twiName: 'Ntrowa Kɔkɔɔ',
    cropType: 'round' as const,
    defaultUnit: 'Wooden Crates (~25kg)',
    defaultPrice: 145,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA716typTYoQbNuhLutDCJbmdbA3dbb4GJCmeam_FmnD0ccutHlzJXVnpB1ZQzoc3-svuht_0YV4FpuDkvJBU1tA3BFC_BITa4QHiGcenq6m4J9yS3z8mRfoCvLLHZZxeKIXYrVaGxDkd8RpIWKlkvaaAb3GCn-FftcGn9eRQseJoHjbFUTz-kqF4Ezw68R7d2ETlJFYlHGO4ckgNLyZFl-8Q27gQiNXwTYvoa_PFE-iYHiocp0gcV_Zw',
    icon: '🍅',
    description: 'High juice content; ideal for sauce & local caterers.',
  },
  {
    name: 'Pepper (Shito & Scotch Bonnet)',
    twiName: 'Mako / Shito',
    cropType: 'pepper' as const,
    defaultUnit: 'Agro Baskets (~20kg)',
    defaultPrice: 120,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB0i5X6QkeKci4w4n2-WWM-p3Yyx8tPaat_Bui54dVm6tjF_EuVaYdUXZT-Id-kVh8O_DHf2DRAFZw_1Fscc5FkJkinf340ieK9uj_dPpbzsjptpRc7sieADS6JYENiTsS8w5GNQNCT2GGUll3JYFoPZiubbwCReGtRAHZIuOe2qI9s2LaqFyjQzPYZN1bQxSKGvF9aYC7OC6REOSL011TE9fFlhrHhOTqfFrcPFdDJFktKC_X4m5fmJg',
    icon: '🌶️',
    description: 'Hot chili; longer storage stability.',
  },
  {
    name: 'Bawku Red Onions',
    twiName: 'Gyeene Kɔkɔɔ',
    cropType: 'onion' as const,
    defaultUnit: 'Maxi Bags (~50kg)',
    defaultPrice: 195,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDFbK9gO2Kj5i9Yq2e-w_x-P_x-mK2-wK4-x_k-mK4-mK2-wK4-mK2-wK4-mK2-wK4-mK2-wK4-mK2-wK4-mK2-wK4-mK2-wK4',
    icon: '🧅',
    description: 'Dry bulbs; excellent 4+ week shelf life.',
  },
  {
    name: 'Apem Green Plantain',
    twiName: 'Brɔdeɛ Apem Monoo',
    cropType: 'cassava' as const,
    defaultUnit: 'Large Bunches (~22kg)',
    defaultPrice: 110,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAAbLKLQxuVwfdV9I49m2xrRsMJZpB2-VpkWgbHIFr1h-xYXXm4wWLEgTu_SSLg067WtOGrxkD_rol077coisAoXt3PdatyIQpTaad-qVWBOBsjCFxG9_o3I__Ey5-HUiWwc9mwPygQ7WQqKeY5ID0ji1P--Rj6WJaFHFGJPxHn6PDMGn1GOmTOc6CE2DpxyDlG6hWsb6Lsoiwb4AVlb2GBltTYyV5iRzdwMpTpXkWKAIKFyQ6qP7hg9Q',
    icon: '🍌',
    description: 'Firm green bunches; strong restaurant demand.',
  },
  {
    name: 'Pona White Yam',
    twiName: 'Bayere Pona',
    cropType: 'cassava' as const,
    defaultUnit: 'Tubers (100 Tubers)',
    defaultPrice: 280,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAHp3_-xISIy4CHvrwjnRtU1j2rbk8Ao-geo01tJ1-qrar4DhwFtuXyPBwhhXuKWU9QgxjrffX-4lummvVVIr2251o1vUurCdSqOkepYFnxiyImRbM2GjHV2k_mN1GekWEQR-N3YnxI2KyeXHwGu_2MzKoJzAQirUJz6dsI50QjDb6yyXswmHuB52pLHLwYbzgL6D_1NcTf-TDGcKtMQeCY5khV7oo1Dabxsv0r5NGkrOh3Lr557wR_fQ',
    icon: '🥔',
    description: 'Export-grade dry tubers; high cash value.',
  },
];

const PACKAGING_UNITS = [
  'Wooden Crates (~25kg)',
  'Heavy Crates (~52kg)',
  'Maxi Bags (~50kg)',
  'Agro Baskets (~20kg)',
  'Large Bunches (~22kg)',
  'Tubers (100 Tubers)',
  'Sacks (50kg)',
  'Metric Tons (1,000kg)',
];

const PILOT_HUBS = [
  'Mankessim Agro Depot, Central Region',
  'Assin Fosu Farm Station, Central Region',
  'Awutu Senya / Kasoa Hub, Central Region',
  'Cape Coast Agro Depot, Central Region',
  'Techiman Northern Central Farm Gate, Bono East',
  'Kumasi Central Agro Depot, Ashanti',
];

export const SellScreen: React.FC = () => {
  const {
    addProduce,
    setActiveTab,
    playSpeech,
    produceList,
    addTransportRequest,
    showToast,
  } = useApp();

  // Mode: 'add_harvest' (Add New Harvest form) vs 'transport' (Request Transport)
  const [activeMode, setActiveMode] = useState<'add_harvest' | 'transport'>('add_harvest');

  // Today's date calculations for defaults
  const today = new Date();
  const todayIso = today.toISOString().split('T')[0];

  const getFutureIso = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  const formatDateDisplay = (isoStr: string) => {
    if (!isoStr || isoStr === todayIso) return 'Harvested Today • Nnɛ';
    const parts = isoStr.split('-');
    if (parts.length !== 3) return isoStr;
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `Harvest: ${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  // --- Add New Harvest Form State ---
  const [cropName, setCropName] = useState<string>('Roma Tomatoes (Bontanga)');
  const [twiCropName, setTwiCropName] = useState<string>('Pepere Ntɔs');
  const [cropType, setCropType] = useState<'roma' | 'round' | 'pepper' | 'onion' | 'cassava'>('roma');
  const [cropImage, setCropImage] = useState<string>(CROP_SUGGESTIONS[0].image);
  const [quantity, setQuantity] = useState<number>(50);
  const [unit, setUnit] = useState<string>('Wooden Crates (~25kg)');
  const [expectedHarvestDateIso, setExpectedHarvestDateIso] = useState<string>(todayIso);
  const [location, setLocation] = useState<string>('Mankessim Agro Depot, Central Region');
  const [price, setPrice] = useState<number>(150);
  const [sharedTransportEligible, setSharedTransportEligible] = useState<boolean>(true);
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [newlyCreatedListingTitle, setNewlyCreatedListingTitle] = useState<string>('');

  // Is this listing a pre-harvest commitment lot?
  const isPreHarvest = expectedHarvestDateIso > todayIso;

  // --- Request Transport State ---
  const farmerListings = produceList.filter(
    (p) =>
      p.farmerName.toLowerCase().includes('kwame') ||
      p.farmerName.toLowerCase().includes('kojo') ||
      p.id.startsWith('prod-')
  );
  const availableListings = farmerListings.length > 0 ? farmerListings : produceList;

  const [selectedListingId, setSelectedListingId] = useState<string>(
    availableListings[0]?.id || ''
  );
  const [cratesToTransport, setCratesToTransport] = useState<number>(30);
  const [destinationMarketId, setDestinationMarketId] = useState<string>('makola');
  const [isSharedLogistics, setIsSharedLogistics] = useState<boolean>(true);
  const [selectedHaulerId, setSelectedHaulerId] = useState<string>('hauler-1');
  const [paymentMode, setPaymentMode] = useState<'momo' | 'cash_depot'>('momo');
  const [showTransportSuccessModal, setShowTransportSuccessModal] = useState<boolean>(false);
  const [lastDispatchedRequestId, setLastDispatchedRequestId] = useState<string>('');

  const selectedListing =
    availableListings.find((p) => p.id === selectedListingId) || availableListings[0];
  const selectedDestination =
    DESTINATION_MARKETS.find((d) => d.id === destinationMarketId) || DESTINATION_MARKETS[0];
  const selectedHauler =
    LOCAL_HAULERS.find((h) => h.id === selectedHaulerId) || LOCAL_HAULERS[0];

  useEffect(() => {
    if (selectedListing) {
      const maxCrates = selectedListing.cratesAvailable || 40;
      setCratesToTransport(Math.min(30, maxCrates));
    }
  }, [selectedListingId]);

  // Pricing calculations for transport
  const baseRate = selectedHauler.baseRatePerCrate;
  const grossCost = cratesToTransport * baseRate;
  const discountMultiplier = isSharedLogistics
    ? selectedHauler.sharedDiscountPercent / 100
    : 0;
  const sharedSavings = Math.round(grossCost * discountMultiplier);
  const netTransportFee = grossCost - sharedSavings;

  // Harvest valuation
  const totalHarvestValue = quantity * price;

  // Quick preset crop selection
  const handleSelectCropPreset = (s: typeof CROP_SUGGESTIONS[0]) => {
    setCropName(s.name);
    setTwiCropName(s.twiName);
    setCropType(s.cropType);
    setCropImage(s.image);
    setUnit(s.defaultUnit);
    setPrice(s.defaultPrice);
    showToast(`Selected crop: ${s.name}`);
  };

  // Voice AI Record Simulator
  const handleVoiceRecord = () => {
    setIsListeningVoice(true);
    playSpeech(
      'Listening... Please speak in Twi or English. For example: I will harvest 50 crates of Roma tomatoes next Tuesday in Mankessim for 150 Cedis.',
      'Voice AI Listing'
    );

    setTimeout(() => {
      setIsListeningVoice(false);
      setCropName('Roma Tomatoes (Bontanga)');
      setTwiCropName('Pepere Ntɔs');
      setCropType('roma');
      setQuantity(60);
      setUnit('Wooden Crates (~25kg)');
      setPrice(150);
      setExpectedHarvestDateIso(getFutureIso(4));
      setLocation('Mankessim Agro Depot, Central Region');
      playSpeech(
        'Captured New Harvest: 60 crates of Roma Tomatoes ready in 4 days at 150 Ghana Cedis in Mankessim. Ready to list on the marketplace!',
        'Captured Harvest Details'
      );
    }, 2600);
  };

  // Submit New Harvest to Marketplace
  const handleSubmitNewHarvest = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cropName.trim()) {
      showToast('Please enter a crop name.');
      return;
    }

    if (quantity <= 0) {
      showToast('Please enter a valid quantity.');
      return;
    }

    if (!location.trim()) {
      showToast('Please enter a farmgate location.');
      return;
    }

    const fullTitle = isPreHarvest ? `Pre-Harvest ${cropName}` : `Grade A Fresh ${cropName}`;
    const displayDate = formatDateDisplay(expectedHarvestDateIso);

    addProduce({
      title: fullTitle,
      twiTitle: `${twiCropName} ${isPreHarvest ? 'a Yɛrentwa Ntɛm' : 'Foforɔ'}`,
      cropType,
      farmerName: 'Kwame Mensah',
      farmerAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDVb9Cb6JPD90kJqR2EtxmAorul1Xt9oa9WvzudwanI6-i6lbPNnM0yNdfFOSpNQuiD_0lozusojQMI0nnLSlffwXvMPuBwpSDmKiIiTWqOBrGobuoK7ljWWY8mwlXPK6PqhbyN4GiWoBnaGnjGjpGoBUMphUYx9vi6OlMZ9fa5fWmjmQ3EARprjzJihdQErbxbQteh3TgJ4f-JO3Yv8Ehf_wChCm-p_Z61knsVk3r9R5OwOjZSEIhomg',
      verified: true,
      cooperative: 'Central Region Tomato Growers (Pilot Hub)',
      distanceKm: 5,
      location: location.trim(),
      spotPrice: price,
      marketAvgDiffPercent: -4,
      cratesAvailable: quantity,
      weightPerCrate: unit,
      image: cropImage,
      gradeTag: isPreHarvest ? 'Pre-Harvest Pre-Commitment' : 'Grade A Fresh',
      readyStatus: displayDate,
      isReadyToday: !isPreHarvest,
      isPreHarvest,
      expectedHarvestDate: isPreHarvest ? displayDate : undefined,
      spoilageRisk: isPreHarvest ? 'low' : 'moderate',
      spoilageReason: isPreHarvest
        ? 'Pre-harvest commitment locks the buyer before picking, preventing roadside spoilage.'
        : 'Immediate transport advised within 36h to preserve firmness in Central heat.',
      preCommitmentCount: 0,
      preCommitmentTarget: quantity,
      sharedTransportEligible,
    });

    setNewlyCreatedListingTitle(fullTitle);
    setShowSuccessModal(true);

    playSpeech(
      `Congratulations! Your new harvest of ${quantity} ${unit} of ${cropName} in ${location} is now listed on the marketplace at ${price} Ghana Cedis. Verified buyers have been alerted!`,
      'New Harvest Listed in Marketplace!'
    );
  };

  // Submit Transport Request
  const handleRequestTransportSubmit = () => {
    if (!selectedListing) {
      showToast('Please select a listing first.');
      return;
    }

    const titleStr = `${cratesToTransport} Crates ${selectedListing.title}`;

    addTransportRequest({
      produceTitle: titleStr,
      quantity: `${cratesToTransport} Crates (~${cratesToTransport * 25} kg)`,
      cratesCount: cratesToTransport,
      pickupLocation: selectedListing.location,
      deliveryLocation: selectedDestination.name,
      pickupDate: selectedHauler.departureWindow,
      departureTime: selectedHauler.departureTime,
      isShared: isSharedLogistics,
      vehicleType: selectedHauler.vehicleType,
      vehicleNumber: selectedHauler.vehicleReg,
      driverName: selectedHauler.driverName,
      driverPhone: selectedHauler.phone,
      transporterName: selectedHauler.name,
      transporterPhone: selectedHauler.phone,
      estimatedCostGhs: netTransportFee,
      estimatedCost: netTransportFee,
      sharedSavingsGhs: isSharedLogistics ? sharedSavings : 0,
    });

    setLastDispatchedRequestId(`TR-${Date.now().toString().slice(-4)}`);
    setShowTransportSuccessModal(true);

    playSpeech(
      `Transport request booked! ${cratesToTransport} crates of ${selectedListing.title} dispatched to ${selectedHauler.driverName} on the ${selectedDestination.name} corridor. Shared logistics saved you ${sharedSavings} Ghana Cedis.`,
      'Transport Request Coordinated'
    );
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto px-4 pt-16 pb-28 gap-4 bg-[#f8faf4] min-h-screen">
      {/* Top Mode Switcher */}
      <div className="w-full bg-[#e7e9e3] p-1.5 rounded-2xl flex items-center gap-1.5 shadow-2xs mt-2">
        <button
          onClick={() => setActiveMode('add_harvest')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeMode === 'add_harvest'
              ? 'bg-[#013a13] text-white shadow-xs'
              : 'text-[#414940] hover:text-[#191c19]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>🌱 Add New Harvest</span>
        </button>

        <button
          onClick={() => setActiveMode('transport')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
            activeMode === 'transport'
              ? 'bg-[#013a13] text-white shadow-xs'
              : 'text-[#414940] hover:text-[#191c19]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">local_shipping</span>
          <span>🚚 Request Transport</span>
          <span className="px-1.5 py-0.5 rounded-full bg-[#b1f0ce] text-[#002114] text-[9px] font-black uppercase">
            -40%
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: ADD NEW HARVEST FORM                                             */}
      {/* ========================================================================= */}
      {activeMode === 'add_harvest' && (
        <form onSubmit={handleSubmitNewHarvest} className="space-y-4">
          {/* Top Bilingual Guidance Banner */}
          <div className="w-full bg-[#aeeecb] text-[#316e52] rounded-3xl p-4 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#2c694e] text-white flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[24px]">agriculture</span>
              </div>
              <div className="flex flex-col min-w-0">
                <h1 className="text-[17px] font-black leading-tight text-[#013a13] truncate">
                  Add New Harvest Listing
                </h1>
                <p className="text-xs text-[#2c694e] font-semibold leading-tight truncate">
                  Tɔn wo nnuane • List for verified buyers
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                playSpeech(
                  'Add New Harvest Form: Kyerɛ wo nnuane din, dodoɔ a wobɛtwa, da a wobɛtwa, ne baabi a woteɛ wɔ Central Region na atɔfoɔ atumi atɔ ntɛm.',
                  'Add New Harvest Audio Instructions'
                )
              }
              aria-label="Listen to instructions in Twi"
              className="flex-shrink-0 w-11 h-11 rounded-full bg-white text-[#2c694e] flex items-center justify-center shadow-xs active:scale-95 transition-transform cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">volume_up</span>
            </button>
          </div>

          {/* Bilingual Voice AI Quick-Fill Hub */}
          <div className="w-full bg-white rounded-3xl p-5 shadow-xs flex flex-col items-center text-center relative overflow-hidden border border-[#edefe9]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdbcf] text-[#380d00] mb-2 font-bold text-xs">
              <span className="material-symbols-outlined text-[16px] text-[#5b1b00]">mic</span>
              <span>Voice AI Form Assist • Twi &amp; English</span>
            </div>

            <div className="relative my-2 flex items-center justify-center">
              <div
                className={`absolute w-20 h-20 rounded-full pointer-events-none transition-all ${
                  isListeningVoice ? 'bg-[#812a00]/20 animate-ping' : 'bg-[#013a13]/10'
                }`}
              ></div>
              <button
                onClick={handleVoiceRecord}
                className={`relative z-10 w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer ${
                  isListeningVoice
                    ? 'bg-[#812a00] text-white animate-pulse'
                    : 'bg-[#013a13] text-white'
                }`}
                type="button"
                aria-label="Speak harvest details"
              >
                <span className="material-symbols-outlined text-[30px]">
                  {isListeningVoice ? 'graphic_eq' : 'mic'}
                </span>
              </button>
            </div>

            <span className="text-base font-bold text-[#013a13] mt-0.5">
              {isListeningVoice ? 'Listening to your voice...' : 'Speak to Fill Details'}
            </span>
            <p className="text-[11px] text-[#414940] max-w-xs mt-1 leading-snug">
              Tap mic &amp; speak:{' '}
              <span className="font-bold text-[#191c19]">
                "50 crates of Roma Tomatoes ready in 4 days in Mankessim"
              </span>
            </p>
          </div>

          {/* FIELD 1: CROP NAME */}
          <div className="w-full bg-white rounded-3xl p-4 shadow-xs space-y-3 border border-[#edefe9]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#013a13] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <label htmlFor="crop-name-input" className="text-sm font-black text-[#191c19]">
                  Crop Name / Nnuane Din
                </label>
              </div>
              <span className="text-[11px] text-[#2c694e] font-bold">Required *</span>
            </div>

            {/* Explicit text input for Crop Name */}
            <div className="relative">
              <input
                id="crop-name-input"
                type="text"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="e.g. Bontanga Roma Tomatoes, Derma Plum, Bawku Onions..."
                required
                className="w-full h-12 px-3.5 pl-10 bg-[#f2f4ee] border border-[#edefe9] rounded-2xl text-xs font-bold text-[#191c19] focus:outline-none focus:border-[#013a13] focus:bg-white transition-colors"
              />
              <span className="material-symbols-outlined text-[20px] text-[#71796f] absolute left-3 top-3 pointer-events-none">
                spa
              </span>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-[#414940] block">
                Popular Varieties &amp; Crops (Tap to Auto-fill):
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {CROP_SUGGESTIONS.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => handleSelectCropPreset(s)}
                    className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                      cropName === s.name
                        ? 'bg-[#013a13] text-white border-[#013a13] shadow-xs'
                        : 'bg-[#f8faf4] text-[#414940] border-[#edefe9] hover:bg-[#e7e9e3]'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span>{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FIELD 2: QUANTITY & PACKAGING UNIT */}
          <div className="w-full bg-white rounded-3xl p-4 shadow-xs space-y-3 border border-[#edefe9]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#013a13] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <label htmlFor="quantity-input" className="text-sm font-black text-[#191c19]">
                  Quantity &amp; Packaging / Dodoɔ
                </label>
              </div>
              <span className="text-[11px] text-[#2c694e] font-bold">Standard Pilot Units</span>
            </div>

            {/* Numeric input with stepper */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(5, quantity - 5))}
                className="w-12 h-12 rounded-2xl bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#013a13] font-bold text-xl flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
              >
                -
              </button>

              <div className="flex-1 relative">
                <input
                  id="quantity-input"
                  type="number"
                  min="1"
                  max="10000"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  required
                  className="w-full h-12 text-center bg-[#f2f4ee] border border-[#edefe9] rounded-2xl text-lg font-black text-[#013a13] focus:outline-none focus:border-[#013a13] focus:bg-white"
                />
              </div>

              <button
                type="button"
                onClick={() => setQuantity(quantity + 5)}
                className="w-12 h-12 rounded-2xl bg-[#013a13] text-white font-bold text-xl flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Quick Increment Buttons */}
            <div className="flex items-center justify-between gap-1.5">
              {[10, 25, 50, 100, 200].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuantity(q)}
                  className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    quantity === q
                      ? 'bg-[#013a13] text-white'
                      : 'bg-[#f2f4ee] text-[#414940] hover:bg-[#e7e9e3]'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Unit Dropdown */}
            <div className="space-y-1">
              <label htmlFor="unit-select" className="text-[11px] font-bold text-[#414940] block">
                Packaging Container / Unit:
              </label>
              <select
                id="unit-select"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full h-11 px-3 bg-[#f2f4ee] border border-[#edefe9] rounded-2xl text-xs font-bold text-[#191c19] focus:outline-none focus:border-[#013a13] cursor-pointer"
              >
                {PACKAGING_UNITS.map((u) => (
                  <option key={u} value={u}>
                    📦 {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FIELD 3: EXPECTED HARVEST DATE */}
          <div className="w-full bg-white rounded-3xl p-4 shadow-xs space-y-3 border border-[#edefe9]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#013a13] text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <label htmlFor="harvest-date-input" className="text-sm font-black text-[#191c19]">
                  Expected Harvest Date / Da a Wobɛtwa
                </label>
              </div>
              <button
                type="button"
                onClick={() =>
                  playSpeech(
                    'Sɛ wobɛtwa da bi a ɛreba a, paw Pre-Harvest na atɔfoɔ atumi ayɛ pre-commitments ansa na wotwa. Ɛno bɛsi rot ne spoilage kwan.',
                    'Harvest Timing Guidance'
                  )
                }
                className="w-8 h-8 rounded-full bg-[#edefe9] flex items-center justify-center text-[#013a13] active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">volume_up</span>
              </button>
            </div>

            {/* Date Input */}
            <div className="relative">
              <input
                id="harvest-date-input"
                type="date"
                min={todayIso}
                value={expectedHarvestDateIso}
                onChange={(e) => setExpectedHarvestDateIso(e.target.value)}
                required
                className="w-full h-12 px-3.5 pl-10 bg-[#f2f4ee] border border-[#edefe9] rounded-2xl text-xs font-bold text-[#191c19] focus:outline-none focus:border-[#013a13] focus:bg-white cursor-pointer"
              />
              <span className="material-symbols-outlined text-[20px] text-[#71796f] absolute left-3 top-3 pointer-events-none">
                calendar_today
              </span>
            </div>

            {/* Quick Date Presets */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setExpectedHarvestDateIso(todayIso)}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                  expectedHarvestDateIso === todayIso
                    ? 'bg-[#013a13] text-white border-[#013a13]'
                    : 'bg-[#f8faf4] text-[#414940] border-[#edefe9] hover:bg-[#e7e9e3]'
                }`}
              >
                Ready Today
              </button>

              <button
                type="button"
                onClick={() => setExpectedHarvestDateIso(getFutureIso(2))}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                  expectedHarvestDateIso === getFutureIso(2)
                    ? 'bg-[#013a13] text-white border-[#013a13]'
                    : 'bg-[#f8faf4] text-[#414940] border-[#edefe9] hover:bg-[#e7e9e3]'
                }`}
              >
                In 2 Days
              </button>

              <button
                type="button"
                onClick={() => setExpectedHarvestDateIso(getFutureIso(4))}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                  expectedHarvestDateIso === getFutureIso(4)
                    ? 'bg-[#013a13] text-white border-[#013a13]'
                    : 'bg-[#f8faf4] text-[#414940] border-[#edefe9] hover:bg-[#e7e9e3]'
                }`}
              >
                In 4 Days
              </button>
            </div>

            {/* Pre-Harvest Commitment & Spoilage Prevention Pill */}
            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs transition-colors ${
                isPreHarvest
                  ? 'bg-[#eaf2e4] border-[#cbe0c5] text-[#013a13]'
                  : 'bg-[#fff5ee] border-[#ffd6ba] text-[#812a00]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px] flex-shrink-0 mt-0.5"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isPreHarvest ? 'verified_user' : 'warning'}
              </span>
              <div className="flex-1 min-w-0">
                <span className="font-black uppercase tracking-wide text-[10px] block">
                  {isPreHarvest
                    ? '🌱 Pre-Harvest Mode: Buyers Pre-Commit Before Cutting'
                    : '⚠️ Harvested Mode: Fast Dispatch Advised (36h shelf life)'}
                </span>
                <p className="mt-0.5 text-[11px] text-[#414940] leading-snug">
                  {isPreHarvest
                    ? 'Listing with a future harvest date allows wholesale buyers in Kasoa & Makola to pledge commitments and escrow funds, cutting post-harvest rot by 80%.'
                    : 'Freshly harvested crops in 31°C Central weather should have transport dispatched promptly.'}
                </p>
              </div>
            </div>
          </div>

          {/* FIELD 4: LOCATION */}
          <div className="w-full bg-white rounded-3xl p-4 shadow-xs space-y-3 border border-[#edefe9]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#013a13] text-white text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <label htmlFor="location-input" className="text-sm font-black text-[#191c19]">
                  Farmgate Location / Beae
                </label>
              </div>
              <span className="text-[11px] text-[#2c694e] font-bold">Central Region Pilot</span>
            </div>

            {/* Text input for location */}
            <div className="relative">
              <input
                id="location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mankessim Agro Station, Assin Fosu, Kasoa..."
                required
                className="w-full h-12 px-3.5 pl-10 bg-[#f2f4ee] border border-[#edefe9] rounded-2xl text-xs font-bold text-[#191c19] focus:outline-none focus:border-[#013a13] focus:bg-white"
              />
              <span className="material-symbols-outlined text-[20px] text-[#71796f] absolute left-3 top-3 pointer-events-none">
                location_on
              </span>
            </div>

            {/* Quick Hub Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#414940] block">
                Or Select Verified Aggregation Hub:
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-11 px-3 bg-[#f2f4ee] border border-[#edefe9] rounded-2xl text-xs font-bold text-[#191c19] focus:outline-none focus:border-[#013a13] cursor-pointer"
              >
                {PILOT_HUBS.map((hub) => (
                  <option key={hub} value={hub}>
                    📍 {hub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FIELD 5: PRICE PER UNIT */}
          <div className="w-full bg-white rounded-3xl p-4 shadow-xs space-y-3 border border-[#edefe9]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#013a13] text-white text-xs font-bold flex items-center justify-center">
                  5
                </span>
                <label htmlFor="price-input" className="text-sm font-black text-[#191c19]">
                  Asking Price Per Unit / Boɔ (GH₵)
                </label>
              </div>
              <span className="text-[11px] text-[#2c694e] font-bold">
                Market Avg: GH₵ 140 - 165
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPrice(Math.max(20, price - 5))}
                className="w-12 h-12 rounded-2xl bg-[#f2f4ee] hover:bg-[#e7e9e3] text-[#013a13] font-bold text-xl flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
              >
                -
              </button>

              <div className="flex-1 relative">
                <input
                  id="price-input"
                  type="number"
                  min="10"
                  max="5000"
                  value={price}
                  onChange={(e) => setPrice(Math.max(1, Number(e.target.value)))}
                  required
                  className="w-full h-12 text-center bg-[#f2f4ee] border border-[#edefe9] rounded-2xl text-lg font-black text-[#013a13] focus:outline-none focus:border-[#013a13] focus:bg-white"
                />
              </div>

              <button
                type="button"
                onClick={() => setPrice(price + 5)}
                className="w-12 h-12 rounded-2xl bg-[#013a13] text-white font-bold text-xl flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Shared Haulage Checkbox */}
            <div
              onClick={() => setSharedTransportEligible(!sharedTransportEligible)}
              className="p-3 bg-[#f2f4ee] rounded-2xl flex items-center justify-between cursor-pointer border border-[#edefe9] hover:bg-[#ebede7] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-[#013a13] text-[20px]">
                  local_shipping
                </span>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-[#191c19] block">
                    Shared Haulage Consolidation
                  </span>
                  <span className="text-[11px] text-[#414940] block truncate">
                    Combine freight with nearby farms • Save ~40%
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={sharedTransportEligible}
                onChange={(e) => setSharedTransportEligible(e.target.checked)}
                className="w-5 h-5 rounded accent-[#013a13] cursor-pointer"
              />
            </div>
          </div>

          {/* CONFIRMATION SUMMARY CARD & CTA */}
          <div className="w-full bg-[#e1e3dd]/80 rounded-3xl p-5 shadow-md space-y-3.5 border border-[#c1c9bd]/50">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-[#414940] font-bold">
                  Listing Valuation
                </span>
                <p className="text-sm text-[#191c19] font-bold mt-0.5">
                  {quantity} {unit} of {cropName}
                </p>
                <span className="text-xs text-[#2c694e] font-semibold">
                  {isPreHarvest
                    ? `Pre-Harvest (${formatDateDisplay(expectedHarvestDateIso)})`
                    : 'Harvested Today'}
                </span>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-xs text-[#414940] block font-medium">Total Value</span>
                <span className="text-[22px] text-[#013a13] font-black">
                  GH₵ {totalHarvestValue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              className="w-full h-14 bg-[#013a13] hover:bg-[#1e5128] text-white rounded-2xl text-base font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">check_circle</span>
              <span>Post Harvest to Marketplace / Tɔn Ntɛm</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[#414940] text-xs">
              <span className="material-symbols-outlined text-[16px] text-[#2c694e]">
                security
              </span>
              <span>Free listing • Instant SMS &amp; app broadcast to verified buyers</span>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: REQUEST TRANSPORT & SHARED LOGISTICS (SRS FR-33 to FR-36)       */}
      {/* ========================================================================= */}
      {activeMode === 'transport' && (
        <div className="space-y-4">
          {/* Header Banner */}
          <div className="w-full bg-[#013a13] text-white rounded-3xl p-5 shadow-md relative overflow-hidden space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#b1f0ce]">
                  <span className="material-symbols-outlined text-[24px]">local_shipping</span>
                </span>
                <div>
                  <h2 className="text-lg font-black leading-tight">Request Transport</h2>
                  <p className="text-xs text-[#b1f0ce] font-medium">
                    Twere Kar • Shared Haulage Coordinator
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  playSpeech(
                    'Twere kar ma wo nnuane. Paw wo nnuane listing no, na fa shared transport kɔ Makola anaasɛ Kasoa gua so na woanya 40 percent nkabom nso.',
                    'Request Transport Voice Guide'
                  )
                }
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer"
                title="Listen in Twi"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">volume_up</span>
              </button>
            </div>

            <p className="text-xs text-white/80 leading-relaxed pt-1">
              Select one of your harvest lots and coordinate shared freight with verified Central
              Region haulers. Combining trips prevents heat spoilage and saves up to{' '}
              <strong className="text-[#b1f0ce]">40% on transport fares</strong>.
            </p>
          </div>

          {/* STEP 1: SELECT LISTING */}
          <div className="w-full bg-white rounded-3xl p-4 shadow-xs border border-[#edefe9] space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#edefe9]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#013a13] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-sm font-black text-[#191c19]">
                  Select Harvest Listing to Transport
                </h3>
              </div>
              <span className="text-xs text-[#2c694e] font-bold">
                {availableListings.length} Available Lots
              </span>
            </div>

            <div className="space-y-2">
              {availableListings.map((item) => {
                const isSelected = selectedListing?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedListingId(item.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'border-[#013a13] bg-[#f8faf4] ring-2 ring-[#013a13]/20 shadow-xs'
                        : 'border-[#edefe9] bg-white hover:bg-[#f8faf4]'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-black text-[#191c19] truncate">
                          {item.title}
                        </span>
                        {item.isPreHarvest && (
                          <span className="px-1.5 py-0.2 rounded bg-[#b1f0ce] text-[#002114] text-[9px] font-bold">
                            Pre-Harvest
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#414940]">
                        <span className="font-bold text-[#013a13]">
                          {item.cratesAvailable} Crates Ready
                        </span>
                        <span>•</span>
                        <span className="truncate">{item.location}</span>
                      </div>

                      <div className="flex items-center gap-1 mt-1 text-[10px] text-[#71796f]">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.spoilageRisk === 'low'
                              ? 'bg-[#2c694e]'
                              : item.spoilageRisk === 'moderate'
                              ? 'bg-[#b8860b]'
                              : 'bg-[#812a00]'
                          }`}
                        ></span>
                        <span className="capitalize">{item.spoilageRisk || 'Low'} Spoilage Risk</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-[#c1c9bd] flex-shrink-0">
                      {isSelected && (
                        <span className="w-3.5 h-3.5 rounded-full bg-[#013a13]"></span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quantity Slider */}
            {selectedListing && (
              <div className="pt-2 p-3 bg-[#f2f4ee] rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#191c19]">Crates to Load for this Trip:</span>
                  <span className="font-black text-[#013a13] text-sm">
                    {cratesToTransport} / {selectedListing.cratesAvailable} Crates
                  </span>
                </div>

                <input
                  type="range"
                  min={5}
                  max={selectedListing.cratesAvailable || 50}
                  step={5}
                  value={cratesToTransport}
                  onChange={(e) => setCratesToTransport(Number(e.target.value))}
                  className="w-full accent-[#013a13] cursor-pointer"
                />

                <div className="flex items-center justify-between gap-2 pt-1">
                  {[25, 50, 75, 100].map((pct) => {
                    const max = selectedListing.cratesAvailable || 50;
                    const val = Math.max(5, Math.round((max * pct) / 100));
                    return (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setCratesToTransport(val)}
                        className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          cratesToTransport === val
                            ? 'bg-[#013a13] text-white'
                            : 'bg-white text-[#414940] hover:bg-[#e7e9e3]'
                        }`}
                      >
                        {pct}% ({val} cr)
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: SELECT DESTINATION MARKET */}
          <div className="w-full bg-white rounded-3xl p-4 shadow-xs border border-[#edefe9] space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#edefe9]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#013a13] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-sm font-black text-[#191c19]">
                  Destination Wholesale Market
                </h3>
              </div>
              <span className="text-xs text-[#71796f]">Wholesale Terminal</span>
            </div>

            <div className="space-y-2">
              {DESTINATION_MARKETS.map((dest) => {
                const isSelected = selectedDestination.id === dest.id;
                return (
                  <div
                    key={dest.id}
                    onClick={() => setDestinationMarketId(dest.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'border-[#013a13] bg-[#f8faf4] ring-2 ring-[#013a13]/20 shadow-xs'
                        : 'border-[#edefe9] bg-white hover:bg-[#f8faf4]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-[#191c19] truncate">
                          {dest.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#414940] mt-0.5">{dest.subText}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px]">
                        <span className="font-semibold text-[#013a13]">
                          🛣️ {dest.distanceKm} km ({dest.transitTime})
                        </span>
                        <span className="text-[#c1c9bd]">•</span>
                        <span className="text-[#812a00] font-bold">{dest.demandBadge}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-[#c1c9bd] flex-shrink-0">
                      {isSelected && (
                        <span className="w-3.5 h-3.5 rounded-full bg-[#013a13]"></span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: LOGISTICS MODE (SHARED CONSOLIDATION) */}
          <div className="w-full bg-white rounded-3xl p-4 shadow-xs border border-[#edefe9] space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#edefe9]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#013a13] text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="text-sm font-black text-[#191c19]">
                  Logistics Mode: Shared Consolidation
                </h3>
              </div>
              <span className="text-xs font-black text-[#2c694e]">Save ~40%</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsSharedLogistics(true)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between min-h-[96px] transition-all cursor-pointer ${
                  isSharedLogistics
                    ? 'border-[#013a13] bg-[#f8faf4] ring-2 ring-[#013a13]/20 shadow-xs'
                    : 'border-[#edefe9] bg-white hover:bg-[#f8faf4]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-[20px] text-[#013a13]">
                      groups
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#b1f0ce] text-[#002114] text-[9px] font-black">
                      -40% Cost
                    </span>
                  </div>
                  <span className="text-xs font-black text-[#191c19] block mt-1">
                    Shared Haulage
                  </span>
                </div>
                <p className="text-[10px] text-[#414940] leading-tight">
                  Pools space with neighboring farms along Central route.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setIsSharedLogistics(false)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between min-h-[96px] transition-all cursor-pointer ${
                  !isSharedLogistics
                    ? 'border-[#013a13] bg-[#f8faf4] ring-2 ring-[#013a13]/20 shadow-xs'
                    : 'border-[#edefe9] bg-white hover:bg-[#f8faf4]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-[20px] text-[#414940]">
                      local_shipping
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#e7e9e3] text-[#414940] text-[9px] font-bold">
                      Dedicated
                    </span>
                  </div>
                  <span className="text-xs font-black text-[#191c19] block mt-1">
                    Dedicated Vehicle
                  </span>
                </div>
                <p className="text-[10px] text-[#414940] leading-tight">
                  Private sole-hire charter. Instant departure at standard rate.
                </p>
              </button>
            </div>
          </div>

          {/* STEP 4: VERIFIED LOCAL TRANSPORT PROVIDERS */}
          <div className="w-full bg-white rounded-3xl p-4 shadow-xs border border-[#edefe9] space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#edefe9]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#013a13] text-white text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <h3 className="text-sm font-black text-[#191c19]">
                  Verified Local Haulers &amp; Drivers
                </h3>
              </div>
              <span className="text-xs text-[#2c694e] font-bold">4 Haulers Active</span>
            </div>

            <div className="space-y-3">
              {LOCAL_HAULERS.map((hauler) => {
                const isSelected = selectedHauler.id === hauler.id;
                const haulerRate = isSharedLogistics
                  ? hauler.baseRatePerCrate * (1 - hauler.sharedDiscountPercent / 100)
                  : hauler.baseRatePerCrate;
                const tripFee = Math.round(cratesToTransport * haulerRate);

                return (
                  <div
                    key={hauler.id}
                    onClick={() => setSelectedHaulerId(hauler.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'border-[#013a13] bg-[#f8faf4] ring-2 ring-[#013a13]/20 shadow-xs'
                        : 'border-[#edefe9] bg-white hover:bg-[#f8faf4]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={hauler.avatar}
                          alt={hauler.driverName}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0 shadow-xs border border-[#d8dbd5]"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-[#191c19] truncate">
                              {hauler.name}
                            </span>
                            <span className="text-[10px] font-bold text-[#2c694e] flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[13px] text-amber-500 fill-amber-500">
                                star
                              </span>
                              {hauler.rating}
                            </span>
                          </div>

                          <span className="text-[11px] text-[#414940] block font-medium truncate">
                            Driver: <strong>{hauler.driverName}</strong> • {hauler.vehicleType}
                          </span>

                          <span className="text-[10px] text-[#71796f] block font-mono">
                            Reg: {hauler.vehicleReg}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-black text-[#013a13] block">
                          GH₵ {tripFee}
                        </span>
                        <span className="text-[10px] text-[#71796f] block">
                          (GH₵ {haulerRate.toFixed(1)}/cr)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#414940] bg-white p-2 rounded-xl border border-[#e1e3dd]">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="material-symbols-outlined text-[15px] text-[#013a13]">
                          schedule
                        </span>
                        <span className="font-semibold">{hauler.departureWindow}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-[#2c694e] font-bold">
                        <span className="material-symbols-outlined text-[14px]">event_seat</span>
                        <span>{hauler.remainingCrates} Crates Space Left</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {hauler.features.map((feat) => (
                          <span
                            key={feat}
                            className="px-2 py-0.5 rounded-full bg-[#f2f4ee] text-[#414940] text-[9px] font-semibold"
                          >
                            ✓ {feat}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1">
                        <a
                          href={`tel:${hauler.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg bg-[#edefe9] hover:bg-[#e7e9e3] text-[#013a13] active:scale-95 transition-transform"
                          title="Call Driver"
                        >
                          <span className="material-symbols-outlined text-[16px]">call</span>
                        </a>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playSpeech(
                              `${hauler.name}, driver ${hauler.driverName}. Departure ${hauler.departureWindow}. Vehicle ${hauler.vehicleType}, registration ${hauler.vehicleReg}. Fare is ${tripFee} Ghana Cedis.`,
                              'Driver Audio Profile'
                            );
                          }}
                          className="p-1.5 rounded-lg bg-[#edefe9] hover:bg-[#e7e9e3] text-[#2c694e] active:scale-95 transition-transform cursor-pointer"
                          title="Listen in Twi"
                        >
                          <span className="material-symbols-outlined text-[16px]">volume_up</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 5: FARE BREAKDOWN & SUBMIT CTA */}
          <div className="w-full bg-[#e1e3dd]/80 rounded-3xl p-4 shadow-md space-y-3.5 border border-[#c1c9bd]/50">
            <div className="flex items-center justify-between pb-1 border-b border-[#c1c9bd]/60">
              <span className="text-xs uppercase tracking-wider text-[#414940] font-bold">
                Transport Fare &amp; Escrow Breakdown
              </span>
              <span className="text-xs font-bold text-[#013a13]">
                {selectedDestination.distanceKm} km Corridor
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-[#414940]">
              <div className="flex items-center justify-between">
                <span>Standard Charter ({cratesToTransport} crates @ GH₵ {baseRate}):</span>
                <span className="font-semibold line-through text-[#71796f]">
                  GH₵ {grossCost}
                </span>
              </div>

              {isSharedLogistics && (
                <div className="flex items-center justify-between text-[#2c694e] font-bold">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">savings</span>
                    <span>Shared Consolidation Rebate (-{selectedHauler.sharedDiscountPercent}%):</span>
                  </span>
                  <span>-GH₵ {sharedSavings}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-[#c1c9bd]/50 text-sm">
                <span className="font-bold text-[#191c19]">Total Haulage Fee:</span>
                <span className="text-base font-black text-[#013a13]">
                  GH₵ {netTransportFee}
                </span>
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-bold text-[#414940] block">
                Payment Method / Sika Tua:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMode('momo')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    paymentMode === 'momo'
                      ? 'bg-[#013a13] text-white border-[#013a13]'
                      : 'bg-white text-[#414940] border-[#edefe9]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                  <span>MTN MoMo Escrow</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('cash_depot')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    paymentMode === 'cash_depot'
                      ? 'bg-[#013a13] text-white border-[#013a13]'
                      : 'bg-white text-[#414940] border-[#edefe9]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">point_of_sale</span>
                  <span>Cash at Depot</span>
                </button>
              </div>
            </div>

            {/* Freshness Guarantee */}
            <div className="p-3 bg-white/90 rounded-2xl border border-[#c1c9bd]/60 flex items-start gap-2.5 text-xs text-[#013a13]">
              <span
                className="material-symbols-outlined text-[20px] text-[#2c694e] flex-shrink-0 mt-0.5"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
              <div className="min-w-0">
                <span className="font-extrabold block">
                  Central Region Freshness &amp; Spoilage Guarantee:
                </span>
                <span className="text-[11px] text-[#414940] leading-tight block mt-0.5">
                  Inspected vehicle with ventilated crates and insulated tarp. Scheduled to depart{' '}
                  <strong>{selectedHauler.departureWindow}</strong> to minimize heat buildup.
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleRequestTransportSubmit}
              type="button"
              className="w-full h-14 bg-[#013a13] hover:bg-[#1e5128] text-white rounded-2xl text-base font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">send</span>
              <span>Submit Transport Request • Twere Kar</span>
            </button>
          </div>
        </div>
      )}

      {/* Success Modal Overlay (Harvest Listing Created) */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl flex flex-col items-center border border-[#edefe9] space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#aeeecb] text-[#2c694e] flex items-center justify-center">
              <span
                className="material-symbols-outlined text-[36px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
            <span className="text-[22px] text-[#013a13] font-black">Harvest Listed!</span>
            <span className="text-sm text-[#2c694e] font-bold">Yɛatɔn wo nnuane no</span>
            <p className="text-xs text-[#414940] leading-relaxed">
              Your <strong>{quantity} {unit}</strong> of <strong>{cropName}</strong> at{' '}
              <strong>{location}</strong> have been listed on the marketplace. Verified buyers in
              Kasoa &amp; Makola received instant alerts.
            </p>

            <div className="w-full space-y-2 pt-2">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setActiveMode('transport');
                  playSpeech(
                    'Now coordinating transport for your fresh harvest lot. Select a verified hauler below.',
                    'Coordinate Transport Now'
                  );
                }}
                className="w-full h-12 bg-[#013a13] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                <span>Coordinate Transport for this Lot</span>
              </button>

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setActiveTab('market');
                }}
                className="w-full h-12 bg-[#edefe9] hover:bg-[#e7e9e3] text-[#191c19] rounded-2xl text-sm font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform cursor-pointer"
                type="button"
              >
                <span>🛒 View Listing on Market</span>
              </button>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-xs font-bold text-[#71796f] hover:underline cursor-pointer pt-1"
                type="button"
              >
                ➕ Add Another Harvest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal Overlay (Transport Request Dispatched) */}
      {showTransportSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl flex flex-col items-center border border-[#edefe9] space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#013a13] text-[#b1f0ce] flex items-center justify-center">
              <span
                className="material-symbols-outlined text-[36px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_shipping
              </span>
            </div>

            <div>
              <span className="text-[20px] text-[#013a13] font-black block">
                Transport Request Booked!
              </span>
              <span className="text-xs text-[#2c694e] font-bold">
                Booking ID: {lastDispatchedRequestId}
              </span>
            </div>

            <p className="text-xs text-[#414940] leading-relaxed">
              Driver <strong>{selectedHauler.driverName}</strong> ({selectedHauler.vehicleReg})
              has been notified for pickup of <strong>{cratesToTransport} crates</strong> at{' '}
              {selectedListing?.location} bound for {selectedDestination.name}.
            </p>

            {isSharedLogistics && (
              <div className="w-full p-2.5 bg-[#aeeecb]/40 rounded-xl border border-[#2c694e]/30 flex items-center justify-center gap-1.5 text-xs text-[#013a13] font-bold">
                <span className="material-symbols-outlined text-[16px] text-[#2c694e]">savings</span>
                <span>You saved GH₵ {sharedSavings} with shared logistics!</span>
              </div>
            )}

            <div className="w-full space-y-2 pt-2">
              <button
                onClick={() => {
                  setShowTransportSuccessModal(false);
                  setActiveTab('notifications');
                }}
                className="w-full h-12 bg-[#013a13] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">timeline</span>
                <span>Track in Transport Dashboard</span>
              </button>

              <a
                href={`tel:${selectedHauler.phone}`}
                className="w-full h-12 bg-[#edefe9] hover:bg-[#e7e9e3] text-[#191c19] rounded-2xl text-sm font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform inline-flex"
              >
                <span className="material-symbols-outlined text-[20px]">call</span>
                <span>Call Driver ({selectedHauler.phone})</span>
              </a>

              <button
                onClick={() => setShowTransportSuccessModal(false)}
                className="text-xs font-bold text-[#71796f] hover:underline cursor-pointer pt-1"
                type="button"
              >
                Close / Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
