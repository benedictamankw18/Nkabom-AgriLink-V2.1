import { AppLanguage } from '../types';

export const TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  en: {
    // Navigation & Screen Titles
    'nav.home': 'Home',
    'nav.market': 'Market',
    'nav.sell': 'List Produce',
    'nav.prices': 'Market Rates',
    'nav.profile': 'Profile',
    'nav.notifications': 'Notifications',

    // Header & Actions
    'header.appName': 'Nkabom AgriLink',
    'header.ussd': '*920#',
    'header.switchRole': 'Switch Role',
    'header.language': 'Language',
    'header.langEn': 'English',
    'header.langTw': 'Twi',

    // Roles
    'role.farmer': 'Farmer',
    'role.buyer': 'Buyer',
    'role.transporter': 'Hauler',
    'role.processor': 'Processor',
    'role.admin': 'Admin',
    'role.seller': 'Seller',

    // Quick Actions
    'quick.list': 'List Harvest',
    'quick.listSub': 'Add Produce',
    'quick.rates': 'Market Rates',
    'quick.ratesSub': 'Today’s Prices',
    'quick.deals': 'My Deals',
    'quick.dealsSub': 'Active Contracts',

    // Voice & Audio
    'voice.listening': 'Playing Audio Assist',
    'voice.stop': 'Stop',
    'voice.listen': 'Listen',
    'voice.twiGuide': 'Listen in Twi',
    'voice.englishGuide': 'Listen in English',

    // Statuses & Badges
    'status.verified': 'Verified Pilot',
    'status.live': 'Live Rates',
    'status.inEscrow': 'Escrow Protected',
    'status.active': 'Active',

    // Market Filters
    'market.filterTitle': 'Refine Produce',
    'market.filterSubtitle': 'Filter by farm distance, harvest freshness, and organic certification',
    'market.distanceToFarm': 'Distance to Farm',
    'market.withinKm': 'Within',
    'market.anyDistance': 'Any Distance',
    'market.harvestDateRange': 'Harvest Date Range',
    'market.allDates': 'All Dates',
    'market.harvestToday': 'Harvested Today (Sep 23)',
    'market.next3Days': 'Next 3 Days (Sep 23 - Sep 26)',
    'market.preHarvestOnly': 'Pre-Harvest Lots Only',
    'market.customRange': 'Custom Date Range',
    'market.startDate': 'From Date',
    'market.endDate': 'To Date',
    'market.organicStatus': 'Organic Certification Status',
    'market.allMethods': 'All Methods',
    'market.certifiedOrganic': 'Certified Organic',
    'market.certifiedOrganicDesc': 'Verified Green Label / Ecocert / CERES',
    'market.inTransition': 'In-Transition / Natural',
    'market.inTransitionDesc': 'Participatory Guarantee (PGS) - No synthetics',
    'market.conventional': 'Conventional',
    'market.conventionalDesc': 'Standard commercial farming practices',
    'market.applyFilters': 'Apply Filters',
    'market.resetAll': 'Reset All',
    'market.activeFilters': 'Active Filters',
    'market.noResults': 'No produce matches your filters',
    'market.tryAdjusting': 'Try expanding your distance radius or selecting all certification methods.',

    // Escrow QR Code
    'escrow.generateQr': 'Generate QR Code',
    'escrow.qrSubtitle': 'Dynamic QR code for secure, instant buyer payments & escrow lock',
    'escrow.scanToPay': 'Scan to Pay Securely',
    'escrow.simulateScan': 'Simulate Buyer Scan',
    'escrow.presentQr': 'Present QR Code',
    'escrow.instantFarmgate': 'Instant Farmgate Sale',
    'escrow.existingOrders': 'Linked Escrow Orders',
    'escrow.paymentReceived': 'Payment Received & Escrow Verified!',
    'escrow.copyUssd': 'Copy USSD (*170#)',
    'escrow.shareRequest': 'Share via WhatsApp / SMS',
    'escrow.downloadQr': 'Save QR Code',

    // Yield Optimization
    'yield.title': 'Yield Optimization',
    'yield.subtitle': 'Weather-calibrated fertilizer & pest control recommendations',
    'yield.targetCrop': 'Target Crop',
    'yield.weatherHub': 'Regional Weather Hub',
    'yield.fertilizerTab': 'Fertilizer Prescriptions',
    'yield.pestTab': 'Pest & Blight Defense',
    'yield.calculatorTab': 'Dosage Calculator',
    'yield.currentWeather': 'Current Weather Impact',
    'yield.sendSmsAdvisory': 'Send Advisory via SMS',
    'yield.sendSmsSuccess': 'Yield optimization guide dispatched to your phone via SMS!',

    // Feedback
    'lang.switched': 'Language switched to English',
    'lang.speechEn': 'Language switched to English. App menus and voice assistance are now set to English.',
    'lang.speechTw': 'Akwaaba! Woasesa kasa no akɔ Akan Twi mu. Seesei mmoa ne nkratoɔ nyinaa bɛba Twi mu.',
  },
  tw: {
    // Navigation & Screen Titles
    'nav.home': 'Fie',
    'nav.market': 'Gua So',
    'nav.sell': 'Tɔn Nnuane',
    'nav.prices': 'Nnɛ Boɔ',
    'nav.profile': 'Wo Ho Nsɛm',
    'nav.notifications': 'Nkratoɔ',

    // Header & Actions
    'header.appName': 'Nkabom AgriLink',
    'header.ussd': '*920#',
    'header.switchRole': 'Sesa Wo Dwuma',
    'header.language': 'Kasa',
    'header.langEn': 'Borɔfo',
    'header.langTw': 'Twi',

    // Roles
    'role.farmer': 'Okuafoɔ',
    'role.buyer': 'Ɔtɔfoɔ',
    'role.transporter': 'Kar Wura',
    'role.processor': 'Adwumakuo',
    'role.admin': 'Panin',
    'role.seller': 'Ɔtɔnfoɔ',

    // Quick Actions
    'quick.list': 'Tɔn Nnuane',
    'quick.listSub': 'Fa Nnuane Ka Ho',
    'quick.rates': 'Nnɛ Boɔ',
    'quick.ratesSub': 'Gua Boɔ',
    'quick.deals': 'Apam Horow',
    'quick.dealsSub': 'Apam a Ɛkɔ So',

    // Voice & Audio
    'voice.listening': 'Kasa Mmoa Retwe',
    'voice.stop': 'Gyae',
    'voice.listen': 'Tie',
    'voice.twiGuide': 'Tie wɔ Twi mu',
    'voice.englishGuide': 'Tie wɔ Borɔfo mu',

    // Statuses & Badges
    'status.verified': 'Afuo a Wɔagye Atom',
    'status.live': 'Gua Boɔ Seesei',
    'status.inEscrow': 'Sika Bɔ Mu Den',
    'status.active': 'Ɛrekɔ So',

    // Market Filters
    'market.filterTitle': 'Sɔsɔ Nnuane Mu',
    'market.filterSubtitle': 'Yi nnuane sɔsɔ kwan a ɛda ntam, twabere, ne abɔdeɛ akwankyerɛ',
    'market.distanceToFarm': 'Kwan a Ɛda Afuo Ntam',
    'market.withinKm': 'Wɔ km',
    'market.anyDistance': 'Kwan biara',
    'market.harvestDateRange': 'Twabere Bere',
    'market.allDates': 'Nda Nyinaa',
    'market.harvestToday': 'Wɔatwa Nnɛ (Sep 23)',
    'market.next3Days': 'Nda 3 a Ɛreba (Sep 23 - Sep 26)',
    'market.preHarvestOnly': 'Nnuane a Yɛrentwa Ntɛm',
    'market.customRange': 'Paw Nda Pɔtee',
    'market.startDate': 'Firi Da',
    'market.endDate': 'Kɔsi Da',
    'market.organicStatus': 'Abɔdeɛ Akwankyerɛ (Organic)',
    'market.allMethods': 'Kwan biara',
    'market.certifiedOrganic': 'Abɔdeɛ Pa (Certified Organic)',
    'market.certifiedOrganicDesc': 'Green Label / Ecocert agye atom',
    'market.inTransition': 'Agro-Eco / Foforɔ',
    'market.inTransitionDesc': 'Participatory Guarantee (PGS) - Aduro nni mu',
    'market.conventional': 'Kwan Dadaw (Conventional)',
    'market.conventionalDesc': 'Kuayɔ a wɔtaa yɛ',
    'market.applyFilters': 'Gye Sɔsɔe Atom',
    'market.resetAll': 'San Fa Firi Ase',
    'market.activeFilters': 'Sɔsɔe a Ɛrekɔ So',
    'market.noResults': 'Nnuane biara nni hɔ a ɛne wo sɔsɔe hyia',
    'market.tryAdjusting': 'Sesa kwan no kɛseɛ anaasɛ paw kuayɔ akwankyerɛ nyinaa.',

    // Escrow QR Code
    'escrow.generateQr': 'Yɛ QR Code',
    'escrow.qrSubtitle': 'Fa QR code kyerɛ atɔfoɔ ma wɔntua sika bɔ mu den ntɛm',
    'escrow.scanToPay': 'Scan Tua Sika Bɔ Mu Den',
    'escrow.simulateScan': 'Sɔ Hwɛ: Ɔtɔfoɔ Scan',
    'escrow.presentQr': 'Kyerɛ QR Code',
    'escrow.instantFarmgate': 'Afuo Ano Tẽẽ Tɔn',
    'escrow.existingOrders': 'Escrow Nkratoɔ a Ɛwɔ Hɔ',
    'escrow.paymentReceived': 'Wɔagye Sika Atom Wɔ Escrow Mu!',
    'escrow.copyUssd': 'Kɔpi USSD (*170#)',
    'escrow.shareRequest': 'Mane wɔ WhatsApp / SMS so',
    'escrow.downloadQr': 'Sie QR Code No',

    // Yield Optimization
    'yield.title': 'Nnuane Dodoɔ Nhyiamu',
    'yield.subtitle': 'Wiem tebea ne aduru a ɛbɛma woanya nnɔbae pii',
    'yield.targetCrop': 'Nnuane a Woredua',
    'yield.weatherHub': 'Wiem Tebea Beae',
    'yield.fertilizerTab': 'Nnuane Aduro (Fertilizer)',
    'yield.pestTab': 'Mmoawa & Yareɛ Ho Akwankyerɛ',
    'yield.calculatorTab': 'Aduru Susu Afuo Ano',
    'yield.currentWeather': 'Wiem Tebea Nsunsuansoɔ',
    'yield.sendSmsAdvisory': 'Mane Akwankyerɛ wɔ SMS so',
    'yield.sendSmsSuccess': 'Wɔamane nnɔbae dodoɔ akwankyerɛ akɔ wo fon so wɔ SMS so!',

    // Feedback
    'lang.switched': 'Woasesa kasa no akɔ Twi mu',
    'lang.speechEn': 'Language switched to English. App menus and voice assistance are now set to English.',
    'lang.speechTw': 'Akwaaba! Woasesa kasa no akɔ Akan Twi mu. Seesei mmoa ne nkratoɔ nyinaa bɛba Twi mu.',
  },
};
