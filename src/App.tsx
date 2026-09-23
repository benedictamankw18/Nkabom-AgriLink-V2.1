import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AudioModal } from './components/AudioModal';
import { Toast } from './components/Toast';
import { UssdModal } from './components/UssdModal';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';

import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MarketScreen } from './screens/MarketScreen';
import { SellScreen } from './screens/SellScreen';
import { PricesScreen } from './screens/PricesScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { ProduceDetailsModal } from './screens/ProduceDetailsModal';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, selectedProduce, setSelectedProduce } = useApp();

  return (
    <div className="relative min-h-screen bg-[#f8faf4] text-[#191c19] flex flex-col font-sans select-none antialiased">
      {/* Top Header Bar (Shown on all main tabs) */}
      {activeTab !== 'onboarding' && (
        <Header
          showBack={activeTab === 'notifications'}
          onBack={() => setActiveTab('home')}
        />
      )}

      {/* Screen Views */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'onboarding' && (
          <OnboardingScreen onComplete={() => setActiveTab('home')} />
        )}
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'market' && <MarketScreen />}
        {activeTab === 'sell' && <SellScreen />}
        {activeTab === 'prices' && <PricesScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
        {activeTab === 'notifications' && <NotificationsScreen />}
      </main>

      {/* Produce Details Modal / Commitment Sheet */}
      {selectedProduce && (
        <ProduceDetailsModal
          produce={selectedProduce}
          onClose={() => setSelectedProduce(null)}
        />
      )}

      {/* Bottom Floating Audio Player */}
      <AudioModal />

      {/* Retro USSD Gateway Simulator (*920*44#) */}
      <UssdModal />

      {/* Stakeholder Role Switcher Modal */}
      <RoleSwitcherModal />

      {/* Micro Toast Feedback */}
      <Toast />

      {/* Fixed Bottom Navigation Bar (Hidden during Onboarding) */}
      {activeTab !== 'onboarding' && <BottomNav />}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
