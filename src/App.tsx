import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CatalogSection } from './components/CatalogSection';
import { EventsSection } from './components/EventsSection';
import { LiveStreamSection } from './components/LiveStreamSection';
import { SocialWallSection } from './components/SocialWallSection';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
import { LoginPage } from './components/LoginPage';
import { ModelDetailModal } from './components/ModelDetailModal';
import { DirectChatDrawer } from './components/DirectChatDrawer';
import { ReviewModal } from './components/ReviewModal';
import { SettingsModal } from './components/SettingsModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { RoleSelectionModal } from './components/RoleSelectionModal';
import { SuspendedAccountGate } from './components/SuspendedAccountGate';
import { PushNotificationDrawer } from './components/PushNotificationDrawer';
import { MobileTabBar } from './components/MobileTabBar';
import { Footer } from './components/Footer';
import { ModelProfile } from './types';
import { CheckCircle2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    currentUser,
    activeTab,
    selectedModel,
    setSelectedModel,
    activeChatModel,
    setActiveChatModel,
    showSettingsModal,
    setShowSettingsModal,
    toastMessage,
  } = useApp();

  // Search & Filter state shared across hero & catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Todas');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [reviewTargetModel, setReviewTargetModel] = useState<ModelProfile | null>(null);

  // TOTAL LOCKOUT: Suspended accounts cannot access ANY section or role
  if (currentUser?.status === 'suspended') {
    return <SuspendedAccountGate />;
  }

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col selection:bg-[var(--color-primary)] selection:text-black">
      
      {/* Top Header compliant with Top Bar Contract */}
      <Header
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'catalogo' && (
          <>
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
            />
            <CatalogSection
              searchQuery={searchQuery}
              selectedCity={selectedCity}
            />
          </>
        )}

        {activeTab === 'parati' && <SocialWallSection />}

        {activeTab === 'eventos' && <EventsSection />}

        {activeTab === 'streaming' && <LiveStreamSection />}

        {activeTab === 'admin' && <AdminDashboard />}

        {activeTab === 'dashboard' && <UserDashboard />}

        {activeTab === 'login' && <LoginPage />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Mobile Bottom Tab Bar */}
      <MobileTabBar />

      {/* Modals & Slide-overs */}
      {selectedModel && (
        <ModelDetailModal
          model={selectedModel}
          onClose={() => setSelectedModel(null)}
          onOpenReview={(model) => setReviewTargetModel(model)}
        />
      )}

      {activeChatModel && (
        <DirectChatDrawer
          model={activeChatModel}
          onClose={() => setActiveChatModel(null)}
        />
      )}

      {reviewTargetModel && (
        <ReviewModal
          model={reviewTargetModel}
          onClose={() => setReviewTargetModel(null)}
        />
      )}

      <PushNotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* Google OAuth & 2FA Modal */}
      <GoogleAuthModal />

      {/* Role Selection Modal for First-time / Standby Users */}
      <RoleSelectionModal />

      {/* Suspended Account Locked Gate (Full Lockout until Admin Approval) */}
      <SuspendedAccountGate />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-zinc-900 border border-[var(--color-primary)]/40 shadow-2xl backdrop-blur-md animate-fade-in text-xs font-semibold text-white">
          <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
