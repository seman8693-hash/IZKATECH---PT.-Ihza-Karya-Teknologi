/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { PartnersSection } from './components/PartnersSection.tsx';
import { ProjectsSection } from './components/ProjectsSection.tsx';
import { MarketSection } from './components/MarketSection.tsx';
import { EstimatorSection } from './components/EstimatorSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { FloatingActions } from './components/FloatingActions.tsx';
import { ServiceDetailModal } from './components/ServiceDetailModal.tsx';
import { PresentationSlideDeck } from './components/PresentationSlideDeck.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { ServiceItem } from './types.ts';

export default function App() {
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);
  const [preselectedEstimatorService, setPreselectedEstimatorService] = useState<string | null>(null);
  const [isSlideDeckOpen, setIsSlideDeckOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#/admin' || hash === '#admin') {
        setIsAdminView(true);
      } else {
        setIsAdminView(false);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenEstimator = (serviceTitle?: string) => {
    if (serviceTitle) {
      setPreselectedEstimatorService(serviceTitle);
    }
    const estimatorElem = document.getElementById('kalkulator');
    if (estimatorElem) {
      estimatorElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAdmin = () => {
    window.location.hash = '/admin';
    setIsAdminView(true);
  };

  const handleCloseAdmin = () => {
    window.location.hash = '';
    setIsAdminView(false);
  };

  // If in Admin Dashboard view mode
  if (isAdminView) {
    return <AdminDashboard onBackToWebsite={handleCloseAdmin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Navigation Header */}
      <Navbar
        lang={lang}
        setLang={setLang}
        onOpenEstimator={() => handleOpenEstimator()}
        onOpenSlideDeck={() => setIsSlideDeckOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        <Hero
          lang={lang}
          onOpenEstimator={() => handleOpenEstimator()}
          onOpenSlideDeck={() => setIsSlideDeckOpen(true)}
        />

        <AboutSection lang={lang} />

        <ServicesSection
          lang={lang}
          onSelectService={(service) => setSelectedServiceForModal(service)}
          onOpenEstimatorWithService={(serviceTitle) => handleOpenEstimator(serviceTitle)}
        />

        <PartnersSection lang={lang} />

        <ProjectsSection lang={lang} />

        <MarketSection lang={lang} />

        <EstimatorSection
          lang={lang}
          preselectedService={preselectedEstimatorService}
        />

        <ContactSection lang={lang} />
      </main>

      {/* Corporate Footer */}
      <Footer lang={lang} onOpenAdmin={handleOpenAdmin} />

      {/* Floating CTA Widgets */}
      <FloatingActions onOpenEstimator={() => handleOpenEstimator()} />

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedServiceForModal}
        onClose={() => setSelectedServiceForModal(null)}
        lang={lang}
        onConsult={(serviceTitle) => handleOpenEstimator(serviceTitle)}
      />

      {/* 16:9 Presentation Slide Deck Viewer */}
      <PresentationSlideDeck
        isOpen={isSlideDeckOpen}
        onClose={() => setIsSlideDeckOpen(false)}
        lang={lang}
      />
    </div>
  );
}

