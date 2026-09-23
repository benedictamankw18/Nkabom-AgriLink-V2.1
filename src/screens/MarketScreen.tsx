import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ProduceListing, MarketFilterState } from '../types';
import { MarketFilterDrawer } from '../components/MarketFilterDrawer';

// SpeechRecognition type declarations for cross-browser compatibility
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: {
    transcript: string;
    confidence: number;
  };
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionErrorEventLike {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}

const getSpeechRecognitionConstructor = (): (new () => SpeechRecognitionInstance) | null => {
  if (typeof window === 'undefined') return null;
  const win = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
};

// Common Ghanaian agricultural search suggestions
const AGRICULTURAL_SUGGESTIONS = [
  { label: 'Tomatoes', query: 'Tomatoes', icon: '🍅' },
  { label: 'Roma', query: 'Roma', icon: '🍅' },
  { label: 'Pepper', query: 'Pepper', icon: '🌶️' },
  { label: 'Onions', query: 'Onions', icon: '🧅' },
  { label: 'Cassava', query: 'Cassava', icon: '🥔' },
  { label: 'Yam', query: 'Yam', icon: '🍠' },
  { label: 'Plantain', query: 'Plantain', icon: '🍌' },
  { label: 'Garden Eggs', query: 'Garden Eggs', icon: '🍆' },
];

export const MarketScreen: React.FC = () => {
  const {
    produceList,
    setSelectedProduce,
    playSpeech,
    stopSpeech,
    showToast,
    transportRequests,
    updateTransportStatus,
    role,
    t,
    language,
  } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showLogisticsCorridor, setShowLogisticsCorridor] = useState(false);

  // Filter Drawer State (Distance to Farm, Harvest Date Range, Organic Certification)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [marketFilters, setMarketFilters] = useState<MarketFilterState>({
    maxDistanceKm: 100, // 100 represents Any
    harvestDateStart: '',
    harvestDateEnd: '',
    harvestDatePreset: 'all',
    organicStatus: 'all',
  });

  // Calculate active filter count for the drawer
  const activeDrawerFiltersCount = useMemo(() => {
    let count = 0;
    if (marketFilters.maxDistanceKm < 100) count++;
    if (
      marketFilters.harvestDatePreset !== 'all' ||
      marketFilters.harvestDateStart ||
      marketFilters.harvestDateEnd
    )
      count++;
    if (marketFilters.organicStatus !== 'all') count++;
    return count;
  }, [marketFilters]);

  const handleResetDrawerFilters = () => {
    setMarketFilters({
      maxDistanceKm: 100,
      harvestDateStart: '',
      harvestDateEnd: '',
      harvestDatePreset: 'all',
      organicStatus: 'all',
    });
    showToast('Filters reset to default.');
  };
  
  // Voice Input States using browser SpeechRecognition API
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [lastVoiceSearch, setLastVoiceSearch] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Check browser SpeechRecognition support
  const isSpeechSupported = useMemo(() => {
    return !!getSpeechRecognitionConstructor();
  }, []);

  const filterChips = [
    { id: 'all', label: 'All Crates', icon: 'apps' },
    { id: 'pre_harvest', label: '🌱 Pre-Harvest Lots', icon: 'psychology' },
    { id: 'low_spoilage', label: '🛡️ Low Spoilage', icon: 'verified_user' },
    { id: 'shared_freight', label: '🚚 Shared Haul', icon: 'local_shipping' },
    { id: 'nearby', label: 'Nearby (<25km)', icon: 'near_me' },
    { id: 'lowest', label: 'Lowest Price', icon: 'payments' },
    { id: 'verified', label: 'Verified Farmer', icon: 'verified' },
    { id: 'ready_today', label: 'Ready Today', icon: 'bolt' },
  ];

  // Stop active speech recognition safely
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore if already stopped
      }
    }
    setIsListening(false);
  };

  // Clean voice search command filler words
  const cleanSpokenQuery = (raw: string): string => {
    return raw
      .replace(/^(search for|find|show me|look for|filter by|get me|i want|buy|check for)\s+/i, '')
      .replace(/[.,?!]+$/, '')
      .trim();
  };

  // Toggle or start SpeechRecognition
  const handleVoiceSearch = () => {
    // If currently listening, toggle off
    if (isListening) {
      stopListening();
      return;
    }

    const SpeechRecognitionClass = getSpeechRecognitionConstructor();
    if (!SpeechRecognitionClass) {
      setVoiceError('Speech recognition is not supported in this browser. Please type to search.');
      showToast('Speech recognition not supported in this browser.');
      return;
    }

    // Stop any existing text-to-speech audio so it doesn't feed back into mic
    stopSpeech();
    setVoiceError(null);
    setLiveTranscript('');

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      // Default to en-US / Ghanaian English for speech accuracy
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
        setLiveTranscript('');
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            final += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }

        const currentSpoken = (final || interim).trim();
        setLiveTranscript(currentSpoken);

        if (final) {
          const cleaned = cleanSpokenQuery(final);
          if (cleaned) {
            setSearchQuery(cleaned);
            setLastVoiceSearch(cleaned);
            showToast(`Voice recognized: "${cleaned}"`);
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceError('Microphone permission was denied. Please allow microphone access in your browser settings.');
          showToast('Microphone access denied.');
        } else if (event.error === 'no-speech') {
          setVoiceError('No speech was detected. Tap the mic and speak clearly.');
          showToast('No speech detected.');
        } else if (event.error === 'network') {
          setVoiceError('Speech service network error. Please verify your connection.');
          showToast('Speech network error.');
        } else {
          setVoiceError(`Voice recognition: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: unknown) {
      console.warn('SpeechRecognition failed to start:', err);
      setIsListening(false);
      setVoiceError('Could not start voice recognition. Please try again.');
    }
  };

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Filter agricultural products by name, crop type, location, farmer, etc.
  const filteredProduce = useMemo(() => {
    let list = [...produceList];

    if (searchQuery.trim()) {
      const cleanQ = cleanSpokenQuery(searchQuery).toLowerCase();
      const terms = cleanQ.split(/\s+/).filter(Boolean);

      list = list.filter((p) => {
        const title = p.title.toLowerCase();
        const twi = (p.twiTitle || '').toLowerCase();
        const crop = (p.cropType || '').toLowerCase();
        const grade = (p.gradeTag || '').toLowerCase();
        const farmer = p.farmerName.toLowerCase();
        const location = p.location.toLowerCase();
        const cooperative = p.cooperative.toLowerCase();

        // Check if item matches a given term with agricultural synonym support
        const matchesTerm = (term: string) => {
          if (
            title.includes(term) ||
            twi.includes(term) ||
            crop.includes(term) ||
            grade.includes(term) ||
            farmer.includes(term) ||
            location.includes(term) ||
            cooperative.includes(term)
          ) {
            return true;
          }

          // Agricultural crop singular / plural & vernacular mappings
          if ((term === 'tomatoes' || term === 'tomato') && (title.includes('tomato') || crop.includes('roma') || crop.includes('round') || twi.includes('ntɔs'))) return true;
          if ((term === 'roma' || term === 'plum') && (title.includes('roma') || crop.includes('roma') || twi.includes('pepere'))) return true;
          if ((term === 'peppers' || term === 'pepper' || term === 'chili' || term === 'shito') && (title.includes('pepper') || crop.includes('pepper') || twi.includes('mako') || twi.includes('shito'))) return true;
          if ((term === 'onions' || term === 'onion') && (title.includes('onion') || crop.includes('onion') || twi.includes('gyeene'))) return true;
          if ((term === 'cassavas' || term === 'cassava') && (title.includes('cassava') || crop.includes('cassava') || twi.includes('bankye'))) return true;
          if ((term === 'yams' || term === 'yam' || term === 'pona') && (title.includes('yam') || crop.includes('yam') || twi.includes('bayere'))) return true;
          if ((term === 'plantains' || term === 'plantain') && (title.includes('plantain') || crop.includes('plantain') || twi.includes('brɔdeɛ') || twi.includes('apem'))) return true;
          if ((term === 'egg' || term === 'eggs' || term === 'eggplant' || term === 'garden eggs') && (title.includes('garden eggs') || crop.includes('garden_eggs') || twi.includes('ntrowa'))) return true;
          if ((term === 'maize' || term === 'corn') && (title.includes('maize') || crop.includes('maize') || twi.includes('aburoo'))) return true;
          if (term === 'cabbage' && title.includes('cabbage')) return true;

          return false;
        };

        // All terms in the spoken/typed query must match
        return terms.every((term) => matchesTerm(term));
      });
    }

    if (activeFilter === 'pre_harvest') {
      list = list.filter((p) => p.isPreHarvest);
    } else if (activeFilter === 'low_spoilage') {
      list = list.filter((p) => p.spoilageRisk === 'low');
    } else if (activeFilter === 'shared_freight') {
      list = list.filter((p) => p.sharedTransportEligible);
    } else if (activeFilter === 'nearby') {
      list = list.filter((p) => p.distanceKm <= 25);
    } else if (activeFilter === 'lowest') {
      list.sort((a, b) => a.spotPrice - b.spotPrice);
    } else if (activeFilter === 'verified') {
      list = list.filter((p) => p.verified);
    } else if (activeFilter === 'ready_today') {
      list = list.filter((p) => p.isReadyToday);
    }

    // 1. Refine by Distance to Farm
    if (marketFilters.maxDistanceKm < 100) {
      list = list.filter((p) => p.distanceKm <= marketFilters.maxDistanceKm);
    }

    // 2. Refine by Harvest Date Range
    if (marketFilters.harvestDatePreset === 'pre_harvest') {
      list = list.filter((p) => p.isPreHarvest || (p.harvestDate && p.harvestDate >= '2026-09-24'));
    } else {
      if (marketFilters.harvestDateStart) {
        list = list.filter((p) => {
          const itemDate = p.harvestDate || (p.isReadyToday ? '2026-09-23' : '');
          return !itemDate || itemDate >= marketFilters.harvestDateStart;
        });
      }
      if (marketFilters.harvestDateEnd) {
        list = list.filter((p) => {
          const itemDate = p.harvestDate || (p.isReadyToday ? '2026-09-23' : '');
          return !itemDate || itemDate <= marketFilters.harvestDateEnd;
        });
      }
    }

    // 3. Refine by Organic Certification Status
    if (marketFilters.organicStatus !== 'all') {
      list = list.filter((p) => {
        const itemStatus = p.organicStatus || 'conventional';
        return itemStatus === marketFilters.organicStatus;
      });
    }

    return list;
  }, [produceList, searchQuery, activeFilter, marketFilters]);

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto px-4 pt-16 pb-28 gap-4 bg-[#f8faf4] min-h-screen">
      {/* Audio Vernacular Assist Banner */}
      <div className="mt-2 bg-[#aeeecb] text-[#316e52] rounded-2xl p-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#2c694e] text-white flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">volume_up</span>
          </div>
          <div className="flex flex-col min-w-0 pr-1">
            <span className="text-xs font-bold truncate">Twi Voice Navigation</span>
            <span className="text-xs opacity-90 truncate">
              Tie ntɔteɛ a ɛwɔ ha no nkaeɛ
            </span>
          </div>
        </div>

        <button
          onClick={() =>
            playSpeech(
              'Gua so nnuane: Kwame Mensah wɔ pepere bɔkiti aduonum wɔ Techiman na ne boɔ yɛ 150 cedis. Akosua Agyeman nso wɔ mako foforɔ wɔ Offinso. Alhassan Haruna wɔ gyeene kɔkɔɔ wɔ Techiman.',
              'Marketplace Voice Summary'
            )
          }
          className="px-3.5 py-1.5 rounded-full bg-white text-[#2c694e] text-xs font-extrabold shadow-xs active:scale-95 transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
          <span>Tie</span>
        </button>
      </div>

      {/* Search & Voice Input Form */}
      <section className="flex flex-col gap-2.5">
        <div className="relative flex items-center">
          <div className="absolute left-4 flex items-center pointer-events-none text-[#013a13]">
            <span className="material-symbols-outlined text-[24px]">search</span>
          </div>
          
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full h-14 pl-12 pr-32 rounded-2xl bg-white text-[#191c19] text-sm placeholder:text-[#71796f] shadow-xs focus:outline-none focus:ring-2 border transition-all ${
              isListening
                ? 'border-[#812a00] ring-2 ring-[#812a00]/30'
                : 'border-[#edefe9] focus:ring-[#013a13]'
            }`}
            placeholder="Search or speak produce (e.g. Tomatoes)..."
            type="text"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {/* Clear Input Button */}
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setLiveTranscript('');
                  setLastVoiceSearch(null);
                }}
                aria-label="Clear search"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#71796f] hover:text-[#191c19] hover:bg-[#edefe9] transition-all cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}

            {/* SpeechRecognition Voice Mic Button */}
            <button
              onClick={handleVoiceSearch}
              aria-label={isListening ? 'Stop voice recognition' : 'Search agricultural products by voice'}
              title={
                !isSpeechSupported
                  ? 'Speech recognition not supported in this browser'
                  : isListening
                  ? 'Listening... Click to stop'
                  : 'Click to speak produce name'
              }
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center active:scale-90 transition-all cursor-pointer ${
                isListening
                  ? 'bg-[#ba1a1a] text-white shadow-md ring-4 ring-[#ba1a1a]/20 animate-pulse'
                  : searchQuery
                  ? 'bg-[#b1f0ce] text-[#002114] hover:bg-[#95d4b3]'
                  : 'bg-[#edefe9] text-[#013a13] hover:bg-[#e7e9e3]'
              }`}
              type="button"
            >
              {isListening ? (
                <span className="material-symbols-outlined text-[20px]">mic</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">mic</span>
              )}
              {isListening && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping" />
              )}
            </button>

            {/* Filter Drawer Toggle Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              aria-label="Open produce filter drawer"
              title="Refine produce by distance, harvest date, and organic certification"
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center active:scale-90 transition-all cursor-pointer ${
                activeDrawerFiltersCount > 0
                  ? 'bg-[#013a13] text-[#b1f0ce] shadow-sm ring-2 ring-[#013a13]/30'
                  : 'bg-[#1e5128] text-[#8cc38f] hover:bg-[#143e1d]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
              {activeDrawerFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#b1f0ce] text-[#013a13] text-[10px] font-black rounded-full flex items-center justify-center border border-[#013a13] shadow-xs">
                  {activeDrawerFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Live Voice Input Feedback Banner when SpeechRecognition is Listening */}
        {isListening && (
          <div className="rounded-2xl p-3 bg-gradient-to-r from-[#ffdbcf] to-[#ffe8de] border border-[#ffb59a] text-[#380d00] flex flex-col gap-2 shadow-sm animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Animated Waveform Equalizer */}
                <div className="flex items-center gap-1 h-5 px-1">
                  <span className="w-1 bg-[#ba1a1a] rounded-full animate-bounce h-3 [animation-delay:-0.3s]"></span>
                  <span className="w-1 bg-[#ba1a1a] rounded-full animate-bounce h-5 [animation-delay:-0.15s]"></span>
                  <span className="w-1 bg-[#ba1a1a] rounded-full animate-bounce h-4"></span>
                  <span className="w-1 bg-[#ba1a1a] rounded-full animate-bounce h-5 [animation-delay:-0.2s]"></span>
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-[#ba1a1a]">
                  Listening for Produce Name...
                </span>
              </div>

              <button
                onClick={stopListening}
                type="button"
                className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-white text-xs font-bold text-[#ba1a1a] cursor-pointer shadow-2xs"
              >
                Done
              </button>
            </div>

            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xs rounded-xl px-3 py-2 border border-[#ffb59a]/40">
              <span className="material-symbols-outlined text-[18px] text-[#802a00]">
                hearing
              </span>
              <p className="text-xs text-[#380d00] font-medium italic truncate">
                {liveTranscript ? `"${liveTranscript}"` : 'Say "Tomatoes", "Pepper", "Onions", "Cassava", "Yam"...'}
              </p>
            </div>
          </div>
        )}

        {/* Voice Error Notice */}
        {voiceError && (
          <div className="rounded-xl p-2.5 bg-[#ffdad6] text-[#93000a] text-xs flex items-center justify-between border border-[#ffdad6]/80">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{voiceError}</span>
            </div>
            <button
              onClick={() => setVoiceError(null)}
              className="text-[#93000a] font-bold px-1.5 py-0.5 hover:bg-white/40 rounded"
              type="button"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Agricultural Voice & Quick Filter Chips */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-[#414940] uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#2c694e]">
                mic_none
              </span>
              <span>Voice / Quick Produce Filters</span>
            </span>
            {searchQuery && (
              <span className="text-[11px] text-[#2c694e] font-bold">
                Filtered: "{searchQuery}"
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5 pb-1 -mx-4 px-4 scrollbar-none">
            {AGRICULTURAL_SUGGESTIONS.map((item) => {
              const isSelected =
                searchQuery.toLowerCase().includes(item.query.toLowerCase()) ||
                (item.query === 'Tomatoes' && searchQuery.toLowerCase().includes('tomato'));
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      setSearchQuery('');
                      setLastVoiceSearch(null);
                    } else {
                      setSearchQuery(item.query);
                      setLastVoiceSearch(item.query);
                      showToast(`Filtered by ${item.label}`);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-2xs active:scale-95 transition-all flex-shrink-0 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#013a13] text-white border-[#013a13]'
                      : 'bg-white text-[#191c19] border-[#edefe9] hover:bg-[#f2f4ee]'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Drawer Filters Display */}
        {activeDrawerFiltersCount > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1 animate-fadeIn">
            <span className="text-[11px] font-bold text-[#414940] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#013a13]">filter_alt</span>
              <span>{t('market.activeFilters', 'Active Filters')}:</span>
            </span>

            {marketFilters.maxDistanceKm < 100 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#013a13] text-white text-[11px] font-bold shadow-2xs">
                <span>&lt; {marketFilters.maxDistanceKm} km</span>
                <button
                  type="button"
                  onClick={() => setMarketFilters((prev) => ({ ...prev, maxDistanceKm: 100 }))}
                  className="hover:text-red-300 ml-0.5 cursor-pointer"
                  aria-label="Remove distance filter"
                >
                  <span className="material-symbols-outlined text-[13px]">close</span>
                </button>
              </span>
            )}

            {marketFilters.harvestDatePreset !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#013a13] text-white text-[11px] font-bold shadow-2xs">
                <span>
                  {marketFilters.harvestDatePreset === 'today'
                    ? 'Harvest: Today'
                    : marketFilters.harvestDatePreset === 'next3days'
                    ? 'Harvest: Next 3 Days'
                    : marketFilters.harvestDatePreset === 'pre_harvest'
                    ? 'Pre-Harvest Lots'
                    : `Date: ${marketFilters.harvestDateStart || 'Start'} → ${marketFilters.harvestDateEnd || 'End'}`}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setMarketFilters((prev) => ({
                      ...prev,
                      harvestDatePreset: 'all',
                      harvestDateStart: '',
                      harvestDateEnd: '',
                    }))
                  }
                  className="hover:text-red-300 ml-0.5 cursor-pointer"
                  aria-label="Remove harvest date filter"
                >
                  <span className="material-symbols-outlined text-[13px]">close</span>
                </button>
              </span>
            )}

            {marketFilters.organicStatus !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#013a13] text-white text-[11px] font-bold shadow-2xs">
                <span>
                  {marketFilters.organicStatus === 'certified_organic'
                    ? '🌿 Certified Organic'
                    : marketFilters.organicStatus === 'in_transition'
                    ? '🌱 In-Transition'
                    : '🚜 Conventional'}
                </span>
                <button
                  type="button"
                  onClick={() => setMarketFilters((prev) => ({ ...prev, organicStatus: 'all' }))}
                  className="hover:text-red-300 ml-0.5 cursor-pointer"
                  aria-label="Remove organic certification filter"
                >
                  <span className="material-symbols-outlined text-[13px]">close</span>
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetDrawerFilters}
              className="text-[11px] font-bold text-[#812a00] hover:underline cursor-pointer ml-1"
            >
              {t('market.resetAll', 'Reset all')}
            </button>
          </div>
        )}

        {/* Filter Chips Horizontal Scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 -mx-4 px-4 scrollbar-none">
          {filterChips.map((chip) => {
            const isActive = activeFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                type="button"
                className={`whitespace-nowrap px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all flex-shrink-0 cursor-pointer border ${
                  isActive
                    ? 'bg-[#013a13] text-white border-[#013a13]'
                    : 'bg-white text-[#191c19] border-[#edefe9] hover:bg-[#f2f4ee]'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[16px] ${
                    isActive ? 'text-white' : 'text-[#2c694e]'
                  }`}
                >
                  {chip.icon}
                </span>
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Live Market Ticker Callout */}
      <div className="rounded-2xl bg-white p-3.5 flex items-center justify-between shadow-xs border border-[#edefe9]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#b1f0ce] flex-shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#2c694e] animate-ping absolute"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#2c694e] relative"></span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold text-[#013a13] uppercase tracking-wider">
              Ghana Agro Marketplace
            </span>
            <p className="text-xs text-[#191c19] truncate font-medium">
              <strong className="text-[#2c694e] font-black">{filteredProduce.length} Listings</strong>{' '}
              {searchQuery ? `matching "${searchQuery}"` : 'available across Bono East, Ashanti & Ahafo'}
            </p>
          </div>
        </div>

        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
            className="text-xs font-bold text-[#812a00] hover:underline flex-shrink-0 ml-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Shared Logistics Corridor Card (FR-33 to FR-36) */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-[#edefe9] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-[#013a13] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            </span>
            <div>
              <h3 className="text-xs font-black text-[#191c19]">
                Central Region Logistics Corridor
              </h3>
              <p className="text-[11px] text-[#414940]">
                Mankessim • Assin Fosu • Kasoa • Makola
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLogisticsCorridor(!showLogisticsCorridor)}
            className="text-xs font-bold text-[#2c694e] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>{showLogisticsCorridor ? 'Collapse' : `View Trips (${transportRequests.length})`}</span>
            <span className="material-symbols-outlined text-[16px]">
              {showLogisticsCorridor ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>

        {showLogisticsCorridor && (
          <div className="space-y-2.5 pt-1 animate-fade-in">
            {transportRequests.map((tr) => (
              <div
                key={tr.id}
                className="p-3 bg-[#f8faf4] rounded-2xl border border-[#e1e3dd] space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-extrabold text-[#191c19] block">
                      {tr.produceTitle} ({tr.cratesCount} Crates)
                    </span>
                    <span className="text-[11px] text-[#414940] block">
                      📍 {tr.pickupLocation} ➔ {tr.deliveryLocation}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      tr.status === 'in_transit'
                        ? 'bg-amber-100 text-amber-800'
                        : tr.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {tr.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] border-t border-[#edefe9] pt-2">
                  <div className="flex items-center gap-1.5 text-[#2c694e] font-semibold">
                    <span className="material-symbols-outlined text-[15px]">badge</span>
                    <span>{tr.transporterName || 'Transporter Matching'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#013a13]">
                      GH₵ {tr.estimatedCost}
                    </span>
                    {tr.transporterPhone && (
                      <a
                        href={`tel:${tr.transporterPhone}`}
                        className="px-2 py-1 bg-[#013a13] text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[12px]">call</span>
                        <span>Call</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Status Advancement for Transporter Role Simulation */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-[#71796f] font-semibold">Update Status:</span>
                  {(['driver_assigned', 'in_transit', 'delivered'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateTransportStatus(tr.id, st)}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                        tr.status === st
                          ? 'bg-[#013a13] text-white'
                          : 'bg-[#edefe9] text-[#414940] hover:bg-[#e1e3dd]'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Produce Listings Flow */}
      <div className="flex flex-col gap-5">
        {filteredProduce.map((produce) => (
          <article
            key={produce.id}
            className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow border border-[#edefe9] flex flex-col"
          >
            {/* Media Header with Tags */}
            <div className="relative w-full h-48 bg-[#f2f4ee]">
              <img
                className="w-full h-full object-cover"
                alt={produce.title}
                src={produce.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

              {/* Status Badge */}
              <div className="absolute top-3 left-3 bg-[#812a00] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#ffdbcf] animate-pulse"></span>
                <span>{produce.readyStatus}</span>
              </div>

              {/* Grade Tag */}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[#013a13] text-xs font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#2c694e]">
                  eco
                </span>
                <span>{produce.gradeTag}</span>
              </div>

              {/* Metric Highlight Bar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">
                    inventory_2
                  </span>
                  <span className="text-sm font-black drop-shadow-sm">
                    {produce.cratesAvailable} Crates Available
                  </span>
                </div>
                <span className="text-xs opacity-90 drop-shadow-sm font-medium">
                  {produce.weightPerCrate}
                </span>
              </div>
            </div>

            {/* Content Pod */}
            <div className="p-4 flex flex-col gap-3">
              {/* Farmer Credibility & Hub Location */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    className="w-11 h-11 rounded-full object-cover flex-shrink-0 shadow-xs ring-1 ring-[#013a13]/20"
                    alt={produce.farmerName}
                    src={produce.farmerAvatar}
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-base text-[#191c19] font-black truncate">
                        {produce.farmerName}
                      </span>
                      {produce.verified && (
                        <span
                          className="material-symbols-outlined text-[18px] text-[#2c694e] flex-shrink-0"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          verified
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#2c694e] font-semibold truncate">
                      {produce.cooperative}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f2f4ee] text-[#414940] flex-shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-[#013a13]">
                    location_on
                  </span>
                  <span className="text-xs font-bold">{produce.distanceKm} km away</span>
                </div>
              </div>

              {/* Title & Vernacular Name */}
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  {/* Organic Certification Tag */}
                  {produce.organicStatus === 'certified_organic' && (
                    <span className="px-2 py-0.5 rounded-full bg-[#b1f0ce]/50 text-[#013a13] text-[10px] font-bold border border-[#2c694e]/40 flex items-center gap-1 shadow-2xs">
                      <span className="material-symbols-outlined text-[13px] text-[#013a13]">eco</span>
                      <span>🌿 Certified Organic</span>
                    </span>
                  )}
                  {produce.organicStatus === 'in_transition' && (
                    <span className="px-2 py-0.5 rounded-full bg-[#f1f8e9] text-[#2c694e] text-[10px] font-bold border border-[#c5e1a5] flex items-center gap-1 shadow-2xs">
                      <span className="material-symbols-outlined text-[13px]">spa</span>
                      <span>🌱 In-Transition (PGS)</span>
                    </span>
                  )}
                  {produce.organicStatus === 'conventional' && (
                    <span className="px-2 py-0.5 rounded-full bg-[#f2f4ee] text-[#555e52] text-[10px] font-medium border border-[#edefe9] flex items-center gap-1">
                      <span>🚜 Conventional</span>
                    </span>
                  )}

                  {/* Harvest Date Info Tag */}
                  {produce.harvestDate && (
                    <span className="px-2 py-0.5 rounded-full bg-white text-[#414940] text-[10px] font-bold border border-[#edefe9] flex items-center gap-1 shadow-2xs">
                      <span className="material-symbols-outlined text-[13px] text-[#2c694e]">event</span>
                      <span>Harvest: {produce.harvestDate}</span>
                    </span>
                  )}

                  {produce.isPreHarvest && (
                    <span className="px-2 py-0.5 rounded-full bg-[#013a13] text-white text-[10px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">psychology</span>
                      <span>Pre-Harvest ({produce.expectedHarvestDate || 'Upcoming'})</span>
                    </span>
                  )}
                  {produce.spoilageRisk && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        produce.spoilageRisk === 'low'
                          ? 'bg-[#eaf2e4] text-[#013a13] border-[#cbe0c5]'
                          : 'bg-[#fff5ee] text-[#812a00] border-[#ffd6ba]'
                      }`}
                    >
                      {produce.spoilageRisk === 'low' ? '🛡️ Low Spoilage' : '⚠️ Mod. Spoilage'}
                    </span>
                  )}
                  {produce.sharedTransportEligible && (
                    <span className="px-2 py-0.5 rounded-full bg-[#f2f4ee] text-[#2c694e] text-[10px] font-bold border border-[#c1c9bd]">
                      🚚 Shared Haul
                    </span>
                  )}
                </div>

                <h3 className="text-base font-extrabold text-[#191c19] leading-snug">
                  {produce.title}
                </h3>
                {produce.twiTitle && (
                  <span className="text-xs text-[#71796f] font-medium">
                    Twi: {produce.twiTitle}
                  </span>
                )}
              </div>

              {/* Pre-Commitment Progress Bar if Pre-Harvest */}
              {produce.isPreHarvest && (
                <div className="bg-[#f8faf4] p-2.5 rounded-xl border border-[#edefe9] space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-[#414940]">Pre-Commitment Target</span>
                    <span className="font-bold text-[#013a13]">
                      {produce.preCommitmentCount || 0} / {produce.cratesAvailable} Crates Pledged
                    </span>
                  </div>
                  <div className="w-full bg-[#e1e3dd] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#013a13] h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(((produce.preCommitmentCount || 0) / produce.cratesAvailable) * 100)
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Location Subtitle */}
              <div className="flex items-center gap-1 text-[#414940] text-xs font-medium">
                <span className="material-symbols-outlined text-[16px] text-[#71796f]">
                  domain
                </span>
                <span className="truncate">{produce.location}</span>
              </div>

              {/* Pricing Panel */}
              <div className="p-3 rounded-2xl bg-[#f2f4ee] flex items-center justify-between border border-[#edefe9]">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#414940] uppercase tracking-wider font-bold">
                    Spot Price
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[22px] text-[#013a13] font-black">
                      GHS {produce.spotPrice}
                    </span>
                    <span className="text-xs text-[#414940] font-medium">/ crate</span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="text-xs text-[#2c694e] font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]">
                      trending_down
                    </span>
                    <span>{produce.marketAvgDiffPercent}% Market Avg</span>
                  </span>
                  <span className="text-xs text-[#414940] font-medium">
                    Total: GHS {(produce.cratesAvailable * produce.spotPrice).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Min 56px Height */}
              <div className="pt-1 flex items-center gap-2">
                <a
                  href="tel:0244123456"
                  aria-label={`Call farmer ${produce.farmerName}`}
                  className="h-14 w-14 rounded-2xl bg-[#edefe9] text-[#013a13] flex items-center justify-center active:scale-95 transition-transform flex-shrink-0 shadow-xs hover:bg-[#e7e9e3]"
                >
                  <span className="material-symbols-outlined text-[24px]">call</span>
                </a>

                <button
                  onClick={() => setSelectedProduce(produce)}
                  className="h-14 flex-1 rounded-2xl bg-[#013a13] hover:bg-[#1e5128] text-white text-base font-bold flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-transform cursor-pointer"
                  type="button"
                >
                  <span>View &amp; Offer</span>
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </article>
        ))}

        {filteredProduce.length === 0 && (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#edefe9] shadow-xs flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#f2f4ee] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-3xl text-[#71796f]">
                {activeDrawerFiltersCount > 0 ? 'filter_list_off' : 'search_off'}
              </span>
            </div>
            <p className="text-base font-extrabold text-[#191c19]">
              {activeDrawerFiltersCount > 0
                ? t('market.noResults', 'No produce matches your filters')
                : searchQuery
                ? `No produce matching "${searchQuery}"`
                : 'No produce available'}
            </p>
            <p className="text-xs text-[#414940] mt-1 max-w-xs">
              {activeDrawerFiltersCount > 0
                ? t(
                    'market.tryAdjusting',
                    'Try expanding your distance radius or selecting all certification methods.'
                  )
                : 'Try voice searching for another crop like "Tomatoes", "Pepper", "Onions", "Cassava", or "Yam".'}
            </p>
            <div className="flex items-center gap-2 mt-4">
              {activeDrawerFiltersCount > 0 ? (
                <>
                  <button
                    onClick={() => setIsFilterDrawerOpen(true)}
                    className="px-4 py-2.5 bg-[#013a13] text-white rounded-xl text-xs font-bold active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">tune</span>
                    <span>Adjust Filters</span>
                  </button>
                  <button
                    onClick={handleResetDrawerFilters}
                    className="px-4 py-2.5 bg-[#edefe9] text-[#013a13] rounded-xl text-xs font-bold active:scale-95 transition-all cursor-pointer"
                    type="button"
                  >
                    {t('market.resetAll', 'Reset All')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveFilter('all');
                      setLastVoiceSearch(null);
                    }}
                    className="px-4 py-2.5 bg-[#013a13] text-white rounded-xl text-xs font-bold active:scale-95 transition-all cursor-pointer"
                    type="button"
                  >
                    Clear Search
                  </button>
                  <button
                    onClick={handleVoiceSearch}
                    className="px-4 py-2.5 bg-[#edefe9] text-[#013a13] rounded-xl text-xs font-bold active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">mic</span>
                    <span>Speak Again</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Escrow Protected Reassurance Banner */}
      <div className="mt-2 flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-[#f2f4ee] border border-[#edefe9]">
        <div className="w-10 h-10 rounded-full bg-[#aeeecb] text-[#316e52] flex items-center justify-center mb-1">
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
        </div>
        <span className="text-sm font-bold text-[#013a13]">
          Nkabom Escrow Protected
        </span>
        <p className="text-xs text-[#414940] mt-0.5 max-w-xs">
          Payments held safe until you inspect crates at pickup. No advance risk.
        </p>
      </div>

      {/* Produce Refinement Filter Drawer (Distance, Harvest Date Range, Organic Certification) */}
      <MarketFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={marketFilters}
        onApplyFilters={(newFilters) => {
          setMarketFilters(newFilters);
          showToast('Produce filters applied.');
        }}
        onResetFilters={handleResetDrawerFilters}
        allProduce={produceList}
      />
    </div>
  );
};

