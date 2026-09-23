export type UserRole = 'farmer' | 'buyer' | 'seller' | 'transporter' | 'processor' | 'admin';

export type AppLanguage = 'en' | 'tw';

export type NavigationTab = 'home' | 'market' | 'sell' | 'prices' | 'profile' | 'notifications' | 'onboarding';

export type AlertCondition = 'above_or_equal' | 'below_or_equal';

export type SpoilageRiskLevel = 'low' | 'moderate' | 'high';

export type OrganicCertificationStatus = 'all' | 'certified_organic' | 'in_transition' | 'conventional';

export interface MarketFilterState {
  maxDistanceKm: number; // e.g. 10, 25, 50, or 100 for Any
  harvestDateStart: string; // 'YYYY-MM-DD' or ''
  harvestDateEnd: string; // 'YYYY-MM-DD' or ''
  harvestDatePreset: 'all' | 'today' | 'next3days' | 'pre_harvest' | 'custom';
  organicStatus: OrganicCertificationStatus;
}

export type TransportStatus =
  | 'requested'
  | 'matched'
  | 'accepted'
  | 'driver_assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface TransportRequest {
  id: string;
  produceTitle: string;
  quantity: string;
  cratesCount?: number;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  departureTime?: string;
  status: TransportStatus;
  isShared: boolean;
  vehicleType: string;
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  transporterName?: string;
  transporterPhone?: string;
  estimatedCostGhs: number;
  estimatedCost?: number;
  sharedSavingsGhs?: number;
}

export interface PriceThresholdAlert {
  id: string;
  produceId: string;
  produceName: string;
  twiName?: string;
  icon: string;
  unit: string;
  targetPrice: number;
  condition: AlertCondition;
  marketLocation: string;
  createdAt: string;
  active: boolean;
  triggered: boolean;
  lastTriggeredPrice?: number;
  lastTriggeredAt?: string;
  notifyViaSms: boolean;
  smsPhone?: string;
  twiSpokenGuidance?: string;
}

export interface ProduceListing {
  id: string;
  title: string;
  twiTitle?: string;
  cropType: 'roma' | 'round' | 'pepper' | 'onion' | 'cassava' | 'yam' | 'plantain' | 'maize' | 'garden_eggs' | 'cabbage' | string;
  farmerName: string;
  farmerAvatar: string;
  verified: boolean;
  cooperative: string;
  distanceKm: number;
  location: string;
  spotPrice: number;
  marketAvgDiffPercent: number; // e.g. -4%
  cratesAvailable: number;
  weightPerCrate: string;
  image: string;
  gradeTag: string;
  readyStatus: string;
  isReadyToday?: boolean;
  isCooperativeLot?: boolean;
  isNewGrower?: boolean;
  isPreHarvest?: boolean;
  expectedHarvestDate?: string;
  harvestDate?: string;
  organicStatus?: OrganicCertificationStatus;
  organicCertifier?: string;
  spoilageRisk?: SpoilageRiskLevel;
  spoilageReason?: string;
  preCommitmentTarget?: number;
  preCommitmentCount?: number;
  sharedTransportEligible?: boolean;
}

export interface BuyerOffer {
  id: string;
  buyerName: string;
  buyerAvatar: string;
  organization: string;
  rating: number;
  completedHauls: number;
  pricePerCrate: number;
  cratesWanted: number;
  pickupTime: string;
  logistics: string;
  phone: string;
  isNew: boolean;
  status: 'pending' | 'accepted' | 'declined';
}

export interface NotificationItem {
  id: string;
  type: 'offer' | 'price' | 'transport' | 'paid';
  title: string;
  badgeText: string;
  timeAgo: string;
  message: string;
  read: boolean;
  priceHighlight?: string;
  location?: string;
  driverPhone?: string;
  refNumber?: string;
  actionRequired?: boolean;
  offerId?: string;
  alertId?: string;
  produceId?: string;
  condition?: AlertCondition;
  targetPrice?: number;
  currentPrice?: number;
  isThresholdAlert?: boolean;
}
