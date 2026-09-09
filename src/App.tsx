/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UrgencyBanner } from './components/UrgencyBanner';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { OfferCards } from './components/OfferCards';
import { ResultsTimeline } from './components/ResultsTimeline';
import { IngredientsSection } from './components/IngredientsSection';
import { UsageGuide } from './components/UsageGuide';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BeforeAfterSection } from './components/BeforeAfterSection';
import { DoctorApproval } from './components/DoctorApproval';
import { FaqSection } from './components/FaqSection';
import { OrderFormSection } from './components/OrderFormSection';
import { Footer } from './components/Footer';
import { FloatingCta } from './components/FloatingCta';
import { OrderTrackModal } from './components/OrderTrackModal';
import { AdminOrdersModal } from './components/AdminOrdersModal';
import { OrderResponse } from './types';

export default function App() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string>('');

  const scrollToOrderForm = () => {
    const el = document.getElementById('order-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOrderSuccess = (orderId: string, _response: OrderResponse) => {
    setActiveOrderId(orderId);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Urgency Banner (Sticky Top) */}
      <UrgencyBanner
        visible={bannerVisible}
        onDismiss={() => setBannerVisible(false)}
      />

      {/* 2. Header (Sticky) */}
      <Header
        bannerVisible={bannerVisible}
        onOpenOrderLookup={() => setTrackModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOrderNowClick={scrollToOrderForm}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 3. Hero Section */}
        <HeroSection onOrderClick={scrollToOrderForm} />

        {/* 4. Offer Cards (4-column grid) */}
        <OfferCards />

        {/* 5. Results Timeline (Clinical Recovery Stages) */}
        <ResultsTimeline />

        {/* 6. Ingredients Section (Herbal Oil & Capsules) */}
        <IngredientsSection />

        {/* 7. Usage Guide (Application & Dosage) */}
        <UsageGuide />

        {/* 8. Testimonials Section (Customer Experiences & Metrics) */}
        <TestimonialsSection />

        {/* 9. Before / After Comparison */}
        <BeforeAfterSection />

        {/* 10. Doctor Approval & Endorsement */}
        <DoctorApproval />

        {/* 11. FAQ Section (Accordion) */}
        <FaqSection />

        {/* 12. Order Form Section (COD Form with Sheets Sync) */}
        <OrderFormSection onOrderSuccess={handleOrderSuccess} />
      </main>

      {/* 13. Footer */}
      <Footer />

      {/* 14. Floating CTA Button */}
      <FloatingCta onOrderClick={scrollToOrderForm} />

      {/* Modals */}
      <OrderTrackModal
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
        initialOrderId={activeOrderId}
      />

      <AdminOrdersModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />
    </div>
  );
}
