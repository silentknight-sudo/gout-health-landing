import React from 'react';
import { ShoppingCart, ShieldCheck } from 'lucide-react';

interface Props {
  onOrderClick: () => void;
}

export const MidPageCta: React.FC<Props> = ({ onOrderClick }) => {
  return (
    <section className="py-10 bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
          अभी 20% छूट के साथ अपना 60-दिन हीलिंग पैक बुक करें
        </h3>
        <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
          कोई एडवांस पेमेंट नहीं — सिर्फ नाम और नंबर दर्ज करें, पार्सल मिलने पर ही भुगतान करें।
        </p>
        <button
          id="mid-page-cta-btn"
          onClick={onOrderClick}
          className="mt-5 inline-flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-base sm:text-lg py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer animate-pulse-subtle"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>कैश ऑन डिलीवरी ऑर्डर करें</span>
        </button>
        <p className="text-emerald-200 text-xs mt-3 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>10,000+ ग्राहकों का भरोसा • AYUSH प्रमाणित</span>
        </p>
      </div>
    </section>
  );
};
