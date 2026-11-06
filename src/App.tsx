/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DemoRoleBanner } from './components/common/DemoRoleBanner';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LoginModal } from './components/common/LoginModal';
import { HomePage } from './components/public/HomePage';
import { AboutPage } from './components/public/AboutPage';
import { DepartmentsPage } from './components/public/DepartmentsPage';
import { AdmissionsPage } from './components/public/AdmissionsPage';
import { NewsPage } from './components/public/NewsPage';
import { EventsPage } from './components/public/EventsPage';
import { GalleryPage } from './components/public/GalleryPage';
import { ContactPage } from './components/public/ContactPage';
import { PortalShell } from './components/portal/PortalShell';

function MainLayout() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [navParams, setNavParams] = useState<any>({});
  const { userProfile } = useAuth();

  const handleNavigate = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setNavParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isPortal = currentPage === 'portal';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Demo Persona Switcher Banner */}
      <DemoRoleBanner
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onNavigatePortal={() => handleNavigate('portal')}
      />

      {isPortal ? (
        <PortalShell
          onBackToWebsite={() => handleNavigate('home')}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
        />
      ) : (
        <>
          <Header
            activePage={currentPage}
            onNavigate={(page) => handleNavigate(page)}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />

          <main className="flex-1">
            {currentPage === 'home' && (
              <HomePage
                onNavigate={(page) => handleNavigate(page)}
                onOpenLogin={() => setIsLoginModalOpen(true)}
              />
            )}
            {currentPage === 'about' && (
              <AboutPage
                onNavigate={(page) => handleNavigate(page)}
              />
            )}
            {currentPage === 'departments' && (
              <DepartmentsPage
                onNavigate={(page, params) => handleNavigate(page, params)}
              />
            )}
            {currentPage === 'admissions' && (
              <AdmissionsPage
                initialDepartment={navParams.preferredDept}
                onNavigate={(page) => handleNavigate(page)}
              />
            )}
            {currentPage === 'news' && <NewsPage />}
            {currentPage === 'events' && <EventsPage />}
            {currentPage === 'gallery' && <GalleryPage />}
            {currentPage === 'contact' && <ContactPage />}
          </main>

          <Footer
            onNavigate={(page) => handleNavigate(page)}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        </>
      )}

      {/* Global Login & Persona Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => handleNavigate('portal')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
