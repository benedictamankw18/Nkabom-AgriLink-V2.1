import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  AppLanguage,
  NavigationTab,
  ProduceListing,
  BuyerOffer,
  NotificationItem,
  PriceThresholdAlert,
  TransportRequest,
  TransportStatus,
} from '../types';
import {
  INITIAL_PRODUCE,
  INITIAL_OFFERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PRICE_ALERTS,
  INITIAL_TRANSPORT_REQUESTS,
} from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedProduce: ProduceListing | null;
  setSelectedProduce: (produce: ProduceListing | null) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string, fallback?: string) => string;
  produceList: ProduceListing[];
  addProduce: (produce: Omit<ProduceListing, 'id'>) => void;
  offers: BuyerOffer[];
  acceptOffer: (id: string) => void;
  declineOffer: (id: string) => void;
  submitPreCommitment: (produceId: string, crates: number, proposedPrice: number, buyerName?: string) => void;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadCount: number;
  // Threshold Alerts state & actions
  priceAlerts: PriceThresholdAlert[];
  addPriceAlert: (alert: Omit<PriceThresholdAlert, 'id' | 'createdAt' | 'triggered'>) => string;
  togglePriceAlert: (id: string) => void;
  removePriceAlert: (id: string) => void;
  checkPriceThresholds: (produceId: string, currentPrice: number, marketName?: string) => number;
  testTriggerPriceAlert: (alertId: string, customPrice?: number) => void;
  // Transport & Logistics
  transportRequests: TransportRequest[];
  addTransportRequest: (req: Omit<TransportRequest, 'id' | 'status'>) => void;
  updateTransportStatus: (id: string, status: TransportStatus) => void;
  // USSD & Role Modals
  showUssdModal: boolean;
  setShowUssdModal: (val: boolean) => void;
  showRoleModal: boolean;
  setShowRoleModal: (val: boolean) => void;
  // Audio Speech state
  isPlayingAudio: boolean;
  audioTitle: string;
  audioScript: string;
  playSpeech: (text: string, title?: string, twiAlternative?: string) => void;
  stopSpeech: () => void;
  // Feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // Settings
  smsMode: boolean;
  setSmsMode: (val: boolean) => void;
  voiceGuidesEnabled: boolean;
  setVoiceGuidesEnabled: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedProduce, setSelectedProduce] = useState<ProduceListing | null>(null);
  const [role, setRole] = useState<UserRole>('farmer');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [produceList, setProduceList] = useState<ProduceListing[]>(INITIAL_PRODUCE);
  const [offers, setOffers] = useState<BuyerOffer[]>(INITIAL_OFFERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [priceAlerts, setPriceAlerts] = useState<PriceThresholdAlert[]>(INITIAL_PRICE_ALERTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [smsMode, setSmsMode] = useState<boolean>(true);
  const [voiceGuidesEnabled, setVoiceGuidesEnabled] = useState<boolean>(true);
  const [transportRequests, setTransportRequests] = useState<TransportRequest[]>(INITIAL_TRANSPORT_REQUESTS);
  const [showUssdModal, setShowUssdModal] = useState<boolean>(false);
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);

  // Audio Guide State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioTitle, setAudioTitle] = useState('');
  const [audioScript, setAudioScript] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const t = (key: string, fallback?: string): string => {
    return TRANSLATIONS[language]?.[key] || fallback || TRANSLATIONS['en']?.[key] || key;
  };

  const playSpeech = (
    text: string,
    title: string = 'Audio Assist • Nkabom Guide',
    twiAlternative?: string
  ) => {
    const isTwi = language === 'tw';
    const effectiveText = isTwi && twiAlternative ? twiAlternative : text;
    const effectiveTitle = isTwi
      ? title.replace('Audio Assist', 'Kasa Mmoa').replace('Weather Forecast', 'Wiem Tebea')
      : title;

    setAudioTitle(effectiveTitle);
    setAudioScript(effectiveText);
    setIsPlayingAudio(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(effectiveText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = isTwi ? 'ak-GH' : 'en-GH';
      utterance.onend = () => {
        setIsPlayingAudio(false);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      // Simulate audio duration for browsers without speech synthesis
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, 4000);
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  const addProduce = (newProduce: Omit<ProduceListing, 'id'>) => {
    const id = 'prod-' + Date.now();
    const created: ProduceListing = { ...newProduce, id };
    setProduceList((prev) => [created, ...prev]);
    showToast('Harvest listed successfully! Verified buyers alerted.');
  };

  const acceptOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'accepted' } : o))
    );
    setNotifications((prev) =>
      prev.map((n) =>
        n.offerId === offerId
          ? { ...n, read: true, badgeText: 'Deal Locked • Apam Asie', actionRequired: false }
          : n
      )
    );
    showToast('Deal Accepted! Produce reserved & buyer notified via SMS.');
  };

  const declineOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'declined' } : o))
    );
    setNotifications((prev) =>
      prev.map((n) =>
        n.offerId === offerId
          ? { ...n, read: true, badgeText: 'Declined', actionRequired: false }
          : n
      )
    );
    showToast('Offer declined.');
  };

  const submitPreCommitment = (
    produceId: string,
    crates: number,
    proposedPrice: number,
    buyerName: string = 'Ama Serwaa (Makola Buyer)'
  ) => {
    setProduceList((prev) =>
      prev.map((p) => {
        if (p.id === produceId) {
          const currentCount = p.preCommitmentCount || 0;
          return {
            ...p,
            preCommitmentCount: Math.min(p.cratesAvailable, currentCount + crates),
          };
        }
        return p;
      })
    );

    const newOfferId = 'offer-' + Date.now();
    const newOffer: BuyerOffer = {
      id: newOfferId,
      buyerName,
      buyerAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAHp3_-xISIy4CHvrwjnRtU1j2rbk8Ao-geo01tJ1-qrar4DhwFtuXyPBwhhXuKWU9QgxjrffX-4lummvVVIr2251o1vUurCdSqOkepYFnxiyImRbM2GjHV2k_mN1GekWEQR-N3YnxI2KyeXHwGu_2MzKoJzAQirUJz6dsI50QjDb6yyXswmHuB52pLHLwYbzgL6D_1NcTf-TDGcKtMQeCY5khV7oo1Dabxsv0r5NGkrOh3Lr557wR_fQ',
      organization: 'Makola & Kasoa Fresh Produce Syndicate',
      rating: 4.9,
      completedHauls: 38,
      pricePerCrate: proposedPrice,
      cratesWanted: crates,
      pickupTime: 'Pre-Harvest Scheduled Pickup',
      logistics: 'Shared Haulage Included',
      phone: '024 411 9022',
      isNew: true,
      status: 'pending',
    };
    setOffers((prev) => [newOffer, ...prev]);

    const notif: NotificationItem = {
      id: 'notif-commit-' + Date.now(),
      type: 'offer',
      title: 'New Pre-Harvest Commitment!',
      badgeText: 'Pre-Commitment',
      timeAgo: 'Just now',
      message: `${buyerName} pre-committed to buy ${crates} crates at GH₵ ${proposedPrice}/crate upon harvest! Tap to lock in the sale.`,
      read: false,
      priceHighlight: `GH₵ ${proposedPrice * crates}`,
      actionRequired: true,
      offerId: newOfferId,
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Pre-commitment for ${crates} crates submitted! Farmer notified.`);
  };

  const addTransportRequest = (req: Omit<TransportRequest, 'id' | 'status'>) => {
    const id = 'tr-' + Date.now();
    const created: TransportRequest = {
      ...req,
      id,
      status: 'requested',
    };
    setTransportRequests((prev) => [created, ...prev]);
    showToast(`Transport request created for ${req.produceTitle}! Matching local drivers.`);

    const notif: NotificationItem = {
      id: 'notif-tr-' + Date.now(),
      type: 'transport',
      title: 'Transport Request Dispatched',
      badgeText: req.isShared ? 'Shared Trip' : 'Dedicated Trip',
      timeAgo: 'Just now',
      message: `Pickup requested at ${req.pickupLocation} to ${req.deliveryLocation}. We are matching verified haulers.`,
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const updateTransportStatus = (id: string, status: TransportStatus) => {
    setTransportRequests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    showToast(`Transport status: ${status.replace('_', ' ').toUpperCase()}`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const addPriceAlert = (newAlert: Omit<PriceThresholdAlert, 'id' | 'createdAt' | 'triggered'>) => {
    const id = 'alert-' + Date.now();
    const created: PriceThresholdAlert = {
      ...newAlert,
      id,
      createdAt: 'Just now',
      triggered: false,
    };
    setPriceAlerts((prev) => [created, ...prev]);
    showToast(`Price target alert set for ${newAlert.produceName} at GH₵ ${newAlert.targetPrice}`);
    return id;
  };

  const togglePriceAlert = (id: string) => {
    setPriceAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === id) {
          const nextActive = !alert.active;
          showToast(
            nextActive
              ? `Alert for ${alert.produceName} activated`
              : `Alert for ${alert.produceName} paused`
          );
          return { ...alert, active: nextActive };
        }
        return alert;
      })
    );
  };

  const removePriceAlert = (id: string) => {
    setPriceAlerts((prev) => prev.filter((alert) => alert.id !== id));
    showToast('Price alert deleted');
  };

  const checkPriceThresholds = (
    produceId: string,
    currentPrice: number,
    marketName: string = 'Techiman Wholesale Market'
  ): number => {
    let triggeredCount = 0;
    const nowStr = 'Just now';

    setPriceAlerts((prevAlerts) => {
      const updatedAlerts = prevAlerts.map((alert) => {
        if (alert.produceId !== produceId || !alert.active) return alert;

        const isMet =
          alert.condition === 'above_or_equal'
            ? currentPrice >= alert.targetPrice
            : currentPrice <= alert.targetPrice;

        if (isMet) {
          triggeredCount++;
          // Create matching notification
          const notifId = 'notif-price-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
          const isHigh = alert.condition === 'above_or_equal';

          const newNotif: NotificationItem = {
            id: notifId,
            type: 'price',
            title: `🎯 Target Met: ${alert.produceName} reached GH₵ ${currentPrice}!`,
            badgeText: isHigh ? 'Target High Reached! 🚀' : 'Bargain Target Met! 📉',
            timeAgo: nowStr,
            message: `Market price at ${marketName} is now GH₵ ${currentPrice}/${alert.unit.includes('Crate') ? 'crate' : 'unit'} (target was ${isHigh ? '≥' : '≤'} GH₵ ${alert.targetPrice}). Buyers actively matching spot orders!`,
            read: false,
            priceHighlight: `GH₵ ${currentPrice}`,
            location: marketName,
            alertId: alert.id,
            produceId: alert.produceId,
            condition: alert.condition,
            targetPrice: alert.targetPrice,
            currentPrice: currentPrice,
            isThresholdAlert: true,
          };

          setNotifications((prevNotifs) => [newNotif, ...prevNotifs]);

          return {
            ...alert,
            triggered: true,
            lastTriggeredPrice: currentPrice,
            lastTriggeredAt: nowStr,
          };
        }
        return alert;
      });

      return updatedAlerts;
    });

    if (triggeredCount > 0) {
      showToast(`🎯 ${triggeredCount} Price Alert(s) triggered! Check Notifications.`);
    }

    return triggeredCount;
  };

  const testTriggerPriceAlert = (alertId: string, customPrice?: number) => {
    const alert = priceAlerts.find((a) => a.id === alertId);
    if (!alert) return;

    const testPrice =
      customPrice !== undefined
        ? customPrice
        : alert.condition === 'above_or_equal'
        ? alert.targetPrice + 5
        : alert.targetPrice - 5;

    const nowStr = 'Just now';
    const isHigh = alert.condition === 'above_or_equal';

    setPriceAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              triggered: true,
              lastTriggeredPrice: testPrice,
              lastTriggeredAt: nowStr,
            }
          : a
      )
    );

    const notifId = 'notif-price-' + Date.now();
    const newNotif: NotificationItem = {
      id: notifId,
      type: 'price',
      title: `🎯 Target Met: ${alert.produceName} reached GH₵ ${testPrice}!`,
      badgeText: isHigh ? 'Target Reached 🚀' : 'Target Price Met 📉',
      timeAgo: nowStr,
      message: `Simulated price change: ${alert.produceName} at ${alert.marketLocation} is now GH₵ ${testPrice} (Target: ${isHigh ? '≥' : '≤'} GH₵ ${alert.targetPrice}). Verified buyers ready to dispatch trucks.`,
      read: false,
      priceHighlight: `GH₵ ${testPrice}`,
      location: alert.marketLocation,
      alertId: alert.id,
      produceId: alert.produceId,
      condition: alert.condition,
      targetPrice: alert.targetPrice,
      currentPrice: testPrice,
      isThresholdAlert: true,
    };

    setNotifications((prev) => [newNotif, ...prev]);

    showToast(
      `🎯 Alert Simulated! ${alert.produceName} hit GH₵ ${testPrice}. Notification created.`
    );

    if (alert.twiSpokenGuidance) {
      playSpeech(
        `Nkratoɔ Aba! ${alert.produceName} boɔ aduru ${testPrice} Cedis wɔ ${alert.marketLocation}. Wo target no yɛ ${alert.targetPrice} Cedis.`,
        `${alert.produceName} Target Met • Twi Audio`
      );
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedProduce,
        setSelectedProduce,
        role,
        setRole,
        language,
        setLanguage,
        t,
        produceList,
        addProduce,
        offers,
        acceptOffer,
        declineOffer,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadCount,
        priceAlerts,
        addPriceAlert,
        togglePriceAlert,
        removePriceAlert,
        checkPriceThresholds,
        testTriggerPriceAlert,
        submitPreCommitment,
        transportRequests,
        addTransportRequest,
        updateTransportStatus,
        showUssdModal,
        setShowUssdModal,
        showRoleModal,
        setShowRoleModal,
        isPlayingAudio,
        audioTitle,
        audioScript,
        playSpeech,
        stopSpeech,
        toastMessage,
        showToast,
        smsMode,
        setSmsMode,
        voiceGuidesEnabled,
        setVoiceGuidesEnabled,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
