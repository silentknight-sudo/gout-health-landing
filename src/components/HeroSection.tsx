import React from 'react';
import { ShieldCheck, Truck, Clock, Sparkles, PhoneCall, Check, ShoppingCart, Award } from 'lucide-react';
import { HERO_DATA } from '../data/landingData';

interface Props {
  onOrderClick: () => void;
}

export const HeroSection: React.FC<Props> = ({ onOrderClick }) => {
  return (
    <section id="hero-section" className="pt-6 pb-12 sm:pt-10 sm:pb-16 bg-gradient-to-b from-emerald-50/60 via-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Copy, Pricing & CTAs (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            
            {/* AYUSH Ministry Certification Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300 text-xs sm:text-sm font-semibold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{HERO_DATA.ayushBadge}</span>
            </div>

            {/* Pain / Hook subheadline */}
            <p className="text-red-600 font-bold text-base sm:text-lg tracking-wide uppercase">
              {HERO_DATA.painSubheadline}
            </p>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.2]">
              गाउट दर्द से <span className="text-emerald-700 underline decoration-emerald-400 underline-offset-8">स्थायी छुटकारा</span> पाएं!
            </h1>

            {/* Subtitle description */}
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {HERO_DATA.description}
            </p>

            {/* Pricing Card */}
            <div id="hero-pricing-box" className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm max-w-xl mx-auto lg:mx-0">
              <div className="flex flex-wrap items-baseline justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-red-600 tracking-tight">
                    ₹{HERO_DATA.discountedPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-lg sm:text-xl font-medium text-gray-400 line-through">
                    ₹{HERO_DATA.regularPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-100 text-red-700 text-xs font-extrabold px-2.5 py-1 rounded-md border border-red-200">
                    {HERO_DATA.discountBadge}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-1 rounded-md border border-emerald-200">
                    {HERO_DATA.savingsBadge}
                  </span>
                </div>
              </div>

              {/* 2x2 Trust Signals Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 text-xs sm:text-sm text-gray-800 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>फ्री होम डिलीवरी</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>30 दिन मनी-बैक गारंटी</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>100% हर्बल व सुरक्षित</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>NABL Lab टेस्टेड फॉर्मूला</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Primary + Secondary */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-xl mx-auto lg:mx-0">
              <button
                id="hero-primary-order-btn"
                onClick={onOrderClick}
                className="flex-1 flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-base sm:text-lg py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>कैश ऑन डिलीवरी ऑर्डर करें</span>
              </button>

              <a
                id="hero-call-specialist-btn"
                href={`tel:${HERO_DATA.tollFreeNumber}`}
                className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-semibold text-sm sm:text-base py-3.5 px-5 rounded-xl transition-all duration-200"
              >
                <PhoneCall className="w-4 h-4 text-blue-700" />
                <span>कॉल पर विशेषज्ञ से बात करें</span>
              </a>
            </div>

            <p className="text-xs text-gray-500 flex items-center justify-center lg:justify-start gap-1.5 pt-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>आज ऑर्डर करें और 24 घंटे के भीतर एक्सप्रेस डिस्पैच प्राप्त करें!</span>
            </p>

          </div>

          {/* Right Column: High Fidelity Product Visual Card (5 cols on lg) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-lg bg-white rounded-3xl p-4 sm:p-5 shadow-xl border border-gray-200/80 overflow-hidden">
              
              {/* Background botanical glow */}
              <div className="absolute -top-16 -right-16 w-52 h-52 bg-emerald-100/60 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-amber-100/50 rounded-full blur-2xl pointer-events-none" />

              {/* Top Banner inside product card */}
              <div className="relative z-10 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white rounded-xl py-2 px-3 text-center mb-3 shadow-xs">
                <span className="text-xs sm:text-sm font-bold tracking-wide">
                  100% ओरिजिनल कॉम्बो पैक (तेल + कैप्सूल)
                </span>
              </div>

              {/* Real Product Image Uploaded */}
              <div className="relative z-10 rounded-2xl overflow-hidden bg-gradient-to-b from-gray-50 to-emerald-50/40 border border-gray-100 shadow-inner group">
                <img
                  id="hero-product-image"
                  src="/assets/product-hero.jpg"
                  alt="Arogya Bio Gouthealth Capsules and Oil Combo Kit"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] font-bold text-emerald-900 border border-emerald-200 shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>हर्बल अर्क फॉर्मूलेशन</span>
                </div>
              </div>

              {/* Product Pack Title & Details */}
              <div className="relative z-10 text-center pt-4 border-t border-gray-100 mt-3">
                <h3 className="font-extrabold text-gray-900 text-base sm:text-lg">
                  Arogya Bio Gouthealth Complete Healing Kit
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Shallaki • Nirgundi • Ashwagandha • गिलोय व प्राकृतिक जॉइंट हीलिंग अर्क
                </p>
                <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                  <span>पूर्ण 60 दिनों का आयुर्वेदिक उपचार कॉम्बो (कैप्सूल + तेल)</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
